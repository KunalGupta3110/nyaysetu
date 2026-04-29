window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['rent-agreement'] = function(data) {
  const d = data.fields;
  return `RENT AGREEMENT

This Rent Agreement is made and executed on this ${data.date} at _____________.

BETWEEN

${d.landlord_name}, residing at ${d.landlord_addr}, hereinafter called the "Landlord" (which expression shall unless it be repugnant to the context or meaning thereof, mean and include their heirs, legal representatives, executors, and assigns) of the FIRST PART.

AND

${d.tenant_name}, residing at ${d.tenant_addr}, hereinafter called the "Tenant" (which expression shall unless it be repugnant to the context or meaning thereof, mean and include their heirs, legal representatives, executors, and assigns) of the SECOND PART.

WHEREAS the Landlord is the absolute owner of the residential property situated at ${d.property_addr} (hereinafter referred to as the "Scheduled Property").

AND WHEREAS the Tenant has approached the Landlord to grant the Scheduled Property on rent, and the Landlord has agreed to rent out the same under the following terms and conditions.

NOW THIS AGREEMENT WITNESSETH AS UNDER:

1. DURATION:
That the tenancy shall commence from ${d.start_date} and shall remain in force for a period of ${d.duration}.

2. RENT:
That the Tenant shall pay a monthly rent of ${d.rent} to the Landlord on or before the 5th day of every calendar month.

3. SECURITY DEPOSIT:
That the Tenant has paid an interest-free refundable security deposit of ${d.deposit} to the Landlord at the time of execution of this agreement. This deposit shall be refunded at the time of vacating the premises, subject to deductions for unpaid dues or damages.

${d.lock_in ? `4. LOCK-IN PERIOD:\nThat both parties agree to a lock-in period of ${d.lock_in}, during which neither party can terminate this agreement.\n` : ''}
${d.lock_in ? '5' : '4'}. PURPOSE OF USE:
That the Tenant shall use the Scheduled Property strictly for ${d.purpose_use || 'residential'} purposes only and shall not use it for any illegal, commercial, or immoral activities.

${d.lock_in ? '6' : '5'}. MAINTENANCE AND UTILITIES:
That the Tenant shall pay electricity, water, and maintenance charges separately as per consumption and bills raised by the respective authorities/association.

${d.lock_in ? '7' : '6'}. SUB-LETTING:
That the Tenant shall not sub-let, assign, or part with the possession of the Scheduled Property, either in whole or in part, to any third party.

${d.lock_in ? '8' : '7'}. TERMINATION:
That after the lock-in period, either party may terminate this agreement by giving one month's prior written notice to the other party.

IN WITNESS WHEREOF, the Landlord and the Tenant have set their respective hands to this Rent Agreement on the date first mentioned above in the presence of the following witnesses.


LANDLORD (FIRST PART)
Signature: __________________________
Name: ${d.landlord_name}


TENANT (SECOND PART)
Signature: __________________________
Name: ${d.tenant_name}


WITNESS 1:
Signature: __________________________
Name & Address: _____________________


WITNESS 2:
Signature: __________________________
Name & Address: _____________________`;
};
