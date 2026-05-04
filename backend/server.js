require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));



// 🔑 PUT YOUR API KEY HERE (⚠️ don’t share publicly)
const GROQ_API_KEY = process.env.GROQ_API_KEY; 

const USERS_FILE = path.join(__dirname, "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch (err) {
    console.error("Failed to read users file:", err);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

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

// ================= AUTH ROUTES =================
app.post("/signup", (req, res) => {
  const { name, email, password, profile } = req.body || {};
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const users = readUsers();
  if (users.some(user => user.email === cleanEmail)) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const { salt, hash } = hashPassword(String(password));
  const user = {
    id: crypto.randomUUID(),
    name: cleanName,
    email: cleanEmail,
    salt,
    passwordHash: hash,
    profile: profile || {},
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);

  res.status(201).json({
    token: createToken(),
    user: publicUser(user)
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const cleanEmail = String(email || "").trim().toLowerCase();

  if (!cleanEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const users = readUsers();
  const user = users.find(item => item.email === cleanEmail);
  if (!user || !verifyPassword(String(password), user)) {
    return res.status(401).json({ error: "Wrong email or password." });
  }

  res.json({
    token: createToken(),
    user: publicUser(user)
  });
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

const CASES_FILE = path.join(__dirname, "data", "cases.json");
const LAWYERS_FILE = path.join(__dirname, "data", "lawyers.json");

function readJsonFile(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`Failed to read file:`, err);
    return [];
  }
}

function writeJsonFile(file, data) {
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.post("/create-case", (req, res) => {
  const { problemType = "General", summary = "", facts = [], documents = [], userId = "anonymous" } = req.body || {};
  const newCase = {
    id: crypto.randomUUID(),
    userId,
    problemType,
    summary,
    facts,
    documents,
    createdAt: new Date().toISOString()
  };
  
  const cases = readJsonFile(CASES_FILE);
  cases.push(newCase);
  writeJsonFile(CASES_FILE, cases);
  
  res.status(201).json(newCase);
});

app.get("/get-cases/:userId", (req, res) => {
  const cases = readJsonFile(CASES_FILE);
  const userCases = cases.filter(c => c.userId === req.params.userId);
  res.json(userCases);
});

function matchLawyers(caseData) {
  const lawyers = readJsonFile(LAWYERS_FILE);
  let matched = lawyers.filter(l => 
    l.specialization.toLowerCase().includes(caseData.problemType.toLowerCase()) ||
    l.specialization.toLowerCase() === "general" || 
    caseData.problemType.toLowerCase() === "general"
  );
  
  if (matched.length === 0) {
    matched = lawyers;
  }
  
  return matched.slice(0, 3);
}

app.get("/match-lawyers/:caseId", (req, res) => {
  const cases = readJsonFile(CASES_FILE);
  const caseData = cases.find(c => c.id === req.params.caseId);
  
  if (!caseData) {
    return res.status(404).json({ error: "Case not found" });
  }
  
  const matchedLawyers = matchLawyers(caseData);
  res.json({
    case: caseData,
    lawyers: matchedLawyers
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
