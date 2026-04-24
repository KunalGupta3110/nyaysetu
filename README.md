# NyaySetu — न्यायसेतु
### AI-Powered Legal Assistant for India

A production-ready, startup-grade legal platform that helps Indian citizens:
- Ask legal questions via an AI chatbot
- Generate court-ready legal documents
- Simplify complex legal text
- Learn Indian law (student notes + AI tutor)

Built with pure HTML/CSS/JS + Anthropic Claude API. **No paid dependencies. No backend required.**

---

## 🚀 Quick Start (Local)

### 1. Clone / Download
```bash
git clone https://github.com/yourusername/nyaysetu.git
cd nyaysetu
```

### 2. Open in browser
Since this is a pure static site, you can open `index.html` directly:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

> ⚠️ **Note:** The Anthropic API is called from the browser. For production, route API calls through a backend proxy to protect your key.

---

## 🌐 Deploy to Netlify (Free — Recommended)

### Option A: Drag & Drop (Fastest)
1. Go to [netlify.com](https://netlify.com) → Log in → "Add new site"
2. Click **"Deploy manually"**
3. Drag and drop the entire `nyaysetu/` folder
4. Done! Your site is live in ~30 seconds.

### Option B: Git Deploy
```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit — NyaySetu"
git remote add origin https://github.com/yourusername/nyaysetu.git
git push -u origin main
```
Then in Netlify:
1. "Add new site" → "Import an existing project"
2. Connect GitHub → Select your repo
3. Build command: *(leave empty)*
4. Publish directory: `.`
5. Click **Deploy site**

---

## 🔼 Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd nyaysetu
vercel

# Follow prompts — no build step needed
```

Or via Vercel dashboard:
1. [vercel.com](https://vercel.com) → "New Project"
2. Import GitHub repo
3. Framework: **Other**
4. Root directory: `.`
5. Click **Deploy**

---

## 📁 Project Structure

```
nyaysetu/
├── index.html              ← Home page
├── netlify.toml            ← Netlify config
├── vercel.json             ← Vercel config
├── README.md
│
├── pages/
│   ├── chat.html           ← AI Legal Chatbot
│   ├── documents.html      ← Document Generator
│   ├── simplifier.html     ← Law Simplifier
│   ├── students.html       ← Student Section
│   ├── auth.html           ← Login / Sign Up
│   └── dashboard.html      ← User Dashboard
│
├── css/
│   ├── main.css            ← Design system, navbar, footer, utilities
│   ├── chat.css            ← Chat-specific styles
│   └── pages.css           ← All page-specific styles
│
├── js/
│   ├── app.js              ← Core: i18n, theme, toast, API helper, auth state
│   ├── chat.js             ← Chat page logic
│   ├── documents.js        ← Document generator logic
│   └── pages.js            ← Simplifier, Students, Auth, Dashboard logic
│
└── assets/
    ├── favicon.svg
    └── nav.html            ← Nav reference snippet
```

---

## ✨ Features

### 🤖 AI Legal Chatbot
- Powered by Claude Sonnet (Anthropic)
- Persistent chat sessions (localStorage)
- Sidebar with chat history
- Quick-prompt chips
- Copy, Simplify, Generate Doc actions on messages
- Supports Hindi + 5 other Indian languages

### 📄 Document Generator
- **6 document types:** Legal Notice, Affidavit, Rent Agreement, Consumer Complaint, RTI Application, Bail Application
- Dynamic form fields per document type
- AI generates complete, court-ready documents
- Live preview panel
- **PDF export** (jsPDF — branded header + footer)
- Copy to clipboard

### 🔍 Law Simplifier
- Paste any legal section, court order, or clause
- AI explains in plain language with Indian examples
- Pre-loaded example texts for instant demo
- Send to Chat for follow-up questions

### 🎓 Student Section
- **8 topic cards** covering: Fundamental Rights, IPC/BNS, Contract Law, Consumer Law, Property Law, Labour Law, Family Law, RTI & PIL
- Filter by topic
- AI Study Assistant — ask any legal question, get exam-focused answers
- Detailed modal with notes, landmark cases, key sections

### 🔐 Auth System
- Email/password login & signup
- Session persistence via localStorage
- Google Auth UI (requires backend for production)
- Redirect protection on dashboard

### 📊 Dashboard
- Activity tracking (chats, docs generated, saved)
- Recent activity feed
- Quick action buttons
- Official legal resources (NALSA, RTI Portal, Consumer Helpline)
- Emergency helpline numbers

### 🌍 Multilingual
- 6 languages: English, हिन्दी, தமிழ், తెలుగు, বাংলা, मराठी
- Dynamic switching (no page reload)
- Preference saved in localStorage

### 🌙 Dark / Light Mode
- Dark mode default
- Smooth toggle
- Preference saved in localStorage

---

## 🔒 API Key Setup

### For Development (Quick)
The app calls the Anthropic API directly from the browser. This works in the Claude.ai artifact environment.

For your own deployment, set up a proxy:

### Backend Proxy (Recommended for Production)

Create a simple Express proxy `api/chat.js`:
```javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

Then update `callClaude()` in `js/app.js`:
```javascript
// Change this line:
const response = await fetch('https://api.anthropic.com/v1/messages', {
// To:
const response = await fetch('/api/chat', {
// And remove the x-api-key header
```

### Environment Variables
```bash
# .env (never commit this)
ANTHROPIC_API_KEY=sk-ant-...
```

On Netlify/Vercel: Add `ANTHROPIC_API_KEY` in the dashboard under Environment Variables.

---

## 🛠 Customization

### Change Brand Colors
Edit CSS variables in `css/main.css`:
```css
:root {
  --gold: #D4AF37;        /* Main accent */
  --gold-hover: #B8961E;  /* Hover state */
  --bg-primary: #0A0A0A;  /* Background */
}
```

### Add a New Language
In `js/app.js`, add to the `I18N` object:
```javascript
gu: {
  nav_chat: 'AI ચેટ',
  hero_title_1: 'તમારા કાયદાકીય અધિકારો,',
  // ... etc
}
```
Then add to all `<select id="langSelect">` dropdowns:
```html
<option value="gu">ગુજરાતી</option>
```

### Add a New Document Type
In `js/documents.js`, add to `DOC_TYPES`:
```javascript
noc: {
  label: 'NOC Certificate', icon: '📝',
  fields: [
    { id: 'issuer', label: 'Issuer Name', placeholder: '...', required: true },
    // ...
  ]
}
```
Then add a button in `pages/documents.html`.

---

## 📦 Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | HTML5, CSS3, Vanilla JS | Free |
| AI | Anthropic Claude Sonnet | Free tier available |
| PDF | jsPDF (CDN) | Free |
| Fonts | Google Fonts (Cormorant Garamond + DM Sans) | Free |
| Storage | localStorage / sessionStorage | Free |
| Hosting | Netlify / Vercel | Free tier |
| Auth | localStorage (demo) / Supabase (production) | Free tier |

---

## 🔮 Production Upgrades (Optional)

| Feature | Solution | Cost |
|---------|----------|------|
| Real Auth | Supabase Auth | Free tier |
| Database | Supabase PostgreSQL | Free tier |
| File Storage | Supabase Storage | Free tier |
| Analytics | Plausible / Umami | Free self-host |
| Search | Algolia (legal DB) | Free tier |
| CMS | Sanity / Contentful | Free tier |

### Supabase Integration (Auth + DB)
```bash
npm install @supabase/supabase-js
```

Replace the auth functions in `js/pages.js` with Supabase calls:
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Login
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Google Auth
const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
```

---

## ⚠️ Legal Disclaimer

NyaySetu provides AI-generated legal information for educational purposes only. It does not constitute legal advice. Users should consult a qualified advocate (lawyer) for specific legal matters. The platform is not responsible for actions taken based on AI-generated content.

---

## 📄 License

MIT License — Free to use, modify, and deploy.

---

**Built with ❤️ for India 🇮🇳 | NyaySetu — Bridging the gap between citizens and justice**
