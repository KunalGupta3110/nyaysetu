require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));



// 🔑 PUT YOUR API KEY HERE (⚠️ don’t share publicly)
const GROQ_API_KEY = process.env.GROQ_API_KEY; 


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
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
