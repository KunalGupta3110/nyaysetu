window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['rent-agreement'] = function(data) {
  const d = data.fields;
  const blocks = [];

  blocks.push({ type: 'title', text: 'RENT AGREEMENT' });
  
  blocks.push({ type: 'body', text: `This Rent Agreement is made and executed on this ${data.date} at _____________.\n\nBETWEEN` });
  
  blocks.push({ type: 'body', text: `${d.landlord_name}, residing at ${d.landlord_addr}, hereinafter called the "Landlord" (which expression shall unless it be repugnant to the context or meaning thereof, mean and include their heirs, legal representatives, executors, and assigns) of the FIRST PART.` });
  
  blocks.push({ type: 'body', text: 'AND' });
  
  blocks.push({ type: 'body', text: `${d.tenant_name}, residing at ${d.tenant_addr}, hereinafter called the "Tenant" (which expression shall unless it be repugnant to the context or meaning thereof, mean and include their heirs, legal representatives, executors, and assigns) of the SECOND PART.` });
  
  blocks.push({ type: 'body', text: `WHEREAS the Landlord is the absolute owner of the residential property situated at ${d.property_addr} (hereinafter referred to as the "Scheduled Property").\n\nAND WHEREAS the Tenant has approached the Landlord to grant the Scheduled Property on rent, and the Landlord has agreed to rent out the same under the following terms and conditions.\n\nNOW THIS AGREEMENT WITNESSETH AS UNDER:` });
  
  blocks.push({ type: 'heading', text: '1. DURATION:' });
  blocks.push({ type: 'body', text: `That the tenancy shall commence from ${d.start_date} and shall remain in force for a period of ${d.duration}.` });
  
  blocks.push({ type: 'heading', text: '2. RENT:' });
  blocks.push({ type: 'body', text: `That the Tenant shall pay a monthly rent of ${d.rent} to the Landlord on or before the 5th day of every calendar month.` });
  
  blocks.push({ type: 'heading', text: '3. SECURITY DEPOSIT:' });
  blocks.push({ type: 'body', text: `That the Tenant has paid an interest-free refundable security deposit of ${d.deposit} to the Landlord at the time of execution of this agreement. This deposit shall be refunded at the time of vacating the premises, subject to deductions for unpaid dues or damages.` });
  
  let counter = 4;
  if (d.lock_in) {
    blocks.push({ type: 'heading', text: `${counter}. LOCK-IN PERIOD:` });
    blocks.push({ type: 'body', text: `That both parties agree to a lock-in period of ${d.lock_in}, during which neither party can terminate this agreement.` });
    counter++;
  }
  
  blocks.push({ type: 'heading', text: `${counter}. PURPOSE OF USE:` });
  blocks.push({ type: 'body', text: `That the Tenant shall use the Scheduled Property strictly for ${d.purpose_use || 'residential'} purposes only and shall not use it for any illegal, commercial, or immoral activities.` });
  counter++;
  
  blocks.push({ type: 'heading', text: `${counter}. MAINTENANCE AND UTILITIES:` });
  blocks.push({ type: 'body', text: 'That the Tenant shall pay electricity, water, and maintenance charges separately as per consumption and bills raised by the respective authorities/association.' });
  counter++;
  
  blocks.push({ type: 'heading', text: `${counter}. SUB-LETTING:` });
  blocks.push({ type: 'body', text: 'That the Tenant shall not sub-let, assign, or part with the possession of the Scheduled Property, either in whole or in part, to any third party.' });
  counter++;
  
  blocks.push({ type: 'heading', text: `${counter}. TERMINATION:` });
  blocks.push({ type: 'body', text: 'That after the lock-in period, either party may terminate this agreement by giving one month\'s prior written notice to the other party.' });
  
  blocks.push({ type: 'body', text: 'IN WITNESS WHEREOF, the Landlord and the Tenant have set their respective hands to this Rent Agreement on the date first mentioned above in the presence of the following witnesses.' });
  
  blocks.push({ type: 'signature', text: `LANDLORD (FIRST PART)\nSignature: __________________________\nName: ${d.landlord_name}\n\nTENANT (SECOND PART)\nSignature: __________________________\nName: ${d.tenant_name}\n\nWITNESS 1:\nSignature: __________________________\nName & Address: _____________________\n\nWITNESS 2:\nSignature: __________________________\nName & Address: _____________________` });

  return blocks;
};
