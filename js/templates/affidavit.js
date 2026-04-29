window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['affidavit'] = function(data) {
  const d = data.fields;
  // Statements might be multi-line
  const statements = (d.statement || '').split('\n').filter(s => s.trim()).map((s, i) => `${i + 1}. ${s.replace(/^\d+[\.\)]\s*/, '')}`).join('\n');

  return `AFFIDAVIT

I, ${d.deponent_name}, aged about ${d.deponent_age}, residing at ${d.deponent_addr}, do hereby solemnly affirm and state on oath as under:

${statements}

That the above statements are true and correct to the best of my knowledge and belief, and I swear this affidavit in support of my application for ${d.purpose}.


DEPONENT
Signature: __________________________
Name: ${d.deponent_name}


VERIFICATION

Verified at ${d.state || '__________'} on this ${data.date}, that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and that no part of it is false and nothing material has been concealed therefrom.


DEPONENT
Signature: __________________________
Name: ${d.deponent_name}`;
};
