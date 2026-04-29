window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['rti'] = function(data) {
  const d = data.fields;
  const blocks = [];

  const infoSought = (d.info_sought || '').split('\n').filter(s => s.trim()).map((s, i) => `${i + 1}. ${s.replace(/^\d+[\.\)]\s*/, '')}`).join('\n');

  blocks.push({ type: 'title', text: 'APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005' });
  
  blocks.push({ type: 'body', text: `To,\n${d.pio_name || 'The Public Information Officer'}\n${d.department}\n${d.department_addr}` });
  
  blocks.push({ type: 'heading', text: '1. Full Name of Applicant:' });
  blocks.push({ type: 'body', text: d.applicant });
  
  blocks.push({ type: 'heading', text: '2. Address:' });
  blocks.push({ type: 'body', text: d.applicant_addr });
  
  blocks.push({ type: 'heading', text: '3. Contact Details:' });
  blocks.push({ type: 'body', text: d.applicant_phone || 'N/A' });
  
  blocks.push({ type: 'heading', text: '4. Details of Information Sought:' });
  blocks.push({ type: 'body', text: infoSought });
  
  let counter = 5;
  if (d.time_period) {
    blocks.push({ type: 'heading', text: `${counter}. Time Period / Year to which the information relates:` });
    blocks.push({ type: 'body', text: d.time_period });
    counter++;
  }
  
  blocks.push({ type: 'heading', text: `${counter}. Fee Details:` });
  blocks.push({ type: 'body', text: `The prescribed application fee has been paid via ${d.fee_mode || 'IPO/Demand Draft/Court Fee Stamp'}.` });
  counter++;
  
  blocks.push({ type: 'heading', text: `${counter}. Below Poverty Line (BPL) Declaration:` });
  blocks.push({ type: 'body', text: 'Whether the applicant is below the poverty line: No (Unless specified otherwise).' });
  
  blocks.push({ type: 'body', text: 'I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office. If the information is held by another public authority, kindly transfer this application under Section 6(3) of the Act and intimate me accordingly.' });
  
  blocks.push({ type: 'signature', text: `Place: _________________\nDate: ${data.date}\n\nYours faithfully,\n\nSignature: __________________________\nName: ${d.applicant}` });

  return blocks;
};
