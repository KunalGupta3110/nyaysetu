window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['legal-notice'] = function(data) {
  const d = data.fields;
  const blocks = [];

  blocks.push({ type: 'title', text: 'LEGAL NOTICE' });
  blocks.push({ type: 'body', text: `Date: ${data.date}` });
  
  blocks.push({ type: 'body', text: `To,\n${d.recipient_name}\n${d.recipient_addr}` });
  
  blocks.push({ type: 'heading', text: `Subject: ${d.subject || 'Legal Notice'}` });
  
  blocks.push({ type: 'body', text: `Under instructions from and on behalf of my client ${d.sender_name}, residing at ${d.sender_addr}, I do hereby serve upon you with the following legal notice:` });
  
  blocks.push({ type: 'heading', text: '1. STATEMENT OF FACTS:' });
  blocks.push({ type: 'body', text: `That the facts giving rise to this notice are as follows:\n${d.facts}` });
  
  if (d.amount) {
    blocks.push({ type: 'heading', text: '2. AMOUNT INVOLVED:' });
    blocks.push({ type: 'body', text: `That the amount/property involved is ${d.amount}.` });
  }
  
  blocks.push({ type: 'heading', text: `${d.amount ? '3' : '2'}. CAUSE OF ACTION:` });
  blocks.push({ type: 'body', text: 'That the cause of action for issuing this notice arose when you failed to address the aforementioned grievances despite repeated requests.' });
  
  blocks.push({ type: 'heading', text: `${d.amount ? '4' : '3'}. RELIEF SOUGHT:` });
  blocks.push({ type: 'body', text: `You are hereby called upon to ${d.demand}${d.time_limit ? ` within ${d.time_limit} from the receipt of this notice` : ''}.` });
  
  blocks.push({ type: 'heading', text: `${d.amount ? '5' : '4'}. CONCLUSION:` });
  blocks.push({ type: 'body', text: 'If you fail to comply with the demands stated above within the stipulated time, my client shall be constrained to initiate appropriate legal proceedings against you in a competent court of law, entirely at your own risk as to costs and consequences.\n\nA copy of this notice is kept in my office for future reference.\n\nYours faithfully,' });
  
  blocks.push({ type: 'signature', text: `Signature: __________________________\n${d.sender_name}\n${d.sender_addr}` });

  return blocks;
};
