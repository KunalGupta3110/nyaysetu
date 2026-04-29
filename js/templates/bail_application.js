window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['bail-application'] = function(data) {
  const d = data.fields;
  const blocks = [];

  blocks.push({ type: 'title', text: `IN THE COURT OF ${d.court.toUpperCase()}` });
  
  blocks.push({ type: 'heading', text: 'BAIL APPLICATION UNDER SECTION 437/439 OF Cr.P.C. (OR BHARATIYA NAGARIK SURAKSHA SANHITA)' });
  
  blocks.push({ type: 'heading', text: 'IN THE MATTER OF:' });
  blocks.push({ type: 'body', text: `${d.accused_name}, aged about ${d.accused_age}\nResident of: ${d.accused_addr}\n... Applicant/Accused` });
  
  blocks.push({ type: 'body', text: 'VERSUS' });
  
  blocks.push({ type: 'body', text: 'State\n... Respondent' });
  
  blocks.push({ type: 'body', text: `FIR No.: ${d.fir_no}\nPolice Station: ${d.police_station}\nOffences U/s: ${d.sections}` });
  
  blocks.push({ type: 'heading', text: `APPLICATION FOR GRANT OF ${d.bail_type.toUpperCase()} ON BEHALF OF THE APPLICANT/ACCUSED` });
  
  blocks.push({ type: 'heading', text: 'MOST RESPECTFULLY SHOWETH:' });
  
  blocks.push({ type: 'body', text: '1. That the Applicant is a peace-loving and law-abiding citizen and has been falsely implicated in the present case.' });
  
  blocks.push({ type: 'body', text: `2. That the Applicant has been in judicial custody since ${d.custody_since || '_________'} (if applicable) and is not required for any further custodial interrogation.` });
  
  blocks.push({ type: 'body', text: '3. That the allegations made in the FIR are completely false, frivolous, and concocted to harass the Applicant.' });
  
  blocks.push({ type: 'heading', text: '4. GROUNDS FOR BAIL:' });
  blocks.push({ type: 'body', text: `That the Applicant seeks bail on the following grounds:\n${d.grounds}` });
  
  blocks.push({ type: 'body', text: '5. That the Applicant undertakes to abide by all the terms and conditions imposed by this Honorable Court, join the investigation as and when required, and will not tamper with the prosecution evidence or influence witnesses.' });
  
  blocks.push({ type: 'body', text: '6. That the Applicant has deep roots in society, has a permanent residence at the address mentioned above, and there is no likelihood of the Applicant absconding or fleeing from justice.' });
  
  if (d.surety) {
    blocks.push({ type: 'body', text: `7. That a reliable surety is ready and willing to stand surety for the Applicant: ${d.surety}` });
  }
  
  blocks.push({ type: 'heading', text: 'PRAYER' });
  blocks.push({ type: 'body', text: `It is, therefore, most respectfully prayed that this Honorable Court may be pleased to release the Applicant/Accused on ${d.bail_type} in the interest of justice.` });
  
  blocks.push({ type: 'signature', text: `APPLICANT/ACCUSED\nThrough Counsel\n\nSignature: __________________________\n\nPlace: _________________\nDate: ${data.date}` });

  return blocks;
};
