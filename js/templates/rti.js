window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['rti'] = function(data) {
  const d = data.fields;
  
  const infoSought = (d.info_sought || '').split('\n').filter(s => s.trim()).map((s, i) => `${i + 1}. ${s.replace(/^\d+[\.\)]\s*/, '')}`).join('\n');

  return `APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

To,
${d.pio_name || 'The Public Information Officer'}
${d.department}
${d.department_addr}

1. Full Name of Applicant:
   ${d.applicant}

2. Address:
   ${d.applicant_addr}

3. Contact Details:
   ${d.applicant_phone || 'N/A'}

4. Details of Information Sought:
${infoSought}

${d.time_period ? `5. Time Period / Year to which the information relates:\n   ${d.time_period}\n` : ''}
${d.time_period ? '6' : '5'}. Fee Details:
   The prescribed application fee has been paid via ${d.fee_mode || 'IPO/Demand Draft/Court Fee Stamp'}.

${d.time_period ? '7' : '6'}. Below Poverty Line (BPL) Declaration:
   Whether the applicant is below the poverty line: No (Unless specified otherwise).

I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office. If the information is held by another public authority, kindly transfer this application under Section 6(3) of the Act and intimate me accordingly.


Place: _________________
Date: ${data.date}

Yours faithfully,

Signature: __________________________
Name: ${d.applicant}`;
};
