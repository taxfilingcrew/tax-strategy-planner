/* ============================================================================
 * 2026 FEDERAL TAX TABLES — single source of truth for all tax constants.
 * Source: Rev. Proc. 2025-32 (released Oct 2025), as amended by the One Big
 * Beautiful Bill Act (OBBBA, P.L. 119-21, July 4, 2025).
 * Verified against IRS.gov and Tax Foundation, July 2026.
 * The tax engine reads ONLY from this file. No tax constants elsewhere.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

TSIQ.TABLES_2026 = {
  taxYear: 2026,

  // Ordinary income brackets: [lowerBound, rate]. Upper bound = next lower bound.
  brackets: {
    single: [
      [0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24],
      [201775, 0.32], [256225, 0.35], [640600, 0.37]
    ],
    mfj: [
      [0, 0.10], [24800, 0.12], [100800, 0.22], [211400, 0.24],
      [403550, 0.32], [512450, 0.35], [768700, 0.37]
    ],
    mfs: [
      [0, 0.10], [12400, 0.12], [50400, 0.22], [105700, 0.24],
      [201775, 0.32], [256225, 0.35], [384350, 0.37]
    ],
    hoh: [
      [0, 0.10], [17700, 0.12], [67450, 0.22], [105700, 0.24],
      [201750, 0.32], [256200, 0.35], [640600, 0.37]
    ]
  },

  standardDeduction: { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 },

  // Long-term capital gains / qualified dividends breakpoints (0% up to first
  // number, 15% up to second, 20% above). Applied to taxable income stacking.
  ltcgBreakpoints: {
    single: [49450, 545500],
    mfj:    [98900, 613700],
    mfs:    [49450, 306850],
    hoh:    [66200, 579600]
  },

  // §199A Qualified Business Income deduction (made permanent by OBBBA).
  qbi: {
    rate: 0.20,
    // Taxable-income threshold where W-2 wage limit / SSTB phase-out begins.
    // Rev. Proc. 2025-32 §4.26: $403,500 MFJ / $201,775 MFS / $201,750 all others.
    threshold: { single: 201750, mfj: 403500, mfs: 201775, hoh: 201750 },
    // OBBBA widened the phase-in range starting 2026: $75k single / $150k joint.
    phaseInRange: { single: 75000, mfj: 150000, mfs: 75000, hoh: 75000 },
    // §199A(i) (OBBBA, 2026+): minimum $400 deduction when aggregate QBI from
    // active (materially participating) trades or businesses is at least $1,000.
    minimumDeduction: 400,
    minimumActiveQbi: 1000
  },

  // Self-employment tax (§1401) and payroll taxes.
  fica: {
    ssWageBase: 184500,        // 2026 Social Security wage base (SSA)
    ssRate: 0.124,             // combined employer+employee (or SE)
    medicareRate: 0.029,       // combined
    seNetEarningsFactor: 0.9235,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: { single: 200000, mfj: 250000, mfs: 125000, hoh: 200000 }
  },

  // Child Tax Credit (§24, as amended by OBBBA): $2,200 per qualifying child
  // (under 17) for 2026, $500 other-dependent credit. Phase-out: $50 per
  // $1,000 (or fraction) of MAGI over the threshold. Refundable portion
  // ($1,700 ACTC) not modeled in v1 — credit applied as nonrefundable.
  ctc: {
    perChild: 2200,
    perOtherDependent: 500,
    phaseOutThreshold: { single: 200000, mfj: 400000, mfs: 200000, hoh: 200000 },
    phaseOutPer1000: 50
  },

  // 3.8% Net Investment Income Tax (§1411). Thresholds are not inflation-indexed.
  niit: {
    rate: 0.038,
    magiThreshold: { single: 200000, mfj: 250000, mfs: 125000, hoh: 200000 }
  },

  // SALT cap under OBBBA for 2026: $40,400 cap ($20,200 MFS), phased down by
  // 30% of MAGI over $505,000 ($252,500 MFS), but never below the $10,000 floor.
  salt: {
    cap: { single: 40400, mfj: 40400, mfs: 20200, hoh: 40400 },
    floor: { single: 10000, mfj: 10000, mfs: 5000, hoh: 10000 },
    phaseDownStart: { single: 505000, mfj: 505000, mfs: 252500, hoh: 505000 },
    phaseDownRate: 0.30
  },

  // Charitable contributions (§170(b)(1)(I), OBBBA, tax years beginning after
  // 12/31/2025): itemized charitable deductions are allowed only to the extent
  // they exceed 0.5% of the contribution base (AGI).
  // Non-itemizers (§170(p), OBBBA, 2026+): up to $1,000 ($2,000 joint) of cash
  // gifts to public charities is deductible on top of the standard deduction.
  // Gifts to donor-advised funds do not qualify.
  charitable: {
    itemizedFloorRate: 0.005,
    nonItemizerLimit: { single: 1000, mfj: 2000, mfs: 1000, hoh: 1000 }
  },

  // §68 as rewritten by OBBBA (2026+): itemized deductions are reduced by 2/37
  // of the lesser of (a) itemized deductions or (b) taxable income, before the
  // reduction and increased by itemized deductions, above the 37% bracket
  // threshold. Net effect: a 37%-bracket filer's deductions are worth 35%.
  itemizedLimitRate: 2 / 37,

  // §469(i): up to $25,000 of rental real estate loss is allowed against other
  // income with active participation, phased out at 50% of modified AGI over
  // $100,000 (gone at $150,000). Not available to most married-separate filers.
  // Statutory amounts — not indexed.
  passive: { rentalAllowance: 25000, phaseOutStart: 100000, phaseOutRate: 0.5 },

  // California rules used when "Apply California rules" is on in Section 1.
  // California does not follow federal bonus depreciation, caps §179 at
  // $25,000, does not recognize HSAs, QSBS, opportunity zones or the real
  // estate professional exception, and keeps the dependent-care exclusion at
  // $5,000. Entity taxes: C corporation 8.84%; S corporation 1.5%; $800
  // minimum franchise tax for either. Elective pass-through entity tax 9.3%.
  california: {
    sec179Limit: 25000,
    corpRate: 0.0884,
    sCorpRate: 0.015,
    minimumFranchiseTax: 800,
    ptetRate: 0.093,
    dcfsaLimit: 5000
  },

  // Bonus depreciation: OBBBA restored permanent 100% bonus for qualified
  // property acquired and placed in service after Jan 19, 2025 (§168(k)).
  bonusDepreciationRate: 1.00,

  // Residential rental real property recovery period (§168(c)) — used to model
  // the straight-line baseline a cost segregation study accelerates against.
  residentialRentalRecoveryYears: 27.5,
  commercialRecoveryYears: 39,
  qipRecoveryYears: 15,            // qualified improvement property, §168(e)(6)

  // AMT exemptions (2026) — engine does not compute AMT in v1; kept here so the
  // data file is complete when AMT support is added.
  amtExemption: { single: 90100, mfj: 140200, mfs: 70100, hoh: 90100 },

  // Flat corporate rate (§11, TCJA permanent).
  corporateRate: 0.21,

  // ---- 2026 limits used by strategy library entries. Verified July 2026. ----
  limits: {
    // Notice 2025-67 (retirement plan COLAs for 2026)
    retirement: {
      electiveDeferral401k: 24500,       // §402(g)
      catchUp50: 8000,                   // age 50+ (must be Roth if prior-yr FICA wages > $150k)
      catchUp60to63: 11250,              // SECURE 2.0 enhanced catch-up
      dcAnnualAdditions: 72000,          // §415(c) — also the SEP cap
      dbAnnualBenefit: 290000,           // §415(b) defined benefit limit
      compensationLimit: 360000,         // §401(a)(17)
      simpleDeferral: 17000,
      simpleCatchUp50: 4000,
      simpleDeferralSmallEmployer: 18100,   // 25 or fewer employees (SECURE 2.0 §117)
      simpleCatchUp50SmallEmployer: 3850,
      simpleCatchUp60to63: 5250,
      // Catch-up must be Roth (no deduction) when prior-year FICA wages from the
      // plan sponsor exceeded this amount (§414(v)(7); self-employed, SEP and
      // SIMPLE IRA participants are not affected).
      rothCatchUpWageThreshold: 150000,
      // Rough planning ceiling for a defined benefit contribution: the §415(b)
      // benefit is the lesser of $290,000 or 100% of 3-year average pay, worth
      // about 12.8 times that amount as a lump sum at 62, earned over at least
      // 10 years of participation. An actuary sets the real number.
      dbFundingMultiple: 1.28,
      iraLimit: 7500,
      iraCatchUp: 1100
    },
    // Rev. Proc. 2025-19 (HSA) and related fringe limits
    fringe: {
      hsaSelf: 4400, hsaFamily: 8750, hsaCatchUp55: 1000,
      dcfsaLimit: 7500,                  // §129, raised by OBBBA effective 2026
      educationAssistance: 5250,         // §127 (OBBBA made loan-payment use permanent)
      groupTermLifeExclusion: 50000      // §79
    },
    // Rev. Proc. 2025-32 / OBBBA §70301
    sec179: { max: 2560000, phaseOutStart: 4090000 },
    // 2026 standard business mileage rate — raised midyear. 72.5¢ for miles
    // driven Jan 1–Jun 30 (Notice 2026-10); 76¢ for Jul 1–Dec 31 (Announcement 2026-11).
    // Projection years after 2026 use the latest (Jul–Dec) rate.
    mileageRateBusiness: { janJun: 0.725, julDec: 0.76 },
    kiddieTaxUnearnedThreshold: 2700,    // above this, taxed at parents' rate
    gift: { annualExclusion: 19000, estateExemption: 15000000 }, // OBBBA permanent
    // §1202 QSBS for stock acquired AFTER 7/4/2025 (OBBBA)
    qsbs: {
      grossAssetCap: 75000000,
      perIssuerCap: 15000000,
      exclusionTiers: { yr3: 0.50, yr4: 0.75, yr5plus: 1.00 }
    }
  }
};

TSIQ.FILING_STATUS_LABELS = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  mfs: 'Married Filing Separately',
  hoh: 'Head of Household'
};

/**
 * Inflation-indexed copy of the tables for projection years after 2026.
 * factor = (1 + inflation)^yearIndex. Indexes only amounts the Code adjusts
 * annually: ordinary brackets, standard deduction, capital-gain breakpoints,
 * the §199A threshold, and the Social Security wage base. Everything else
 * (SALT cap, NIIT / Additional Medicare thresholds, CTC, plan limits) stays
 * at 2026 values. Amounts are rounded to the nearest $50, as the IRS does.
 */
TSIQ.indexTables = function (tables, factor) {
  if (!(factor > 0) || factor === 1) return tables;
  var r50 = function (n) { return Math.round(n * factor / 50) * 50; };
  var mapObj = function (o, fn) {
    var out = {};
    Object.keys(o).forEach(function (k) { out[k] = fn(o[k]); });
    return out;
  };
  var t = Object.assign({}, tables);
  t.brackets = mapObj(tables.brackets, function (rows) {
    return rows.map(function (row) { return [r50(row[0]), row[1]]; });
  });
  t.standardDeduction = mapObj(tables.standardDeduction, r50);
  t.ltcgBreakpoints = mapObj(tables.ltcgBreakpoints, function (bp) { return bp.map(r50); });
  t.qbi = Object.assign({}, tables.qbi, { threshold: mapObj(tables.qbi.threshold, r50) });
  t.fica = Object.assign({}, tables.fica, { ssWageBase: r50(tables.fica.ssWageBase) });
  return t;
};

/**
 * State non-conformity hook for strategies. When California rules are on,
 * `amount` of a federal deduction is added back to the state tax base (the
 * state does not allow it). Pass a NEGATIVE amount in later years when the
 * federal give-back should not raise state tax either. No effect when the
 * California setting is off.
 */
TSIQ.stateAddBack = function (p, amount) {
  if (p && p.caRules && amount) p.stateAddBack = (p.stateAddBack || 0) + amount;
  return p;
};

/**
 * State view of one profile field. When California rules are on, `amount` is
 * added to `field` for the STATE computation only — e.g. after a strategy
 * lowers rentalNet by a bonus-depreciation deduction California does not
 * allow, TSIQ.stateAdjust(p, 'rentalNet', +thatAmount) puts it back for the
 * state. The engine then runs the adjusted profile through the same passive
 * loss rules, so a loss that is suspended federally is not double counted.
 * Pass field 'rentalLossesUsable' with false to keep rental losses passive
 * for the state (California has no real estate professional exception).
 */
TSIQ.stateAdjust = function (p, field, amount) {
  if (!p || !p.caRules) return p;
  var adj = Object.assign({}, p.stateAdj || {});
  if (field === 'rentalLossesUsable') adj[field] = amount;
  else if (amount) adj[field] = (adj[field] || 0) + amount;
  p.stateAdj = adj;
  return p;
};

/**
 * Retirement plan coordination. Several strategies share one set of legal
 * limits (§402(g) deferrals, §415(c) annual additions, the 25% employer
 * deduction, the SIMPLE exclusive-plan rule, §404(a)(7) when a pension and a
 * 401(k) sit side by side). Each retirement strategy records what it put in
 * for the year here, so the next one only uses the room that is left.
 */
TSIQ.plan = {
  // Running record for the current projection year (reset each year).
  year: function (state) {
    if (!state) return TSIQ.plan.blank();
    if (!state._plan || state._planYear !== state.yearIndex) {
      state._plan = TSIQ.plan.blank();
      state._planYear = state.yearIndex;
    }
    return state._plan;
  },
  blank: function () {
    return { deferral: 0, catchUp: 0, employer: 0, db: 0, disallowed: 0,
      simple: false, stack: false, names: [] };
  },
  // Total owner contributions already modeled this year.
  total: function (ret) { return ret.deferral + ret.employer + ret.db - ret.disallowed; },

  halfSeTax: function (p, tb) {
    var f = tb.fica;
    var net = Math.max(0, p.scheduleCNet || 0) * f.seNetEarningsFactor;
    var room = Math.max(0, f.ssWageBase - (p.wages || 0) - (p.ownerWages || 0));
    return (Math.min(net, room) * f.ssRate + net * f.medicareRate) / 2;
  },

  /**
   * The owner's plan compensation. route 'se' = Schedule C (earned income =
   * net profit less half of SE tax); route 'w2' = wages from the owner's own
   * corporation. A K-1 share of profit is NOT compensation. When both exist
   * the larger one is used.
   *   comp       — pay counted for percentage limits (W-2 capped at §401(a)(17))
   *   pay        — uncapped pay (the 100%-of-compensation limit)
   *   employerRate — 20% of earned income (self-employed) or 25% of wages
   *   staffPayroll — W-2 payroll other than the owner's
   */
  owner: function (p, state) {
    var tb = (state && state.tables) || TSIQ.TABLES_2026;
    var lim = tb.limits.retirement;
    var seEarned = (p.scheduleCNet || 0) > 0 ? p.scheduleCNet - TSIQ.plan.halfSeTax(p, tb) : 0;
    var w2 = Math.max(0, p.ownerWages || 0);
    var staff = Math.max(0, (p.entityW2Wages || 0) - w2);
    if (seEarned <= 0 && w2 <= 0) return { route: null, comp: 0, pay: 0, employerRate: 0, staffPayroll: staff, lim: lim, tb: tb };
    if (seEarned >= w2) {
      return { route: 'se', comp: Math.min(seEarned, lim.compensationLimit), pay: seEarned,
        employerRate: 0.20, staffPayroll: staff, lim: lim, tb: tb };
    }
    return { route: 'w2', comp: Math.min(w2, lim.compensationLimit), pay: w2,
      employerRate: 0.25, staffPayroll: staff, lim: lim, tb: tb };
  },

  // Employer (profit sharing / SEP) room left: the 25%/20% deduction limit and
  // the §415(c) limit (lesser of $72,000 or 100% of pay), net of what earlier
  // strategies used. Catch-up deferrals do not count against §415(c).
  employerRoom: function (o, ret) {
    var byRate = o.comp * o.employerRate - ret.employer;
    var by415 = Math.min(o.lim.dcAnnualAdditions, o.pay) - (ret.deferral - ret.catchUp) - ret.employer;
    return Math.max(0, Math.min(byRate, by415));
  },

  // Rough yearly ceiling on a defined benefit contribution (see tables).
  dbCeiling: function (o) {
    return o.lim.dbFundingMultiple * Math.min(o.pay, o.lim.dbAnnualBenefit);
  },

  /**
   * §404(a)(7): with a pension and a 401(k)/SEP together (plan not covered by
   * the PBGC — owner-only plans and small professional firms are not), the
   * combined employer deduction is limited to the greater of 25% of pay or
   * the pension funding amount; employer 401(k)/SEP money up to 6% of pay is
   * ignored. Returns the employer amount that is not deductible.
   */
  combinedDisallowed: function (ret, o) {
    if (!(ret.db > 0)) return 0;
    var over6 = Math.max(0, ret.employer - 0.06 * o.comp);
    if (!over6) return 0;
    return Math.max(0, ret.db + over6 - Math.max(0.25 * o.comp, ret.db));
  },

  // Staff contributions: a business deduction and a cash cost of the plan.
  staffCost: function (p, amount) {
    if (!(amount > 0)) return p;
    if ((p.scheduleCNet || 0) > 0) p.scheduleCNet = p.scheduleCNet - amount;
    else p.passthroughK1 = (p.passthroughK1 || 0) - amount;
    p.planCosts = (p.planCosts || 0) + amount;
    return p;
  }
};

/**
 * Family health premiums already deducted this year by an earlier strategy
 * (S-corp owner health insurance, §105 plan). The self-employed health
 * insurance strategy only deducts what is left, so one premium is never
 * counted twice.
 */
TSIQ.health = {
  year: function (state) {
    if (!state) return { covered: 0, sehi: 0 };
    if (!state._health || state._healthYear !== state.yearIndex) {
      state._health = { covered: 0, sehi: 0 }; // sehi = the part taken under §162(l)
      state._healthYear = state.yearIndex;
    }
    return state._health;
  }
};

/**
 * Benefits paid to non-owner staff (ICHRA, QSEHRA, §127 education). These
 * are money the business pays out, so the owner's result depends on what the
 * benefit replaces:
 *   mode 'wages' — it replaces the same amount of taxable pay. The business
 *     deduction is the same either way; the owner's saving is the employer
 *     payroll tax (7.65%) no longer due, which comes back as profit.
 *   mode 'new'  — a new benefit on top of current pay: deducted from business
 *     income and shown as a plan cost.
 * Returns { ficaSaved, cost }.
 */
TSIQ.staffBenefit = {
  payroll: function (p) { return Math.max(0, (p.entityW2Wages || 0) - (p.ownerWages || 0)); },
  apply: function (p, amount, mode, state) {
    var tb = (state && state.tables) || TSIQ.TABLES_2026;
    var useC = (p.scheduleCNet || 0) > 0;
    if (mode === 'new') {
      if (useC) p.scheduleCNet = p.scheduleCNet - amount;
      else p.passthroughK1 = (p.passthroughK1 || 0) - amount;
      p.planCosts = (p.planCosts || 0) + amount;
      return { ficaSaved: 0, cost: amount };
    }
    var fica = amount * (tb.fica.ssRate + tb.fica.medicareRate) / 2;
    if (useC) p.scheduleCNet = p.scheduleCNet + fica;
    else p.passthroughK1 = (p.passthroughK1 || 0) + fica;
    p.otherTaxes = (p.otherTaxes || 0) - fica; // employer payroll tax no longer paid
    return { ficaSaved: fica, cost: 0 };
  },
  modeInput: { key: 'replaces', label: 'This benefit replaces', type: 'select', default: 'wages',
    options: [{ value: 'wages', label: 'The same amount of taxable pay' },
      { value: 'new', label: 'Nothing — a new benefit on top of current pay' }] }
};

/**
 * Business credits. hasBusiness: any business activity in the profile (a
 * business with a loss still counts). addBack: the "no double benefit" rules
 * (§280C, §44(d)(7), §45F(f)) take away the deduction for the credited
 * amount, which raises business income by the credit.
 */
TSIQ.credit = {
  hasBusiness: function (p) {
    return !!((p.scheduleCNet || 0) || (p.passthroughK1 || 0) || (p.ownerWages || 0) > 0 || (p.entityW2Wages || 0) > 0);
  },
  addBack: function (p, amount) {
    if (!(amount > 0)) return p;
    if ((p.scheduleCNet || 0) !== 0 || !(p.passthroughK1 || 0)) p.scheduleCNet = (p.scheduleCNet || 0) + amount;
    else p.passthroughK1 = p.passthroughK1 + amount;
    return p;
  }
};

// Shared formatting helpers — round only at display, never in the engine.
TSIQ.fmt = {
  usd: function (n) {
    var sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
  },
  usd0: function (n) { return TSIQ.fmt.usd(n); },
  pct: function (n, dp) {
    return (n * 100).toFixed(dp === undefined ? 1 : dp) + '%';
  }
};
