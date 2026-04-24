/* ============================================================
   NyaySetu — Simplifier (simplifier.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Check if redirected from chat
  const prefill = sessionStorage.getItem('simplify_text');
  if (prefill) {
    const ta = document.getElementById('legalInput');
    if (ta) ta.value = prefill;
    sessionStorage.removeItem('simplify_text');
  }
});

async function simplifyLaw() {
  const input = document.getElementById('legalInput');
  const text = input ? input.value.trim() : '';
  if (!text) { showToast('Please enter legal text to simplify.', 'error'); return; }

  const btn = document.getElementById('simplifyBtn');
  const btnText = document.getElementById('simplifyBtnText');
  btnText.innerHTML = '<span class="spinner spinner-sm"></span> Analyzing…';
  btn.disabled = true;

  document.getElementById('simplifyResult').innerHTML = `
    <div class="result-placeholder">
      <span class="spinner spinner-lg"></span>
      <div>Reading and analyzing the legal text…</div>
    </div>`;

  const prompt = `Explain this Indian legal text in simple, clear language for a common citizen:

---
${text}
---

Please provide:
1. **What this law/provision means** — in plain everyday language (2-3 sentences)
2. **Who does it apply to?** — who is affected
3. **Key rights and obligations** — what must/can/cannot be done
4. **Real-life Indian example** — a relatable scenario
5. **Consequences of violation** — what happens if it's broken
6. **Important things to know** — any limitations, exceptions, or caveats

Write in simple English. Use bullet points where helpful. Avoid legal jargon. If the text is in Hindi or a regional language, respond in that language.`;

  try {
    const result = await callClaude(
      [{ role: 'user', content: prompt }],
      'You are a legal educator who specializes in making Indian law accessible to ordinary citizens. You explain laws using simple language, relatable Indian examples, and practical guidance. Your explanations help common people understand their rights and obligations.',
      1200
    );

    document.getElementById('simplifyResult').innerHTML = `
      <div class="result-content">${formatLegalResult(result)}</div>
      <div style="margin-top:16px;display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="copyToClipboard(document.getElementById('resultText').innerText)">📋 Copy</button>
        <button class="btn btn-outline btn-sm" onclick="sendToChatContext()">💬 Ask follow-up</button>
      </div>`;

    App.addActivity('simplify', 'Law simplified');
    showToast('Law simplified!', 'success');
  } catch (err) {
    document.getElementById('simplifyResult').innerHTML = `
      <div class="result-placeholder">
        <div class="ph-icon">⚠️</div>
        Simplification failed. Please try again.
      </div>`;
    showToast('Failed to simplify. Try again.', 'error');
  }

  btnText.textContent = '✨ Simplify This Law';
  btn.disabled = false;
}

function formatLegalResult(text) {
  return `<div id="resultText">${escHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p style="margin:12px 0">')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
  }</div>`;
}

function sendToChatContext() {
  const input = document.getElementById('legalInput');
  if (input) {
    sessionStorage.setItem('chat_context', 'Tell me more about: ' + input.value.slice(0, 200));
    window.location.href = 'chat.html';
  }
}

function clearSimplifier() {
  const input = document.getElementById('legalInput');
  if (input) input.value = '';
  const result = document.getElementById('simplifyResult');
  if (result) result.innerHTML = `
    <div class="result-placeholder">
      <div class="ph-icon">🔍</div>
      <div>Your simplified explanation will appear here</div>
    </div>`;
}


/* ============================================================
   NyaySetu — Students (students.js)
   ============================================================ */

const STUDENT_CARDS = [
  {
    tag: 'Constitution', filter: 'constitution',
    title: 'Fundamental Rights (Art. 12–35)',
    desc: 'The six fundamental rights guaranteed to every Indian citizen under the Constitution.',
    content: `<h4>The Six Fundamental Rights</h4>
<ul>
  <li><strong>Right to Equality (Art. 14-18)</strong> — Equality before law, prohibition of discrimination on religion/race/caste/sex, abolition of untouchability</li>
  <li><strong>Right to Freedom (Art. 19-22)</strong> — Freedom of speech, assembly, movement, profession; protection against arbitrary arrest</li>
  <li><strong>Right against Exploitation (Art. 23-24)</strong> — Prohibition of forced labour, trafficking, child labour in hazardous industries</li>
  <li><strong>Right to Freedom of Religion (Art. 25-28)</strong> — Freedom of conscience, right to profess/practice/propagate religion</li>
  <li><strong>Cultural & Educational Rights (Art. 29-30)</strong> — Rights of minorities to conserve culture, establish educational institutions</li>
  <li><strong>Right to Constitutional Remedies (Art. 32)</strong> — "Soul of the Constitution" — right to approach Supreme Court for enforcement</li>
</ul>
<h4>Key Points for Exams</h4>
<ul>
  <li>Art. 21 (Right to Life) is the most expansive right — now includes right to privacy (Puttaswamy, 2017), livelihood, health, education</li>
  <li>Fundamental Rights can be restricted but not abrogated (Kesavananda Bharati, 1973 — Basic Structure)</li>
  <li>Art. 20 & 21 cannot be suspended even during Emergency</li>
  <li>Writs under Art. 32 (SC) and Art. 226 (HC): Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto</li>
</ul>
<h4>Landmark Cases</h4>
<ul>
  <li>Maneka Gandhi v. UOI (1978) — Art. 21 procedure must be fair, just & reasonable</li>
  <li>Kesavananda Bharati (1973) — Basic Structure Doctrine; Parliament cannot amend basic structure</li>
  <li>K.S. Puttaswamy (2017) — Right to Privacy is a fundamental right under Art. 21</li>
  <li>Navtej Singh Johar (2018) — S.377 IPC struck down; affirmed LGBTQ+ rights</li>
  <li>Olga Tellis (1985) — Right to livelihood is part of Right to Life</li>
</ul>`
  },
  {
    tag: 'Criminal Law', filter: 'criminal',
    title: 'IPC / BNS Key Sections',
    desc: 'Important sections of Indian Penal Code and the new Bharatiya Nyaya Sanhita 2023.',
    content: `<h4>Offences Against the Person</h4>
<ul>
  <li>S.299/300 IPC (S.99/100 BNS) — Culpable Homicide / Murder; S.302 IPC punishment: death or life imprisonment</li>
  <li>S.304A IPC — Causing death by negligence (2 years / fine)</li>
  <li>S.307 IPC — Attempt to murder (up to life if hurt caused)</li>
  <li>S.323-325 IPC — Voluntarily causing hurt / grievous hurt</li>
  <li>S.354 IPC — Assault or criminal force against woman (S.74 BNS)</li>
  <li>S.375/376 IPC (S.63/64 BNS) — Rape and punishment</li>
</ul>
<h4>Property Offences</h4>
<ul>
  <li>S.378 IPC (S.303 BNS) — Theft (3 years + fine)</li>
  <li>S.383 IPC — Extortion; S.390 — Robbery; S.391 — Dacoity</li>
  <li>S.406 IPC — Criminal breach of trust (3 years + fine)</li>
  <li>S.420 IPC (S.318 BNS) — Cheating and dishonestly inducing delivery (7 years)</li>
</ul>
<h4>Other Key Sections</h4>
<ul>
  <li>S.499/500 IPC — Defamation (2 years)</li>
  <li>S.498A IPC (S.85 BNS) — Cruelty by husband/relatives (dowry harassment); 3 years + fine</li>
  <li>S.138 NI Act — Cheque bounce; imprisonment up to 2 years or 2x cheque amount</li>
  <li>S.66C/66D IT Act — Identity theft / cheating by impersonation using computer</li>
</ul>
<h4>BNS 2023 — Key Changes</h4>
<ul>
  <li>IPC replaced by Bharatiya Nyaya Sanhita (BNS), CrPC by BNSS, Evidence Act by BSA</li>
  <li>New offence: Terrorism (S.111 BNS), Organised crime (S.112 BNS)</li>
  <li>Trial timelines now mandatory under BNSS</li>
  <li>Zero FIR provision codified</li>
</ul>`
  },
  {
    tag: 'Civil Law', filter: 'civil',
    title: 'Indian Contract Act 1872',
    desc: 'Formation, validity, performance, and breach of contracts under Indian law.',
    content: `<h4>Essentials of a Valid Contract (S.10)</h4>
<ul>
  <li>Offer (S.2a) + Acceptance (S.2b) = Agreement (S.2e)</li>
  <li>Lawful Consideration (S.2d) — "quid pro quo"; past consideration generally not valid</li>
  <li>Competent Parties (S.11) — Age of majority (18), sound mind, not disqualified by law</li>
  <li>Free Consent (S.14) — No coercion (S.15), undue influence (S.16), fraud (S.17), misrepresentation (S.18), mistake (S.20-22)</li>
  <li>Lawful Object (S.23) — Not forbidden by law, not immoral, not against public policy</li>
</ul>
<h4>Void vs Voidable vs Illegal</h4>
<ul>
  <li>Void Agreement (S.2j) — No legal effect from the start (e.g., agreement with minor)</li>
  <li>Voidable Contract (S.2i) — Valid until rescinded by aggrieved party (e.g., induced by fraud)</li>
  <li>Illegal Agreement — Void + collateral transactions also void</li>
</ul>
<h4>Performance & Breach</h4>
<ul>
  <li>Actual breach, anticipatory breach (S.39)</li>
  <li>Remedies: Damages (S.73), specific performance, injunction, rescission, quantum meruit</li>
  <li>Doctrine of Frustration (S.56) — contract becomes void if performance impossible due to supervening event</li>
</ul>
<h4>Special Contracts</h4>
<ul>
  <li>Indemnity (S.124), Guarantee (S.126) — surety's liability is co-extensive with principal debtor</li>
  <li>Bailment (S.148), Pledge (S.172)</li>
  <li>Agency (S.182) — principal-agent relationship, apparent authority</li>
</ul>`
  },
  {
    tag: 'Consumer Law', filter: 'consumer',
    title: 'Consumer Protection Act 2019',
    desc: 'Rights of consumers, complaint forums, e-commerce coverage under CPA 2019.',
    content: `<h4>Who is a Consumer? (S.2(7))</h4>
<ul>
  <li>Buys goods for consideration (not for resale or commercial purpose)</li>
  <li>Hires or avails services for consideration</li>
  <li>Includes online/e-commerce buyers (2019 amendment)</li>
  <li>Beneficiaries of service also covered</li>
</ul>
<h4>Six Consumer Rights</h4>
<ul>
  <li>Right to Safety, Right to Information, Right to Choose</li>
  <li>Right to be Heard, Right to Seek Redressal, Right to Consumer Education</li>
</ul>
<h4>Complaint Forums (Pecuniary Jurisdiction)</h4>
<ul>
  <li>District Commission — Up to ₹1 crore</li>
  <li>State Commission — ₹1 crore to ₹10 crore (also first appeals from District)</li>
  <li>National Commission (NCDRC) — Above ₹10 crore (also first appeals from State)</li>
  <li>Supreme Court — Appeals from National Commission</li>
</ul>
<h4>Key Features of CPA 2019</h4>
<ul>
  <li>Central Consumer Protection Authority (CCPA) — can suo motu investigate, issue recall orders</li>
  <li>Product Liability (Ch. VI) — manufacturer, seller, service provider liable for harm</li>
  <li>E-commerce platforms covered; misleading advertisements attract penalty</li>
  <li>Mediation as alternate dispute resolution</li>
  <li>Limitation: 2 years from cause of action</li>
</ul>
<h4>Deficiencies Covered</h4>
<ul>
  <li>Defect in goods, Deficiency in services, Unfair trade practices, Restrictive trade practices</li>
</ul>`
  },
  {
    tag: 'Property Law', filter: 'property',
    title: 'Transfer of Property Act 1882',
    desc: 'Modes of transfer, mortgage types, and key doctrines in property law.',
    content: `<h4>Modes of Transfer of Property</h4>
<ul>
  <li>Sale (S.54) — Absolute transfer of ownership for a price; immovable property >₹100 needs registered instrument</li>
  <li>Mortgage (S.58) — Transfer of limited interest as security for loan repayment</li>
  <li>Lease (S.105) — Transfer of right to enjoy property for time/consideration; lessee's right: quiet enjoyment</li>
  <li>Gift (S.122) — Voluntary transfer without consideration; must be accepted in donor's lifetime</li>
  <li>Exchange (S.118) — Mutual transfer of ownership between two parties</li>
  <li>Actionable Claim (S.130) — Transfer of a right to sue</li>
</ul>
<h4>Types of Mortgage (S.58)</h4>
<ul>
  <li>Simple Mortgage — personal undertaking to repay; mortgagor retains possession</li>
  <li>Mortgage by Conditional Sale — ostensible sale with condition of retransfer</li>
  <li>Usufructuary Mortgage — mortgagee takes possession, rents go towards debt</li>
  <li>English Mortgage — absolute transfer + undertaking to retransfer on repayment</li>
  <li>Equitable Mortgage (Deposit of Title Deeds) — most common in housing loans</li>
</ul>
<h4>Important Doctrines</h4>
<ul>
  <li>Doctrine of Part Performance (S.53A) — protects transferee in possession even without registered deed</li>
  <li>Lis Pendens (S.52) — property cannot be transferred pending litigation</li>
  <li>Rule against Perpetuity (S.14) — interest in property must vest within 18 years after lives in being</li>
  <li>Feeding the Grant (S.43) — transferor without title but subsequently acquiring it, transfer gets validated</li>
</ul>`
  },
  {
    tag: 'Labour Law', filter: 'labour',
    title: 'Key Labour Laws',
    desc: 'Worker rights, employer obligations, and dispute resolution under Indian labour law.',
    content: `<h4>Four Labour Codes (2019-2020)</h4>
<ul>
  <li>Code on Wages 2019 — Consolidates: Minimum Wages Act, Payment of Wages Act, Equal Remuneration Act, Payment of Bonus Act</li>
  <li>Industrial Relations Code 2020 — Consolidates: Trade Union Act, Industrial Employment (Standing Orders) Act, Industrial Disputes Act</li>
  <li>Code on Social Security 2020 — EPF, ESI, Gratuity, Maternity Benefit, etc.</li>
  <li>Occupational Safety, Health & Working Conditions Code 2020 — Factories Act, Mines Act, etc.</li>
</ul>
<h4>Key Rights of Workers</h4>
<ul>
  <li>Minimum Wages — state-wise; no employer can pay below floor wage</li>
  <li>Equal pay for equal work (now codified in Code on Wages)</li>
  <li>Overtime — 2x rate for work beyond 9 hours/day or 48 hours/week</li>
  <li>Gratuity (Payment of Gratuity Act) — 15 days wages per year after 5 years continuous service</li>
  <li>Maternity Benefit — 26 weeks paid leave for first 2 children</li>
</ul>
<h4>POSH Act 2013 (Sexual Harassment at Workplace)</h4>
<ul>
  <li>Internal Complaints Committee (ICC) mandatory for 10+ employees</li>
  <li>Local Complaints Committee (LCC) for smaller establishments</li>
  <li>90-day inquiry deadline; 60-day appeal period</li>
  <li>Quid pro quo and hostile work environment both covered</li>
</ul>
<h4>Industrial Disputes</h4>
<ul>
  <li>Strike notice: 6 weeks in public utility services</li>
  <li>Layoff / Retrenchment: 100+ worker establishment needs govt. permission</li>
  <li>Gratuity, PF, ESI — mandatory social security contributions</li>
</ul>`
  },
  {
    tag: 'Family Law', filter: 'family',
    title: 'Hindu Marriage & Divorce',
    desc: 'Conditions for marriage, grounds for divorce, and matrimonial remedies.',
    content: `<h4>Hindu Marriage Act 1955 — Conditions (S.5)</h4>
<ul>
  <li>Neither party has a living spouse (monogamy)</li>
  <li>Neither party is of unsound mind / incapable of valid consent</li>
  <li>Bridegroom — 21 years; Bride — 18 years</li>
  <li>Parties are not within prohibited degrees of relationship</li>
  <li>Registration encouraged; now mandatory in many states</li>
</ul>
<h4>Grounds for Divorce (S.13)</h4>
<ul>
  <li>Adultery, Cruelty, Desertion (2 years), Conversion, Unsound mind</li>
  <li>Leprosy, Venereal disease, Renunciation of world</li>
  <li>Not heard of for 7 years (presumed dead)</li>
  <li>Divorce by mutual consent (S.13B) — 1 year separation + joint petition</li>
</ul>
<h4>Matrimonial Remedies</h4>
<ul>
  <li>Restitution of Conjugal Rights (S.9) — court orders spouse to return</li>
  <li>Judicial Separation (S.10) — live apart without divorce</li>
  <li>Maintenance under S.125 CrPC / BNSS — wife, children, parents</li>
  <li>Domestic Violence Act 2005 — protection orders, residence orders, monetary relief</li>
</ul>
<h4>Property Rights</h4>
<ul>
  <li>Hindu Succession Act 1956 (amended 2005) — daughters have equal coparcenary rights</li>
  <li>Stridhan — woman's absolute property (gifts before/at/after marriage)</li>
  <li>Dowry Prohibition Act 1961 — giving/taking dowry is a criminal offence</li>
</ul>`
  },
  {
    tag: 'RTI & PIL', filter: 'rti',
    title: 'RTI Act & Public Interest Litigation',
    desc: 'How to use the Right to Information Act and file a PIL in India.',
    content: `<h4>Right to Information Act 2005</h4>
<ul>
  <li>Every citizen can seek information from any public authority</li>
  <li>Application fee: ₹10 (BPL: NIL); additional cost for documents ₹2/page</li>
  <li>Reply deadline: 30 days (10 days if life/liberty); 45 days for non-central authorities</li>
  <li>PIO must provide info; if refused — appeal to First Appellate Authority within 30 days</li>
  <li>Second appeal/complaint to Central/State Information Commission within 90 days</li>
</ul>
<h4>Exempted Information (S.8)</h4>
<ul>
  <li>National security, sovereignty, strategic/scientific/economic interests</li>
  <li>Cabinet deliberations, personal information with no public interest</li>
  <li>Information that would endanger life/safety of a person</li>
</ul>
<h4>Public Interest Litigation (PIL)</h4>
<ul>
  <li>Any citizen/group can file PIL in HC (Art. 226) or SC (Art. 32) for public cause</li>
  <li>Locus standi relaxed — third party can file on behalf of victim</li>
  <li>No court fee; available in matters of public importance</li>
  <li>SC can even treat a letter or postcard as a writ petition (epistolary jurisdiction)</li>
</ul>
<h4>Consumer Helplines & Portals</h4>
<ul>
  <li>RTI Online: rtionline.gov.in (Central Govt matters)</li>
  <li>Consumer helpline: 1915 or consumerhelpline.gov.in</li>
  <li>Labour complaints: Shram Suvidha Portal</li>
  <li>Legal aid: nalsa.gov.in (free legal services)</li>
</ul>`
  }
];

// ── Students init ─────────────────────────────────────────────
if (document.getElementById('studentsGrid')) {
  let activeFilter = 'all';

  document.addEventListener('DOMContentLoaded', () => {
    renderStudentCards('all');
    setupFilterBtns();
  });

  function setupFilterBtns() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderStudentCards(activeFilter);
      });
    });
  }

  function renderStudentCards(filter) {
    const grid = document.getElementById('studentsGrid');
    if (!grid) return;
    const filtered = filter === 'all' ? STUDENT_CARDS : STUDENT_CARDS.filter(c => c.filter === filter);
    grid.innerHTML = filtered.map((card, i) => `
      <div class="student-card" onclick="openStudentModal(${STUDENT_CARDS.indexOf(card)})">
        <div class="student-card-tag">${card.tag}</div>
        <div class="student-card-title">${card.title}</div>
        <div class="student-card-desc">${card.desc}</div>
        <div class="student-card-footer">
          <span>Click to expand</span>
          <span class="card-arrow">→</span>
        </div>
      </div>`).join('');
  }

  function openStudentModal(idx) {
    const card = STUDENT_CARDS[idx];
    document.getElementById('studentModalTitle').textContent = card.title;
    document.getElementById('studentModalBody').innerHTML = card.content;
    openModal('studentModal');
  }

  window.openStudentModal = openStudentModal;
}

// ── AI Study Tool ─────────────────────────────────────────────
async function askStudyAI() {
  const input = document.getElementById('studyQuestion');
  const q = input ? input.value.trim() : '';
  if (!q) { showToast('Please enter a legal question', 'error'); return; }

  const btn = document.getElementById('studyAskBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner spinner-sm"></span>';

  const resultArea = document.getElementById('studyAiResult');
  resultArea.innerHTML = '<div style="display:flex;gap:10px;align-items:center;color:var(--text-muted)"><span class="spinner"></span> Thinking…</div>';
  resultArea.style.display = 'block';

  try {
    const answer = await callClaude(
      [{ role: 'user', content: q }],
      'You are an expert Indian law professor and examiner. Answer legal questions clearly with references to relevant acts, sections, and landmark cases. Provide exam-focused, accurate answers suitable for LLB/judiciary exam preparation. Use structured format with key points.',
      800
    );
    resultArea.innerHTML = `<div style="font-size:14px;line-height:1.8">${escHtml(answer).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>`;
  } catch (err) {
    resultArea.innerHTML = `<div style="color:var(--text-muted)">Failed to get answer. Please try again.</div>`;
    showToast('AI request failed', 'error');
  }

  btn.disabled = false;
  btn.textContent = 'Ask';
}


/* ============================================================
   NyaySetu — Auth (auth.js)
   ============================================================ */

if (document.getElementById('authCard')) {
  let authMode = 'login';

  document.addEventListener('DOMContentLoaded', () => {
    if (App.user) window.location.href = '../pages/dashboard.html';
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    document.getElementById('authForm')?.addEventListener('submit', e => { e.preventDefault(); handleAuth(); });
  });

  function switchTab(mode) {
    authMode = mode;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
    const submitBtn = document.getElementById('authSubmitBtn');
    if (submitBtn) submitBtn.textContent = mode === 'login' ? 'Login' : 'Create Account';
    const nameGroup = document.getElementById('nameGroup');
    if (nameGroup) nameGroup.style.display = mode === 'signup' ? 'block' : 'none';
    document.getElementById('authError').style.display = 'none';
  }

  function handleAuth() {
    const email = document.getElementById('authEmail')?.value.trim();
    const password = document.getElementById('authPassword')?.value;
    const name = document.getElementById('authName')?.value.trim();
    const errEl = document.getElementById('authError');

    if (!email || !password) { errEl.textContent = 'Email and password are required.'; errEl.style.display = 'block'; return; }
    if (!email.includes('@')) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return; }
    if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.style.display = 'block'; return; }
    if (authMode === 'signup' && !name) { errEl.textContent = 'Please enter your name.'; errEl.style.display = 'block'; return; }

    errEl.style.display = 'none';
    const btn = document.getElementById('authSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner spinner-sm"></span> Please wait…';

    setTimeout(() => {
      const user = { email, name: name || email.split('@')[0], createdAt: new Date().toISOString() };
      App.user = user;
      localStorage.setItem('nyaysetu_user', JSON.stringify(user));
      showToast(authMode === 'login' ? 'Welcome back!' : 'Account created!', 'success');
      setTimeout(() => window.location.href = '../pages/dashboard.html', 800);
    }, 1000);
  }

  window.handleAuth = handleAuth;
  window.switchTab = switchTab;

  function handleGoogleAuth() {
    showToast('Google Auth requires backend integration (Supabase). Using email login for demo.', 'info');
  }
  window.handleGoogleAuth = handleGoogleAuth;
}


/* ============================================================
   NyaySetu — Dashboard (dashboard.js)
   ============================================================ */

if (document.getElementById('dashboardPage')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (!App.user) { window.location.href = '../pages/auth.html'; return; }
    renderDashboard();
  });

  function renderDashboard() {
    const u = App.user;
    document.getElementById('dashName').textContent = `Welcome back, ${u.name}`;
    document.getElementById('dashDate').textContent = getDateStr();
    document.getElementById('statChats').textContent = App.stats.chats;
    document.getElementById('statDocs').textContent = App.stats.docs;
    document.getElementById('statSaved').textContent = App.stats.saved;
    document.getElementById('statSessions').textContent = JSON.parse(localStorage.getItem('nyaysetu_sessions') || '[]').length;
    renderActivity();
  }

  function renderActivity() {
    const list = document.getElementById('activityList');
    if (!list) return;
    const acts = App.activity;
    if (!acts.length) {
      list.innerHTML = '<div class="saved-empty">No activity yet. Start chatting or generating documents!</div>';
      return;
    }
    const icons = { chat: '💬', doc: '📄', simplify: '🔍', study: '🎓' };
    list.innerHTML = acts.slice(0, 10).map(a => `
      <div class="activity-item">
        <div class="activity-icon">${icons[a.type] || '⚡'}</div>
        <div class="activity-info">
          <div class="activity-title">${escHtml(a.title)}</div>
          <div class="activity-time">${a.time}</div>
        </div>
        <div class="activity-badge">${a.type.charAt(0).toUpperCase() + a.type.slice(1)}</div>
      </div>`).join('');
  }

  function logout() {
    App.user = null;
    localStorage.removeItem('nyaysetu_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => window.location.href = '../index.html', 800);
  }

  window.logout = logout;
}
