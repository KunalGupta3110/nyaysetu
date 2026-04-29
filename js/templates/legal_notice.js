window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['legal-notice'] = function(data) {
  const d = data.fields;
  return `LEGAL NOTICE

Date: ${data.date}

To,
${d.recipient_name}
${d.recipient_addr}

Subject: ${d.subject || 'Legal Notice'}

Under instructions from and on behalf of my client ${d.sender_name}, residing at ${d.sender_addr}, I do hereby serve upon you with the following legal notice:

1. STATEMENT OF FACTS:
That the facts giving rise to this notice are as follows:
${d.facts}

${d.amount ? `2. AMOUNT INVOLVED:\nThat the amount/property involved is ${d.amount}.\n` : ''}
${d.amount ? '3' : '2'}. CAUSE OF ACTION:
That the cause of action for issuing this notice arose when you failed to address the aforementioned grievances despite repeated requests.

${d.amount ? '4' : '3'}. RELIEF SOUGHT:
You are hereby called upon to ${d.demand}${d.time_limit ? ` within ${d.time_limit} from the receipt of this notice` : ''}.

${d.amount ? '5' : '4'}. CONCLUSION:
If you fail to comply with the demands stated above within the stipulated time, my client shall be constrained to initiate appropriate legal proceedings against you in a competent court of law, entirely at your own risk as to costs and consequences.

A copy of this notice is kept in my office for future reference.

Yours faithfully,


Signature: __________________________
${d.sender_name}
${d.sender_addr}`;
};
