/* ============================================================================
 * STRATEGY: §199A Aggregation Election (Reg. §1.199A-4)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'qbi-aggregation',
  name: '§199A Aggregation Election',
  category: 'QBI Optimization',
  applyOrder: 22, // after wage optimization sets entity payroll
  modeled: true,

  advisor: {
    summary:
      'Reg. §1.199A-4 lets a taxpayer aggregate commonly controlled trades or ' +
      'businesses and apply the §199A wage/UBIA limitation to the COMBINED ' +
      'W-2 wages and UBIA. The classic fact pattern: a high-profit, low-payroll ' +
      'entity whose deduction is wage-capped sits beside a sibling entity with ' +
      'substantial payroll but thin margins — separately, the wage-rich entity ' +
      'wastes its limit capacity and the profit-rich entity starves. Aggregated, ' +
      'the sibling\'s W-2 wages support the combined deduction. The election ' +
      'requires 50% common ownership for a majority of the year, the same ' +
      'taxable year, no SSTBs in the group, and two of three integration ' +
      'factors; it must be disclosed annually and is binding going forward.',
    mechanics: [
      'Above the taxable-income threshold ($403,500 MFJ / $201,750 single, 2026, ' +
      'phase-in widened to $75k/$150k by OBBBA), each business standing alone is ' +
      'limited to the greater of 50% of ITS OWN W-2 wages or 25% of wages + 2.5% ' +
      'of ITS OWN UBIA. Aggregation pools wages and UBIA across the group before ' +
      'the limit is applied.',
      'Eligibility (Reg. §1.199A-4(b)(1)): the same person or group owns 50% or ' +
      'more of each business, the ownership exists for a majority of the taxable ' +
      'year including the last day, all businesses use the same taxable year, and ' +
      'none is an SSTB.',
      'Plus two of three integration factors: (1) the businesses provide products, ' +
      'property, or services that are the same or customarily offered together; ' +
      '(2) they share facilities or significant centralized business elements ' +
      '(personnel, accounting, legal, purchasing, HR, IT); (3) they operate in ' +
      'coordination with, or reliance upon, one another (e.g., supply chain ' +
      'interdependence).',
      'Family attribution applies for the 50% test (spouse, children, ' +
      'grandchildren, parents — Reg. §1.199A-4(b)(3)), so sibling entities owned ' +
      'across a married couple can qualify.',
      'The election is made on the return with an annual disclosure statement for ' +
      'each aggregated group (Reg. §1.199A-4(c)); once made it binds all future ' +
      'years — newly created or acquired businesses can be added if they qualify, ' +
      'but a chosen aggregation cannot be cherry-picked apart later.',
      'SSTBs may never be aggregated (with anything); an SSTB owner\'s play is ' +
      'threshold management, not aggregation.'
    ],
    authority: [
      { type: 'Reg', cite: 'Reg. §1.199A-4(b)(1)', note: 'Aggregation requirements: ≥50% common ownership for a majority of the year including the last day, same taxable year, no SSTBs, and at least two of the three integration factors.' },
      { type: 'Reg', cite: 'Reg. §1.199A-4(b)(3)', note: 'Family attribution (spouse, children, grandchildren, parents) for the 50% common-ownership test.' },
      { type: 'Reg', cite: 'Reg. §1.199A-4(c)', note: 'Reporting: annual disclosure statement for each aggregated trade or business; consistency required — the aggregation is binding in subsequent years.' },
      { type: 'IRC', cite: 'IRC §199A(b)(2)(B)', note: 'The wage/UBIA limitation the aggregation is applied against — computed on combined wages and UBIA for the group.' },
      { type: 'Reg', cite: 'Reg. §1.199A-2', note: 'W-2 wages must be properly allocable to QBI of the aggregated group and timely reported on W-2/941 filings.' },
      { type: 'Admin', cite: 'Rev. Proc. 2019-11', note: 'Permitted methods for computing W-2 wages for the limitation.' }
    ],
    requirements: [
      '50% or more common ownership of each aggregated business (with family attribution), for a majority of the year including the last day.',
      'Same taxable year for every business in the group; none may be an SSTB.',
      'Two of three integration factors documented: same/complementary offerings, shared facilities or centralized functions, or operational interdependence.',
      'Annual disclosure statement attached to the return for each group; consistent aggregation every year thereafter.'
    ],
    risks: [
      'The election is effectively irrevocable — a group aggregated in a good year stays aggregated when facts change (e.g., the wage-rich entity is later sold, or a loss entity now drags down group QBI: aggregated losses net against aggregated income).',
      'Failing an eligibility prong on exam (common ownership slipping below 50%, an entity recharacterized as an SSTB) unwinds the aggregation and the wage support with it.',
      'Missed annual disclosure invites the Commissioner to disaggregate.',
      'Aggregating a business that later generates losses reduces group QBI — model both directions before electing.',
      'The two-of-three factors are facts-and-circumstances; thin, undocumented "centralized management" claims are the soft spot on exam.'
    ],
    bestFit: [
      'Owners above the §199A threshold with one wage-limited, profit-rich entity and a commonly controlled sibling with real payroll (management company, operating affiliate, staffing entity).',
      'Vertically integrated groups — real estate with a related management/construction company, product companies with a related distribution entity.',
      'Non-SSTB groups only — any SSTB in the picture disqualifies that entity.'
    ],
    implementation: [
      'Map the ownership of every candidate entity, applying family attribution, and confirm 50%+ common ownership held a majority of the year.',
      'Confirm no candidate is an SSTB and all share a taxable year.',
      'Document two of the three integration factors in a memo (shared services agreements, common payroll/accounting, intercompany contracts).',
      'Model the combined limitation both ways — aggregation is binding, so stress-test future-year scenarios (entity sale, loss years).',
      'Attach the Reg. §1.199A-4(c) disclosure statement to the return in the first year and every year after; calendar it.'
    ]
  },

  client: {
    teaser: 'Your businesses already work together — a one-page election makes them count together at tax time',
    headline: 'Let your businesses combine forces for a bigger deduction',
    plainEnglish: [
      'Owners of profitable businesses get a deduction of up to 20% of business income. But for higher-income owners, each business\'s deduction is capped based on that business\'s own payroll. If one of your companies earns most of the profit while another one carries most of the payroll, the tax law — by default — looks at each in isolation, and the profitable one gets short-changed.',
      'There is an election that fixes this. If your businesses are under common ownership and genuinely operate together — shared staff, shared offices, or one serving the other — we can tell the IRS to treat them as one combined group when the deduction cap is calculated.',
      'The payroll from one company then supports the deduction on the profits of the other. Nothing about how you run the businesses changes; only the math does.'
    ],
    analogy: 'It\'s like a family cell-phone plan: separately, one line has unused data while another keeps hitting its limit. Pooled into one plan, nothing goes to waste.',
    benefits: [
      'A bigger 20% business-income deduction using payroll you already pay',
      'No restructuring — a disclosure statement with your tax return',
      'Repeats automatically every year once elected',
      'No new entities, payroll, or spending required'
    ],
    steps: [
      'We map the ownership and operations of each of your businesses',
      'We confirm the combination qualifies and model the benefit both ways',
      'We attach the election statement to your return',
      'We renew the disclosure each year — you do nothing'
    ],
    considerations: [
      'Once made, the election is permanent — so we model future scenarios (like selling one business or a down year) before committing.',
      'The businesses must genuinely operate together and stay under common ownership; if that changes, the benefit can go away.'
    ]
  },

  inputs: [
    { key: 'aggregatedW2Wages', label: 'W-2 wages paid by the sibling business', type: 'currency', default: 0 },
    { key: 'siblingQbi', label: 'Sibling business\'s own profit (already in Section 1 income)', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs QBI income and non-SSTB status
  },

  /**
   * Aggregation lets a wage-rich business lend its spare W-2 wages to a
   * wage-poor one. Section 1 holds the income of BOTH businesses and the W-2
   * wages of the MAIN business only. The sibling first needs wages equal to
   * 40% of its own profit to support its own 20% deduction; only wages above
   * that are spare, and they help only up to the main business's shortfall
   * (40% of its profit less its own wages). That amount is added to
   * entityW2Wages. The effect appears only above the §199A threshold.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;

    if (p.isSSTB) {
      if (first) {
        notes.push('Profile is flagged SSTB — an SSTB may not be aggregated with any other ' +
          'business (Reg. §1.199A-4(b)(1)). No benefit modeled; consider SSTB Threshold Management instead.');
      }
      return { profile: p, notes: notes };
    }
    var totalQbi = Math.max(0, p.passthroughK1 || 0) + Math.max(0, p.scheduleCNet || 0);
    if (totalQbi <= 0) {
      if (first) notes.push('No positive business income found for the §199A deduction to apply to. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    var w = Math.max(0, params.aggregatedW2Wages || 0);
    if (w <= 0) {
      if (first) notes.push('Nothing entered. Enter the sibling business\'s W-2 wages and its own profit.');
      return { profile: p, notes: notes };
    }
    var g = (state && state.growthFactor) || 1;
    var sibQbi = Math.min(totalQbi, Math.max(0, params.siblingQbi || 0) * g);
    w = w * g;
    var spare = Math.max(0, w - 0.4 * sibQbi);                      // wages the sibling does not need
    var shortfall = Math.max(0, 0.4 * (totalQbi - sibQbi) - (p.entityW2Wages || 0)); // wages the main business lacks
    var added = Math.min(spare, shortfall);
    p.entityW2Wages = (p.entityW2Wages || 0) + added;

    if (first) {
      notes.push(TSIQ.fmt.usd(added) + ' of the sibling\'s W-2 wages counted toward the main business\'s wage ' +
        'limit (Reg. §1.199A-4): the sibling has ' + TSIQ.fmt.usd(spare) + ' of wages beyond what its own ' +
        'deduction needs, and the main business is short ' + TSIQ.fmt.usd(shortfall) + '. The gain is up to ' +
        TSIQ.fmt.usd(added * 0.5) + ' of extra QBI deduction.');
      notes.push('Assumes Section 1 business income covers both businesses and "W-2 wages paid by the ' +
        'business" covers the main business only. If the sibling\'s wages are already in that field, ' +
        'the baseline already reflects aggregation and this strategy adds nothing.');
      notes.push('Benefit appears only when taxable income exceeds the §199A threshold — below it ' +
        'the wage limit does not apply and this election changes nothing.');
    }
    return { profile: p, notes: notes };
  }
});
