/* ============================================================================
 * SCENARIO ENGINE — composes strategies over a multi-year projection.
 * A scenario = a list of {strategyId, params}. Strategies are applied in
 * their declared applyOrder, each receiving the profile produced by the
 * previous one. No strategy-specific logic lives here.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

(function () {
  // Income fields that grow with the client's assumed growth rate. Owner and
  // entity W-2 wages grow with the business so the §199A wage limit and the
  // payroll-tax layer keep pace with K-1 income in later years.
  var GROWTH_FIELDS = ['wages', 'ownerWages', 'entityW2Wages', 'scheduleCNet',
    'passthroughK1', 'rentalNet',
    'ltcg', 'qualDiv', 'interest', 'otherIncome',
    'propertyTax', 'mortgageInterest', 'charitable', 'otherItemized'];

  function grownProfile(base, growthRate, yearIndex) {
    var p = Object.assign({}, base);
    var factor = Math.pow(1 + growthRate, yearIndex);
    GROWTH_FIELDS.forEach(function (k) {
      if (typeof p[k] === 'number') p[k] = p[k] * factor;
    });
    // Withholding/estimates are year-to-date payments for the CURRENT year —
    // they don't apply to projection years 2+.
    if (yearIndex > 0) {
      p.fedWithholding = 0; p.fedEstimates = 0;
      p.stateWithholding = 0; p.stateEstimates = 0;
      // A one-off sale happens once: its gain is in year 1 only and is never
      // grown. (Recurring gains belong in `ltcg`, which does grow.)
      p.oneTimeGain = 0;
    }
    return p;
  }

  /**
   * Run one scenario across `years` years.
   * selections: [{ strategy, params }] — strategy is the library object.
   * inflationRate (optional, decimal) indexes brackets, standard deduction,
   * capital-gain breakpoints, the §199A threshold, and the SS wage base for
   * projection years 2+; omitted or 0 = 2026 amounts in every year.
   * Returns { years: [yearResult...], totals: {...}, notes: [...] }.
   */
  TSIQ.computeScenario = function (baseProfile, selections, years, growthRate, inflationRate) {
    var ordered = selections.slice().sort(function (a, b) {
      return a.strategy.applyOrder - b.strategy.applyOrder;
    });
    var state = {};           // multi-year memory shared by engine + strategies
    var allNotes = [];
    var yearResults = [];

    for (var y = 0; y < years; y++) {
      var profile = grownProfile(baseProfile, growthRate, y);
      var baseRentalNet = profile.rentalNet || 0;
      var baseRentalUsable = !!profile.rentalLossesUsable;
      // Context strategies may read: where we are in the projection, how much
      // the client's income has grown, and which strategies already ran this
      // year (so strategies sharing one legal limit can coordinate).
      state.yearIndex = y;
      state.projectionYears = years;
      state.growthFactor = Math.pow(1 + growthRate, y);
      state.applied = {};
      // Current-year tables — strategies read state.tables for indexed amounts.
      var tables = TSIQ.indexTables(TSIQ.TABLES_2026, Math.pow(1 + (inflationRate || 0), y));
      state.tables = tables;
      profile.ptetPaid = 0;
      profile.entityStateTax = 0;
      profile.stateAddBack = 0;
      profile.stateAdj = null;
      profile.planCosts = 0;
      profile.oneTimeGain = profile.oneTimeGain || 0;
      profile.ownerWages = profile.ownerWages || 0;
      profile.entityW2Wages = profile.entityW2Wages || 0;

      ordered.forEach(function (sel) {
        var out = sel.strategy.apply(profile, sel.params, y, state);
        profile = out.profile;
        state.applied[sel.strategy.id] = true;
        (out.notes || []).forEach(function (n) {
          var tagged = '[' + sel.strategy.name + '] ' + n;
          if (allNotes.indexOf(tagged) === -1) allNotes.push(tagged);
        });
      });

      // A strategy that creates or deepens a rental loss only saves tax if the
      // loss is usable. When that rests on the Section 1 checkbox (not on a
      // REPS / short-term-rental strategy in this scenario), say so.
      if (y === 0 && baseRentalUsable && profile.rentalNet < Math.min(0, baseRentalNet)) {
        var passiveNote = '[Passive loss rules] This scenario uses a rental loss of ' +
          TSIQ.fmt.usd(-profile.rentalNet) + ' against other income because "rental losses ' +
          'usable" is checked in Section 1. That is valid only for a real estate professional, ' +
          'a short-term rental the client materially participates in, or a client with other ' +
          'passive income. Otherwise uncheck it — the loss is limited to the $25,000 allowance ' +
          '(phased out above $100,000 of income) and the rest is suspended.';
        if (allNotes.indexOf(passiveNote) === -1) allNotes.push(passiveNote);
      }

      var result = TSIQ.computeYear(profile, state, tables);
      if (y === 0 && result.ptetCreditCarry > 0.5) {
        var ptetNote = '[PTET credit] The entity-level tax exceeds this year\'s personal state tax by ' +
          TSIQ.fmt.usd(result.ptetCreditCarry) + '. The unused credit carries forward (five years ' +
          'in California) but is cash paid now — check that the owner\'s state tax will absorb it, ' +
          'or reduce the amount elected.';
        if (allNotes.indexOf(ptetNote) === -1) allNotes.push(ptetNote);
      }
      result.yearIndex = y;
      result.taxYear = TSIQ.TABLES_2026.taxYear + y;
      yearResults.push(result);
    }

    var totals = { totalFederal: 0, totalState: 0, totalBurden: 0, planCosts: 0 };
    yearResults.forEach(function (r) {
      totals.totalFederal += r.totalFederal;
      totals.totalState += r.totalState;
      totals.totalBurden += r.totalBurden;
      totals.planCosts += r.planCosts;
    });

    return { years: yearResults, totals: totals, notes: allNotes };
  };

  /**
   * What each strategy adds, in applyOrder, on top of the ones before it:
   * first-year savings and savings over the whole projection. A timing
   * strategy (deferral, accelerated depreciation) has a large first-year
   * figure and a small or negative total — the total is the honest number.
   * Returns [{ strategy, firstYear, cumulative, kind }], kind being
   * 'savings' | 'timing' | 'foundation' | 'cost' (a benefit the business pays
   * for) | 'existing' (the value of something the client already has).
   */
  TSIQ.incrementalSavings = function (baseProfile, selections, years, growthRate, inflationRate) {
    var ordered = selections.slice().sort(function (a, b) {
      return a.strategy.applyOrder - b.strategy.applyOrder;
    });
    var base = TSIQ.computeScenario(baseProfile, [], years, growthRate, inflationRate);
    var prevFirst = base.years[0].totalBurden, prevTotal = base.totals.totalBurden;
    var running = [], steps = [];
    ordered.forEach(function (sel) {
      running.push(sel);
      var r = TSIQ.computeScenario(baseProfile, running, years, growthRate, inflationRate);
      var firstYear = prevFirst - r.years[0].totalBurden;
      var cumulative = prevTotal - r.totals.totalBurden;
      var kind = 'savings';
      if (sel.strategy.existingBenefit && cumulative >= 500) kind = 'existing'; // e.g. an NOL the client already has
      else if (firstYear <= -500 && cumulative <= -500) kind = 'cost';   // e.g. a new staff benefit
      else if (firstYear < 500 && cumulative < 500) kind = 'foundation';
      else if (firstYear >= 500 && cumulative < 0.5 * firstYear) kind = 'timing';
      steps.push({ strategy: sel.strategy, firstYear: firstYear, cumulative: cumulative, kind: kind });
      prevFirst = r.years[0].totalBurden; prevTotal = r.totals.totalBurden;
    });
    return steps;
  };

  /** Convenience: baseline is a scenario with no strategies. */
  TSIQ.computeBaseline = function (baseProfile, years, growthRate, inflationRate) {
    return TSIQ.computeScenario(baseProfile, [], years, growthRate, inflationRate);
  };
})();
