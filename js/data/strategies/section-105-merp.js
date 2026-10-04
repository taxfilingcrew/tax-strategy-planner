/* ============================================================================
 * STRATEGY: Section 105 Medical Reimbursement Plan (Spouse Employee)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-105-merp',
  name: 'Section 105 Medical Reimbursement Plan (Spouse Employee)',
  category: 'Health & Fringe',
  applyOrder: 75,

  advisor: {
    summary:
      'The classic sole-proprietor play: the Schedule C owner hires their ' +
      'spouse as a bona fide employee and adopts a written §105 medical ' +
      'reimbursement plan covering employees and their FAMILIES. The ' +
      'employee-spouse\'s family coverage sweeps in the owner (as the ' +
      'employee\'s spouse) and the children — so the household\'s medical ' +
      'costs (premiums, deductibles, dental, vision, out-of-pockets) become ' +
      '§162 business deductions on Schedule C, saving both income tax AND ' +
      'SE tax. That SE-tax layer is what elevates this over the §162(l) ' +
      'self-employed health insurance deduction, which saves income tax only. ' +
      'Rev. Rul. 71-588 blesses the structure; the audit battleground is ' +
      'whether the spouse\'s employment is bona fide. A one-employee plan is ' +
      'exempt from the ACA market reforms (§9831(a)(2)), keeping compliance ' +
      'simple as long as the spouse is the only participant.',
    mechanics: [
      'Spouse performs real services (bookkeeping, scheduling, administration) ' +
      'for the Schedule C business as a W-2 employee; the written §105 plan ' +
      'provides medical expense reimbursement for employees, their spouses, ' +
      'and dependents.',
      'Reimbursements of §213(d) expenses are excluded from the spouse\'s ' +
      'income under §105(b) and are not FICA wages; the business deducts them ' +
      'as employee benefits on Schedule C — reducing net SE earnings.',
      'Because the plan covers the employee\'s FAMILY, the owner\'s own medical ' +
      'costs ride through as the spouse of the employee — this is the ' +
      'Rev. Rul. 71-588 architecture.',
      'Stacks against §162(l): the SE health insurance deduction is ' +
      'above-the-line only (no SE tax savings) and covers premiums only; the ' +
      '§105 plan converts premiums AND out-of-pockets into Schedule C ' +
      'deductions with SE tax savings. Do not double-count premiums under both.',
      'With only the spouse participating, the plan has fewer than two ' +
      'current-employee participants and is exempt from the ACA market ' +
      'reforms under §9831(a)(2) — no integration issue.',
      'Spouse wages must be reasonable for the services; total compensation ' +
      '(wages + benefits) must be defensible against hours and duties.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §105(b)', note: 'Exclusion for employer reimbursements of medical expenses of the employee, spouse, and dependents — the family sweep that carries the owner.' },
      { type: 'IRC', cite: 'IRC §106(a)', note: 'Exclusion for employer-provided accident/health coverage.' },
      { type: 'Reg', cite: 'Reg. §1.105-5; Reg. §1.105-11(b)(1)(i)', note: '§1.105-5 defines an accident or health plan (it may be uninsured, and that section does not itself require a writing). The separate-written-plan requirement for a self-insured medical reimbursement plan is in §1.105-11(b)(1)(i). Adopt the plan in writing before any expense is reimbursed.' },
      { type: 'Admin', cite: 'Rev. Rul. 71-588', note: 'The controlling ruling: sole proprietor\'s spouse-employee covered by the business medical plan; reimbursements (including for the owner as family member) excludable and deductible.' },
      { type: 'IRC', cite: 'IRC §162(a)', note: 'Business deduction for the reimbursements as compensation/employee-benefit expense.' },
      { type: 'IRC', cite: 'IRC §9831(a)(2)', note: 'Plans with fewer than two current-employee participants are exempt from the ACA group-market reforms.' },
      { type: 'IRC', cite: 'IRC §105(h)', note: 'Self-insured plan nondiscrimination — becomes live if the business has other employees who are excluded.' }
    ],
    requirements: [
      'A Schedule C business (or farm) — the structure fails for S-corps as to >2% shareholders\' families (§1372 attribution).',
      'Bona fide employment: real services, contemporaneous time records, reasonable W-2 wages actually paid (payroll filings: 941/940/W-2).',
      'A written §105 plan document adopted BEFORE expenses are reimbursed, covering employees and family.',
      'Actual reimbursement mechanics: spouse submits receipts; business pays from the business account; records retained.',
      'If other employees exist, the plan must cover them per its eligibility terms — §105(h) discrimination testing applies.'
    ],
    risks: [
      'Bona fide employment is THE exam issue: no time records, no real duties, or wages never actually paid have sunk these plans in Tax Court repeatedly. Paper the employment like you would for a stranger.',
      'Adopting the plan document after the fact — reimbursements before adoption are not made under a plan and are taxable.',
      'Other employees: excluding them invites §105(h) discrimination taxation and morale/legal issues; covering them changes the economics.',
      'Owner cannot be the employee: reimbursing the owner directly (not as the employee-spouse\'s family member) fails — the sole proprietor is not their own employee.',
      'Overlap error: deducting the same premiums under both §162(l) and the §105 plan.'
    ],
    bestFit: [
      'Married sole proprietors with no (or few) other employees and meaningful family medical costs — high-deductible years, orthodontics, therapy, fertility, etc.',
      'A spouse who genuinely works in the business (or credibly can).',
      'High-SE-income households where the 15.3%/2.9% SE layer makes the incremental savings material.'
    ],
    implementation: [
      'Document the spouse\'s role: written job description, hours log, reasonable wage; run real payroll (Forms 941, 940, W-2).',
      'Adopt the written §105 plan (effective date BEFORE any reimbursements) covering employees and their families; set an annual reimbursement cap.',
      'Have the spouse submit receipts/EOBs; reimburse by check or transfer from the business account; keep a reimbursement log.',
      'Deduct reimbursements on Schedule C (employee benefit programs); do not also claim the same premiums under §162(l).',
      'If the business has other employees, run §105(h) eligibility analysis before adopting.',
      'Review annually: wages still reasonable, plan cap still appropriate, participant count still under the market-reform exemption.'
    ]
  },

  client: {
    teaser: 'Turns your family\'s medical bills into business deductions — including the payroll-tax layer most deductions miss',
    headline: 'Make your family\'s medical costs a business expense',
    plainEnglish: [
      'If you run your own unincorporated business and your spouse works in it — handling the books, scheduling, paperwork — the tax law offers something powerful: the business can adopt a formal medical plan for its employees and their families. Your spouse is the employee. Their family is you and your kids.',
      'That means the medical bills your family already pays — insurance premiums, deductibles, dental, vision, glasses, copays — can be reimbursed by the business and deducted as a business expense. And because this deduction comes off your business profit, it saves not just income tax but self-employment tax too, which most health-cost deductions cannot do.',
      'The catch is that this must be real: your spouse genuinely working, real paychecks, a written plan set up before the reimbursements start, and receipts for everything. Done properly, it has been approved by the IRS for over fifty years. Done sloppily, it is one of the first things an auditor picks apart — so we do the paperwork right.'
    ],
    analogy: 'Normally, medical bills are paid with money the tax collector has already taken a bite of. This plan lets the business pay them first — before that bite happens, and before the self-employment tax bite too.',
    benefits: [
      'Family medical costs become business deductions',
      'Saves self-employment tax on top of income tax — a layer most strategies miss',
      'Covers what insurance does not: deductibles, dental, vision, out-of-pockets',
      'IRS-recognized structure with decades of history'
    ],
    steps: [
      'We confirm your spouse\'s role in the business and set up proper payroll',
      'We put the written medical plan in place before any money moves',
      'Your spouse submits the family\'s medical receipts; the business reimburses them',
      'We take the deduction and keep the records audit-ready'
    ],
    considerations: [
      'Your spouse\'s job must be genuine — real work, real hours, real paychecks. This is the single thing auditors test, so we document it thoroughly.',
      'If the business has other employees, the plan generally has to include them, which changes the math — we check that first.',
      'This structure fits unincorporated businesses; if yours is an S-corporation, we use different strategies instead.'
    ]
  },

  inputs: [
    { key: 'annualMedicalReimbursed', label: 'Annual family medical costs reimbursed', type: 'currency', default: 15000 },
    { key: 'alreadyDeducted', label: 'Of that, premiums the return already deducts above the line', type: 'currency', default: 0 },
    { key: 'spouseCashWage', label: 'New cash wages paid to the spouse (if any)', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // needs Schedule C income and a spouse; validated with a note in apply()
  },

  /**
   * Deducts reimbursed family medical costs against scheduleCNet — income tax
   * and SE tax savings. Requires Schedule C income and a married filer (the
   * plan covers the spouse as the employee). Premiums the return already
   * deducts as self-employed health insurance are MOVED, not added: that
   * above-the-line deduction is removed, so only the SE tax saving remains on
   * that part. New cash wages to the spouse: deducted on Schedule C, taxed on
   * the joint return, and both halves of FICA are charged (same treatment as
   * the Spouse on Payroll strategy — leave at 0 if that strategy is used).
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    var tb = (state && state.tables) || TSIQ.TABLES_2026;
    if (!(p.scheduleCNet > 0)) {
      if (first) notes.push('Requires a Schedule C (sole proprietorship) with net profit — the spouse-employee §105 plan does not work for S-corp >2% shareholders. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    if (p.filingStatus !== 'mfj' && p.filingStatus !== 'mfs') {
      if (first) notes.push('Requires a spouse: the plan covers the owner only as the family member of a spouse who is a real employee of the business. This client is not filing as married. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    var health = TSIQ.health.year(state);
    var amt = Math.min(Math.max(0, params.annualMedicalReimbursed || 0), p.scheduleCNet);
    var moved = Math.min(Math.max(0, params.alreadyDeducted || 0), amt);
    var wage = Math.max(0, params.spouseCashWage || 0);
    if (state && state.applied && state.applied['spouse-payroll']) wage = 0;

    p.scheduleCNet = p.scheduleCNet - amt;
    if (moved > 0) p.adjustments = (p.adjustments || 0) - moved; // deduction moves from Schedule 1 to Schedule C
    health.covered += amt;

    var fica = 0;
    if (wage > 0) {
      var f = tb.fica;
      var half = (Math.min(wage, f.ssWageBase) * f.ssRate + wage * f.medicareRate) / 2;
      fica = half * 2;
      p.scheduleCNet = p.scheduleCNet - wage - half;      // wage + employer FICA deducted
      p.spouseWages = (p.spouseWages || 0) + wage;         // taxed on the joint return
      p.otherTaxes = (p.otherTaxes || 0) + fica;           // both halves of FICA are a real cost
    }
    if (first) {
      notes.push(TSIQ.fmt.usd(amt) + ' family medical costs reimbursed under the §105 plan and deducted on Schedule C — saves income tax AND SE tax.');
      if (moved > 0) {
        notes.push(TSIQ.fmt.usd(moved) + ' of that is premiums the return already deducts above the line. Moving them to Schedule C saves SE tax only — no new income tax saving on that part.');
      } else {
        notes.push('If the return already deducts the health premiums as self-employed health insurance, enter that amount in "premiums the return already deducts" — otherwise the income tax saving on them is counted twice.');
      }
      if (wage > 0) {
        notes.push(TSIQ.fmt.usd(wage) + ' of new cash wages to the spouse costs ' + TSIQ.fmt.usd(fica) + ' in Social Security and Medicare tax (both halves), included above.');
      }
      notes.push('Requires bona fide spouse employment (payroll, time records) and a written plan adopted before reimbursements.');
    }
    return { profile: p, notes: notes };
  }
});
