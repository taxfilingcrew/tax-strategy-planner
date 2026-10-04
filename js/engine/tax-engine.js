/* ============================================================================
 * TAX ENGINE — computes a single tax year from a profile object.
 * Reads all constants from TSIQ.TABLES_2026. No strategy-specific logic here.
 *
 * Profile shape (the "return data" for one year):
 * {
 *   filingStatus: 'single'|'mfj'|'mfs'|'hoh',
 *   wages,            // outside W-2 wages (jobs other than the client's entity)
 *   ownerWages,       // W-2 wages the client's own entity pays them (S-corp)
 *   scheduleCNet,     // sole proprietorship net profit (SE income)
 *   passthroughK1,    // S-corp / partnership ordinary income (QBI, not SE)
 *   entityW2Wages,    // total W-2 wages the entity pays (for §199A wage limit)
 *   isSSTB,           // specified service trade or business flag
 *   rentalNet,        // Schedule E rental net (after current depreciation)
 *   rentalLossesUsable, // true = RE pro / passive income available (§469)
 *   ltcg, qualDiv, interest, otherIncome,
 *   oneTimeGain,      // capital gain from a one-off sale — year 1 only; the
 *                     // scenario engine does not repeat or grow it
 *   oneTimeGainActive,// true = gain from a business the client actively runs
 *                     // (not net investment income, §1411(c)(4))
 *   spouseWages,      // W-2 wages paid to the spouse by the client's business
 *                     // (income, but not counted against the owner's own
 *                     // Social Security wage base)
 *   propertyTax, mortgageInterest, charitable, otherItemized,
 *   stateRate,        // flat effective state rate, decimal (simplification)
 *   ptetPaid,         // entity-level state tax paid (PTET strategy) — creditable
 *   entityStateTax,   // non-creditable entity-level state tax (e.g., CA 1.5%
 *                     // S-corp franchise tax) — added to the state burden
 *   stateAddBack,     // federal deductions the state does not allow (added to
 *                     // the state tax base; set via TSIQ.stateAddBack)
 *   caRules,          // true = California non-conformity applies
 *   planCosts         // non-tax cash cost of the plan (payroll service,
 *                     // compliance, study fees) — counted in total burden so
 *                     // savings are net of it
 * }
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

(function () {
  var T = function () { return TSIQ.TABLES_2026; };

  function bracketTax(taxable, brackets) {
    var tax = 0;
    for (var i = 0; i < brackets.length; i++) {
      var lower = brackets[i][0];
      var rate = brackets[i][1];
      var upper = (i + 1 < brackets.length) ? brackets[i + 1][0] : Infinity;
      if (taxable <= lower) break;
      tax += (Math.min(taxable, upper) - lower) * rate;
    }
    return tax;
  }

  // Preferential-rate tax on LTCG + qualified dividends, stacked on top of
  // ordinary taxable income against the 0/15/20 breakpoints.
  function prefRateTax(ordinaryTaxable, prefIncome, fs, tb) {
    var bp = tb.ltcgBreakpoints[fs];
    var tax = 0, remaining = prefIncome, stackTop = ordinaryTaxable;
    // 0% band
    var room0 = Math.max(0, bp[0] - stackTop);
    var in0 = Math.min(remaining, room0);
    remaining -= in0; stackTop += in0;
    // 15% band
    var room15 = Math.max(0, bp[1] - Math.max(stackTop, bp[0]));
    var in15 = Math.min(remaining, room15);
    tax += in15 * 0.15; remaining -= in15; stackTop += in15;
    // 20% band
    tax += remaining * 0.20;
    return tax;
  }

  // §199A QBI deduction — simplified but structurally correct:
  // - full 20% below the taxable-income threshold
  // - W-2 wage limit (50% of wages; UBIA prong not modeled) phased in above it
  // - SSTB benefit phased out entirely across the phase-in range
  // - overall cap: 20% of (taxable income before QBI − net capital gain)
  // - §199A(i) minimum: $400 when active QBI is at least $1,000 (2026+).
  //   Material participation is assumed; for an SSTB in the phase-out only the
  //   applicable percentage of its QBI counts toward the $1,000 test.
  function qbiDeduction(p, agi, deduction, seDeduction, tb) {
    var t = tb.qbi, fs = p.filingStatus;
    var qbiIncome = Math.max(0,
      (p.scheduleCNet - seDeduction) + p.passthroughK1 - (p.qbiReduction || 0));
    if (qbiIncome <= 0) return 0;

    var tiBeforeQBI = Math.max(0, agi - deduction);
    var tentative = t.rate * qbiIncome;
    var wageLimit = 0.50 * (p.entityW2Wages || 0);

    var threshold = t.threshold[fs];
    var range = t.phaseInRange[fs];
    var excess = tiBeforeQBI - threshold;
    var applicable;
    var activeQbi = qbiIncome;

    if (excess <= 0) {
      applicable = tentative;
    } else {
      var phasePct = Math.min(1, excess / range);
      if (p.isSSTB) {
        activeQbi = qbiIncome * (1 - phasePct);
        // SSTB: the whole deduction phases out across the range.
        var reducedTentative = tentative * (1 - phasePct);
        var reducedWageLimit = wageLimit * (1 - phasePct);
        applicable = (phasePct >= 1) ? 0
          : Math.min(reducedTentative,
              reducedTentative - (reducedTentative - reducedWageLimit) * phasePct);
        applicable = Math.max(0, applicable);
      } else {
        // Non-SSTB: phase in the wage limitation.
        if (tentative <= wageLimit) {
          applicable = tentative;
        } else {
          applicable = tentative - (tentative - wageLimit) * phasePct;
        }
        applicable = Math.max(0, applicable);
      }
    }
    var netCapGain = Math.max(0, (p.ltcg || 0) + (p.oneTimeGain || 0)) + Math.max(0, (p.qualDiv || 0));
    var overallCap = t.rate * Math.max(0, tiBeforeQBI - netCapGain);
    var allowed = Math.max(0, Math.min(applicable, overallCap));
    if (t.minimumDeduction && activeQbi >= t.minimumActiveQbi) {
      // Greater-of rule; can never exceed taxable income before the deduction.
      allowed = Math.max(allowed, Math.min(t.minimumDeduction, tiBeforeQBI));
    }
    return allowed;
  }

  /**
   * Passive rental loss rules (§469, simplified carryforward) and AGI for a
   * profile `q`. Unless rental losses are flagged usable (real estate
   * professional, short-term rental with material participation, or other
   * passive income), a rental loss is limited to the §469(i) allowance —
   * $25,000, phased out between $100,000 and $150,000 of modified AGI — and
   * the rest is suspended and carried in st[carryKey] until rental income
   * absorbs it. Used once for federal AGI and, with California rules on, once
   * more for the state's view of the same year.
   */
  function incomeAndAgi(q, seDeduction, st, carryKey, fs, tb) {
    var ltcgAll = q.ltcg + q.oneTimeGain;
    var other = q.wages + q.ownerWages + q.spouseWages + q.scheduleCNet + q.passthroughK1 +
      ltcgAll + q.qualDiv + q.interest + q.otherIncome;
    var rentalAllowed = q.rentalNet;
    var suspendedUsed = 0, suspendedAdded = 0, allowanceUsed = 0;
    st[carryKey] = st[carryKey] || 0;
    if (q.rentalNet < 0 && !q.rentalLossesUsable) {
      var pv = tb.passive;
      var magi = other - seDeduction - q.adjustments;
      var allowance = (fs === 'mfs') ? 0
        : Math.max(0, pv.rentalAllowance - pv.phaseOutRate * Math.max(0, magi - pv.phaseOutStart));
      allowanceUsed = Math.min(-q.rentalNet, allowance);
      suspendedAdded = -q.rentalNet - allowanceUsed;
      st[carryKey] += suspendedAdded;
      rentalAllowed = -allowanceUsed;
    } else if (q.rentalNet > 0 && st[carryKey] > 0) {
      suspendedUsed = Math.min(q.rentalNet, st[carryKey]);
      st[carryKey] -= suspendedUsed;
      rentalAllowed = q.rentalNet - suspendedUsed;
    }
    var totalIncome = other + rentalAllowed;
    return {
      rentalAllowed: rentalAllowed, suspendedUsed: suspendedUsed,
      suspendedAdded: suspendedAdded, allowanceUsed: allowanceUsed,
      totalIncome: totalIncome, agi: totalIncome - seDeduction - q.adjustments
    };
  }

  /**
   * Compute one tax year. `state` carries multi-year memory (suspended
   * passive losses) and belongs to the scenario, not the profile.
   * `tables` is optional — the scenario engine passes an inflation-indexed
   * copy for projection years; omitted, the 2026 tables are used.
   * Returns a detailed breakdown object.
   */
  TSIQ.computeYear = function (profile, state, tables) {
    var p = Object.assign({
      wages: 0, ownerWages: 0, scheduleCNet: 0, passthroughK1: 0,
      entityW2Wages: 0, isSSTB: false, rentalNet: 0, rentalLossesUsable: false,
      ltcg: 0, qualDiv: 0, interest: 0, otherIncome: 0,
      oneTimeGain: 0, oneTimeGainActive: false, spouseWages: 0,
      propertyTax: 0, mortgageInterest: 0, charitable: 0, otherItemized: 0,
      charitableToDAF: false,
      stateRate: 0, ptetPaid: 0, entityStateTax: 0, stateAddBack: 0,
      caRules: false, stateAdj: null, planCosts: 0,
      kidsCTC: 0, otherDeps: 0,
      fedWithholding: 0, fedEstimates: 0, stateWithholding: 0, stateEstimates: 0,
      // Generic hooks set by strategies:
      adjustments: 0,    // above-the-line deductions (retirement, SE health, HSA…)
      qbiReduction: 0,   // amounts that also reduce §199A qualified business income
      otherCredits: 0,   // nonrefundable credits other than CTC (R&D, WOTC, 45F…)
      corpTaxPaid: 0,    // entity-level federal tax (C-corp conversion strategy)
      otherTaxes: 0      // additional payroll/other federal taxes strategies create
                         // (e.g., FICA on kids' S-corp wages)
    }, profile);
    state = state || {};
    var tb = tables || T(), fs = p.filingStatus, f = tb.fica;

    // ---- Self-employment tax (§1401/1402), coordinated with W-2 SS wages ----
    var seNetEarnings = Math.max(0, p.scheduleCNet) * f.seNetEarningsFactor;
    var ficaWages = p.wages + p.ownerWages;
    var ssRoomLeft = Math.max(0, f.ssWageBase - ficaWages);
    var seSS = Math.min(seNetEarnings, ssRoomLeft) * f.ssRate;
    var seMedicare = seNetEarnings * f.medicareRate;
    var seTax = seSS + seMedicare;
    var seDeduction = seTax / 2;

    // ---- Payroll tax on owner W-2 wages (both halves — a real cost of the
    // S-corp structure; the employer half is already deducted from entity
    // profit by the strategy, and is also deductible here economically) ----
    var ownerSS = Math.min(p.ownerWages, f.ssWageBase) * f.ssRate;
    var ownerMedicare = p.ownerWages * f.medicareRate;
    var ownerPayrollTax = ownerSS + ownerMedicare;

    // ---- Additional Medicare (0.9% over threshold, wages + SE earnings) ----
    var medicareBase = p.wages + p.ownerWages + p.spouseWages + seNetEarnings;
    var addlMedicare = f.additionalMedicareRate *
      Math.max(0, medicareBase - f.additionalMedicareThreshold[fs]);

    // All long-term gain for the year: recurring gains plus any one-off sale.
    var ltcgAll = p.ltcg + p.oneTimeGain;

    // ---- Passive rental loss rules and AGI (see incomeAndAgi) ----
    var fed = incomeAndAgi(p, seDeduction, state, 'suspendedRentalLoss', fs, tb);
    var rentalAllowed = fed.rentalAllowed;
    var suspendedUsed = fed.suspendedUsed, suspendedAdded = fed.suspendedAdded;
    var rentalAllowanceUsed = fed.allowanceUsed;
    var totalIncome = fed.totalIncome;
    var agi = fed.agi;

    // ---- State tax (flat effective rate — documented simplification).
    // The state base starts from AGI, plus (a) entity-level state tax deducted
    // federally — a state does not allow a deduction for its own income tax,
    // so a PTET election leaves state tax unchanged — and (b) federal
    // deductions the state does not follow (stateAddBack).
    // With California rules on, AGI is recomputed for the state from the
    // profile as the state sees it (stateAdj: no bonus depreciation, no real
    // estate professional exception, and so on), through the same passive-loss
    // rules with its own carryforward. PTET paid at the entity level then
    // credits against the personal liability. ----
    var stateAgi = agi;
    if (p.caRules) {
      var q = Object.assign({}, p);
      var adj = p.stateAdj || {};
      Object.keys(adj).forEach(function (k) {
        if (k === 'rentalLossesUsable') q[k] = adj[k];
        else q[k] = (q[k] || 0) + adj[k];
      });
      stateAgi = incomeAndAgi(q, seDeduction, state, 'suspendedRentalLossState', fs, tb).agi;
    }
    var stateBase = Math.max(0, stateAgi + p.ptetPaid + p.stateAddBack);
    var stateTaxGross = stateBase * p.stateRate;
    // A PTET credit larger than the year's state tax is not lost — it carries
    // forward (California: five years) and is used when liability allows.
    var ptetAvailable = p.ptetPaid + (state.ptetCreditCarry || 0);
    var ptetCreditUsed = Math.min(ptetAvailable, stateTaxGross);
    state.ptetCreditCarry = ptetAvailable - ptetCreditUsed;
    var personalStateTax = stateTaxGross - ptetCreditUsed;

    // ---- Itemized vs standard, with OBBBA SALT cap phase-down ----
    var saltPaid = personalStateTax + p.propertyTax;
    var s = tb.salt;
    var effectiveCap = Math.max(
      s.floor[fs],
      s.cap[fs] - s.phaseDownRate * Math.max(0, agi - s.phaseDownStart[fs])
    );
    var saltDeduction = Math.min(saltPaid, effectiveCap);
    // OBBBA (2026+): itemized charitable giving counts only above 0.5% of AGI.
    var charitableFloor = Math.min(Math.max(0, p.charitable),
      tb.charitable.itemizedFloorRate * Math.max(0, agi));
    var charitableAllowed = Math.max(0, p.charitable) - charitableFloor;
    var itemizedGross = saltDeduction + p.mortgageInterest + charitableAllowed + p.otherItemized;
    // Non-itemizers: standard deduction plus up to $1,000 / $2,000 of cash
    // gifts (§170(p)); gifts to a donor-advised fund do not count.
    var nonItemizerCharitable = p.charitableToDAF ? 0
      : Math.min(Math.max(0, p.charitable), tb.charitable.nonItemizerLimit[fs]);
    var standardDed = tb.standardDeduction[fs] + nonItemizerCharitable;
    // §68 (2026+): 37%-bracket filers lose 2/37 of their itemized deductions.
    var itemizedLimitReduction = 0;
    if (itemizedGross > standardDed) {
      var top = tb.brackets[fs][tb.brackets[fs].length - 1][0];
      var qbiProvisional = qbiDeduction(p, agi, itemizedGross, seDeduction, tb);
      itemizedLimitReduction = tb.itemizedLimitRate *
        Math.min(itemizedGross, Math.max(0, agi - qbiProvisional - top));
    }
    var itemized = itemizedGross - itemizedLimitReduction;
    var deduction = Math.max(standardDed, itemized);
    var usedItemized = itemized > standardDed;
    if (usedItemized) nonItemizerCharitable = 0;

    // ---- QBI, taxable income, income tax ----
    var qbi = qbiDeduction(p, agi, deduction, seDeduction, tb);
    var taxableIncome = Math.max(0, agi - deduction - qbi);
    var prefIncome = Math.min(taxableIncome, Math.max(0, ltcgAll) + Math.max(0, p.qualDiv));
    var ordinaryTaxable = taxableIncome - prefIncome;
    var ordinaryTax = bracketTax(ordinaryTaxable, tb.brackets[fs]);
    var capGainsTax = prefRateTax(ordinaryTaxable, prefIncome, fs, tb);
    var incomeTaxBeforeCredits = ordinaryTax + capGainsTax;

    // ---- Child tax credit / other-dependent credit (§24, OBBBA amounts).
    // Phase-out: $50 per $1,000 (or fraction) of MAGI over the threshold.
    // Applied as nonrefundable (ACTC refundable portion not modeled in v1). ----
    var c = tb.ctc;
    var grossCTC = p.kidsCTC * c.perChild + p.otherDeps * c.perOtherDependent;
    var ctcExcess = Math.max(0, agi - c.phaseOutThreshold[fs]);
    var ctcReduction = Math.ceil(ctcExcess / 1000) * c.phaseOutPer1000;
    var ctcAllowed = Math.min(Math.max(0, grossCTC - ctcReduction), incomeTaxBeforeCredits);
    // Other nonrefundable credits (strategy hook) — applied after CTC. What
    // the year's tax cannot absorb carries forward to later projection years
    // (general business credits carry 20 years, §39).
    var creditsAvailable = p.otherCredits + (state.creditCarryforward || 0);
    var otherCreditsAllowed = Math.max(0,
      Math.min(creditsAvailable, incomeTaxBeforeCredits - ctcAllowed));
    state.creditCarryforward = creditsAvailable - otherCreditsAllowed;
    var incomeTax = incomeTaxBeforeCredits - ctcAllowed - otherCreditsAllowed;

    // ---- NIIT (§1411) — rental treated as passive NII unless losses-usable
    // toggle indicates real estate professional status ----
    // A one-off gain on a business the client actively runs is not NII.
    var niiGains = Math.max(0, p.ltcg + (p.oneTimeGainActive ? 0 : p.oneTimeGain));
    var nii = niiGains + Math.max(0, p.qualDiv) + Math.max(0, p.interest) +
      (p.rentalLossesUsable ? 0 : Math.max(0, rentalAllowed));
    var niit = tb.niit.rate * Math.max(0, Math.min(nii,
      Math.max(0, agi - tb.niit.magiThreshold[fs])));

    var totalFederal = incomeTax + seTax + addlMedicare + niit + ownerPayrollTax +
      p.corpTaxPaid + p.otherTaxes;
    var totalState = personalStateTax + p.ptetPaid + p.entityStateTax;
    // Total burden = tax plus the non-tax cash cost of running the plan, so
    // every savings figure is net of what the plan costs to operate.
    var totalTax = totalFederal + totalState;
    var totalBurden = totalTax + p.planCosts;

    // ---- Payments to date → remaining balance due (current year only;
    // the scenario engine zeroes payments for projection years 2+). ----
    var fedPayments = p.fedWithholding + p.fedEstimates;
    var statePayments = p.stateWithholding + p.stateEstimates;
    var fedBalanceDue = totalFederal - fedPayments;
    var stateBalanceDue = personalStateTax - statePayments;

    return {
      profile: p,
      totalIncome: totalIncome, agi: agi,
      deduction: deduction, usedItemized: usedItemized,
      saltDeduction: saltDeduction, saltEffectiveCap: effectiveCap,
      charitableAllowed: charitableAllowed, charitableFloor: charitableFloor,
      nonItemizerCharitable: nonItemizerCharitable,
      itemizedLimitReduction: itemizedLimitReduction,
      rentalAllowanceUsed: rentalAllowanceUsed,
      creditCarryforward: state.creditCarryforward,
      qbiDeduction: qbi, taxableIncome: taxableIncome,
      ordinaryTax: ordinaryTax, capGainsTax: capGainsTax,
      incomeTaxBeforeCredits: incomeTaxBeforeCredits,
      ctcAllowed: ctcAllowed, otherCreditsAllowed: otherCreditsAllowed,
      corpTaxPaid: p.corpTaxPaid, otherTaxes: p.otherTaxes, incomeTax: incomeTax,
      fedPayments: fedPayments, statePayments: statePayments,
      totalPayments: fedPayments + statePayments,
      fedBalanceDue: fedBalanceDue, stateBalanceDue: stateBalanceDue,
      totalBalanceDue: fedBalanceDue + stateBalanceDue,
      seTax: seTax, ownerPayrollTax: ownerPayrollTax,
      addlMedicare: addlMedicare, niit: niit,
      totalFederal: totalFederal,
      personalStateTax: personalStateTax, ptetPaid: p.ptetPaid,
      entityStateTax: p.entityStateTax,
      ptetCreditCarry: state.ptetCreditCarry,
      stateAgi: stateAgi, stateBase: stateBase, stateAddBack: p.stateAddBack,
      totalState: totalState, totalTax: totalTax, planCosts: p.planCosts,
      totalBurden: totalBurden,
      suspendedRentalLossAdded: suspendedAdded,
      suspendedRentalLossUsed: suspendedUsed,
      suspendedRentalLossBalance: state.suspendedRentalLoss
    };
  };
})();
