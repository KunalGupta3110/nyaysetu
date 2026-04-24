/* ============================================================
   NyaySetu — Chat Page (chat.js)
   ============================================================ */

const CHAT_SYSTEM = `You are NyaySetu, an expert AI legal assistant specializing in Indian law. You have deep knowledge of:
- Indian Penal Code (IPC/BNS), Code of Criminal Procedure (CrPC/BNSS), Code of Civil Procedure (CPC)
- Constitution of India, Fundamental Rights, Directive Principles
- Consumer Protection Act 2019, Right to Information Act 2005
- Transfer of Property Act, Indian Contract Act, Indian Evidence Act
- Family law: Hindu Marriage Act, Muslim Personal Law, Special Marriage Act
- Labour laws: ID Act, Minimum Wages Act, POSH Act, EPF Act
- Motor Vehicles Act, Negotiable Instruments Act (cheque bounce)
- Cyber law: IT Act 2000, DPDP Act 2023

Guidelines:
- Be clear, accurate, and helpful
- Use simple language; avoid excessive legal jargon
- Structure responses with paragraphs for readability
- Always mention that serious legal matters require a qualified advocate
- Cite specific sections/acts where relevant
- Respond in the user's language if they write in Hindi/regional languages`;

// ── State ─────────────────────────────────────────────────────
let chatSessions = JSON.parse(localStorage.getItem('nyaysetu_sessions') || '[]');
let currentSessionId = null;
let currentMessages = [];
let isStreaming = false;

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  startNewSession();
  setupInput();
});

// ── Session management ────────────────────────────────────────
function startNewSession(id) {
  if (id) {
    const s = chatSessions.find(s => s.id === id);
    if (s) {
      currentSessionId = id;
      currentMessages = [...s.messages];
      renderMessages();
      highlightSidebar(id);
      return;
    }
  }
  currentSessionId = 'session_' + Date.now();
  currentMessages = [];
  const session = { id: currentSessionId, preview: 'New Chat', time: new Date().toISOString(), messages: [] };
  chatSessions.unshift(session);
  saveSessions();
  renderSidebar();
  resetChatUI();
}

function saveSessions() {
  localStorage.setItem('nyaysetu_sessions', JSON.stringify(chatSessions.slice(0, 30)));
}

function updateSessionPreview(text) {
  const s = chatSessions.find(s => s.id === currentSessionId);
  if (s && s.preview === 'New Chat') {
    s.preview = text.slice(0, 42) + (text.length > 42 ? '…' : '');
    saveSessions();
    renderSidebar();
  }
}

// ── Sidebar ───────────────────────────────────────────────────
function renderSidebar() {
  const list = document.getElementById('chatHistoryList');
  if (!list) return;
  if (!chatSessions.length) {
    list.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 8px">No previous chats</div>';
    return;
  }
  list.innerHTML = chatSessions.map(s => `
    <div class="chat-item ${s.id === currentSessionId ? 'active' : ''}" onclick="startNewSession('${s.id}')">
      <span class="chat-item-icon">💬</span>
      <span class="chat-item-text">${escHtml(s.preview)}</span>
    </div>
  `).join('');
}

function highlightSidebar(id) {
  document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
  const items = document.querySelectorAll('.chat-item');
  const idx = chatSessions.findIndex(s => s.id === id);
  if (items[idx]) items[idx].classList.add('active');
}

function resetChatUI() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  msgs.innerHTML = `
    <div class="msg ai animate-fade-up">
      <div class="msg-avatar">N</div>
      <div class="msg-content">
        <div class="msg-bubble">
          Namaste! 🙏 I am <strong>NyaySetu</strong>, your AI legal assistant for Indian law.<br><br>
          I can help you with:
          <ul style="margin-top:10px;padding-left:20px;line-height:1.9">
            <li>Criminal law (FIR, bail, IPC sections)</li>
            <li>Civil disputes (property, contracts, family)</li>
            <li>Consumer complaints &amp; RTI</li>
            <li>Labour rights &amp; workplace issues</li>
            <li>Constitutional rights</li>
          </ul>
          <br>How can I assist you today?
        </div>
        <div class="msg-time">${getTimeStr()}</div>
      </div>
    </div>`;
  renderSidebar();
}

// ── Input setup ───────────────────────────────────────────────
function setupInput() {
  const textarea = document.getElementById('chatInput');
  if (!textarea) return;
  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 130) + 'px';
  });
}

function setQuickPrompt(text) {
  const ta = document.getElementById('chatInput');
  if (ta) { ta.value = text; ta.focus(); }
}

// ── Send message ──────────────────────────────────────────────
async function sendMessage() {
  if (isStreaming) return;
  const ta = document.getElementById('chatInput');
  const text = ta ? ta.value.trim() : '';
  if (!text) return;

  isStreaming = true;
  ta.value = ''; ta.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;

  appendUserMessage(text);
  updateSessionPreview(text);
  currentMessages.push({ role: 'user', content: text });

  const typingId = 'typing_' + Date.now();
  appendTyping(typingId);

  App.stats.chats++;
  App.saveStats();
  App.addActivity('chat', text.slice(0, 40));

  try {
    const reply = await callClaude(
      currentMessages.slice(-12),
      CHAT_SYSTEM,
      1200
    );
    currentMessages.push({ role: 'assistant', content: reply });
    replaceTypingWithMessage(typingId, reply);

    const s = chatSessions.find(s => s.id === currentSessionId);
    if (s) { s.messages = [...currentMessages]; saveSessions(); }
  } catch (err) {
    replaceTypingWithError(typingId, err.message);
    showToast('Failed to get response. Check your connection.', 'error');
  }

  isStreaming = false;
  document.getElementById('sendBtn').disabled = false;
}

// ── Message rendering ─────────────────────────────────────────
function appendUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg user animate-fade-up';
  div.innerHTML = `
    <div class="msg-avatar">U</div>
    <div class="msg-content">
      <div class="msg-bubble">${escHtml(text)}</div>
      <div class="msg-time">${getTimeStr()}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping(id) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ai animate-fade-in';
  div.id = id;
  div.innerHTML = `
    <div class="msg-avatar">N</div>
    <div class="msg-content">
      <div class="msg-bubble">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function replaceTypingWithMessage(id, reply) {
  const el = document.getElementById(id);
  if (!el) return;
  const formatted = formatAIResponse(reply);
  el.outerHTML = `
    <div class="msg ai animate-fade-up">
      <div class="msg-avatar">N</div>
      <div class="msg-content">
        <div class="msg-bubble">${formatted}</div>
        <div class="msg-time">${getTimeStr()}</div>
        <div class="msg-actions">
          <button class="msg-action-btn" onclick="copyToClipboard(\`${reply.replace(/`/g,'\\`').replace(/\\/g,'\\\\')}\`)">📋 Copy</button>
          <button class="msg-action-btn" onclick="sendToSimplifier(\`${reply.replace(/`/g,'\\`').replace(/\\/g,'\\\\')}\`)">🔍 Simplify</button>
          <button class="msg-action-btn" onclick="window.location.href='documents.html'">📄 Make Document</button>
        </div>
      </div>
    </div>`;
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function replaceTypingWithError(id, errMsg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.outerHTML = `
    <div class="msg ai">
      <div class="msg-avatar">N</div>
      <div class="msg-content">
        <div class="msg-bubble" style="color:var(--text-secondary)">
          Sorry, I encountered an error: ${escHtml(errMsg)}. Please try again.
        </div>
      </div>
    </div>`;
}

function renderMessages() {
  resetChatUI();
  const msgs = document.getElementById('chatMessages');
  currentMessages.forEach(m => {
    if (m.role === 'user') appendUserMessage(m.content);
    else {
      const div = document.createElement('div');
      div.className = 'msg ai';
      div.innerHTML = `
        <div class="msg-avatar">N</div>
        <div class="msg-content">
          <div class="msg-bubble">${formatAIResponse(m.content)}</div>
          <div class="msg-time">–</div>
        </div>`;
      msgs.appendChild(div);
    }
  });
  msgs.scrollTop = msgs.scrollHeight;
}

function formatAIResponse(text) {
  return escHtml(text)
    .replace(/\n\n/g, '</p><p style="margin-top:10px">')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

function sendToSimplifier(text) {
  sessionStorage.setItem('simplify_text', text);
  window.location.href = 'simplifier.html';
}
