require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const User = require("./models/User");
const Case = require("./models/Case");
const Application = require("./models/Application");

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nyaysetu")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." }
});
app.use(apiLimiter);



// 🔑 PUT YOUR API KEY HERE (⚠️ don’t share publicly)
const GROQ_API_KEY = process.env.GROQ_API_KEY;

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile || {},
    createdAt: user.createdAt
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  const { hash } = hashPassword(password, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(user.passwordHash, "hex"));
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getFallbackLawyers() {
  try {
    const dataPath = path.join(__dirname, "data", "lawyers.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function mapLawyerForList(lawyer) {
  const profile = lawyer.profile || {};
  return {
    id: lawyer._id || lawyer.id,
    name: lawyer.name || "Unknown Lawyer",
    specialization: profile.l_spec || lawyer.specialization || "General",
    experience: profile.l_exp ? profile.l_exp + " Years" : lawyer.experience || "Unknown",
    location: profile.l_loc || lawyer.location || "Unknown",
    phone: profile.phone || lawyer.phone || "Unknown",
    keywords: lawyer.keywords || []
  };
}

function matchLawyersForCase(lawyers, caseData) {
  const problemType = String(caseData.problemType || "").toLowerCase();
  const caseText = [
    caseData.problemType,
    caseData.summary,
    ...(caseData.facts || [])
  ].filter(Boolean).join(" ").toLowerCase();

  const matched = lawyers.filter(lawyer => {
    const spec = String(lawyer.specialization || "").toLowerCase();
    const keywords = Array.isArray(lawyer.keywords) ? lawyer.keywords : [];
    return spec.includes(problemType) ||
      problemType.includes(spec.split(" ")[0]) ||
      spec === "general" ||
      problemType === "general" ||
      keywords.some(keyword => caseText.includes(String(keyword).toLowerCase()));
  });

  return matched.length ? matched : lawyers;
}

// ================= AUTH ROUTES =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, profile, role } = req.body || {};
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    if (!/^[^s@]+@[^s@]+\.[^s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const { salt, hash } = hashPassword(String(password));
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: role || 'user',
      profile: profile || {}
    });

    res.status(201).json({
      token: createToken(),
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during signup." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user || !verifyPassword(String(password), user)) {
      return res.status(401).json({ error: "Wrong email or password." });
    }

    res.json({
      token: createToken(),
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// ================= CHAT ROUTE =================
app.post("/chat", async (req, res) => {
  const { message, system } = req.body;

  const systemPrompt = system || "You are a legal assistant for Indian law. Answer clearly, professionally, and politely.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("CHAT RESPONSE:", data);

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error. Try again." });
  }
});


app.post("/generate-doc", async (req, res) => {
  const { formData = "", type = "legal-notice", mode = "body-only", fields = {}, documentTitle = "", date = "" } = req.body || {};

  const docProfiles = {
    "legal-notice": {
      label: "legal notice",
      instructions: "Draft numbered body paragraphs covering facts, cause of action, statutory/legal basis where appropriate, demand, time for compliance, and consequences of non-compliance."
    },
    affidavit: {
      label: "affidavit",
      instructions: "Draft only the numbered statements of fact. Do not draft the title, deponent introduction, verification, notary block, or signature block."
    },
    "rent-agreement": {
      label: "rent agreement",
      instructions: "Draft only the operative clauses: term, rent, security deposit, utilities, maintenance, use, inspection, subletting, termination, handover, damages, dispute resolution, and jurisdiction."
    },
    "consumer-complaint": {
      label: "consumer complaint",
      instructions: "Draft body paragraphs covering facts, deficiency in service/defect, cause of action, jurisdiction, limitation, evidence, and prayer for relief under the Consumer Protection Act, 2019."
    },
    rti: {
      label: "RTI application",
      instructions: "Draft only the request body, listing the information sought clearly and referencing Section 6(1) and transfer under Section 6(3) where relevant."
    },
    "bail-application": {
      label: "bail application",
      instructions: "Draft body paragraphs covering brief facts, custody status if provided, grounds for bail, undertakings, and prayer under the applicable criminal procedure provisions."
    }
  };

  const typeAliases = {
    rent: "rent-agreement",
    consumer: "consumer-complaint",
    bail: "bail-application",
    legal_notice: "legal-notice",
    rent_agreement: "rent-agreement",
    consumer_complaint: "consumer-complaint",
    bail_application: "bail-application"
  };

  const normalizedType = typeAliases[String(type).toLowerCase()] || String(type).toLowerCase();
  const profile = docProfiles[normalizedType] || docProfiles["legal-notice"];
  const fieldsText = String(formData || "").trim() || Object.entries(fields || {})
    .filter(([, value]) => String(value || "").trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const bodyOnly = mode === "body-only";
  const systemPrompt = `
You are a professional Indian legal document drafter.

Task: Draft a ${profile.label}.

STRICT RULES:
- Do not mention NyaySetu, any website, any logo, or that a platform generated this document.
- No markdown, asterisks, hash headings, tables, or decorative separators.
- Use clean formal legal paragraphs with readable spacing.
- Use only details supplied by the user. Do not write undefined, null, [not provided], or placeholder values.
- If an optional detail is missing, omit that clause or phrase naturally.
- Keep the tone professional, realistic, and suitable for review by an advocate or court filing clerk.
${bodyOnly ? "- Return ONLY the body clauses/paragraphs. Do not include title, date, party/address block, subject line, salutation, footer, disclaimer, or signature block." : "- Return the complete document in plain text with title, date, party blocks, subject, body, and signature block."}

Document-specific instructions:
${profile.instructions}

Output only the final document text.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Document title: ${documentTitle || profile.label}
Date: ${date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}

User-provided details:
${fieldsText}`
          }
        ]
      })
    });

    const data = await response.json();

    const documentText = String(data.choices?.[0]?.message?.content || "No response")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter(line => !/\b(NyaySetu|nyaysetu\.in|AI Legal Assistant|Generated by)\b/i.test(line))
      .join("\n")
      .trim();

    res.json({
      document: documentText || "No response"
    });

  } catch (err) {
    res.json({ document: "Server error while generating document." });
  }
});
// ================= LAWYER CONNECTIVITY =================

app.post("/create-case", async (req, res) => {
  try {
    const { problemType, summary, facts = [], documents = [], userId } = req.body || {};

    if (!userId || !problemType || !summary) {
      return res.status(400).json({ error: "Missing required case fields." });
    }

    const newCase = await Case.create({
      userId,
      problemType,
      summary,
      facts,
      documents,
      status: "open",
      assignedLawyerId: null
    });

    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ error: "Failed to create case." });
  }
});

app.get("/get-cases/:userId", async (req, res) => {
  try {
    const userCases = await Case.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(userCases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases." });
  }
});

app.get("/cases", async (req, res) => {
  try {
    // Return only anonymized data
    const openCases = await Case.find({ status: "open" })
      .select('problemType summary facts location status createdAt')
      .sort({ createdAt: -1 });

    res.json(openCases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch open cases." });
  }
});

app.post("/apply-case", async (req, res) => {
  try {
    const { caseId, lawyerId, role } = req.body || {};

    if (role !== "lawyer") {
      return res.status(403).json({ error: "Only lawyers can apply for cases." });
    }
    if (!caseId || !lawyerId) {
      return res.status(400).json({ error: "Missing caseId or lawyerId." });
    }

    const alreadyApplied = await Application.findOne({ caseId, lawyerId });
    if (alreadyApplied) {
      return res.status(400).json({ error: "You have already applied for this case." });
    }

    const newApp = await Application.create({
      caseId,
      lawyerId,
      status: "pending"
    });

    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit application." });
  }
});

app.get("/my-applications/:lawyerId", async (req, res) => {
  try {
    const apps = await Application.find({ lawyerId: req.params.lawyerId })
      .populate({
        path: 'caseId',
        select: 'problemType summary status createdAt' // Anonymized case data
      })
      .sort({ createdAt: -1 });

    const enrichedApps = apps.map(app => ({
      _id: app._id,
      id: app._id,
      caseId: app.caseId?._id || app.caseId,
      lawyerId: app.lawyerId,
      status: app.status,
      createdAt: app.createdAt,
      case: app.caseId // Populated object
    }));

    res.json(enrichedApps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

app.get("/case-details/:caseId", async (req, res) => {
  try {
    const { lawyerId } = req.query; // Assume lawyerId is passed in query for now

    if (!lawyerId) {
      return res.status(401).json({ error: "Unauthorized access." });
    }

    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(403).json({ error: "Access denied. Lawyers only." });
    }

    const caseData = await Case.findById(req.params.caseId).populate('userId', 'name email');

    if (!caseData) {
      return res.status(404).json({ error: "Case not found." });
    }

    // Security check: only assigned lawyer can see full details
    if (String(caseData.assignedLawyerId) !== String(lawyerId)) {
      return res.status(403).json({ error: "You are not assigned to this case. User identity is hidden until case is assigned." });
    }

    res.json(caseData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch case details." });
  }
});

app.get("/get-lawyers", async (req, res) => {
  try {
    const lawyers = await User.find({ role: "lawyer" }).limit(6).select('name email profile');

    const mapped = lawyers.map(mapLawyerForList);
    res.json(mapped.length ? mapped : getFallbackLawyers());
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lawyers." });
  }
});

app.get("/match-lawyers/:caseId", async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId);
    if (!caseData) return res.status(404).json({ error: "Case not found" });

    // Match logic
    const lawyers = await User.find({ role: "lawyer" }).select('name email profile');
    const mapped = lawyers.map(mapLawyerForList);
    const lawyerPool = mapped.length ? mapped : getFallbackLawyers();
    const matched = matchLawyersForCase(lawyerPool, caseData);

    res.json({ case: caseData, lawyers: matched.slice(0, 3) });
  } catch (err) {
    res.status(500).json({ error: "Failed to match lawyers." });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
