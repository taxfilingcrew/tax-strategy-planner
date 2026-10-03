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
      // Current-year tables — strategies read state.tables for indexed amounts.
      var tables = TSIQ.indexTables(TSIQ.TABLES_2026, Math.pow(1 + (inflationRate || 0), y));
      state.tables = tables;
      profile.ptetPaid = 0;
      profile.entityStateTax = 0;
      profile.ownerWages = profile.ownerWages || 0;
      profile.entityW2Wages = profile.entityW2Wages || 0;

      ordered.forEach(function (sel) {
        var out = sel.strategy.apply(profile, sel.params, y, state);
        profile = out.profile;
        (out.notes || []).forEach(function (n) {
          var tagged = '[' + sel.strategy.name + '] ' + n;
          if (allNotes.indexOf(tagged) === -1) allNotes.push(tagged);
        });
      });

      var result = TSIQ.computeYear(profile, state, tables);
      result.yearIndex = y;
      result.taxYear = TSIQ.TABLES_2026.taxYear + y;
      yearResults.push(result);
    }

    var totals = { totalFederal: 0, totalState: 0, totalBurden: 0 };
    yearResults.forEach(function (r) {
      totals.totalFederal += r.totalFederal;
      totals.totalState += r.totalState;
      totals.totalBurden += r.totalBurden;
    });

    return { years: yearResults, totals: totals, notes: allNotes };
  };

  /** Convenience: baseline is a scenario with no strategies. */
  TSIQ.computeBaseline = function (baseProfile, years, growthRate, inflationRate) {
    return TSIQ.computeScenario(baseProfile, [], years, growthRate, inflationRate);
  };
})();
