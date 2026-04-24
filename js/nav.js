/* ═══════════════════════════════════════════
   NYAYSETU — NAV INJECTOR
   Call injectNav() in each page's <body>
═══════════════════════════════════════════ */

function injectNav() {
  const nav = `
  <nav id="nav">
    <a href="../index.html" class="nav-logo">
      <div class="nav-logo-box">N</div>
      <span class="nav-logo-name">NyaySetu</span>
    </a>
    <div class="nav-tabs">
      <a class="nav-tab" href="../index.html"       data-page="home"><span data-i18n="nav_home">Home</span></a>
      <a class="nav-tab" href="pages/chat.html"            data-page="chat"><span class="nav-icon"></span> <span data-i18n="nav_chat">AI Chat</span></a>
      <a class="nav-tab" href="pages/documents.html"       data-page="docs"><span class="nav-icon"></span> <span data-i18n="nav_docs">Documents</span></a>
      <a class="nav-tab" href="pages/simplifier.html"      data-page="simplify"><span class="nav-icon"></span> <span data-i18n="nav_simplify">Simplifier</span></a>
      <a class="nav-tab" href="pages/students.html"        data-page="students"><span class="nav-icon"></span> <span data-i18n="nav_students">Students</span></a>
    </div>
    <div class="nav-right">
      <div class="nav-lang">${typeof getLangSelectHTML === 'function' ? getLangSelectHTML() : ''}</div>
      <button class="nav-icon-btn" id="theme-btn" onclick="toggleTheme()" title="Toggle theme">☀</button>
      <a href="pages/chat.html" class="btn-nav" data-i18n="nav_ask">Ask a Question</a>
    </div>
  </nav>
  <div id="toast"><span id="toast-icon">✓</span><span id="toast-msg"></span></div>`;

  document.body.insertAdjacentHTML('afterbegin', nav);
  initTheme();
  setActiveNav();
}
