/* ============================================================================
 * STRATEGY: Solo 401(k)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'solo-401k',
  name: 'Solo 401(k)',
  category: 'Retirement',
  applyOrder: 61,

  advisor: {
    summary:
      'A one-participant 401(k) for an owner (and spouse) with no common-law ' +
      'employees. The owner contributes in two capacities: elective deferrals up ' +
      'to $24,500 (2026, §402(g); +$8,000 catch-up at 50+, $11,250 at 60–63 under ' +
      'SECURE 2.0), plus an employer contribution of up to 25% of W-2 compensation ' +
      '(S corp) or ~20% of net self-employment earnings (Schedule C). Combined ' +
      'annual additions are capped at $72,000 under §415(c) — catch-up rides on ' +
      'top. For self-employed owners the deduction is above-the-line and also ' +
      'reduces §199A QBI; for S corp owners the deferral reduces Box 1 wages and ' +
      'the employer piece is an entity deduction. Beats a SEP at the same income ' +
      'because the deferral layer does not depend on the 25%/20% math.',
    mechanics: [
      'Employee deferral: $24,500 (2026), dollar-for-dollar against compensation ' +
      '— available even at modest income, unlike the SEP\'s percentage-only formula.',
      'Catch-up: $8,000 at age 50+; $11,250 in the years the owner is 60–63 ' +
      '(SECURE 2.0 enhanced catch-up). From 2026, an owner-employee whose prior-year ' +
      'FICA wages from the business exceeded $150,000 must make catch-up as Roth — ' +
      'no deduction (§414(v)(7), SECURE 2.0 §603). A sole proprietor has no FICA ' +
      'wages and is not affected.',
      'Employer profit-sharing: 25% of W-2 wages for an S corp owner-employee; for ' +
      'a sole proprietor, 20% of earned income (net profit less half of SE tax) — ' +
      'the 25% limit applied to earnings net of the contribution itself.',
      'Total annual additions (deferral + employer, excluding catch-up) are capped at ' +
      'the LESSER of $72,000 or 100% of compensation under §415(c); compensation ' +
      'counted up to $360,000 (§401(a)(17)). A K-1 share of S corp profit is not ' +
      'compensation — only W-2 wages count.',
      'Deferrals do NOT reduce FICA/SE tax — the income tax deduction is the whole ' +
      'benefit; do not promise payroll tax savings.',
      'Once plan assets exceed $250,000, Form 5500-EZ is required annually — a ' +
      'commonly missed filing with steep late penalties (delinquent filers use the ' +
      'IRS penalty relief program).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §401(k); §402(g)', note: 'Cash-or-deferred arrangement; elective deferral limit — $24,500 for 2026.' },
      { type: 'IRC', cite: 'IRC §414(v)', note: 'Catch-up contributions: $8,000 at 50+, $11,250 at ages 60–63 (SECURE 2.0 enhancement) for 2026.' },
      { type: 'IRC', cite: 'IRC §415(c)', note: 'Annual additions limit — $72,000 for 2026; catch-up contributions are excluded from the limit.' },
      { type: 'IRC', cite: 'IRC §404(a)(8); §401(a)(17)', note: 'Deduction rules for self-employed individuals; $360,000 compensation cap (2026).' },
      { type: 'Admin', cite: 'Notice 2025-67', note: '2026 cost-of-living adjustments for qualified plan limits.' },
      { type: 'Admin', cite: 'SECURE 2.0 Act §317 (P.L. 117-328)', note: 'First-year sole proprietors may make retroactive elective deferrals up to the filing deadline (without extensions) for the plan\'s first year.' },
      { type: 'Admin', cite: 'SECURE 2.0 Act §603 (P.L. 117-328)', note: 'Catch-up contributions must be Roth if prior-year FICA wages exceeded the indexed threshold ($150,000 for 2026).' },
      { type: 'Admin', cite: 'Form 5500-EZ', note: 'Required annually once one-participant plan assets exceed $250,000.' }
    ],
    requirements: [
      'Self-employment income or owner W-2 wages from the client\'s own entity — no benefit without compensation to defer against.',
      'No common-law employees other than a spouse (a single 1,000-hour employee, or 500+ hours in consecutive years under SECURE 2.0 long-term part-time rules, blows up the "solo" design).',
      'Plan adopted by the employer\'s tax filing deadline (SECURE Act retroactive adoption); deferral elections generally in place by 12/31 except the §317 first-year sole-proprietor exception.',
      'W-2 owners: the deferral must actually run through payroll in the calendar year.'
    ],
    risks: [
      'Hiring an eligible employee converts the plan into a full 401(k) with nondiscrimination testing and coverage obligations — monitor headcount and part-time hours annually.',
      'Missed Form 5500-EZ once assets pass $250,000 — penalties accrue per day.',
      'S corp owners often set wages too low to support the desired employer contribution (25% of a $50,000 salary is only $12,500) — coordinate with reasonable-compensation planning.',
      'Deferrals save income tax only, not SE/FICA tax — overstating the benefit is a credibility risk.',
      'Contributions in excess of §415(c)/§402(g) limits require corrective distributions with earnings.'
    ],
    bestFit: [
      'Owner-only businesses (or owner + spouse) with consistent profit above ~$50,000.',
      'S corp owners who want to maximize deductions on top of an already-optimized salary.',
      'Clients who may later want Roth or mega-backdoor features — solo plans can be documented to allow them.'
    ],
    implementation: [
      'Confirm no common-law employees (including long-term part-time eligibility under SECURE 2.0).',
      'Adopt a plan document through a brokerage or TPA prototype by the filing deadline; elect Roth and after-tax features if wanted later.',
      'Set the deferral election in writing; for S corp owners, code the deferral through payroll before 12/31.',
      'Compute the employer contribution with the 25%/20% worksheet (Pub. 560); fund by the return due date including extensions.',
      'Deduct: self-employed owner on Schedule 1 (also reducing QBI); S corp employer contribution on the 1120-S.',
      'Calendar the Form 5500-EZ threshold check each year.'
    ]
  },

  client: {
    teaser: 'Turns business profit into personal wealth — with a deduction most owners only half-use',
    headline: 'Your own 401(k) — with you on both sides of the match',
    plainEnglish: [
      'Employees of big companies get a 401(k) with a company match. When you own the business, you can have something better: a retirement plan where you are both the employee AND the company. You contribute once as the worker, and your business contributes again on top as the employer.',
      'For 2026 the two layers together can reach $72,000 a year — more if you are 50 or older. Every dollar you put in is deducted from your taxable income now, and the money grows for your retirement instead of going to the IRS.',
      'Unlike other small-business retirement plans, the first layer does not depend on a percentage of your income, so even in a moderate-profit year you can shelter a meaningful amount.'
    ],
    analogy: 'It\'s like getting the big-company 401(k) match — except you own the company doing the matching, so the "match" is really you paying your future self instead of the IRS.',
    benefits: [
      'Deduct up to $72,000 per year (2026) — more if you are 50 or older',
      'Two contribution layers: one as employee, one as employer',
      'You choose the amount each year — contribute a lot in good years, less in lean ones',
      'Money grows tax-deferred until retirement'
    ],
    steps: [
      'We confirm your business qualifies and pick the right plan provider',
      'We calculate your exact maximum for the year — both layers',
      'You fund the account; we handle the deduction on the returns',
      'Each year we re-run the numbers so you never over- or under-contribute'
    ],
    considerations: [
      'This works only while the business has no employees other than you (and your spouse) — if you plan to hire, we design around that first.',
      'The money is for retirement: pulling it out early generally means tax plus a penalty.'
    ]
  },

  inputs: [
    { key: 'employeeDeferral', label: 'Employee deferral (include any catch-up)', type: 'currency', default: 24500 },
    { key: 'employerContribution', label: 'Employer contribution', type: 'currency', default: 20000 },
    { key: 'age50Plus', label: 'Catch-up eligibility (owner age at year-end)', type: 'select', default: 'no',
      options: [{ value: 'no', label: 'Under 50 — none' },
        { value: 'yes', label: '50–59 or 64+ ($8,000)' },
        { value: '60to63', label: '60–63 ($11,250)' }] }
  ],

  // Needs pay to defer against (Schedule C profit or owner wages) and no staff.
  suggest: function (p) {
    var staff = Math.max(0, (p.entityW2Wages || 0) - (p.ownerWages || 0));
    if (staff > 0) return null;
    var sc = p.scheduleCNet || 0, w2 = p.ownerWages || 0;
    if (sc >= 60000) {
      return { reason: TSIQ.fmt.usd(sc) + ' of self-employment profit and no staff payroll — confirm no plan already exists.' };
    }
    if (w2 > 0 && w2 + (p.passthroughK1 || 0) >= 60000) {
      return { reason: TSIQ.fmt.usd(w2) + ' of owner wages and no staff payroll supports owner retirement deductions — confirm no plan already exists.' };
    }
    return null;
  },

  appliesTo: function (profile) {
    return true; // needs scheduleCNet or ownerWages; validated with a note in apply()
  },

  /**
   * Self-employed owner: deferral + employer contribution are above-the-line
   * deductions that also reduce QBI. Compensation is earned income (net profit
   * less half of SE tax); employer money is limited to 20% of it and the total
   * to 100% of it.
   * S corp owner: the deferral reduces Box 1 wages (adjustments; FICA
   * unchanged); the employer contribution (25% of wages) is an entity
   * deduction against passthroughK1. A K-1 share of profit is not compensation.
   * §415(c): deferral + employer ≤ lesser of $72,000 or 100% of pay; catch-up
   * rides on top. Catch-up is not deductible (Roth only) for a W-2 owner whose
   * wages from the business exceed $150,000.
   * Limits are shared with the other retirement strategies through TSIQ.plan.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    var o = TSIQ.plan.owner(p, state), ret = TSIQ.plan.year(state), lim = o.lim;

    if (!o.route) {
      if (first) {
        notes.push('Requires self-employment profit (Schedule C) or W-2 wages from the client\'s ' +
          'own corporation. A K-1 share of profit is not compensation for plan purposes. ' +
          'No benefit modeled.');
      }
      return { profile: p, notes: notes };
    }
    if (ret.simple) {
      if (first) {
        notes.push('Not modeled: a SIMPLE IRA is in this scenario, and a business with a SIMPLE ' +
          'cannot have any other plan in the same year (§408(p)(2)(D)).');
      }
      return { profile: p, notes: notes };
    }

    var is60to63 = params.age50Plus === '60to63';
    var is50 = params.age50Plus === 'yes' || is60to63;
    var catchUpLimit = is60to63 ? lim.catchUp60to63 : (is50 ? lim.catchUp50 : 0);
    var isSE = o.route === 'se';

    // ---- Employee deferral: §402(g) + catch-up, limited to pay actually available.
    var want = params.employeeDeferral || 0;
    var regularRoom = Math.max(0, lim.electiveDeferral401k - (ret.deferral - ret.catchUp));
    var regular = Math.min(want, regularRoom);
    var catchUp = Math.min(Math.max(0, want - regular), Math.max(0, catchUpLimit - ret.catchUp));
    if (want > regular + catchUp && first) {
      notes.push('Employee deferral capped at ' + TSIQ.fmt.usd(regular + catchUp) + ' (§402(g)' +
        (is60to63 ? ' plus the ages 60–63 catch-up' : (is50 ? ' plus the age-50 catch-up' : '')) + ', 2026).' +
        (is50 ? '' : ' A catch-up is available from age 50 — pick the age band if it applies.'));
    }
    // A W-2 owner can defer no more than the paycheck left after FICA.
    var payAvailable = o.pay;
    if (!isSE) {
      var f = o.tb.fica;
      payAvailable = o.pay - (Math.min(o.pay, f.ssWageBase) * f.ssRate + o.pay * f.medicareRate) / 2;
    }
    if (regular + catchUp > payAvailable) {
      var cut = regular + catchUp - payAvailable;
      var cutCatch = Math.min(catchUp, cut);
      catchUp -= cutCatch;
      regular = Math.max(0, regular - (cut - cutCatch));
      if (first) {
        notes.push('Deferral limited to ' + TSIQ.fmt.usd(regular + catchUp) + ' — the owner\'s ' +
          (isSE ? 'earned income (net profit less half of SE tax)' : 'W-2 pay after Social Security and Medicare') + '.');
      }
    }

    // ---- Employer contribution: 25% of wages / 20% of earned income.
    var wantEmployer = params.employerContribution || 0;
    var employerMax = Math.max(0, o.comp * o.employerRate - ret.employer);
    var employer = Math.min(wantEmployer, employerMax);
    if (wantEmployer > employerMax && first) {
      notes.push('Employer contribution capped at ' + TSIQ.fmt.usd(employerMax) + ' — ' +
        (isSE ? '20% of earned income (net profit less half of SE tax)' : '25% of owner W-2 wages') +
        (isSE ? '' : '. A higher salary supports more, if it is defensible as reasonable compensation') + '.');
    }

    // ---- §415(c): deferral + employer ≤ lesser of $72,000 or 100% of pay.
    var room415 = Math.max(0, Math.min(lim.dcAnnualAdditions, o.pay) -
      (ret.deferral - ret.catchUp) - ret.employer);
    if (regular + employer > room415) {
      employer = Math.max(0, room415 - regular);
      if (first) {
        notes.push('Deferral plus employer contribution capped at ' + TSIQ.fmt.usd(room415) +
          ' — the lesser of ' + TSIQ.fmt.usd(lim.dcAnnualAdditions) + ' or 100% of the owner\'s pay (§415(c)).');
      }
    }
    // A self-employed owner cannot deduct more than earned income in total.
    if (isSE && regular + catchUp + employer > o.pay) {
      employer = Math.max(0, o.pay - regular - catchUp);
    }

    // ---- Roth-only catch-up for higher-paid W-2 owners (no deduction).
    var deductibleCatchUp = catchUp;
    if (!isSE && catchUp > 0 && o.pay > lim.rothCatchUpWageThreshold) {
      deductibleCatchUp = 0;
      if (first) {
        notes.push('The ' + TSIQ.fmt.usd(catchUp) + ' catch-up is NOT deducted: an owner whose prior-year ' +
          'wages from the business were over ' + TSIQ.fmt.usd(lim.rothCatchUpWageThreshold) +
          ' must make catch-up contributions as Roth (after-tax) from 2026. The tool tests ' +
          'this year\'s owner wages — check last year\'s W-2 Box 3.');
      }
    }

    var total = regular + deductibleCatchUp + employer;
    if (isSE) {
      p.adjustments = (p.adjustments || 0) + total;
      p.qbiReduction = (p.qbiReduction || 0) + total; // SE retirement deduction reduces §199A QBI
    } else {
      p.adjustments = (p.adjustments || 0) + regular + deductibleCatchUp; // Box 1 reduction; FICA unchanged
      p.passthroughK1 = (p.passthroughK1 || 0) - employer;                // entity deduction (also reduces QBI)
    }
    ret.deferral += regular + catchUp;
    ret.catchUp += catchUp;
    ret.employer += employer;
    ret.names.push('Solo 401(k)');

    if (first) {
      notes.push(TSIQ.fmt.usd(total) + ' of deductible Solo 401(k) contributions modeled (' +
        TSIQ.fmt.usd(regular + deductibleCatchUp) + ' deferral + ' + TSIQ.fmt.usd(employer) + ' employer). ' +
        'Deferrals do not reduce SE/FICA tax.');
      if (o.staffPayroll > 0) {
        notes.push('Section 1 shows ' + TSIQ.fmt.usd(o.staffPayroll) + ' of staff payroll. A solo plan ' +
          'works only while no employee other than a spouse is eligible; with eligible staff the ' +
          'plan needs testing and staff contributions, which are not modeled here.');
      }
      if (is60to63) {
        notes.push('Ages 60–63 catch-up applies only in the years the owner is 60, 61, 62 or 63 at ' +
          'year-end — the projection holds it for every year, so later years may be overstated.');
      }
    }
    return { profile: p, notes: notes };
  }
});
