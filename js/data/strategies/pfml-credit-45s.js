/* ============================================================================
 * STRATEGY: Paid Family & Medical Leave Credit (§45S)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'pfml-credit-45s',
  name: 'Paid Family & Medical Leave Credit (§45S)',
  category: 'Credits & Incentives',
  applyOrder: 87,

  advisor: {
    summary:
      'The §45S credit rewards employers that voluntarily pay wages to ' +
      'employees on FMLA-type leave (birth/adoption, serious health ' +
      'condition, care of a family member, qualifying military exigencies). ' +
      'The credit is 12.5% of wages paid during leave if the program replaces ' +
      '50% of normal wages, increasing 0.25 points for each percentage point ' +
      'of replacement above 50%, to a maximum 25% at full pay — on up to 12 ' +
      'weeks of leave per employee per year. Originally a TCJA pilot that was ' +
      'repeatedly extended, OBBBA (P.L. 119-21) made §45S PERMANENT and added ' +
      'the option to compute the credit on premiums paid for paid-leave ' +
      'insurance rather than wages. A written leave policy meeting the ' +
      'statutory minimums must be in place, and leave paid or mandated by a ' +
      'state program does not count.',
    mechanics: [
      'Credit rate: 12.5% + 0.25% × (wage-replacement percentage − 50), max ' +
      '25% when the policy pays 100% of normal wages. Applies to up to 12 ' +
      'weeks of qualifying leave per employee per year.',
      'Written policy minimums: at least 2 weeks of annual paid family/' +
      'medical leave for full-time qualifying employees (prorated for ' +
      'part-time), at a rate of at least 50% of normal wages.',
      'Qualifying employees: employed for at least a year and compensated ' +
      'below a threshold keyed to 60% of the §414(q) highly compensated ' +
      'threshold for the prior year — the credit targets rank-and-file leave, ' +
      'not executive benefits.',
      'OBBBA changes: §45S is permanent; employers may elect to compute the ' +
      'credit as a percentage of PREMIUMS paid for paid family and medical ' +
      'leave insurance (making the benefit insurable rather than self-funded); ' +
      'the employer may elect to treat employees with 6 months of service ' +
      '(instead of 1 year) as qualifying; and a qualifying employee must be ' +
      'customarily employed at least 20 hours a week.',
      'No double-dip: leave paid by a state or required by state/local law ' +
      'is not "paid family and medical leave" for the credit — only the ' +
      'employer\'s voluntary program counts. Wages used for this credit ' +
      'cannot also drive other employment credits, and the wage deduction is ' +
      'reduced by the credit (§280C(a)) — enter the net figure.',
      'PTO, vacation, and sick leave not specifically designated for ' +
      'FMLA-type purposes do not qualify — the policy language matters.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §45S', note: 'Employer credit for paid family and medical leave: 12.5%–25% of wages paid during up to 12 weeks of qualifying leave; written-policy and qualifying-employee requirements.' },
      { type: 'Admin', cite: 'OBBBA (P.L. 119-21), July 2025', note: 'Made §45S permanent and added the insurance-premium computation option (effective for tax years beginning after 2025). Also allows an election to cover employees after 6 months of service and requires qualifying employees to be customarily employed at least 20 hours a week.' },
      { type: 'Admin', cite: 'IRS Notice 2018-71', note: 'Q&A guidance on §45S: written policy requirements, qualifying leave types, wage-replacement computation, and the exclusion of state-mandated leave.' },
      { type: 'IRC', cite: 'IRC §280C(a)', note: 'Wage deduction reduced by the credit claimed — no double benefit.' },
      { type: 'Admin', cite: 'Form 8994 / Form 3800', note: 'Credit computation and general business credit reporting.' }
    ],
    requirements: [
      'A WRITTEN policy in place before the leave is taken: ≥ 2 weeks annual paid FMLA-type leave for full-time qualifying employees (prorated part-time) at ≥ 50% wage replacement.',
      'Non-interference language for employers with employees not covered by FMLA (per Notice 2018-71).',
      'Qualifying employees only: 1+ year of service and prior-year compensation under the 60%-of-HCE threshold.',
      'Leave tracked and designated as FMLA-type — general PTO does not count.',
      'If using the OBBBA insurance option: premiums for a qualifying paid-leave policy, computed under the new rules.'
    ],
    risks: [
      'Policy-first rule: leave paid before the written policy\'s effective date earns no credit — the document must precede the leave.',
      'State paid-leave programs (now common) crowd out the credit: only employer-paid amounts above/outside the state mandate can qualify — analyze state-by-state.',
      'Misclassified leave (ordinary PTO relabeled at year-end) fails the designation requirement.',
      'Nonrefundable general business credit — low-tax years push it into carryforward (the tool carries it forward within the projection).',
      'For small employers, the dollars are modest — typically thousands, not tens of thousands; weigh administration against benefit.'
    ],
    bestFit: [
      'Employers already paying for parental or medical leave informally — the credit rewards formalizing what they already do.',
      'Businesses in states WITHOUT mandated paid leave, where the entire program is voluntary and creditable.',
      'Employers using the new insurance option to offer leave at a predictable premium cost.'
    ],
    implementation: [
      'Adopt (or amend) a written paid family and medical leave policy meeting the §45S minimums BEFORE the plan year — include the non-interference language.',
      'Set the wage-replacement percentage deliberately: higher replacement earns a higher credit rate (25% max at full pay).',
      'Identify qualifying employees (1-year service, compensation under the threshold) and track FMLA-type leave separately in payroll.',
      'If insuring the benefit, evaluate the OBBBA premium-based computation against self-funding.',
      'Compute the credit on Form 8994, reduce the wage deduction accordingly (§280C(a)), and carry to Form 3800.'
    ]
  },

  client: {
    teaser: 'A tax reward for taking care of your team when life happens',
    headline: 'Get paid back for paid leave',
    plainEnglish: [
      'When an employee has a baby, faces a serious illness, or needs to care for a sick family member, many good employers keep paying them anyway. The tax law rewards that: if you have a formal paid-leave policy, the government gives you back up to a quarter of the wages you pay while someone is out on family or medical leave.',
      'The catch is the word "formal." A handshake promise or general vacation time does not count — there has to be a written policy, set up before the leave happens, that meets a few specific standards. Most employers who informally do right by their people are one document away from qualifying.',
      'There is also a newer option: instead of paying leave out of pocket, you can buy insurance that covers it, and the credit can apply to those premiums — turning an unpredictable cost into a fixed one.'
    ],
    analogy: 'You were going to take care of your people anyway. This is the government offering to cover part of the bill — but only if the promise is in writing first.',
    benefits: [
      'Up to 25% of wages paid during family or medical leave back as a credit',
      'Usually just requires formalizing what you already do',
      'An insurance option can make the cost fixed and predictable',
      'A permanent benefit you can build into your employee handbook'
    ],
    steps: [
      'We draft or update your written leave policy to meet the requirements',
      'We set the pay level to balance generosity against the credit rate',
      'Your payroll tracks the qualifying leave — we show you how',
      'We claim the credit on your return each year'
    ],
    considerations: [
      'The written policy must be in place before the leave is taken — this cannot be fixed retroactively.',
      'If your state requires paid leave by law, only what you voluntarily pay beyond the state program counts.'
    ]
  },

  inputs: [
    // defaultFrom: 2% of staff payroll (about one week of leave per employee).
    { key: 'leaveWages', label: 'Wages paid to staff on family/medical leave', type: 'currency', default: 0,
      defaultFrom: function (profile) {
        return Math.round(0.02 * Math.max(0, (profile.entityW2Wages || 0) - (profile.ownerWages || 0)));
      } },
    { key: 'replacementPct', label: 'Share of normal pay the policy pays (%)', type: 'percent', default: 100 }
  ],

  appliesTo: function (profile) {
    return true; // depends on leave-policy facts the advisor computes
  },

  /**
   * Credit = leave wages × rate, where the rate is 12.5% plus 0.25 point for
   * each point the policy pays above 50% of normal wages (25% at full pay).
   * Needs non-owner staff. §280C(a): the wage deduction is reduced by the
   * credit, so business income is raised by it. The leave wages themselves
   * are ordinary payroll and are not treated as a new cost.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    if (!TSIQ.credit.hasBusiness(p)) {
      if (first) notes.push('The paid family and medical leave credit is a business credit — no business found in this profile. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    if (!(TSIQ.staffBenefit.payroll(p) > 0)) {
      if (first) {
        notes.push('No benefit modeled: Section 1 shows no W-2 payroll for anyone other than the owner. The credit is for leave wages paid to employees — owners do not count. ' +
          'Enter the staff payroll in "W-2 wages paid by the business" if the business has employees.');
      }
      return { profile: p, notes: notes };
    }
    var wages = Math.max(0, params.leaveWages || 0);
    var repl = params.replacementPct === undefined ? 100 : params.replacementPct;
    if (repl < 50) {
      if (first) notes.push('No credit: the policy must pay at least 50% of normal wages during leave.');
      return { profile: p, notes: notes };
    }
    var rate = (12.5 + 0.25 * (Math.min(100, repl) - 50)) / 100;
    var amt = wages * rate;
    p.otherCredits = (p.otherCredits || 0) + amt;
    TSIQ.credit.addBack(p, amt);
    if (first) {
      notes.push(TSIQ.fmt.usd(amt) + ' §45S paid-leave credit applied (' + TSIQ.fmt.pct(rate) + ' of ' +
        TSIQ.fmt.usd(wages) + ' of leave wages; nonrefundable), net of the wage deduction it cancels (§280C(a)).');
      notes.push('The leave-wage figure starts at 2% of staff payroll (about one week per employee) — replace ' +
        'it with the wages actually paid to employees on qualifying leave, up to 12 weeks each. Only ' +
        'employees paid no more than 60% of the highly-compensated threshold count. Leave that is paid ' +
        'by a state program or required by state law does not count — in California, that removes ' +
        'state disability and paid family leave benefits and mandated sick pay.');
    }
    return { profile: p, notes: notes };
  }
});
