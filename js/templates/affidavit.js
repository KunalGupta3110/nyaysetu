window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['affidavit'] = function(data) {
  const d = data.fields;
  const blocks = [];

  const statements = (d.statement || '').split('\n').filter(s => s.trim()).map((s, i) => `${i + 1}. ${s.replace(/^\d+[\.\)]\s*/, '')}`).join('\n');

  blocks.push({ type: 'title', text: 'AFFIDAVIT' });
  blocks.push({ type: 'body', text: `I, ${d.deponent_name}, aged about ${d.deponent_age}, residing at ${d.deponent_addr}, do hereby solemnly affirm and state on oath as under:` });
  
  blocks.push({ type: 'body', text: statements });
  
  blocks.push({ type: 'body', text: `That the above statements are true and correct to the best of my knowledge and belief, and I swear this affidavit in support of my application for ${d.purpose}.` });
  
  blocks.push({ type: 'signature', text: `DEPONENT\nSignature: __________________________\nName: ${d.deponent_name}` });
  
  blocks.push({ type: 'title', text: 'VERIFICATION' });
  
  blocks.push({ type: 'body', text: `Verified at ${d.state || '__________'} on this ${data.date}, that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and that no part of it is false and nothing material has been concealed therefrom.` });
  
  blocks.push({ type: 'signature', text: `DEPONENT\nSignature: __________________________\nName: ${d.deponent_name}` });

  return blocks;
};
