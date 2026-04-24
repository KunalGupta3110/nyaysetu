/* ============================================================
   NyaySetu — Document Generator (documents.js)
   ============================================================ */

const DOC_TYPES = {
  legal_notice: {
    label: 'Legal Notice', icon: '⚡',
    fields: [
      { id: 'sender_name', label: 'Sender Full Name', placeholder: 'Your full legal name', required: true },
      { id: 'sender_addr', label: 'Sender Address', placeholder: 'Your complete address with PIN', required: true },
      { id: 'sender_phone', label: 'Sender Phone / Email', placeholder: 'Contact details', required: true },
      { id: 'recipient_name', label: "Recipient's Full Name", placeholder: "Opposite party's full name", required: true },
      { id: 'recipient_addr', label: "Recipient's Address", placeholder: "Opposite party's complete address", required: true },
      { id: 'subject', label: 'Subject of Notice', placeholder: 'e.g., Demand for payment of dues, Recovery of property', required: true },
      { id: 'facts', label: 'Statement of Facts / Grievance', placeholder: 'Describe the situation and events in chronological order...', type: 'textarea', required: true },
      { id: 'demand', label: 'Relief / Demand Sought', placeholder: 'What specific action do you demand?', required: true },
      { id: 'time_given', label: 'Time Given to Comply', placeholder: 'e.g., 15 days, 30 days', required: true },
      { id: 'place', label: 'Place (City)', placeholder: 'City where notice is issued', required: true }
    ]
  },
  affidavit: {
    label: 'Affidavit', icon: '📜',
    fields: [
      { id: 'name', label: 'Deponent Full Name', placeholder: 'Your full legal name', required: true },
      { id: 'age', label: 'Age', placeholder: 'Your age in years', required: true },
      { id: 'father_name', label: "Father's / Husband's Name", placeholder: 'S/o or W/o', required: true },
      { id: 'address', label: 'Permanent Address', placeholder: 'Complete residential address with PIN', required: true },
      { id: 'purpose', label: 'Purpose of Affidavit', placeholder: 'e.g., Address proof, Name change, Date of birth declaration', required: true },
      { id: 'statements', label: 'Statements / Facts', placeholder: 'Write each fact you are declaring...', type: 'textarea', required: true },
      { id: 'court', label: 'Before Whom (Court / Authority)', placeholder: 'e.g., Before the Notary, District Court', required: true },
      { id: 'place', label: 'Place', placeholder: 'City', required: true }
    ]
  },
  rent_agreement: {
    label: 'Rent Agreement', icon: '🏠',
    fields: [
      { id: 'landlord', label: "Landlord's Full Name", placeholder: 'First Party / Owner name', required: true },
      { id: 'landlord_addr', label: "Landlord's Address", placeholder: 'Permanent address of landlord', required: true },
      { id: 'tenant', label: "Tenant's Full Name", placeholder: 'Second Party / Tenant name', required: true },
      { id: 'tenant_addr', label: "Tenant's Permanent Address", placeholder: 'Permanent (home) address of tenant', required: true },
      { id: 'property_addr', label: 'Property Address (to be rented)', placeholder: 'Complete address of the property', required: true },
      { id: 'property_desc', label: 'Property Description', placeholder: 'e.g., 2BHK flat, ground floor, approx 850 sq.ft.', required: true },
      { id: 'rent', label: 'Monthly Rent (₹)', placeholder: 'Rent amount in figures', required: true },
      { id: 'deposit', label: 'Security Deposit (₹)', placeholder: 'Security deposit amount', required: true },
      { id: 'start_date', label: 'Commencement Date', placeholder: 'e.g., 1st April 2025', required: true },
      { id: 'duration', label: 'Duration of Agreement', placeholder: 'e.g., 11 months', required: true },
      { id: 'city', label: 'City of Execution', placeholder: 'City', required: true }
    ]
  },
  consumer_complaint: {
    label: 'Consumer Complaint', icon: '🛒',
    fields: [
      { id: 'complainant', label: 'Complainant (Your) Name', placeholder: 'Your full name', required: true },
      { id: 'complainant_addr', label: 'Complainant Address', placeholder: 'Your complete address', required: true },
      { id: 'complainant_contact', label: 'Phone / Email', placeholder: 'Your contact details', required: true },
      { id: 'op_name', label: 'Opposite Party (Company / Seller)', placeholder: 'Full name of company or seller', required: true },
      { id: 'op_addr', label: 'Opposite Party Address', placeholder: 'Address of company / seller / service provider', required: true },
      { id: 'product', label: 'Product / Service Purchased', placeholder: 'Name and description of product or service', required: true },
      { id: 'amount', label: 'Amount Paid (₹)', placeholder: 'Total amount paid', required: true },
      { id: 'purchase_date', label: 'Date of Purchase / Service', placeholder: 'Date when you bought or used the service', required: true },
      { id: 'grievance', label: 'Details of Grievance / Deficiency', placeholder: 'Describe the problem, defect, or deficiency in detail...', type: 'textarea', required: true },
      { id: 'relief', label: 'Relief Sought', placeholder: 'e.g., Refund of ₹X, replacement, compensation of ₹Y, mental harassment damages', required: true },
      { id: 'forum', label: 'Forum / Commission', placeholder: 'e.g., District Consumer Disputes Redressal Commission, Delhi', required: true }
    ]
  },
  rti: {
    label: 'RTI Application', icon: '📋',
    fields: [
      { id: 'applicant', label: 'Applicant Full Name', placeholder: 'Your full name', required: true },
      { id: 'applicant_addr', label: 'Applicant Address', placeholder: 'Your complete address with PIN code', required: true },
      { id: 'applicant_phone', label: 'Phone / Email', placeholder: 'Your contact details', required: true },
      { id: 'pio_name', label: 'Public Information Officer Name', placeholder: 'Name of PIO (if known, else leave "The PIO")', required: false },
      { id: 'department', label: 'Department / Public Authority', placeholder: 'e.g., Municipal Corporation of Delhi, Central Govt, Ministry of Finance', required: true },
      { id: 'department_addr', label: 'Department Address', placeholder: 'Complete address of the public authority', required: true },
      { id: 'info_sought', label: 'Information Sought', placeholder: 'List each piece of information you want, clearly and specifically...', type: 'textarea', required: true },
      { id: 'period', label: 'Period for which Information is Sought', placeholder: 'e.g., Financial Year 2023-24, or specific dates', required: false },
      { id: 'fee_paid', label: 'Application Fee (₹)', placeholder: 'RTI fee paid, usually ₹10 (BPL: nil)', required: false },
      { id: 'place', label: 'Place', placeholder: 'City', required: true }
    ]
  },
  bail: {
    label: 'Bail Application', icon: '⚖️',
    fields: [
      { id: 'accused', label: 'Name of Accused / Applicant', placeholder: 'Full name of the accused', required: true },
      { id: 'accused_addr', label: "Accused's Address", placeholder: 'Permanent residential address', required: true },
      { id: 'fir_no', label: 'FIR Number and Police Station', placeholder: 'e.g., FIR No. 123/2024, PS Connaught Place', required: true },
      { id: 'sections', label: 'Sections Charged Under', placeholder: 'e.g., IPC Sec. 420, 406 or BNS Sec. 318, 316', required: true },
      { id: 'court', label: 'Court Name and Location', placeholder: 'e.g., Sessions Court, Delhi', required: true },
      { id: 'date_arrest', label: 'Date of Arrest', placeholder: 'Date when accused was arrested', required: true },
      { id: 'grounds', label: 'Grounds for Bail', placeholder: 'State reasons e.g., no criminal antecedents, permanent resident, family dependent, offence bailable, custodial interrogation complete...', type: 'textarea', required: true },
      { id: 'surety', label: 'Surety Details', placeholder: 'Name and address of proposed surety (if applicable)', required: false },
      { id: 'advocate', label: "Advocate's Name", placeholder: "Applicant's advocate name", required: false }
    ]
  }
};

// ── State ─────────────────────────────────────────────────────
let currentDocType = 'legal_notice';
let generatedDocText = '';

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDocTypeButtons();
  renderDocFields();
});

// ── Doc type buttons ──────────────────────────────────────────
function renderDocTypeButtons() {
  const grid = document.getElementById('docTypeGrid');
  if (!grid) return;
  grid.innerHTML = Object.entries(DOC_TYPES).map(([key, dt]) => `
    <button class="doc-type-btn ${key === currentDocType ? 'active' : ''}"
      data-type="${key}" onclick="selectDocType('${key}')">
      <span class="icon">${dt.icon}</span>${dt.label}
    </button>
  `).join('');
}

function selectDocType(type) {
  currentDocType = type;
  document.querySelectorAll('.doc-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  renderDocFields();
  document.getElementById('docPreview').innerHTML = `
    <div class="preview-placeholder">
      <div class="ph-icon">${DOC_TYPES[type].icon}</div>
      Fill in all fields and click <strong>Generate Document</strong>
    </div>`;
  document.getElementById('previewTitleText').textContent = DOC_TYPES[type].label + ' Preview';
  generatedDocText = '';
}

// ── Form fields ───────────────────────────────────────────────
function renderDocFields() {
  const form = document.getElementById('docFormFields');
  if (!form) return;
  const fields = DOC_TYPES[currentDocType].fields;
  form.innerHTML = fields.map(f => `
    <div class="form-group">
      <label class="form-label">${f.label}${f.required ? ' <span style="color:var(--gold)">*</span>' : ''}</label>
      ${f.type === 'textarea'
        ? `<textarea class="form-textarea" id="df_${f.id}" placeholder="${f.placeholder}" rows="4"></textarea>`
        : `<input class="form-input" type="text" id="df_${f.id}" placeholder="${f.placeholder}">`
      }
    </div>
  `).join('');
}

// ── Generate document ─────────────────────────────────────────
async function generateDocument() {
  const fields = DOC_TYPES[currentDocType].fields;
  const fieldData = {};
  let missing = [];

  fields.forEach(f => {
    const el = document.getElementById('df_' + f.id);
    const val = el ? el.value.trim() : '';
    fieldData[f.label] = val;
    if (f.required && !val) missing.push(f.label);
  });

  if (missing.length > 0) {
    showToast(`Please fill required fields: ${missing.slice(0,2).join(', ')}${missing.length > 2 ? '...' : ''}`, 'error');
    return;
  }

  const btn = document.getElementById('genDocBtn');
  const btnText = document.getElementById('genDocBtnText');
  btnText.innerHTML = '<span class="spinner spinner-sm"></span> Generating…';
  btn.disabled = true;

  document.getElementById('docPreview').innerHTML = `
    <div class="preview-placeholder">
      <span class="spinner spinner-lg"></span>
      <div style="margin-top:16px;color:var(--text-muted)">Drafting your ${DOC_TYPES[currentDocType].label}…</div>
    </div>`;

  const fieldStr = Object.entries(fieldData)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const prompt = `Draft a complete, professional, court-ready Indian ${DOC_TYPES[currentDocType].label} using these details:

${fieldStr}

Today's Date: ${today}

STRICT REQUIREMENTS:
1. Use proper Indian legal document format and structure
2. Professional and formal legal language as used in Indian courts
3. Include all standard clauses appropriate for this document type
4. Add proper headings, numbering, salutations, and signature blocks
5. Reference relevant Indian laws/acts where appropriate
6. Plain text only — NO markdown, NO asterisks, NO hash symbols
7. Use proper indentation and spacing for readability
8. Include "DISCLAIMER: This document is AI-generated and should be reviewed by a qualified advocate before use."
9. The document should be complete and ready to use with minimal editing`;

  try {
    const doc = await callClaude(
      [{ role: 'user', content: prompt }],
      'You are an expert Indian legal document drafter with 25+ years of experience drafting documents for various courts and authorities across India. You draft clear, legally sound, professional documents in standard Indian legal format. Respond with only the document text — no commentary, no markdown.',
      1500
    );

    generatedDocText = doc;
    document.getElementById('docPreview').innerHTML = `<div class="preview-content">${escHtml(doc)}</div>`;
    document.getElementById('previewTitleText').textContent = DOC_TYPES[currentDocType].label;

    App.stats.docs++;
    App.saveStats();
    App.addActivity('doc', DOC_TYPES[currentDocType].label);
    showToast('Document generated successfully!', 'success');
  } catch (err) {
    document.getElementById('docPreview').innerHTML = `<div class="preview-placeholder"><div class="ph-icon">⚠️</div>Generation failed: ${escHtml(err.message)}<br><small>Please check your connection and try again.</small></div>`;
    showToast('Generation failed. Please try again.', 'error');
  }

  btnText.textContent = 'Generate Document';
  btn.disabled = false;
}

// ── Copy & PDF ────────────────────────────────────────────────
function copyDocument() {
  if (!generatedDocText) { showToast('No document to copy. Generate one first.', 'error'); return; }
  copyToClipboard(generatedDocText);
  App.stats.saved++;
  App.saveStats();
}

function downloadPDF() {
  if (!generatedDocText) { showToast('No document to download. Generate one first.', 'error'); return; }

  if (!window.jspdf) { showToast('PDF library loading…', 'info'); return; }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('NyaySetu — AI Legal Assistant', 105, 15, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(DOC_TYPES[currentDocType].label, 105, 22, { align: 'center' });

    // Divider line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(15, 26, 195, 26);

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);

    const lines = doc.splitTextToSize(generatedDocText, 175);
    let y = 34;
    const pageH = 280;
    lines.forEach(line => {
      if (y > pageH) { doc.addPage(); y = 20; }
      doc.text(line, 15, y);
      y += 5.5;
    });

    // Footer
    const pCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by NyaySetu.in | Page ${i} of ${pCount} | AI-generated document — consult a qualified advocate`, 105, 290, { align: 'center' });
    }

    const filename = `NyaySetu_${DOC_TYPES[currentDocType].label.replace(/ /g,'_')}_${Date.now()}.pdf`;
    doc.save(filename);
    App.stats.saved++;
    App.saveStats();
    showToast('PDF downloaded!', 'success');
  } catch (e) {
    showToast('PDF generation failed: ' + e.message, 'error');
  }
}
