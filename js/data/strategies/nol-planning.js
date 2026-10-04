/* ============================================================================
 * STRATEGY: NOL Carryforward Planning (§172)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'nol-planning',
  name: 'NOL Carryforward Planning',
  category: 'Income Timing & Character',
  applyOrder: 4,
  existingBenefit: true, // value of a carryforward the client already has — not plan savings
  modeled: true,

  advisor: {
    summary:
      'Post-2017 net operating losses carry forward indefinitely but cannot be ' +
      'carried back (limited farming exception), and the deduction is capped at ' +
      '80% of taxable income computed without the NOL (§172(a)(2)). Because the ' +
      'carryforward never expires, the planning question is WHEN to absorb it: ' +
      'an NOL burned against 22%-bracket income is worth far less than the same ' +
      'NOL against a 37% year, so income acceleration into an NOL-shielded year ' +
      '(Roth conversions, gain recognition, bonus timing) is often the play. ' +
      'Interaction traps: the NOL deduction does not reduce QBI (the §199A ' +
      'qualified business loss carryover is a separate, parallel mechanism), and ' +
      'the 80% cap means a large NOL year still leaves 20% of income exposed.',
    mechanics: [
      'Post-2017 NOLs: no carryback (except 2-year carryback for farming ' +
      'losses), indefinite carryforward, deduction limited to 80% of taxable ' +
      'income before the NOL (§172(a)(2)); pre-2018 NOLs remain 100%-usable ' +
      'and expire after 20 years — order and track the vintages separately.',
      'The NOL originates after the §461(l) excess business loss gate: the ' +
      'disallowed EBL becomes part of NEXT year\'s NOL, so a big loss year ' +
      'often produces both a current deduction (up to the threshold) and a ' +
      'carryforward.',
      'Rate arbitrage is the core play: hold discretionary income (Roth ' +
      'conversions, asset sales, dividends from a controlled C corp) for NOL ' +
      'years, or conversely avoid wasting NOL absorption on income that would ' +
      'have been taxed at low brackets anyway.',
      'QBI interplay: §172 and §199A run on separate tracks — the NOL ' +
      'deduction does not reduce current-year QBI, but a negative-QBI year ' +
      'creates its own qualified business loss carryforward (§199A(c)(2)) that ' +
      'reduces FUTURE QBI. A loss year quietly damages future QBI deductions ' +
      'even while the NOL shelters ordinary income.',
      'The 80% cap means NOLs cannot zero out a big year — plan estimated ' +
      'payments and AMT-adjacent items on the exposed 20%.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §172(a)(2)', note: 'NOL deduction for post-2017 losses limited to 80% of taxable income computed without regard to the NOL deduction.' },
      { type: 'IRC', cite: 'IRC §172(b)(1)(A)', note: 'No carryback / indefinite carryforward for post-2017 NOLs (farming losses retain a 2-year carryback, §172(b)(1)(B)).' },
      { type: 'IRC', cite: 'IRC §461(l)(2)', note: 'Disallowed excess business loss is treated as an NOL carryover to the following year — the upstream gate that feeds §172.' },
      { type: 'IRC', cite: 'IRC §199A(c)(2)', note: 'Negative QBI carries forward as a separate qualified business loss — the NOL deduction itself does not reduce QBI.' },
      { type: 'Admin', cite: 'IRS Pub. 536', note: 'NOL computation for individuals — the nonbusiness/business income and deduction adjustments in computing the loss.' },
      { type: 'Admin', cite: 'Form 1045, Schedule A / return statement', note: 'NOL computation schedule; carryforward tracked by an attached statement each year.' }
    ],
    requirements: [
      'A computed and documented NOL carryforward — the loss-year return must correctly separate business from nonbusiness income and deductions (Pub. 536 worksheet).',
      'Vintage tracking: pre-2018 NOLs (100% usable, 20-year life) vs. post-2017 NOLs (80% cap, indefinite) applied in the correct order.',
      'A projection of future-year brackets so absorption is aimed at the highest-rate years.',
      'Coordination with §461(l) in the loss year and §199A carryovers in the following years.'
    ],
    risks: [
      'The 80% cap: taxable income cannot be fully zeroed by post-2017 NOLs — clients who spend the "no tax this year" assumption get a surprise on the residual 20%.',
      'Wasting NOL against low-bracket income — absorption at 12–22% when a 32–37% year was coming is a permanent value loss.',
      'Computation errors in the loss year (nonbusiness deduction adjustments) compound silently for years; the IRS can challenge the carryforward in any open year it is used.',
      'The parallel §199A qualified business loss carryover reduces future QBI deductions — the projected benefit of NOL years is often overstated when this is missed.',
      'State conformity varies widely (different caps, carryforward periods, and some states disallow NOLs entirely).'
    ],
    bestFit: [
      'Clients emerging from a loss year (startup ramp, bad year, large bonus depreciation) with a documented carryforward.',
      'Clients with discretionary income timing — Roth conversions, gain harvesting, controlled distributions — to aim at the shielded year.',
      'Multi-entity owners whose loss and income years can be sequenced.'
    ],
    implementation: [
      'Reconstruct and document the carryforward by vintage (pre-2018 vs. post-2017) with the Pub. 536 computation for each loss year.',
      'Project the next 3–5 years in this tool. The NOL is absorbed in the earliest years automatically (§172(b)(2)) — the client cannot pick the year, so plan which income lands in those years.',
      'Accelerate discretionary income into the shielded year (Roth conversion sized to the NOL after the 80% cap; harvest gains; time bonuses).',
      'Attach the NOL statement to each return; recompute the remaining carryforward annually.',
      'Track the separate §199A qualified business loss carryover and reflect it in QBI projections.'
    ]
  },

  client: {
    teaser: 'Uses a past bad year to erase tax on your best years ahead',
    headline: 'Turn a loss year into a tax shield',
    plainEnglish: [
      'If your business ever lost money on paper — from a slow year, a big equipment write-off, or startup costs — the tax law doesn\'t just forget it. That loss becomes a credit-like shield you carry forward, and it can cancel out income in future years.',
      'The catch is that the shield is worth different amounts depending on WHEN you use it. Used against a modest-income year, it erases tax at low rates. Used against a big year, the same shield erases tax at the highest rates — sometimes nearly double the savings from the identical loss.',
      'Our job is to aim it. We track exactly how much shield you have, project your income, and time things — like retirement account conversions or asset sales — so the shield lands on your most expensive income.'
    ],
    analogy: 'It\'s like a stack of gift cards that never expire: spending them on your most expensive purchase gets you the most value, so we save them for exactly that.',
    benefits: [
      'A past loss becomes real dollars saved on future returns',
      'The shield never expires under current law — no pressure to waste it',
      'Big planned income events (conversions, sales) can be sheltered deliberately',
      'We track the running balance so nothing is lost to a filing mistake'
    ],
    steps: [
      'We verify and document exactly how much loss carryforward you have',
      'We project your next several years — the loss is used in the first years it can be, so we plan what income to bring into those years',
      'We time income events into the shielded year when it helps',
      'Each year we file the supporting schedule and update the remaining balance'
    ],
    considerations: [
      'The shield can cancel most, but not all, of a year\'s income — current law leaves about 20% of a big year still taxable, and we plan for that piece.',
      'Using it well means sometimes waiting — spending it on a low-income year wastes much of its value.'
    ]
  },

  inputs: [
    { key: 'nolAvailable', label: 'NOL carryforward available (post-2017 losses)', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true;
  },

  /**
   * The carryforward is absorbed in the earliest year, as §172(b)(2)
   * requires: each year the deduction is the lesser of what is left and 80%
   * of taxable income figured without the NOL and without the QBI deduction
   * (§172(a)(2)); the rest carries to the next projection year. Routed
   * through `adjustments`, so it does not reduce QBI.
   * existingBenefit: the client already owns this deduction. Section 1 has
   * no NOL field, so the baseline does not include it — the figure is the
   * value of the carryforward, shown as such, not a saving the plan creates.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    state = state || {};
    if (yearIndex === 0) state.nolRemaining = Math.max(0, params.nolAvailable || 0);
    var remaining = state.nolRemaining || 0;
    if (yearIndex === 0 && remaining <= 0) {
      notes.push('No NOL entered. Enter the carryforward from the prior-year return (Form 1040 Schedule 1 ' +
        'statement, or the NOL worksheet).');
      return { profile: p, notes: notes };
    }
    if (remaining <= 0) return { profile: p, notes: notes };

    var tb = state.tables || TSIQ.TABLES_2026;
    var probe = TSIQ.computeYear(p, Object.assign({}, state), tb);
    var limit = 0.8 * Math.max(0, probe.taxableIncome + probe.qbiDeduction);
    var used = Math.min(remaining, limit);
    p.adjustments = (p.adjustments || 0) + used;
    state.nolRemaining = remaining - used;

    if (yearIndex === 0) {
      notes.push(TSIQ.fmt.usd(used) + ' of the NOL is absorbed in ' + TSIQ.TABLES_2026.taxYear +
        ' (limit: 80% of taxable income before the NOL = ' + TSIQ.fmt.usd(limit) + ')' +
        (state.nolRemaining > 0 ? '; ' + TSIQ.fmt.usd(state.nolRemaining) + ' carries to later years and is used the same way.' : '.'));
      notes.push('This is the value of a deduction the client already owns, not a saving created by ' +
        'planning — the law requires it to be used in the earliest year (§172(b)(2)); the client ' +
        'cannot hold it for a better year. The planning gain is in what income is moved INTO the ' +
        'years it shelters (Roth conversions, gain harvesting) and in keeping 20% of income from ' +
        'surprising the client. Client slides label this figure as an existing carryforward.');
      notes.push('The NOL deduction does not reduce the §199A QBI base; any separate §199A qualified ' +
        'business loss carryover must be handled in the QBI inputs. Pre-2018 NOLs are not subject ' +
        'to the 80% limit.' + (p.caRules ? ' California computes its own NOL (FTB 3805V) and suspended ' +
        'NOL deductions for 2024–2026 for taxpayers with $1 million or more of income — check the ' +
        'state figure separately.' : ''));
    }
    return { profile: p, notes: notes };
  }
});
