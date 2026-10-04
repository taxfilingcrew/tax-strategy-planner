/* ============================================================================
 * STRATEGY: Work Opportunity Tax Credit (§51)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'wotc',
  name: 'Work Opportunity Tax Credit',
  category: 'Credits & Incentives',
  applyOrder: 82,

  advisor: {
    summary:
      'The §51 Work Opportunity Tax Credit rewards hiring from targeted groups ' +
      '— qualified veterans, SNAP recipients, long-term unemployed, ' +
      'ex-felons, designated community residents, vocational-rehab referrals, ' +
      'SSI recipients, and long-term family assistance recipients. Generally ' +
      '40% of first-year wages up to $6,000 ($2,400 per hire), rising to ' +
      '$9,600 for certain qualified veterans (40% of up to $24,000) and up to ' +
      '$9,000 over two years for long-term family assistance hires. The ' +
      'make-or-break step is Form 8850 pre-screening submitted to the state ' +
      'workforce agency within 28 days of the start date — miss it and the ' +
      'credit is gone. §280C(a) reduces the wage deduction by the credit; ' +
      'the model nets that out. STATUS: the credit lapsed for employees who ' +
      'begin work after 12/31/2025 (§51(c)(4)) and had not been extended as of ' +
      'October 2026. For 2026 it applies only to first-year wages paid to ' +
      'people hired on or before 12/31/2025. Keep filing Form 8850 on new ' +
      'hires in case Congress extends it retroactively, as it has before.',
    mechanics: [
      'Credit is 40% of qualified first-year wages if the employee works at ' +
      'least 400 hours; 25% if 120–399 hours; no credit under 120 hours.',
      'Wage caps by group: $6,000 general (max $2,400); qualified veteran ' +
      'categories up to $24,000 of wages (max $9,600 for a veteran with a ' +
      'service-connected disability unemployed 6+ months); summer youth ' +
      '$3,000 of wages (max $1,200).',
      'Long-term family assistance recipients (§51(e)): 40% of up to $10,000 ' +
      'of first-year wages plus 50% of up to $10,000 of second-year wages — ' +
      'up to $9,000 over two years.',
      'Form 8850 (Pre-Screening Notice) must be signed by employer and ' +
      'applicant on or before the job-offer date and submitted to the state ' +
      'workforce agency within 28 calendar days after the employee starts; ' +
      'ETA Form 9061/9062 supplies the eligibility documentation. The state ' +
      'agency certification is the credit.',
      '§280C(a): the employer\'s wage deduction is reduced by the credit ' +
      'claimed. If you enter the net-of-deduction-loss benefit here, no ' +
      'further income adjustment is needed; the model does not separately ' +
      'reduce business income.',
      'Claimed on Form 5884, flowing into the §38 general business credit ' +
      '(Form 3800); nonrefundable, with §39 carryback 1 / carryforward 20.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §51', note: 'The credit: targeted groups, wage caps, 400/120-hour tiers, and certification requirement.' },
      { type: 'IRC', cite: 'IRC §51(d)(13)', note: 'Pre-screening and certification: Form 8850 must go to the designated local (state workforce) agency within 28 days of the start date.' },
      { type: 'IRC', cite: 'IRC §51(e)', note: 'Long-term family assistance recipients — two-year credit up to $9,000.' },
      { type: 'IRC', cite: 'IRC §280C(a)', note: 'Wage deduction reduced by the credit — no double benefit.' },
      { type: 'Admin', cite: 'Form 8850; ETA Forms 9061/9062', note: 'IRS pre-screening notice plus DOL conditional certification/individual characteristics forms filed with the state workforce agency.' },
      { type: 'Admin', cite: 'Form 5884 / Form 3800', note: 'Credit computation and general business credit reporting.' },
      { type: 'Admin', cite: 'Consolidated Appropriations Act, 2021 (P.L. 116-260)', note: 'Extended WOTC through 12/31/2025 (§51(c)(4)). Not extended as of October 2026: no credit for employees who begin work after that date. WOTC has historically lapsed and been extended retroactively.' }
    ],
    requirements: [
      'Hires certified by the state workforce agency as members of a targeted group — self-attestation alone is not enough.',
      'Form 8850 signed by offer date and submitted within 28 days of the start date (hard deadline, no reasonable-cause relief).',
      'Employee works at least 120 hours (25% tier) or 400 hours (40% tier).',
      'The employee must be a new hire — rehires and related parties (§51(i)) do not qualify.',
      'Payroll records isolating qualified first-year wages per certified employee.'
    ],
    risks: [
      'LAPSED: no credit for employees who begin work after 12/31/2025 unless Congress extends §51 — not extended as of October 2026. Do not model or claim the credit for 2026 hires. Extension has historically been routine but retroactive, so keep the Form 8850 screening running.',
      'The 28-day Form 8850 window is the leading cause of lost credits; without a process embedded in onboarding, eligible hires slip through unscreened.',
      'Certifications can take months; credits may need to be claimed on amended returns or held until certification arrives.',
      'Wages counted for WOTC cannot double-count with certain other employment credits for the same employee.',
      'Nonrefundable: a low-tax year strands the credit in carryforward (this tool applies it after the child tax credit; carryovers not modeled).'
    ],
    bestFit: [
      'Employers with steady hiring volume in hourly, entry-level, food service, healthcare, warehouse, or trades roles — where targeted-group density is highest.',
      'Businesses willing to add a two-minute screening questionnaire to their onboarding packet (or use payroll-provider WOTC screening).',
      'Veteran-focused hiring programs — the veteran categories carry the largest per-hire credits.'
    ],
    implementation: [
      'Embed WOTC screening in onboarding: applicant completes Form 8850 page 1 by the offer date, employer completes page 2 at hire.',
      'Submit Form 8850 plus ETA 9061 (or 9062) to the state workforce agency within 28 calendar days of the start date — calendar this per hire.',
      'Track hours to the 120/400-hour thresholds and isolate first-year qualified wages in payroll.',
      'On certification, compute the credit on Form 5884 and carry to Form 3800; coordinate the §280C(a) wage-deduction reduction.',
      'Consider payroll-provider or specialist WOTC administration for volume hiring — screening compliance drives the entire benefit.'
    ]
  },

  client: {
    teaser: 'A hiring credit worth keeping the paperwork alive for',
    headline: 'Turn your hiring into tax credits',
    plainEnglish: [
      'The government offers employers a reward for hiring people from groups that often face barriers to work — for example, veterans, people who have been unemployed a long time, or people receiving government assistance. The reward is a tax credit: a dollar-for-dollar cut in your tax bill, typically $2,400 per qualifying hire and up to $9,600 for certain veterans.',
      'Many employers already hire people who qualify and never collect a dime, because the credit has one strict rule: a short screening form must be filed within 28 days of the person\'s start date. Miss the window, lose the credit.',
      'The fix is simple — a quick questionnaire added to your new-hire paperwork. From there, we handle the filings and claim the credit for every hire who qualifies.'
    ],
    analogy: 'It\'s like a coupon the government hands you for certain new hires — but the coupon expires 28 days after their first day, so the trick is having a system that never forgets to redeem it.',
    benefits: [
      'Typically $2,400 per qualifying hire — up to $9,600 for certain veterans — for people hired through the end of 2025',
      'Reduces your tax bill dollar for dollar',
      'No change to who you hire — just a screening step added to onboarding',
      'Scales with your hiring: more qualifying hires, more credit'
    ],
    steps: [
      'We add a short screening form to your new-hire paperwork',
      'We file the required forms with the state within the deadline',
      'The state certifies which hires qualify',
      'We claim the credit on your tax return'
    ],
    considerations: [
      'The program expired for anyone hired after December 31, 2025, and Congress had not renewed it as of October 2026. Right now it only applies to wages paid in 2026 to people you hired in 2025 or earlier. We keep the screening step in place so you can claim it if Congress renews it retroactively, as it has done before.',
      'The 28-day filing deadline is absolute, so the screening step has to be built into onboarding, not done after the fact.'
    ]
  },

  inputs: [
    { key: 'creditAmount', label: 'WOTC on 2026 wages of employees hired by 12/31/2025', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // needs a business with employees; validated in apply()
  },

  /**
   * WOTC lapsed for employees beginning work after 12/31/2025 and had not
   * been extended as of October 2026, so the credit is modeled in year 1 ONLY
   * (first-year wages paid in 2026 to people hired in 2025) and defaults to
   * zero. §280C(a) disallows the wage deduction equal to the credit — the
   * credit amount is added back to business income so the figure is net.
   * Unused credit carries forward in the engine.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    if (yearIndex !== 0) return { profile: p, notes: notes };

    var amt = Math.max(0, params.creditAmount || 0);
    var hasSchC = p.scheduleCNet > 0, hasEntity = p.passthroughK1 > 0;
    if (!hasSchC && !hasEntity) {
      notes.push('WOTC is an employer credit — no business income found in this profile. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    if (amt <= 0) {
      notes.push('No WOTC entered. The credit lapsed for anyone hired after 12/31/2025 and had ' +
        'not been extended as of October 2026 — enter an amount only for 2026 wages paid to ' +
        'qualifying employees hired on or before that date.');
      return { profile: p, notes: notes };
    }
    p.otherCredits = (p.otherCredits || 0) + amt;
    // §280C(a): the wage deduction is reduced by the credit.
    if (hasSchC) p.scheduleCNet = p.scheduleCNet + amt;
    else p.passthroughK1 = p.passthroughK1 + amt;
    notes.push(TSIQ.fmt.usd(amt) + ' WOTC applied for ' + TSIQ.TABLES_2026.taxYear +
      ' only, net of the wage deduction it cancels (§280C(a)). No credit is modeled for later ' +
      'years: the program lapsed for hires after 12/31/2025 and had not been extended as of ' +
      'October 2026.');
    return { profile: p, notes: notes };
  }
});
