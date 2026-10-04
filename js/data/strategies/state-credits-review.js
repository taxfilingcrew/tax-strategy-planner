/* ============================================================================
 * STRATEGY: State Credits Review (California)
 * Advisory-only — appears in plan documents; does not change scenario math.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'state-credits-review',
  name: 'State Credits Review (California)',
  category: 'Credits & Incentives',
  applyOrder: 86,
  modeled: false,

  advisor: {
    summary:
      'A systematic annual sweep of California credits and incentives the ' +
      'client is entitled to but frequently leaves unclaimed. California has ' +
      'no general investment tax credit and no state Work Opportunity ' +
      'Credit; what it does have is (1) the elective pass-through entity tax ' +
      '(9.3% of qualified net income, credit to the owners, federal deduction ' +
      'outside the SALT cap), (2) the California research credit, (3) the ' +
      'negotiated California Competes Tax Credit, (4) hiring credits — the ' +
      'New Employment Credit for employees hired before 2026 and the ' +
      'Homeless Hiring Tax Credit through 2026, (5) the partial sales and ' +
      'use tax exemption for manufacturing and R&D equipment, and (6) ' +
      'Employment Training Panel funding. Two limits apply through 2026: ' +
      'business credits are capped at $5 million a year and NOL deductions ' +
      'are suspended for taxpayers with $1 million or more of income. ' +
      'Because rules, windows and sunsets change every year, this is an ' +
      'advisory checklist item — the PTET strategy module models the federal ' +
      'math when an election is quantified.',
    mechanics: [
      'Pass-through entity elective tax: an S corporation or partnership ' +
      'elects on a timely filed original return to pay 9.3% on each ' +
      'consenting owner\'s share of qualified net income; the owner claims ' +
      'a nonrefundable credit with a 5-year carryover. Federally the tax is ' +
      'deducted at the entity level (Notice 2020-75), outside the personal ' +
      'SALT cap. Prepayment: the greater of $1,000 or 50% of the prior-year ' +
      'elective tax by June 15. For 2026–2030 a short or missed June payment ' +
      'no longer voids the election; it reduces the owner\'s credit by 12.5% ' +
      'of the shortfall.',
      'California research credit (FTB 3523): 15% of qualified research ' +
      'expenses over a base amount (plus 24% of basic research payments for ' +
      'corporations), California research only. From 2025 the alternative ' +
      'incremental method is gone and an alternative simplified credit is ' +
      'available: 3% of QREs over half the prior three-year average, or 1.3% ' +
      'with no prior-year QREs. Nonrefundable; unused credit carries forward ' +
      'indefinitely. An S corporation uses one-third against its 1.5% tax ' +
      'and passes the full credit through to shareholders. California did ' +
      'not adopt §174 capitalization — research costs stay fully deductible ' +
      'for the state.',
      'California Competes Tax Credit: negotiated with GO-Biz for businesses ' +
      'adding jobs or investment in California; applications only in set ' +
      'windows (fiscal 2026–27: July 20–August 10, 2026; January 4–25, 2027; ' +
      'March 1–15, 2027) and BEFORE the hiring or investment. A five-year ' +
      'agreement with milestones and recapture if they are missed.',
      'Hiring credits: New Employment Credit (FTB 3554) — 35% of wages ' +
      'between 150% and 350% of minimum wage for qualifying hires in a ' +
      'designated area, for 60 months after hire; closed to employees hired ' +
      'after December 31, 2025, but credits on earlier hires continue and ' +
      'are often unclaimed. Homeless Hiring Tax Credit — $2,500 to $10,000 ' +
      'per certified employee, up to $30,000 per employer per year, for tax ' +
      'years through 2026. Both require a tentative credit reservation with ' +
      'the FTB within 30 days — of the hire date for the homeless hiring ' +
      'credit, of the EDD new-hire report for the New Employment Credit — ' +
      'miss that and the credit is gone.',
      'Sales and use tax: a partial exemption (3.9375 points off the rate) ' +
      'for manufacturing and research equipment bought by qualified ' +
      'manufacturers and R&D businesses, through June 30, 2030 — claimed by ' +
      'giving the seller an exemption certificate at purchase, or by refund ' +
      'claim afterwards. Routinely missed.',
      'Limits for 2024–2026: total business credits used in a year are ' +
      'capped at $5 million (an election can make the disallowed part ' +
      'refundable over later years), and NOL deductions are suspended for ' +
      'taxpayers with $1 million or more of income, with the carryover ' +
      'period extended. Both are scheduled to end for 2027 and can end ' +
      'earlier if the Department of Finance so determines — check each year.',
      'Also check: the other-state tax credit (Schedule S) for income taxed ' +
      'by two states; Employment Training Panel reimbursements for training ' +
      'incumbent workers; and city business-tax incentives where the client ' +
      'operates.',
      'Federal interaction: state credits received can reduce the state tax ' +
      'deduction; refundable state credits in excess of tax may be federal ' +
      'income; PTET paid reduces the federal pass-through income dollar for ' +
      'dollar — sequence the analysis with the PTET module.'
    ],
    authority: [
      { type: 'Admin', cite: 'IRS Notice 2020-75', note: 'Entity-level state taxes imposed on pass-throughs are deductible in computing non-separately-stated income — the federal foundation for every state PTET credit regime.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §19900 et seq. and §17052.10 (2021–2025); §19914 and §17052.11 (2026–2030)', note: 'California pass-through entity elective tax and the owner credit: 9.3% of qualified net income, election on a timely original return, June 15 prepayment, 5-year credit carryover; extended through 2030 with the reduced-credit rule for short prepayments from 2026.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §17052.12, §23609; FTB 3523', note: 'California research credit: 15% regular credit (24% basic research for corporations); alternative simplified credit of 3% / 1.3% from 2025 under SB 711; alternative incremental credit repealed; indefinite carryforward.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §17059.2, §23689', note: 'California Competes Tax Credit — negotiated, application windows set each fiscal year by GO-Biz, recapture for missed milestones.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §17053.73, §23626; FTB 3554', note: 'New Employment Credit — qualified full-time employees hired before January 1, 2026; credit for 60 months from hire; tentative credit reservation required.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §17053.80, §23629', note: 'Homeless Hiring Tax Credit — taxable years beginning before January 1, 2027; employee certification and FTB reservation required.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §6377.1; CDTFA Reg. 1525.4', note: 'Partial sales and use tax exemption for manufacturing and research and development equipment, through June 30, 2030.' },
      { type: 'Admin', cite: 'Cal. Rev. & Tax. Code §17039.4, §23036.4; §17276.24, §24416.24', note: '$5 million annual limit on business credits and suspension of NOL deductions (income of $1 million or more) for taxable years 2024 through 2026.' },
      { type: 'IRC', cite: 'IRC §164', note: 'SALT deduction framework; OBBBA set the personal cap at $40,400 (2026) with a high-income phase-down — the reason entity-level state tax deductions matter.' }
    ],
    requirements: [
      'A current-year inventory of every state where the client has nexus, payroll, property, or credits carrying forward — California first, then any others.',
      'PTET: owner consents, the June 15 prepayment, and the election on a timely original return — it cannot be made on an amended return.',
      'Hiring credits: an FTB reservation within 30 days of each qualifying hire; California Competes: an application in an open window before the hire or investment.',
      'Research credit: California-only QREs and gross receipts, tracked separately from the federal computation.',
      'Owner-level coordination: the other-state tax credit for income taxed elsewhere, and K-1 reporting of each owner\'s PTET credit (FTB 3804-CR).'
    ],
    risks: [
      'Sunsets and windows move annually: the New Employment Credit closed to new hires after 2025 (a bill to reinstate it, AB 2205, was pending in 2026 — check whether it passed), the Homeless Hiring Tax Credit and the credit cap run through 2026, and California Competes windows are a few weeks long. Verify each year.',
      'A PTET election can hurt owners in credit-mismatch situations (nonresident owners, a home state that gives no credit for the California tax) and gives no federal benefit to an owner already under the SALT cap who itemizes — model per owner before electing.',
      'Missed procedural deadlines (the 30-day hiring reservation, the June 15 PTET payment, pre-approval windows) are the leading cause of forfeited state credits; they are rarely recoverable.',
      'The $5 million credit cap and the NOL suspension can defer benefits a projection assumed — material only for larger clients, but check.',
      'Refundable or transferable state credits can create federal taxable income — coordinate the federal return.',
      'Incentive clawbacks: California Competes agreements carry hiring and investment milestones with recapture.'
    ],
    bestFit: [
      'S-corporation and partnership owners with meaningful California income tax who are over the SALT cap or do not itemize (PTET).',
      'Businesses with California engineering, software, product or process development payroll (research credit), or buying manufacturing or lab equipment (sales tax exemption).',
      'Employers that hired in designated areas before 2026 and never claimed the New Employment Credit, or that hire through homeless-services programs.',
      'Growing companies planning California hiring or capital investment (California Competes).'
    ],
    implementation: [
      'Each fall, review the client\'s California position against this list and check the FTB and GO-Biz pages for the current year\'s rules, windows and sunsets.',
      'PTET: run the per-owner benefit; collect consents; calendar June 15 and the original-return election; report each owner\'s credit.',
      'Screen payroll and project lists for California research credit activity; compute the regular credit and the simplified credit and take the better one.',
      'Screen prior-year hires (before 2026) for unclaimed New Employment Credit and its 60-month tail; set up the 30-day reservation step for any homeless-hiring-credit hires.',
      'Screen fixed-asset additions for the manufacturing and R&D sales tax exemption; file refund claims for tax overpaid in open periods.',
      'If the client is planning to add jobs or invest, calendar the next California Competes window and apply before committing.',
      'Quantify any PTET election in the PTET strategy module so the federal benefit shows in the scenario math.',
      'Document carryforwards (research credit, PTET credit, hiring credits) in the permanent file so they survive preparer transitions.'
    ]
  },

  client: {
    teaser: 'Money California may already owe you — most businesses never collect it',
    headline: 'Stop leaving state tax money on the table',
    plainEnglish: [
      'Most business owners focus on federal taxes and treat the state return as an afterthought. But California has real money available — credits for research and development work, for hiring in certain areas and from certain programs, a sales tax break on manufacturing and lab equipment, and negotiated credits for companies that are growing here — and much of it goes unclaimed simply because nobody looked.',
      'There is also a powerful election available to many business owners: having your company pay your California income tax for you. Done correctly, you get credit for the payment on your state return, and the business gets a federal deduction that you could not have taken personally because of federal limits on state tax deductions.',
      'This strategy is a yearly sweep: we check what you qualify for, catch the credits, and make the elections on time. Several of these require paperwork within 30 days of a hire, or before you invest — which is exactly why the review happens during the year, not at tax time.'
    ],
    analogy: 'It\'s like checking every coat pocket at the start of winter — the money was always yours; someone just has to go look for it.',
    benefits: [
      'Captures California credits that go unclaimed by default',
      'The company-pays-your-state-tax election can create a federal deduction you\'d otherwise lose',
      'Catches deadline-driven opportunities before they expire',
      'Unused credits are tracked so they carry into future years'
    ],
    steps: [
      'We review your hiring, equipment purchases, and development work against California\'s credit list',
      'We check whether the company-pays election helps each owner, and by how much',
      'We make the elections and file the applications on time',
      'We track any unused credits so they carry into future years'
    ],
    considerations: [
      'State rules change nearly every year — some credits have closed to new hires and others end after 2026 — so the review has to be redone annually.',
      'A few of these elections can backfire in specific situations (for example, owners living in a different state), so we run your numbers before electing anything.',
      'Several credits are lost for good if a form is not filed within 30 days of a hire or before an investment is made.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. Quantify a PTET election with the PTET strategy module.']
      : [] };
  }
});
