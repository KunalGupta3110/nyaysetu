window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['consumer-complaint'] = function(data) {
  const d = data.fields;
  const blocks = [];

  blocks.push({ type: 'title', text: 'BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION' });
  blocks.push({ type: 'heading', text: 'COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019' });
  
  blocks.push({ type: 'heading', text: 'IN THE MATTER OF:' });
  blocks.push({ type: 'body', text: `${d.complainant}\n${d.complainant_addr}\nPhone/Email: ${d.complainant_phone || '_________________'}\n... Complainant` });
  
  blocks.push({ type: 'body', text: 'VERSUS' });
  
  blocks.push({ type: 'body', text: `${d.company}\n${d.company_addr}\n... Opposite Party` });
  
  blocks.push({ type: 'heading', text: `SUBJECT: COMPLAINT REGARDING DEFICIENCY IN SERVICE / DEFECT IN GOODS IN RESPECT OF ${d.product.toUpperCase()}.` });
  
  blocks.push({ type: 'heading', text: 'MOST RESPECTFULLY SHOWETH:' });
  
  blocks.push({ type: 'body', text: '1. That the Complainant is a consumer as defined under Section 2(7) of the Consumer Protection Act, 2019. The Opposite Party is engaged in the business of selling goods/providing services.' });
  
  blocks.push({ type: 'body', text: `2. That on ${d.purchase_date || '_________'}, the Complainant purchased/availed ${d.product} from the Opposite Party for a total consideration of ${d.amount_paid}, paid via valid receipt/invoice.` });
  
  blocks.push({ type: 'body', text: `3. That shortly after the purchase/service, the Complainant discovered the following defects and deficiencies:\n${d.complaint}` });
  
  blocks.push({ type: 'body', text: '4. That the Complainant made several representations to the Opposite Party to rectify the issue or refund the amount, but the Opposite Party failed to resolve the grievance, thereby committing severe deficiency in service and unfair trade practice.' });
  
  blocks.push({ type: 'body', text: `5. That the cause of action arose on ${d.purchase_date || '_________'} and continues to subsist. The Honorable Commission has jurisdiction to adjudicate this complaint.` });
  
  blocks.push({ type: 'heading', text: 'PRAYER / RELIEF SOUGHT' });
  blocks.push({ type: 'body', text: `In view of the facts and circumstances stated above, the Complainant most respectfully prays that this Honorable Commission may be pleased to:\na) Direct the Opposite Party to ${d.relief}.\nb) Award compensation for mental agony and physical harassment caused to the Complainant.\nc) Award the cost of this litigation in favor of the Complainant.\nd) Pass any other order which this Honorable Commission deems fit and proper in the interest of justice.` });
  
  blocks.push({ type: 'signature', text: `COMPLAINANT\nSignature: __________________________\nName: ${d.complainant}\nDate: ${data.date}` });

  return blocks;
};
