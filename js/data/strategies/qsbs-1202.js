/* ============================================================================
 * STRATEGY: QSBS §1202 Exclusion
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'qsbs-1202',
  name: 'QSBS §1202 Exclusion',
  category: 'Income Timing & Character',
  applyOrder: 7,
  modeled: true,

  advisor: {
    summary:
      '§1202 excludes gain on qualified small business stock — C-corporation ' +
      'stock acquired at original issuance while aggregate gross assets are under ' +
      'the ceiling, in an active qualified business. OBBBA (P.L. 119-21) split ' +
      'the regime in two: stock acquired AFTER 7/4/2025 gets tiered exclusion ' +
      '(50% at a 3-year hold, 75% at 4 years, 100% at 5+), a $15M (indexed) or ' +
      '10× basis per-issuer cap, and a $75M gross-asset ceiling; stock acquired ' +
      'BEFORE 7/5/2025 keeps the old rules — a 5-year cliff (no partial tiers), ' +
      '$10M/10× cap, $50M asset ceiling, with 100% exclusion for post-9/27/2010 ' +
      'acquisitions (earlier vintages: 50–75% with the §57(a)(7) AMT preference). ' +
      'For partial-exclusion tiers the taxable portion is 28%-rate gain ' +
      '(§1(h)(4)); the 7% AMT preference applies only to stock acquired before ' +
      '9/28/2010, not to the new OBBBA tiers. The exclusion is per ' +
      'issuer and per taxpayer — gifting shares (§1202(h) tacks holding period ' +
      'and treats donees as original holders) can multiply caps across family ' +
      'members and non-grantor trusts, an aggressive but recognized play.',
    mechanics: [
      'Qualification at issuance: domestic C corp; aggregate gross assets ≤ ' +
      '$75M (post-OBBBA stock; $50M for pre-7/5/2025 stock) at and immediately ' +
      'after issuance; stock acquired at ORIGINAL issuance for money, property, ' +
      'or services (§1202(c)) — secondary purchases never qualify.',
      'Active business requirement: ≥80% of assets used in a qualified trade ' +
      'or business during substantially all the holding period (§1202(e)); ' +
      'excluded fields include health, law, accounting, consulting, financial ' +
      'services, hospitality, and farming (§1202(e)(3)).',
      'Post-OBBBA tiers (stock acquired after 7/4/2025): 50% exclusion at 3 ' +
      'years, 75% at 4, 100% at 5+. Pre-OBBBA stock: nothing before 5 years, ' +
      'then 100% (acquired after 9/27/2010), 75% (after 2/17/2009), or 50% ' +
      '(§1202(a)(1), earlier vintages).',
      'Per-issuer cap: greater of $15M indexed (post-OBBBA; $10M pre-OBBBA) or ' +
      '10× the aggregate adjusted basis of stock sold that year — the 10× arm ' +
      'rewards high-basis contributions (e.g., appreciated IP or asset ' +
      'contributions at incorporation).',
      'Partial tiers (50%/75%): the included portion is taxed as 28%-rate gain ' +
      '(§1(h)(4)) — the effective saving is smaller than the headline tier. ' +
      'The 7% AMT preference (§57(a)(7)) is limited to stock acquired on or ' +
      'before 9/27/2010. Stock acquired after 7/4/2025 cannot reach its first ' +
      'tier before July 2028.',
      'Cap multiplication: each taxpayer gets a separate per-issuer cap; ' +
      'completed gifts to children or non-grantor trusts before sale multiply ' +
      'the caps (§1202(h) preserves qualification and tacks the holding ' +
      'period). Flag as advanced planning — respect step-transaction risk and ' +
      'genuine donative intent.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1202 (as amended by OBBBA, P.L. 119-21)', note: 'Tiered 50%/75%/100% exclusion at 3/4/5-year holds, $15M (indexed)/10× cap, $75M asset ceiling — for stock acquired after 7/4/2025. Pre-7/5/2025 stock keeps prior law.' },
      { type: 'IRC', cite: 'IRC §1202(a)(4)', note: '100% exclusion for pre-OBBBA stock acquired after 9/27/2010 and held 5+ years (no AMT preference on the 100% tier).' },
      { type: 'IRC', cite: 'IRC §1202(b)', note: 'Per-issuer limitation — greater of the dollar cap or 10× aggregate adjusted basis of the stock disposed of during the year.' },
      { type: 'IRC', cite: 'IRC §1202(c), (d), (e)', note: 'Original-issuance requirement; aggregate gross asset ceiling at issuance; 80% active qualified business requirement and excluded service fields.' },
      { type: 'IRC', cite: 'IRC §57(a)(7)', note: '7% of the excluded gain is an AMT preference only for stock acquired on or before 9/27/2010 (as amended by OBBBA) — it does not apply to the post-7/4/2025 50%/75% tiers.' },
      { type: 'IRC', cite: 'IRC §1202(h)', note: 'Transfers by gift or at death: transferee steps into the transferor\'s shoes — holding period tacks and QSBS status carries over (the basis of cap-multiplication planning).' },
      { type: 'IRC', cite: 'IRC §1045', note: 'Rollover of QSBS gain into replacement QSBS within 60 days when the holding period is short of the exclusion tier.' },
      { type: 'IRC', cite: 'IRC §1(h)(4)', note: 'The non-excluded portion of §1202 gain on partial tiers is 28%-rate gain, not regular LTCG.' }
    ],
    requirements: [
      'Original-issuance C-corp stock with contemporaneous documentation: issuance records, a gross-assets balance sheet at issuance, and capitalization history.',
      'The corporation meets the active-business and non-excluded-field tests for substantially all of the holding period.',
      'Holding period met at sale: 3/4/5 years (post-OBBBA stock) or a strict 5 years (pre-OBBBA stock).',
      'Redemption traps avoided: significant redemptions by the issuer around issuance can disqualify the stock (§1202(c)(3)).',
      'Gain, era, and per-issuer cap computed per taxpayer, per issuer, per year.'
    ],
    risks: [
      'Qualification is fact-intensive and tested YEARS before the sale — missing issuance-date evidence of the asset test is the most common failure; build the file at issuance, not at exit.',
      'The excluded-field list (§1202(e)(3)) is broad and litigated at the margins — consulting-adjacent businesses need a hard look.',
      'Partial tiers are not free: the included portion is 28%-rate gain, not 15/20%.',
      'California does not conform to §1202 — the gain is fully taxable for California at ordinary rates.',
      'Cap-stacking via gifts/trusts draws step-transaction and economic-substance scrutiny — complete gifts well before a sale is in sight, with real donative intent.',
      'State nonconformity: several states (notably CA) do not conform to §1202 — the state tax may be the whole bill.',
      'Two regimes now coexist: mixing up a client\'s pre- vs. post-7/5/2025 lots misstates both the tier and the cap.'
    ],
    bestFit: [
      'Founders and early employees of C-corp startups acquired at original issuance under the asset ceiling.',
      'Investors choosing entity form now: the tiered 3-year exclusion materially improves the C-corp calculus for high-growth ventures.',
      'Exits under the per-issuer cap, or families willing to do genuine advance gifting to multiply caps.'
    ],
    implementation: [
      'At issuance: obtain the gross-assets balance sheet, board records, and a QSBS representation letter; calendar the 3/4/5-year tier dates by lot.',
      'Annually: monitor the 80% active-business test and any redemptions.',
      'Before a contemplated exit: verify each lot\'s era (acquired before vs. after 7/5/2025), tier, and per-issuer cap; consider §1045 rollover if the hold is short.',
      'For cap multiplication: complete gifts to family/non-grantor trusts well before any sale process starts; file gift tax returns.',
      'At sale: report the exclusion on Form 8949/Schedule D with the §1202 adjustment code; report the included portion of a partial tier as 28%-rate gain; add the gain back on the California return.'
    ]
  },

  client: {
    teaser: 'Can make millions of dollars of profit on one investment completely tax-free',
    headline: 'The startup stock break: up to 100% tax-free gain',
    plainEnglish: [
      'The tax law has a powerful reward for people who invest early in small American companies: if you got your shares directly from the company when it was still small, and you hold them long enough, an enormous amount of your profit when you sell can be completely free of federal tax.',
      'For newer shares the break phases in over time — hold three years and half the profit is tax-free, four years gets you three-quarters, and five years makes it fully tax-free, up to a cap of $15 million or more per company. Older shares follow an earlier version of the rule that requires the full five years.',
      'The catch is paperwork and patience: the company had to qualify when you got the shares, and proving it later can be hard. We build that proof file early, track your holding-period dates, and time the sale so you land on the best tier.'
    ],
    analogy: 'It\'s like a savings bond that matures in stages — cash it too early and you leave most of the prize on the table; wait for full maturity and the entire gain can be yours tax-free.',
    benefits: [
      'Up to 100% of the profit on qualifying shares free of federal tax',
      'Caps of $15 million or more per company — this is a life-changing exclusion, not a rounding error',
      'Sale timing planned around the 3-, 4-, and 5-year milestones',
      'Advanced options can multiply the cap across family members'
    ],
    steps: [
      'We confirm whether your shares qualify and assemble the proof file',
      'We calendar your holding-period milestones for every block of shares',
      'Before any sale, we model each timing option so you see the tiers in dollars',
      'We handle the specialized tax reporting when you sell'
    ],
    considerations: [
      'The rules are strict about how and when you got the shares — shares bought from another investor never qualify, and the proof must reach back to the day the company issued them.',
      'California does not honor this break, so California tax still applies to the full gain — the projection includes it.',
      'Selling before a milestone forfeits the better tier, so patience is a real part of the strategy.'
    ]
  },

  inputs: [
    { key: 'excludedGain', label: 'QSBS gain eligible for exclusion', type: 'currency', default: 2000000 },
    { key: 'acquisitionEra', label: 'Stock acquisition era', type: 'select', default: 'pre',
      options: [{ value: 'pre', label: 'Acquired before 7/5/2025 (old rules)' }, { value: 'post', label: 'Acquired after 7/4/2025 (OBBBA tiers)' }] },
    { key: 'holdYears', label: 'Years held at sale', type: 'number', default: 5 },
    { key: 'stockBasis', label: 'Basis in the stock (for the 10x-basis cap)', type: 'currency', default: 0 }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs the sale gain in "One-time gain"
  },

  /**
   * Year-1 (2026) sale model. The sale gain must be in the profile's
   * oneTimeGain (Section 1, "One-time gain"); this strategy removes the
   * excluded portion, capped at the gain entered and at the per-issuer cap.
   * Stock acquired BEFORE 7/5/2025: 100% exclusion at a 5-year hold (assumes
   * post-9/27/2010 acquisition), nothing before 5 years; cap is the greater
   * of $10M or 10x basis.
   * Stock acquired AFTER 7/4/2025: the 50/75/100% tiers need a 3/4/5-year
   * hold, so the earliest any exclusion can apply is July 2028. A 2026 sale
   * gets nothing — no exclusion is modeled.
   * California does not conform to §1202: with California rules on, the
   * excluded gain stays in the state tax base.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    if (yearIndex !== 0) return { profile: p, notes: notes };

    var hold = params.holdYears || 0;
    if (params.acquisitionEra === 'post') {
      notes.push('Stock acquired after 7/4/2025 cannot reach its first exclusion tier (50% at a ' +
        '3-year hold) before July 2028. A ' + TSIQ.TABLES_2026.taxYear + ' sale gets no §1202 ' +
        'exclusion — consider a §1045 rollover, or holding to a tier date (3 years 50%, ' +
        '4 years 75%, 5 years 100%; the taxable part of a partial tier is 28%-rate gain). ' +
        'No benefit modeled.');
      return { profile: p, notes: notes };
    }
    if (hold < 5) {
      notes.push('Pre-OBBBA stock held under 5 years — §1202 is a 5-year cliff for this era; ' +
        'no partial tiers apply. No exclusion modeled.');
      return { profile: p, notes: notes };
    }

    var available = Math.max(p.oneTimeGain || 0, 0);
    if (available <= 0) {
      notes.push('No one-time gain found. Enter the stock sale gain in "One-time gain this year" ' +
        'in Section 1 so this strategy can remove the excluded portion. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    var cap = Math.max(10000000, 10 * Math.max(0, params.stockBasis || 0));
    var requested = Math.max(0, params.excludedGain || 0);
    var reduction = Math.min(requested, cap, available);
    p.oneTimeGain = p.oneTimeGain - reduction;
    TSIQ.stateAddBack(p, reduction); // California taxes the gain in full

    notes.push(TSIQ.fmt.usd(reduction) + ' of QSBS gain excluded from federal tax (§1202, 100% at a ' +
      hold + '-year hold).');
    if (requested > cap) {
      notes.push('Exclusion limited to the per-issuer cap of ' + TSIQ.fmt.usd(cap) +
        ' (greater of $10M or 10x basis, §1202(b)); the rest of the gain is taxed normally.');
    }
    if (requested > available && available < Math.min(requested, cap)) {
      notes.push('Exclusion capped at the ' + TSIQ.fmt.usd(available) + ' one-time gain entered in Section 1.');
    }
    notes.push(p.caRules
      ? 'California does not conform to §1202: the full gain is taxed by California and is included in the state figure.'
      : 'State conformity varies — several states (California among them) tax the gain in full. Turn on California rules in Section 1 if that applies.');
    notes.push('Confirm the stock qualifies: original issuance from a domestic C corporation ' +
      '(never an S corporation), gross assets under the cap at issuance, and a qualified ' +
      'active business throughout the holding period.');
    return { profile: p, notes: notes };
  }
});
