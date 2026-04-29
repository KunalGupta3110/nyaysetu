window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['bail-application'] = function(data) {
  const d = data.fields;
  
  return `IN THE COURT OF ${d.court.toUpperCase()}

BAIL APPLICATION UNDER SECTION 437/439 OF Cr.P.C. (OR BHARATIYA NAGARIK SURAKSHA SANHITA)

IN THE MATTER OF:

${d.accused_name}, aged about ${d.accused_age}
Resident of: ${d.accused_addr}
... Applicant/Accused

VERSUS

State
... Respondent

FIR No.: ${d.fir_no}
Police Station: ${d.police_station}
Offences U/s: ${d.sections}

APPLICATION FOR GRANT OF ${d.bail_type.toUpperCase()} ON BEHALF OF THE APPLICANT/ACCUSED

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is a peace-loving and law-abiding citizen and has been falsely implicated in the present case.

2. That the Applicant has been in judicial custody since ${d.custody_since || '_________'} (if applicable) and is not required for any further custodial interrogation.

3. That the allegations made in the FIR are completely false, frivolous, and concocted to harass the Applicant.

4. GROUNDS FOR BAIL:
That the Applicant seeks bail on the following grounds:
${d.grounds}

5. That the Applicant undertakes to abide by all the terms and conditions imposed by this Honorable Court, join the investigation as and when required, and will not tamper with the prosecution evidence or influence witnesses.

6. That the Applicant has deep roots in society, has a permanent residence at the address mentioned above, and there is no likelihood of the Applicant absconding or fleeing from justice.
${d.surety ? `\n7. That a reliable surety is ready and willing to stand surety for the Applicant: ${d.surety}\n` : ''}

PRAYER

It is, therefore, most respectfully prayed that this Honorable Court may be pleased to release the Applicant/Accused on ${d.bail_type} in the interest of justice.


APPLICANT/ACCUSED
Through Counsel

Signature: __________________________

Place: _________________
Date: ${data.date}`;
};
