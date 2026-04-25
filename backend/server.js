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
  const { formData, type } = req.body;

  let systemPrompt = "";

  switch (type) {
    case "affidavit":
      systemPrompt = "Generate a formal affidavit under Indian law.";
      break;
    case "rent":
      systemPrompt = "Generate a detailed rent agreement between landlord and tenant.";
      break;
    case "consumer":
      systemPrompt = "Generate a consumer complaint.";
      break;
    case "rti":
      systemPrompt = "Generate an RTI application.";
      break;
    case "bail":
      systemPrompt = "Generate a bail application.";
      break;
    default:
      systemPrompt = "Generate a legal notice.";
  }

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
            content: `
You are a professional Indian legal document writer.

${systemPrompt}

STRICT RULES:
- No markdown
- No repetition
- Use clean paragraphs
- Proper headings
- Formal legal tone

Output only final document.
`
          },
          {
            role: "user",
            content: formData
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      document: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    res.json({ document: "Server error while generating document." });
  }
});
// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
