/* ============================================================================
 * STRATEGY: C-Corp Conversion (Retained Earnings / QSBS)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'c-corp-conversion',
  name: 'C-Corp Conversion (Retained Earnings / QSBS)',
  category: 'Entity Structure',
  applyOrder: 11, // restructures income right after S-corp election in ordering
  modeled: true,

  advisor: {
    summary:
      'Operate the business as a C corporation taxed at the flat 21% rate (§11) ' +
      'instead of passing profit through to the owner\'s 1040. The owner takes a ' +
      'reasonable W-2 salary; remaining profit is taxed once at 21% and retained ' +
      'for reinvestment, compounding at the corporate rate rather than the ' +
      'owner\'s marginal rate. Dividends actually paid are a second tax layer at ' +
      'qualified-dividend rates (§301/§316; §1(h)(11)). The long-game payoff is ' +
      '§1202 QSBS: for stock acquired after 7/4/2025, OBBBA allows exclusion of ' +
      'up to $15M (or 10x basis) of gain — 50%/75%/100% at 3/4/5-year holds — if ' +
      'the corporation stays under the $75M gross-asset cap and runs a qualified ' +
      'active business. The trade-offs are the dividend double tax, loss of the ' +
      '§199A deduction on the corporate profit, and the §531/§541 penalty-tax ' +
      'regimes on passive or hoarded earnings.',
    mechanics: [
      'Sole-prop (or SMLLC) incorporates under §351, or an existing LLC checks ' +
      'the box (Form 8832) to be taxed as a C corporation. Owner becomes a W-2 ' +
      'employee; corporation files Form 1120.',
      'Corporate profit after salary, employer payroll tax, and admin cost is ' +
      'taxed at the flat 21% rate (§11) — no SE tax, no individual brackets, ' +
      'but also no §199A/QBI deduction on that profit.',
      'Retained earnings compound inside the corporation at the 21% rate. The ' +
      'benefit versus a passthrough is a rate spread play: it works when the ' +
      'owner\'s marginal rate (up to 37% + Medicare taxes) exceeds 21% and the ' +
      'cash genuinely stays in the business.',
      'Cash the owner pulls out beyond salary is a dividend — taxable again at ' +
      '0/15/20% qualified-dividend rates plus 3.8% NIIT (§301/§316). The ' +
      'combined double-taxed rate (~36–40% top) usually exceeds the passthrough ' +
      'rate, so the structure only wins when distributions are low.',
      '§1202 exit: original-issuance C-corp stock in a qualified trade or ' +
      'business (most non-service businesses; SSTB-type fields are excluded ' +
      'under §1202(e)(3)) with gross assets ≤ $75M at issuance. For stock ' +
      'acquired after 7/4/2025, OBBBA allows a 50% exclusion at a 3-year hold, ' +
      '75% at 4 years, 100% at 5 years, capped at the greater of $15M ' +
      '(inflation-indexed) or 10x basis per issuer.',
      'Guardrails: §541 imposes a 20% personal holding company tax where ≥60% ' +
      'of adjusted ordinary gross income is passive and 5 or fewer individuals ' +
      'own >50%; §531 imposes the 20% accumulated earnings tax on earnings ' +
      'retained beyond reasonable business needs (generally above the $250,000 ' +
      'credit; $150,000 for service corporations).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §11', note: 'Flat 21% corporate rate (TCJA, permanent).' },
      { type: 'IRC', cite: 'IRC §1202 (as amended by OBBBA, P.L. 119-21)', note: 'QSBS exclusion for stock acquired after 7/4/2025: $75M gross-asset cap, greater of $15M or 10x basis per issuer, tiered 50/75/100% exclusion at 3/4/5-year holding periods.' },
      { type: 'IRC', cite: 'IRC §§301, 316; §1(h)(11)', note: 'Distributions out of E&P are dividends — the second tax layer, at qualified-dividend rates for domestic corporations.' },
      { type: 'IRC', cite: 'IRC §531', note: 'Accumulated earnings tax: 20% on earnings retained beyond reasonable business needs; documented growth/expansion plans are the defense.' },
      { type: 'IRC', cite: 'IRC §541', note: 'Personal holding company tax: 20% on undistributed PHC income where the income and ownership tests are met — the trap for investment-heavy closely held corps.' },
      { type: 'IRC', cite: 'IRC §351', note: 'Tax-free incorporation of the existing business in exchange for stock (start of the §1202 holding period and original-issuance requirement).' },
      { type: 'IRC', cite: 'IRC §199A', note: 'By contrast: C-corp profit gets no QBI deduction — part of the honest rate comparison against a passthrough.' }
    ],
    requirements: [
      'A qualified active trade or business if §1202 is part of the thesis — §1202(e)(3) excludes health, law, consulting, financial services, and other reputation/skill businesses.',
      'Stock must be acquired at original issuance from the corporation (direct incorporation or check-the-box conversion; an S corporation\'s existing stock does not qualify — the corporation must be a C corp when the stock is issued).',
      'Aggregate gross assets ≤ $75M at and immediately after issuance (OBBBA cap for post-7/4/2025 stock).',
      'Genuine reinvestment need for retained earnings — documented expansion plans defend against §531.',
      'Payroll for the owner\'s salary and Form 1120 compliance annually.'
    ],
    risks: [
      'Double taxation on any cash the owner actually needs personally — model dividends honestly; if the owner distributes most of the profit, the passthrough usually wins.',
      'Accumulated earnings tax (§531) if retention outruns documented business needs; personal holding company tax (§541) if the corporation drifts into passive income.',
      'Loss of §199A: the 21% rate must be compared against the owner\'s effective passthrough rate AFTER the QBI deduction, not the headline bracket.',
      'Locked-in structure: getting appreciated assets back out of a C corporation is itself a taxable event; converting back to passthrough status has its own toll charges (e.g., BIG tax if re-electing S).',
      '§1202 is a facts-heavy exclusion — qualified business, original issuance, gross-asset test, and holding period must all be documented from day one; a later exam reconstructs all of it.',
      'California taxes C-corporation income at 8.84% ($800 minimum) and does not conform to §1202 — a QSBS exit is fully taxable for California.',
      'Accumulated earnings tax (§531): 20% on earnings retained beyond the reasonable needs of the business, above a $250,000 credit ($150,000 for service corporations).'
    ],
    bestFit: [
      'Profitable businesses that genuinely reinvest most earnings (equipment, inventory, hiring) rather than distributing them.',
      'Owners in the 32–37% brackets where the 21% corporate rate creates a real deferral spread.',
      'Businesses with a plausible 3–5+ year exit where §1202 could exclude some or all of the sale gain.',
      'Non-SSTB businesses (SSTBs fail the §1202 qualified-business test).'
    ],
    implementation: [
      'Model the full comparison: passthrough (with QBI) vs. 21% + dividend layer at the client\'s actual distribution needs — this tool\'s scenario math does exactly that.',
      'Incorporate under §351 or file Form 8832 for an existing LLC; issue stock and record the §1202 gross-asset test as of issuance.',
      'Set reasonable W-2 compensation and run payroll; document board minutes for retained-earnings plans (the §531 defense file).',
      'Adopt a dividend policy — deliberately low if the retained-earnings thesis is the point.',
      'Calendar the §1202 holding-period milestones (3/4/5 years from issuance) in the permanent file.',
      'File Form 1120 annually; monitor passive-income mix against the §541 tests.'
    ]
  },

  client: {
    teaser: 'A flat, lower tax rate on profits you keep in the business — and a path to a tax-free sale someday',
    headline: 'Keep profits in the business at a 21% rate — and set up a tax-free exit',
    plainEnglish: [
      'Right now, every dollar your business earns lands on your personal tax return, where rates can run well over 30% — even for profit you never take out of the company. Restructuring as a regular corporation changes that: profit the business keeps is taxed at a flat 21% federal rate, plus your state\'s corporate tax (8.84% in California, about 28% combined).',
      'That gap matters when you are reinvesting. Money kept in the company to buy equipment, hire, or build inventory grows from a bigger after-tax base every year. The catch is that money you pull out for yourself beyond your salary gets taxed a second time, so this works best when the business — not your household — needs the cash.',
      'There is also a powerful long-term prize: if you hold the company\'s stock long enough and later sell the business, current federal law can make millions of dollars of that sale free of federal tax (California still taxes it). The clock starts when we set the structure up, which is a reason to plan early rather than later.'
    ],
    analogy: 'Think of it as a greenhouse for your profits: money that stays inside grows in a better climate, but every trip outside the greenhouse costs a toll — so we design it for profits you truly intend to keep planted.',
    benefits: [
      'A flat 21% federal rate on profits kept in the business, instead of your higher personal rate',
      'More after-tax money compounding inside the company each year',
      'A potential exit where a large part of the sale price is free of federal tax after a 5-year hold',
      'A salary and structure that look and feel like any established company'
    ],
    steps: [
      'We run the numbers both ways — your current setup versus the corporate structure — using your real profit and spending needs',
      'We handle the incorporation paperwork and set up your salary through payroll',
      'We document everything the future tax-free-sale rules require, starting day one',
      'Each year we review how much to pay out versus keep in, so the math keeps working for you'
    ],
    considerations: [
      'Money you take out beyond your salary is taxed twice — this structure is for owners who reinvest most of their profit, and we will be honest if that is not you.',
      'The tax-free-sale benefit requires holding the stock for years and meeting several technical tests — we set up the documentation now, but the payoff is down the road.',
      'Undoing this structure later has real costs, so we treat it as a long-term commitment, not an experiment.'
    ]
  },

  inputs: [
    { key: 'ownerSalary', label: 'Owner W-2 salary (reasonable comp)', type: 'currency', default: 120000 },
    { key: 'dividendsPaid', label: 'Annual dividends paid to owner', type: 'currency', default: 0 },
    { key: 'adminCost', label: 'Annual payroll + 1120 compliance cost', type: 'currency', default: 3000 },
    // defaultFrom: California's 8.84% when California rules are on; otherwise
    // the client's own state rate as a rough stand-in for the corporate rate.
    { key: 'corpStateRatePct', label: 'State corporate tax rate (%) — California is 8.84', type: 'percent', default: 8.84,
      defaultFrom: function (profile) {
        return profile.caRules ? 8.84 : Math.round((profile.stateRate || 0) * 10000) / 100;
      } },
    { key: 'exitTax', label: 'Tax on retained earnings when they come out', type: 'select', default: 'yes',
      options: [{ value: 'yes', label: 'Tax them at the end of the projection' },
        { value: 'no', label: 'Leave untaxed (QSBS exit or indefinite retention)' }] }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs Schedule C income
  },

  /**
   * Converts Schedule C income into: owner W-2 wages + corporate profit taxed
   * at the flat 21% rate (§11) after state corporate tax + an optional
   * dividend layer.
   * - Salary and dividends grow with the client's income growth rate (a
   *   salary frozen for ten years while profit rises is not reasonable comp).
   * - State corporate tax (California: 8.84%, $800 minimum) is deducted before
   *   the 21% and carried as entityStateTax.
   * - Admin cost is deducted by the corporation AND counted as a plan cost.
   * - Retained earnings are tracked. By default they are taxed as a
   *   distribution in the final projection year, so the projection total shows
   *   the full two-layer cost instead of presenting deferral as savings. Turn
   *   that off only for a planned §1202 exit or genuine indefinite retention.
   * - Dividends are limited to accumulated after-tax earnings.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    if (p.scheduleCNet <= 0) {
      if (yearIndex === 0) {
        notes.push('No Schedule C (sole proprietorship) profit found — nothing to convert. ' +
          'This strategy models incorporating a sole proprietorship as a C corporation.');
      }
      return { profile: p, notes: notes };
    }
    var tb = TSIQ.TABLES_2026;
    var f = ((state && state.tables) || tb).fica; // indexed in later years
    var g = (state && state.growthFactor) || 1;
    var wantedSalary = (params.ownerSalary || 0) * g;
    var salary = Math.min(wantedSalary, p.scheduleCNet); // can't pay more than profit
    if (salary < wantedSalary && yearIndex === 0) {
      notes.push('Salary capped at business profit of ' + TSIQ.fmt.usd(p.scheduleCNet) + '.');
    }
    var employerFICA = Math.min(salary, f.ssWageBase) * (f.ssRate / 2) +
      salary * (f.medicareRate / 2);
    var adminCost = Math.max(0, params.adminCost || 0);
    var corpProfit = p.scheduleCNet - salary - employerFICA - adminCost;

    // State corporate tax, deductible against the federal 21%.
    var stateRate = Math.max(0, params.corpStateRatePct === undefined ? 0 : params.corpStateRatePct) / 100;
    var stateMin = p.caRules ? tb.california.minimumFranchiseTax : 0;
    var stateCorpTax = (stateRate > 0 || stateMin > 0)
      ? Math.max(stateMin, stateRate * Math.max(0, corpProfit)) : 0;
    var corpTax = Math.max(0, corpProfit - stateCorpTax) * tb.corporateRate;
    var afterTax = Math.max(0, corpProfit) - stateCorpTax - corpTax;

    // Dividends come out of accumulated after-tax earnings.
    var retainedBefore = state.ccorpRetained || 0;
    var wantedDividends = Math.max(0, params.dividendsPaid || 0) * g;
    var dividends = Math.min(wantedDividends, Math.max(0, retainedBefore + afterTax));
    state.ccorpRetained = retainedBefore + afterTax - dividends;

    p.corpTaxPaid = (p.corpTaxPaid || 0) + corpTax;
    p.entityStateTax = (p.entityStateTax || 0) + stateCorpTax;
    p.planCosts = (p.planCosts || 0) + adminCost;
    p.ownerWages = (p.ownerWages || 0) + salary;
    p.qualDiv = (p.qualDiv || 0) + dividends;
    p.scheduleCNet = 0;

    // Second layer on what was kept inside: taxed when it comes out.
    var lastYear = (state.projectionYears || 1) - 1;
    var taxExit = params.exitTax !== 'no';
    if (taxExit && yearIndex === lastYear && state.ccorpRetained > 0) {
      p.qualDiv = p.qualDiv + state.ccorpRetained;
      notes.push('Final projection year: ' + TSIQ.fmt.usd(state.ccorpRetained) + ' of retained ' +
        'earnings taxed as a distribution to the owner (the second layer of tax). Without ' +
        'this the projection would show deferral as savings.');
      state.ccorpRetained = 0;
    }

    if (yearIndex === 0) {
      notes.push('C-corp profit of ' + TSIQ.fmt.usd(Math.max(0, corpProfit)) + ' bears ' +
        (stateCorpTax > 0 ? TSIQ.fmt.usd(stateCorpTax) + ' of state corporate tax and ' : '') +
        TSIQ.fmt.usd(corpTax) + ' of federal tax at the flat 21% rate (§11). The owner takes ' +
        TSIQ.fmt.usd(salary) + ' of salary' +
        (dividends > 0 ? ' and ' + TSIQ.fmt.usd(dividends) + ' of dividends' : '') +
        '; the rest stays in the corporation.');
      if (wantedDividends > dividends) {
        notes.push('Dividends limited to ' + TSIQ.fmt.usd(dividends) +
          ' — the corporation cannot distribute more than its accumulated after-tax earnings.');
      }
      notes.push(taxExit
        ? 'Retained earnings are taxed again when they come out. This projection taxes the ' +
          'accumulated balance in its final year, so the total reflects both layers.'
        : 'Retained earnings are NOT taxed in this projection (QSBS exit or indefinite ' +
          'retention assumed). Any dividend, salary bonus or non-QSBS sale later adds a ' +
          'second layer of tax that is not shown.');
      notes.push('Compare the owner\'s cash, not just the tax: salary' +
        (dividends > 0 ? ' plus dividends' : '') + ' of ' + TSIQ.fmt.usd(salary + dividends) +
        ' replaces ' + TSIQ.fmt.usd(profile.scheduleCNet) + ' of business profit the owner ' +
        'could spend today.');
      var creditAmt = p.isSSTB ? 150000 : 250000;
      notes.push('No §199A/QBI deduction applies to C-corp profit — the scenario math reflects ' +
        'losing it. Accumulated earnings beyond the reasonable needs of the business are ' +
        'exposed to the 20% accumulated earnings tax (§531) above a ' + TSIQ.fmt.usd(creditAmt) +
        ' credit; at ' + TSIQ.fmt.usd(afterTax - dividends) + ' retained a year that is reached ' +
        'in about ' + Math.max(1, Math.ceil(creditAmt / Math.max(1, afterTax - dividends))) +
        ' year(s). Also watch §541 (personal holding company).' +
        (p.isSSTB ? ' A service business in the §1202 excluded fields cannot use the QSBS exit.' : ''));
      if (corpProfit < 0) {
        notes.push('Warning: salary + payroll costs exceed profit — conversion is not beneficial at this income level.');
      }
    }
    return { profile: p, notes: notes };
  }
});
