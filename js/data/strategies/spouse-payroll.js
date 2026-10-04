/* ============================================================================
 * STRATEGY: Adding Spouse to Payroll
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'spouse-payroll',
  name: 'Adding Spouse to Payroll',
  category: 'Payroll & Family',
  applyOrder: 32,

  advisor: {
    summary:
      'Putting a working spouse on the business payroll is NOT an income-tax ' +
      'play on a joint return — the salary is deductible to the business and ' +
      'taxable as wages on the same 1040, a wash — and it affirmatively COSTS ' +
      'FICA (spouse wages are fully subject to Social Security and Medicare; ' +
      'FUTA is waived only when the employer is the other spouse\'s sole ' +
      'proprietorship, §3306(c)(5) — a corporation or partnership owes it). ' +
      'The real value is what a ' +
      'W-2 unlocks: the spouse becomes eligible to defer up to $24,500 (2026, ' +
      'Notice 2025-67) into the company 401(k), doubling the household\'s ' +
      'tax-deferred capacity, plus Social Security earnings credits. (Tax-free ' +
      'health and cafeteria-plan fringes reach the spouse only in a sole ' +
      'proprietorship — in an S corporation the spouse is treated as a ' +
      'more-than-2% shareholder by attribution.) Model it honestly: ' +
      'the benefit is the deferral and the fringe access, net of the payroll ' +
      'tax cost — never the salary itself.',
    mechanics: [
      'Income-tax mechanics on MFJ: business income falls by the salary (plus ' +
      'the employer\'s 7.65% FICA share, also deductible under §162); wages ' +
      'rise by the same salary. Pre-deferral, taxable income barely moves.',
      'FICA cost is real and two-sided: 7.65% employer + 7.65% employee on ' +
      'the full salary (spouse below the wage base). Against this, deducting ' +
      'the salary from Schedule C also shrinks the owner\'s own SE base — a ' +
      'partial offset when the owner is under the Social Security wage base.',
      'The unlock: with W-2 compensation the spouse can make elective ' +
      'deferrals under §402(g) — $24,500 in 2026, plus the $8,000 age-50 ' +
      'catch-up — capped at their actual compensation. A $30,000 salary can ' +
      'shelter $24,500 of it.',
      'Secondary benefits: the spouse accrues Social Security quarters and ' +
      'earnings history in their own right. Fringe benefits are limited: in an ' +
      'S corporation the spouse is a more-than-2% shareholder by attribution ' +
      '(§1372, §318), and a dependent care plan fails if more than 25% of its ' +
      'benefits go to owners and their spouses (§129(d)(4)).',
      'The salary must be reasonable for services actually rendered (§162) — ' +
      'a no-show salary fails the deduction and still owes the payroll tax.',
      'Traditional (pre-tax) deferrals are modeled here as an above-the-line ' +
      'reduction; Roth deferrals trade the current deduction for tax-free ' +
      'growth and may be preferable at lower marginal rates.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §162(a)', note: 'Salary and employer payroll taxes deductible only if reasonable compensation for services actually performed.' },
      { type: 'IRC', cite: 'IRC §3306(c)(5)', note: 'Wages paid by an individual to their spouse are exempt from FUTA — sole proprietorships only; a corporation or partnership employing the owner\'s spouse owes FUTA. Never exempt from FICA: Social Security and Medicare apply in full.' },
      { type: 'IRC', cite: 'IRC §402(g)', note: 'Elective deferral limit — $24,500 for 2026 per Notice 2025-67 — available only to employees with compensation, which the W-2 creates.' },
      { type: 'Admin', cite: 'Notice 2025-67', note: '2026 retirement plan COLAs: $24,500 elective deferral, $8,000 age-50 catch-up, $72,000 §415(c) annual additions.' },
      { type: 'IRC', cite: 'IRC §129(d)(4)', note: 'Dependent care assistance: no more than 25% of plan benefits may go to more-than-5% owners or their spouses and dependents — a family-only plan fails. The spouse\'s W-2 does supply the earned income the dependent care credit requires.' }
    ],
    requirements: [
      'The spouse performs genuine, documented services (bookkeeping, admin, scheduling, marketing) commensurate with the salary.',
      'Real payroll: W-4, withholding, Form 941 deposits, W-2 — not a year-end journal entry.',
      'A 401(k) or similar plan whose terms cover the spouse (check eligibility and coverage provisions).',
      'Salary set at a defensible market rate for the role and hours.'
    ],
    risks: [
      'Modeling the salary itself as savings is the classic error — on a joint return it is income-tax neutral and FICA-negative. The deferral is the benefit.',
      'Unreasonable compensation for minimal services risks deduction disallowance while the payroll taxes stick.',
      'Payroll compliance overhead (deposits, filings, state registration) has real cost — weigh against benefit at small salaries.',
      'If the spouse already has outside W-2 wages near the Social Security wage base, stacking another salary multiplies FICA cost with less marginal benefit — coordinate the §402(g) limit across all employers (it is per person, not per plan).',
      'Retirement plan nondiscrimination and coverage rules apply if there are other employees.'
    ],
    bestFit: [
      'Owners with a profitable business, a spouse doing real work, and a company retirement plan (or willingness to adopt one).',
      'Households maxing the owner\'s deferral and wanting a second $24,500 of tax-deferred room.',
      'Spouses with thin Social Security earnings histories who benefit from credited quarters.'
    ],
    implementation: [
      'Document the spouse\'s role: job description, hours, market-rate salary support.',
      'Onboard through payroll (W-4, I-9, state new-hire report); flag the FUTA exemption for spouse wages only if the business is a sole proprietorship.',
      'Confirm or adopt the retirement plan; execute the spouse\'s deferral election before the compensation is earned.',
      'Run salary evenly through the year; deposit 941 taxes on schedule.',
      'Issue the W-2; report deferrals in Box 12.',
      'Revisit annually: salary level vs. services, deferral limits (COLA updates), and whether Roth deferrals beat pre-tax at the household\'s bracket.'
    ]
  },

  client: {
    teaser: 'Doubles your household\'s access to one of the best tax shelters available',
    headline: 'Put your spouse on payroll — and double your retirement tax break',
    plainEnglish: [
      'If your spouse already helps in the business — books, scheduling, admin, marketing — putting them officially on payroll opens a door: only employees with a paycheck can contribute to the company retirement plan. With a W-2, your spouse can put up to $24,500 a year (2026) into the 401(k), on top of what you contribute for yourself.',
      'We want to be straight with you about the math: the salary by itself does not save income tax on a joint return — the business deducts it, but you report it as wages, so it cancels out. And payroll taxes apply to it. The win comes from what the paycheck unlocks: a second large retirement contribution, spouse benefits like Social Security credits, and other employee perks.',
      'For most couples who use this, sheltering an extra $24,500 a year — every year — far outweighs the payroll tax cost. We run the numbers for your situation before you commit.'
    ],
    analogy: 'Think of the salary as a ticket, not a prize. The ticket costs a little in payroll tax — but it admits your spouse to a retirement plan that shelters far more.',
    benefits: [
      'Up to $24,500 more per year (2026) into tax-deferred retirement savings',
      'Your spouse earns Social Security credits in their own name',
      'Decades of tax-deferred compounding on the extra contributions'
    ],
    steps: [
      'We define your spouse\'s role and set a fair, defensible salary',
      'We set up payroll properly — forms, withholding, W-2',
      'Your spouse signs up for the retirement plan and picks a contribution amount',
      'We check the numbers each year as limits change'
    ],
    considerations: [
      'Payroll taxes on the salary are a real cost — we only recommend this when the retirement and benefit value clearly beats it.',
      'The work must be real and the pay must match it; we document both.'
    ]
  },

  inputs: [
    { key: 'spouseSalary', label: 'Annual spouse salary', type: 'currency', default: 30000 },
    { key: 'spouse401kDeferral', label: 'Spouse 401(k) deferral', type: 'currency', default: 24500 }
  ],

  appliesTo: function (profile) {
    return true; // needs business income and a joint return; validated in apply()
  },

  /**
   * Honest MFJ modeling. The salary is income-tax neutral: deducted from the
   * business (with the employer FICA share), added back as the spouse's wages.
   * It COSTS payroll tax: both halves of FICA on the spouse's wages are charged
   * to the plan through `otherTaxes`, the same way the engine charges both
   * halves on the owner's own S-corp wages. The spouse's wages go in
   * `spouseWages`, not `wages`, so they do not use up the OWNER's Social
   * Security wage base — each person has their own.
   * The modeled benefit is the 401(k) deferral, capped at the §402(g) limit
   * and at what is left of the paycheck after the spouse's own FICA.
   * Joint returns only (on any other status the wages would land on a return
   * this tool is not modeling). Salary is capped at business profit.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var tb = TSIQ.TABLES_2026;
    var f = ((state && state.tables) || tb).fica; // wage base indexed in later years

    if (p.filingStatus !== 'mfj') {
      if (yearIndex === 0) {
        notes.push('Modeled for married-filing-jointly returns only — a spouse salary moves ' +
          'income to the spouse, which nets out only on a joint return. No benefit modeled.');
      }
      return { profile: p, notes: notes };
    }
    var fromSchC = p.scheduleCNet > 0;
    if (!fromSchC && !(p.passthroughK1 > 0)) {
      if (yearIndex === 0) {
        notes.push('No business income (Schedule C or pass-through K-1) found to pay a ' +
          'spouse salary from. No benefit modeled.');
      }
      return { profile: p, notes: notes };
    }

    var employerRate = (f.ssRate + f.medicareRate) / 2;
    var available = fromSchC ? p.scheduleCNet : p.passthroughK1;
    var requested = Math.max(0, params.spouseSalary || 0);
    // Salary plus the employer FICA share cannot exceed business profit.
    var salary = Math.min(requested, available / (1 + employerRate));
    var ssWages = Math.min(salary, f.ssWageBase);
    var employerFica = ssWages * (f.ssRate / 2) + salary * (f.medicareRate / 2);
    var employeeFica = employerFica;
    var totalCost = salary + employerFica;

    if (fromSchC) {
      p.scheduleCNet = p.scheduleCNet - totalCost;
    } else {
      p.passthroughK1 = p.passthroughK1 - totalCost;
      p.entityW2Wages = (p.entityW2Wages || 0) + salary; // counts for the §199A wage limit
    }
    p.spouseWages = (p.spouseWages || 0) + salary;
    // Payroll tax on the spouse's wages — both halves are a real cost of the plan.
    p.otherTaxes = (p.otherTaxes || 0) + employerFica + employeeFica;

    var deferral = Math.min(
      Math.max(0, params.spouse401kDeferral || 0),
      Math.max(0, salary - employeeFica),
      tb.limits.retirement.electiveDeferral401k
    );
    p.adjustments = (p.adjustments || 0) + deferral;

    if (yearIndex === 0) {
      if (salary < requested) {
        notes.push('Salary reduced to ' + TSIQ.fmt.usd(salary) + ' — salary plus the employer ' +
          'payroll tax cannot exceed the business profit of ' + TSIQ.fmt.usd(available) + '.');
      }
      notes.push('Spouse salary of ' + TSIQ.fmt.usd(salary) + ' is income-tax neutral on a ' +
        'joint return and costs ' + TSIQ.fmt.usd(employerFica + employeeFica) + ' of Social ' +
        'Security and Medicare tax (both halves, shown under "Other payroll taxes"). For a ' +
        'sole proprietor most of that is offset by lower self-employment tax; for an S ' +
        'corporation it is a net new cost.');
      notes.push('Modeled benefit: ' + TSIQ.fmt.usd(deferral) + ' 401(k) deferral (capped at ' +
        'the paycheck after payroll tax and the ' +
        TSIQ.fmt.usd(tb.limits.retirement.electiveDeferral401k) +
        ' §402(g) limit). Not modeled: the spouse\'s Social Security credits.');
      if ((params.spouse401kDeferral || 0) > deferral) {
        notes.push('Deferral entry reduced to ' + TSIQ.fmt.usd(deferral) +
          ' — it cannot exceed take-home pay or the §402(g) limit.');
      }
    }
    return { profile: p, notes: notes };
  }
});
