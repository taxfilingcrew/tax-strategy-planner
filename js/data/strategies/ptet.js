/* ============================================================================
 * STRATEGY: Pass-Through Entity Tax (PTET) Election
 * State-level entity tax — the SALT cap workaround blessed by Notice 2020-75.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'ptet',
  name: 'Pass-Through Entity Tax (PTET) Election',
  category: 'Entity Structure',
  applyOrder: 20, // runs after S-corp election so it sees entity income

  advisor: {
    summary:
      'The partnership or S corporation elects to pay state income tax at the ' +
      'entity level. The entity deducts that tax against ordinary income under ' +
      '§164 with no SALT cap (the §164(b)(6) cap applies only to individuals), and ' +
      'the owner receives a state credit (or income exclusion) for the tax paid. ' +
      'IRS blessed the structure in Notice 2020-75. Post-OBBBA the individual SALT ' +
      'cap is $40,400 (2026) but phases back toward $10,000 once MAGI exceeds ' +
      '$505,000 — so PTET remains highly valuable for high-income owners.',
    mechanics: [
      'Entity makes the state PTET election (annual in most states; some require ' +
      'elections or estimated payments by specific deadlines — calendar them).',
      'Entity pays state tax on its passthrough income and deducts it as a ' +
      'non-separately-stated expense, reducing federal K-1 ordinary income.',
      'Owner claims the state credit (e.g., CA, NY) or excludes the income ' +
      '(e.g., WI approach) on the personal state return — state mechanics vary.',
      'Federal benefit ≈ PTET paid × owner\'s marginal federal rate, net of any ' +
      'QBI interaction (the deduction also reduces §199A qualified business income).',
      'Interplay with the individual SALT cap: below the OBBBA phase-down range, ' +
      'compare against what the owner could deduct personally; above $600k MAGI ' +
      'the personal cap is back at $10,000 and PTET is nearly always favorable.'
    ],
    authority: [
      { type: 'Admin', cite: 'IRS Notice 2020-75', note: 'IRS will respect entity-level state taxes as deductible by the entity, not subject to the individual SALT cap. Proposed regs promised; still the controlling guidance.' },
      { type: 'IRC', cite: 'IRC §164; §164(b)(6)', note: 'State taxes deductible; the SALT cap (as amended by OBBBA — $40,400 for 2026 with MAGI phase-down) applies to individuals, not entities.' },
      { type: 'IRC', cite: 'IRC §§702, 1366', note: 'Passthrough of entity items — PTET reduces the ordinary income passed through on the K-1.' },
      { type: 'IRC', cite: 'IRC §199A', note: 'PTET reduces QBI; the federal benefit is partially offset for QBI-eligible income (~20% haircut on the deduction\'s value).' },
      { type: 'Admin', cite: 'State PTET statutes (36+ states)', note: 'Election deadlines, rates, credit vs. exclusion mechanics, and estimated payment requirements vary by state — verify the specific state each year.' }
    ],
    requirements: [
      'A partnership or S corporation (sole proprietorships and SMLLCs taxed as sole props do NOT qualify — pair with an S-corp election if needed).',
      'A state with a PTET regime and a timely election (deadlines are strict and vary).',
      'Cash to fund entity-level estimated payments on the state\'s schedule.',
      'All-owner consent where the state requires it (some elections bind every owner).'
    ],
    risks: [
      'Missed election or estimated-payment deadlines can forfeit the year\'s benefit.',
      'Nonresident / multistate owners can face credit mismatches — resident-state credit for the PTET may be limited.',
      'Deduction timing: most regimes are deductible when paid — mind the year-end cash date for cash-basis benefit.',
      'QBI reduction claws back roughly 20% of the deduction\'s value for QBI-eligible income.',
      'Notice 2020-75 regs were never finalized; structure remains respected but monitor guidance.'
    ],
    bestFit: [
      'Owners with MAGI above the OBBBA phase-down (~$505k+) where the personal SALT cap is effectively $10k.',
      'Profitable S corps / partnerships in higher-tax states (CA, NY, NJ, MN, etc.).',
      'Owners already itemizing whose SALT is capped even at $40,400.'
    ],
    implementation: [
      'Confirm the state\'s PTET regime, rate, and election deadline.',
      'Model the federal benefit net of the QBI interaction (this tool does that).',
      'Make the election and schedule entity-level estimated payments.',
      'Pay before year-end for cash-basis entities.',
      'Report the deduction on the entity return; claim the owner credit on the personal state return.'
    ]
  },

  client: {
    teaser: 'Restores a deduction Congress capped — through a door most filers never use',
    headline: 'Restore the state-tax deduction Congress capped',
    plainEnglish: [
      'Since 2018, there has been a cap on how much state income tax you can deduct on your federal return ($40,400 for 2026, shrinking for incomes over $505,000). For business owners whose state and property taxes exceed the cap — or who take the standard deduction — part of that deduction is simply lost.',
      'Here is the good news: the cap applies to people, not to businesses. If your business elects to pay your state income tax at the company level, the business deducts every dollar of it — no cap — and the state gives you credit so you are not taxed twice.',
      'The IRS has formally approved this approach. It is not a loophole; most states created these programs specifically so their business owners could keep the full deduction.'
    ],
    analogy: 'Same tax bill to the state, but routed through a door where the federal deduction is unlimited instead of capped.',
    benefits: [
      'Deduct 100% of the state tax on your business income — no federal cap',
      'You pay the state the same amount you already owe; only the federal bill shrinks',
      'IRS-approved structure used by business owners in 36+ states',
      'Savings repeat every single year the election is in place'
    ],
    steps: [
      'We confirm your state\'s program and the election deadline',
      'Your business files a simple annual election',
      'The business pays the state tax it would normally pass to you',
      'We claim your credit on your personal state return — no double tax'
    ],
    considerations: [
      'Deadlines matter — some states require the election or a payment early in the year, so we calendar this together.',
      'The business needs to have the cash on hand to make the state payments on schedule.'
    ]
  },

  inputs: [
    // defaultFrom: the app pre-fills this from the client's state rate in
    // Section 1 when the strategy is checked (until the advisor edits it).
    { key: 'ptetRatePct', label: 'State PTET rate (%) — California elective tax is 9.3; otherwise starts at the client\'s state rate', type: 'percent', default: 9.3,
      defaultFrom: function (profile) {
        return profile.caRules ? 9.3 : Math.round((profile.stateRate || 0) * 10000) / 100;
      } }
  ],

  suggest: function (p) {
    if (!(p.passthroughK1 > 0 && p.stateRate > 0)) return null;
    // PTET helps only where the owner's own state-tax deduction is capped or
    // unused: a non-itemizer, or state + property tax above the SALT cap.
    // An itemizer under the cap just swaps one deduction for another and
    // loses part of it through the QBI haircut.
    var salt = TSIQ.TABLES_2026.salt;
    var fs = p.filingStatus || 'mfj';
    var statePaid = (p.stateRate || 0) * ((p.wages || 0) + (p.ownerWages || 0) + (p.passthroughK1 || 0) + (p.scheduleCNet || 0)) + (p.propertyTax || 0);
    var itemizes = statePaid + (p.mortgageInterest || 0) + (p.charitable || 0) + (p.otherItemized || 0) >
      TSIQ.TABLES_2026.standardDeduction[fs];
    if (itemizes && statePaid <= salt.cap[fs]) return null;
    return { reason: TSIQ.fmt.usd(p.passthroughK1) + ' of pass-through income, and the owner\'s own state-tax deduction is ' +
        (itemizes ? 'over the SALT cap' : 'unused (standard deduction)') + ' — the entity-level deduction recovers it.',
      params: { ptetRatePct: p.caRules ? 9.3 : Math.round(p.stateRate * 10000) / 100 } };
  },

  appliesTo: function (profile) {
    return true; // validated in apply(): needs passthrough entity income
  },

  /**
   * Reduces federal passthrough income by the entity-level tax paid, and
   * credits that tax against the personal state liability (the engine treats
   * profile.ptetPaid as a credit and includes it in total state burden, so
   * total state tax stays ~flat while federal income drops).
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    if (p.passthroughK1 <= 0) {
      notes.push('No pass-through entity income found — PTET requires a partnership ' +
        'or S corporation. Pair with the S-Corp Election strategy, or enter K-1 income.');
      return { profile: p, notes: notes };
    }
    // No rate supplied → California's 9.3% under California rules, otherwise
    // the client's own state rate.
    var rate = (params.ptetRatePct !== undefined
      ? params.ptetRatePct : (p.caRules ? 9.3 : (p.stateRate || 0) * 100)) / 100;
    var ptet = p.passthroughK1 * rate;
    p.passthroughK1 = p.passthroughK1 - ptet;
    p.ptetPaid = (p.ptetPaid || 0) + ptet;
    if (yearIndex === 0) {
      notes.push('Entity pays ' + TSIQ.fmt.usd(ptet) + ' of state tax, fully deductible ' +
        'federally (Notice 2020-75); owner receives an equal state credit.');
      notes.push('Federal benefit shown is net of the §199A interaction (PTET also reduces QBI).');
      notes.push('State tax is unchanged: the state does not allow a deduction for its own tax, ' +
        'so the benefit is federal only. The election pays off when the owner\'s own state-tax ' +
        'deduction is capped or unused; an owner who itemizes under the $40,400 SALT cap can ' +
        'come out slightly behind.');
      if (p.caRules) {
        notes.push('California: 9.3% of qualified net income; each owner consents separately; ' +
          'elected on a timely original return. Prepay by June 15 the greater of $1,000 or 50% ' +
          'of the prior-year tax — for 2026–2030 a short or missed prepayment no longer voids ' +
          'the election but trims the credit by 12.5% of the shortfall. The credit is ' +
          'nonrefundable with a 5-year carryover.');
      }
    }
    return { profile: p, notes: notes };
  }
});
