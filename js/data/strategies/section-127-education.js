/* ============================================================================
 * STRATEGY: Section 127 Educational Assistance
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'section-127-education',
  name: 'Section 127 Educational Assistance',
  category: 'Health & Fringe',
  applyOrder: 78,

  advisor: {
    summary:
      'A written §127 educational assistance program lets an employer pay up ' +
      'to $5,250 per employee per year for tuition, fees, books, and supplies ' +
      '— excluded from the employee\'s income and FICA wages, deductible to ' +
      'the business. The education need not be job-related (contrast §132(d) ' +
      'working-condition fringe). Since 2020 the exclusion also covers ' +
      'payments of principal and interest on the employee\'s qualified ' +
      'education LOANS — OBBBA made that permanent and indexes the $5,250 ' +
      'after 2026. The honest limitation for owner clients: §127(b)(3) caps ' +
      'benefits to the >5%-owner class — including their spouses AND ' +
      'dependents — at 5% of total benefits paid, so owners generally cannot ' +
      'run their own (or their dependent children\'s) education through the ' +
      'plan. The clean owner-family play is an adult child on payroll who is ' +
      'NOT a dependent and owns no stock: they are outside the restricted ' +
      'class, and their tuition or student-loan payments qualify. For a ' +
      'corporation the child must also be 21 or older: §127(c)(4) borrows the ' +
      '§1563(e) attribution rules, under which a child under 21 is treated as ' +
      'owning the parent\'s stock. California did not extend its exclusion for ' +
      'employer student-loan payments past 2025 — from 2026 those payments ' +
      'are California wages to the employee.',
    mechanics: [
      'Written plan; exclusive benefit of employees; no more than 5% of ' +
      'benefits to >5% shareholders/owners or their spouses or dependents; ' +
      'no choice between benefits and other taxable compensation; reasonable ' +
      'notice to eligible employees (§127(b)).',
      'Covers tuition, fees, books, supplies, and equipment for education at ' +
      'any level — undergraduate, graduate, courses unrelated to the job. ' +
      'Excludes meals/lodging/transportation, tools the employee keeps, and ' +
      'most sports/hobby courses.',
      'Student loan payments (principal AND interest) on the employee\'s ' +
      'qualified education loans count toward the same $5,250 — made ' +
      'permanent by OBBBA; the cap is inflation-indexed after 2026.',
      'Excluded amounts escape income tax and FICA (both halves) — for the ' +
      'business, roughly a 7.65% employer-payroll-tax saving versus paying ' +
      'the same amount as wages.',
      'Who benefits in an owner-family plan: rank-and-file employees, and ' +
      'owner\'s adult children on payroll ONLY IF the child is not a ' +
      'dependent and holds no ownership (the §127(b)(3) restricted class is ' +
      'owners plus their spouses and dependents; in a corporation a child ' +
      'under 21 is also treated as an owner by attribution). A dependent child on ' +
      'payroll is inside the restricted class — do not promise this for ' +
      'college-age dependents.',
      'Employer deducts the payments as ordinary compensation-type expense; ' +
      'amounts within §127 do not appear in W-2 Boxes 1/3/5.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §127', note: 'The exclusion: $5,250/employee/year; written-plan and notice requirements; benefits, not job-related-ness, define eligibility.' },
      { type: 'IRC', cite: 'IRC §127(b)(3)', note: 'The owner limitation: no more than 5% of benefits paid may go to >5% shareholders/owners, their spouses, or dependents.' },
      { type: 'IRC', cite: 'IRC §127(c)(1)(B)', note: 'Student loan payments (principal and interest) as educational assistance — made permanent by OBBBA (P.L. 119-21), with the $5,250 indexed after 2026.' },
      { type: 'IRC', cite: 'IRC §3121(a)(18)', note: 'FICA wage exclusion for §127 amounts — the payroll-tax layer of the benefit.' },
      { type: 'IRC', cite: 'IRC §132(d); §162', note: 'Fallback for job-related education beyond $5,250: working-condition fringe with no dollar cap, but a strict job-relatedness standard.' },
      { type: 'IRC', cite: 'IRC §221(e)(1)', note: 'No student loan interest deduction for interest paid by the employer under §127 — no double benefit.' }
    ],
    requirements: [
      'A separate written plan document adopted before benefits are paid, with reasonable notification to eligible employees.',
      'Benefits limited to $5,250 per employee per year (2026; indexed thereafter); excess is taxable wages.',
      'The 5% concentration test: benefits to >5% owners, their spouses, and dependents must not exceed 5% of total benefits paid for the year.',
      'No cash-or-benefit choice — the program cannot be offered as an alternative to taxable compensation.',
      'For owner-family use: the employed child must be a bona fide employee, a non-dependent, hold no equity, and — in a corporation — be 21 or older (§1563(e)(6)(A) attribution treats a younger child as owning the parent\'s stock).'
    ],
    risks: [
      'The owner-concentration test is fractional: if the ONLY user of the plan is an owner-class person, 100% of benefits went to the restricted class and the exclusion fails for them. Solo owners cannot self-fund an MBA this way.',
      'Dependent children are inside the restricted class — a plan pitched as "pay your college kid\'s tuition tax-free" fails if the child is still a dependent.',
      'Bona fide employment of the child is the exam companion issue: real duties, reasonable wages, payroll filings.',
      'Payments above $5,250 are W-2 wages unless independently excludable as §132(d) job-related education.',
      'Employer-paid loan interest under §127 kills the employee\'s §221 interest deduction for the same dollars — small, but do not double-count.',
      'California: student-loan payments under the plan are taxable California wages from 2026 (the state exclusion covered payments through 2025 only); tuition assistance remains excluded.'
    ],
    bestFit: [
      'Businesses with non-owner employees pursuing degrees or carrying student loans — a high-perceived-value benefit at modest cost.',
      'Owner clients with adult, non-dependent children legitimately working in the business who have tuition or student loans.',
      'Employers competing for younger staff where a student-loan-payment benefit is a differentiator.'
    ],
    implementation: [
      'Adopt the written §127 plan (define eligible class, annual cap, covered benefits including loan payments); notify employees.',
      'For owner-family use: confirm the child is a non-dependent, equity-free, bona fide employee with reasonable wages and payroll records.',
      'Collect substantiation (tuition bills, registrar records, loan statements) before each payment.',
      'Track per-employee benefits against the $5,250 cap; run the 5% owner-concentration test at year-end.',
      'Deduct payments on the business return; keep §127 amounts out of W-2 wage boxes.',
      'After 2026, update the plan cap for indexing.'
    ]
  },

  client: {
    teaser: 'Turn education bills into a business deduction — without the recipient paying a dime of tax',
    headline: 'Let the business pay for education, tax-free',
    plainEnglish: [
      'The tax law lets a business set up a formal education benefit: up to $5,250 per employee, per year, for tuition, books, fees — and now student loan payments too. The business deducts it, and the employee pays no tax on it. It even skips payroll taxes, which a normal raise would not.',
      'Here is the honest part: the rules are deliberately written so owners cannot funnel this benefit to themselves, their spouses, or the children they claim on their tax return. So if you were hoping to run your own dependent college student\'s tuition through the business — this is not the tool for that.',
      'Where it shines: employees you already want to help with school or student debt, and adult children who genuinely work in your business and are no longer your dependents. For them, tuition or student loan payments become a clean business deduction and tax-free money to them — a real family win when the facts fit.'
    ],
    analogy: 'A $5,250 raise gets taxed before it can touch a tuition bill. This benefit sends the same dollars straight to the school — no tax toll on the way.',
    benefits: [
      'Up to $5,250 per employee, per year — deductible to the business, tax-free to them',
      'Now covers student loan payments, not just tuition — permanently',
      'Skips payroll taxes on both sides, unlike a raise',
      'A standout perk for hiring and keeping good people'
    ],
    steps: [
      'We check who in your situation can actually benefit — honestly, before promising numbers',
      'We put the required written plan in place',
      'The business pays the school or loan servicer and keeps the records',
      'We handle the deduction and the payroll treatment at year-end'
    ],
    considerations: [
      'The rules block owners, spouses, and dependent children from taking this benefit themselves in almost every case — we will tell you plainly if that is you.',
      'An adult child using this must be a real employee doing real work, no longer claimed as your dependent — and at least 21 if your business is a corporation.',
      'The benefit caps at $5,250 per person per year; amounts above that are taxable wages.'
    ]
  },

  inputs: [
    { key: 'annualAssistance', label: 'Total §127 assistance paid for the year', type: 'currency', default: 5250 },
    { key: 'recipients', label: 'Number of employees receiving it', type: 'number', default: 1 },
    TSIQ.staffBenefit.modeInput
  ],

  appliesTo: function (profile) {
    return true; // needs a business with non-owner staff; validated with a note in apply()
  },

  /**
   * A benefit for employees outside the owner class. Needs W-2 payroll other
   * than the owner's. Capped at $5,250 per recipient. See TSIQ.staffBenefit
   * for the two comparison modes. The recipient-side exclusion is not modeled
   * (the engine does not compute the employees' returns).
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    var fr = TSIQ.TABLES_2026.limits.fringe;
    var recipients = Math.max(1, Math.round(params.recipients || 1));
    var cap = fr.educationAssistance * recipients;
    var amt = Math.min(params.annualAssistance || 0, cap);
    if ((params.annualAssistance || 0) > cap && first) {
      notes.push('Capped at ' + TSIQ.fmt.usd(cap) + ' — the §127 limit of ' + TSIQ.fmt.usd(fr.educationAssistance) +
        ' per employee (2026) for ' + recipients + ' recipient' + (recipients > 1 ? 's' : '') + '. Anything above is taxable wages.');
    }
    var hasBusiness = p.scheduleCNet > 0 || p.passthroughK1 > 0 || p.ownerWages > 0;
    var staffPayroll = TSIQ.staffBenefit.payroll(p);
    if (!hasBusiness || !(staffPayroll > 0)) {
      if (first) {
        notes.push(hasBusiness
          ? 'No benefit modeled: Section 1 shows no W-2 payroll for anyone other than the owner. ' +
            'Owners, their spouses and their dependents cannot receive more than 5% of the plan\'s benefits. Enter the staff payroll in "W-2 wages paid by the business" if the business has employees.'
          : 'A §127 plan needs an operating business with employees — no business income found. No benefit modeled.');
      }
      return { profile: p, notes: notes };
    }
    
    var mode = params.replaces === 'new' ? 'new' : 'wages';
    var out = TSIQ.staffBenefit.apply(p, amt, mode, state);
    if (first) {
      notes.push(mode === 'new'
        ? TSIQ.fmt.usd(amt) + ' of §127 educational assistance modeled as a NEW benefit: deducted from business income and ' +
          'shown under "Cost of running the plan". The result is the owner\'s net cost after tax — this is ' +
          'a benefit for staff, not a tax saving for the owner.'
        : TSIQ.fmt.usd(amt) + ' of §127 educational assistance modeled in place of the same amount of taxable pay. The ' +
          'business deducts it either way; the owner\'s saving is the ' + TSIQ.fmt.usd(out.ficaSaved) +
          ' of employer payroll tax no longer due (shown as a negative "Other payroll taxes" line). ' +
          'The employees also stop paying income and payroll tax on it — that part is their saving, ' +
          'not the owner\'s.');
      notes.push('§127(b)(3): no more than 5% of benefits may go to more-than-5% owners, their spouses or dependents. ' +
        'An owner\'s child qualifies only if the child is a real employee, is not a dependent, and — for a ' +
        'corporation — is 21 or older (a younger child is treated as owning the parent\'s stock).');
      if (p.caRules) {
        notes.push('California: the state exclusion for employer payments of student LOANS ended for payments ' +
          'after 2025. From 2026 those payments are California wages to the employee; tuition assistance ' +
          'is still excluded.');
      }
    }
    return { profile: p, notes: notes };
  }
});
