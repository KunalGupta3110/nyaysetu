window.DocTemplates = window.DocTemplates || {};

window.DocTemplates['consumer-complaint'] = function(data) {
  const d = data.fields;
  return `BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION

COMPLAINT UNDER SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019

IN THE MATTER OF:

${d.complainant}
${d.complainant_addr}
Phone/Email: ${d.complainant_phone || '_________________'}
... Complainant

VERSUS

${d.company}
${d.company_addr}
... Opposite Party

SUBJECT: COMPLAINT REGARDING DEFICIENCY IN SERVICE / DEFECT IN GOODS IN RESPECT OF ${d.product.toUpperCase()}.

MOST RESPECTFULLY SHOWETH:

1. That the Complainant is a consumer as defined under Section 2(7) of the Consumer Protection Act, 2019. The Opposite Party is engaged in the business of selling goods/providing services.

2. That on ${d.purchase_date || '_________'}, the Complainant purchased/availed ${d.product} from the Opposite Party for a total consideration of ${d.amount_paid}, paid via valid receipt/invoice.

3. That shortly after the purchase/service, the Complainant discovered the following defects and deficiencies:
${d.complaint}

4. That the Complainant made several representations to the Opposite Party to rectify the issue or refund the amount, but the Opposite Party failed to resolve the grievance, thereby committing severe deficiency in service and unfair trade practice.

5. That the cause of action arose on ${d.purchase_date || '_________'} and continues to subsist. The Honorable Commission has jurisdiction to adjudicate this complaint.

PRAYER / RELIEF SOUGHT

In view of the facts and circumstances stated above, the Complainant most respectfully prays that this Honorable Commission may be pleased to:
a) Direct the Opposite Party to ${d.relief}.
b) Award compensation for mental agony and physical harassment caused to the Complainant.
c) Award the cost of this litigation in favor of the Complainant.
d) Pass any other order which this Honorable Commission deems fit and proper in the interest of justice.


COMPLAINANT
Signature: __________________________
Name: ${d.complainant}
Date: ${data.date}`;
};
