/* ============================================================================
 * PITCH DECK RENDERER — the proposal deck shown to a prospect.
 *
 * Built so the fee can be compared with a number that will hold up:
 *   - The headline is PERMANENT savings only, after the client's own costs of
 *     running the plan. Tax that is merely moved between years (timing) and
 *     value the client already owns (an NOL carryforward) are shown on
 *     separate lines and never added to it (TSIQ.valueSummary).
 *   - The investment slide is a year-by-year table: permanent savings, less
 *     plan costs, less the fee, with the break-even year marked
 *     (TSIQ.feeSchedule).
 *   - Assumptions slides list the client data and the inputs behind every
 *     strategy, with a plain statement that the figures are estimates.
 *
 * Each strategy is named. Incremental attribution: strategies are added one
 * at a time in applyOrder (TSIQ.incrementalSavings).
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.render = TSIQ.render || {};

(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };

  var FILING = { single: 'Single', mfj: 'Married filing jointly', mfs: 'Married filing separately', hoh: 'Head of household' };
  // Section 1 entries worth showing a client, in the order they are entered.
  var PROFILE_LINES = [
    ['wages', 'W-2 wages'], ['ownerWages', 'Owner wages from the business'],
    ['scheduleCNet', 'Schedule C profit'], ['passthroughK1', 'K-1 business income'],
    ['entityW2Wages', 'Business W-2 payroll'], ['rentalNet', 'Net rental income'],
    ['ltcg', 'Capital gains each year'], ['oneTimeGain', 'One-time gain this year'],
    ['qualDiv', 'Qualified dividends'], ['interest', 'Interest'], ['otherIncome', 'Other income'],
    ['mortgageInterest', 'Mortgage interest'], ['propertyTax', 'Property tax'],
    ['charitable', 'Charitable giving']
  ];
  var signed = function (n) { return (n < 0 ? '−' : '') + usd(Math.abs(n)); };
  var pct = function (n) { return (Math.round((n || 0) * 1000) / 10) + '%'; };

  function inputText(inp, v) {
    if (v === undefined || v === null) v = inp.default;
    if (inp.type === 'select') {
      var o = (inp.options || []).filter(function (x) { return x.value === v; })[0];
      return o ? o.label : String(v);
    }
    if (inp.type === 'currency') return usd(v);
    if (inp.type === 'percent') return v + '%';
    return String(v);
  }

  // "Label: value · Label: value" for one selected strategy.
  function assumedInputs(sel) {
    var s = sel.strategy;
    if (s.modeled === false) return 'No dollar figure is counted for this one — it shapes how the plan is carried out.';
    if (!s.inputs || !s.inputs.length) return 'No amounts assumed — the result follows from your figures above.';
    return s.inputs.map(function (inp) {
      return esc(inp.label) + ': <strong>' + esc(inputText(inp, (sel.params || {})[inp.key])) + '</strong>';
    }).join(' &nbsp;·&nbsp; ');
  }

  /**
   * data: same shape as clientReport/slideshow, PLUS:
   *   profile     — the base profile (needed to recompute incremental steps)
   *   fees: { planning, annual } — one-time plan fee and annual maintenance fee
   */
  TSIQ.render.pitchDeck = function (data) {
    // Pitch is built on the best scenario (lowest total burden).
    var best = data.scenarios.reduce(function (a, b) {
      return b.result.totals.totalBurden < a.result.totals.totalBurden ? b : a;
    }, data.scenarios[0]);

    var baseYr1 = data.baseline.years[0].totalBurden;
    var taxYear = TSIQ.TABLES_2026.taxYear;

    // What each strategy adds on top of the ones before it, and how much of
    // the total is a permanent saving, a deferral, or already the client's.
    var steps = TSIQ.incrementalSavings(data.profile, best.selections,
      data.years, data.growthRate, data.inflationRate);
    var value = TSIQ.valueSummary(steps, data.years);

    var fees = data.fees || { planning: 0, annual: 0 };
    var schedule = TSIQ.feeSchedule(value, fees);
    var totalFees = schedule.totals.fee;
    var hasOther = value.timing.count > 0 || value.existing.count > 0;

    var slides = '' +
      '<div class="slide center active">' + TSIQ.render.deckLogo() +
      '<div class="eyebrow">' + esc(data.firmName) + '</div>' +
      '<h1>Your Tax Opportunity</h1>' +
      '<p class="sub">Prepared for ' + esc(data.clientName) + ' &middot; Tax Year ' +
      TSIQ.TABLES_2026.taxYear + '</p></div>' +

      '<div class="slide center">' +
      '<div class="eyebrow">Where you stand today</div>' +
      '<div class="big" style="color:#e8756a">' + usd(baseYr1) + '</div>' +
      '<div class="big-label">Projected ' + TSIQ.TABLES_2026.taxYear + ' tax if nothing changes</div>' +
      '<p class="sub" style="margin-top:4vh">Over the next ' + data.years + ' years, that adds up to ' +
      '<strong>' + usd(data.baseline.totals.totalBurden) + '</strong>. It does not have to.</p></div>' +

      '<div class="slide center">' +
      '<div class="eyebrow">Our analysis</div>' +
      '<h2>We identified ' + steps.length + ' specific ' +
      (steps.length === 1 ? 'strategy' : 'strategies') + ' for you</h2>' +
      '<p class="sub">Each one is named on the pages that follow, with what it is worth to you ' +
      'and what that figure assumes.</p></div>';

    steps.forEach(function (step, i) {
      // Advisory/foundation strategies (no meaningful year-one math) get a
      // teaser slide without a dollar figure rather than an awkward "$0".
      var numberBlock;
      if (step.kind === 'savings') {
        numberBlock = '<div class="big">' + usd(step.firstYear) + '</div>' +
          '<div class="big-label">Additional first-year savings</div>' +
          '<p class="sub" style="margin-top:2vh">' + usd(step.cumulative) + ' over ' +
          data.years + ' years</p>';
      } else if (step.kind === 'timing') {
        // Deferral: the year-one figure comes back later. Lead with the net.
        numberBlock = (step.cumulative >= 500
          ? '<div class="big">' + usd(step.cumulative) + '</div>' +
            '<div class="big-label">Net savings over ' + data.years + ' years</div>'
          : '<div class="big" style="font-size:6vh">Timing</div>' +
            '<div class="big-label">Improves cash flow — not a permanent saving</div>') +
          '<p class="sub" style="margin-top:2vh">Moves ' + usd(step.firstYear) +
          ' of tax out of ' + TSIQ.TABLES_2026.taxYear + ' into later years</p>';
      } else if (step.kind === 'existing') {
        // Not created by the plan — e.g. a loss carryforward the client already owns.
        numberBlock = '<div class="big">' + usd(step.cumulative) + '</div>' +
          '<div class="big-label">Value of a carryforward you already have</div>' +
          '<p class="sub" style="margin-top:2vh">Used in the earliest years the law allows — our job is to plan around it</p>';
      } else if (step.kind === 'cost') {
        // A benefit the business pays for (staff health, retirement for the team).
        numberBlock = '<div class="big">' + usd(-step.firstYear) + '</div>' +
          '<div class="big-label">Net cost per year, after tax savings</div>' +
          '<p class="sub" style="margin-top:2vh">An investment in your team — not a tax saving</p>';
      } else {
        numberBlock = '<div class="big" style="font-size:6vh">Foundation</div>' +
          '<div class="big-label">Structural — powers the strategies that follow</div>';
      }
      slides += '<div class="slide center">' +
        '<div class="eyebrow">Strategy #' + (i + 1) + ' &middot; ' + esc(step.strategy.name) + '</div>' + numberBlock +
        (step.strategy.client.teaser
          ? '<p class="sub" style="margin-top:4vh">&ldquo;' + esc(step.strategy.client.teaser) + '&rdquo;</p>'
          : '') +
        '</div>';
    });

    // ---- Totals: permanent savings lead; timing and existing value stand apart.
    var otherRows = function (firstYearView) {
      if (!hasOther) return '';
      var rows = '';
      if (value.timing.count > 0) {
        rows += firstYearView
          ? '<tr><td>Tax moved out of ' + taxYear + ' into later years (timing)</td><td>' + usd(value.timing.firstYear) + '</td></tr>'
          : '<tr><td>Net effect of the timing strategies over ' + data.years + ' years</td><td>' + signed(value.timing.total) + '</td></tr>';
      }
      if (value.existing.count > 0) {
        rows += '<tr><td>Carryforward you already have, used ' + (firstYearView ? 'in ' + taxYear : 'over ' + data.years + ' years') +
          '</td><td>' + usd(firstYearView ? value.existing.firstYear : value.existing.total) + '</td></tr>';
      }
      return '<table class="small-table" style="margin-top:4vh"><thead><tr><th>Shown separately — not counted as savings</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
    };

    slides += '' +
      '<div class="slide center">' +
      '<div class="eyebrow">All together — first year</div>' +
      '<div class="big">' + signed(value.permanent.firstYear) + '</div>' +
      '<div class="big-label">Estimated permanent tax savings in ' + taxYear + '</div>' +
      '<p class="note">After your own costs of running the plan (payroll, filings, staff contributions). Before our fee.</p>' +
      otherRows(true) + '</div>' +

      '<div class="slide center">' +
      '<div class="eyebrow">Over ' + data.years + ' years</div>' +
      '<div class="big">' + signed(value.permanent.total) + '</div>' +
      '<div class="big-label">Estimated permanent savings, after plan costs</div>' +
      (hasOther ? '' : '<p class="sub" style="margin-top:4vh">Money that stays in your business and your ' +
        'investments instead of leaving every April.</p>') +
      otherRows(false) + '</div>';

    // ---- Your investment, year by year (permanent savings only).
    var hasPlanCosts = schedule.totals.planCosts > 0;
    if (totalFees > 0 || hasPlanCosts) {
      var rowsHtml = schedule.rows.map(function (r) {
        var be = schedule.breakEvenYear === r.year && totalFees > 0;
        return '<tr' + (be ? ' class="be"' : '') + '><td>' + (taxYear + r.year - 1) + (be ? ' &nbsp;&#9668; pays for itself' : '') + '</td>' +
          '<td>' + signed(r.savings) + '</td>' +
          (hasPlanCosts ? '<td>' + usd(r.planCosts) + '</td>' : '') +
          '<td>' + usd(r.fee) + '</td>' +
          '<td class="' + (r.net >= 0 ? 'green' : 'red') + '">' + signed(r.net) + '</td>' +
          '<td>' + signed(r.cumulative) + '</td></tr>';
      }).join('');
      var size = Math.min(2.1, 30 / (schedule.rows.length + 4));
      var breakEven = totalFees <= 0 ? ''
        : (schedule.breakEvenYear === 1 ? 'On permanent savings alone, the plan pays for itself in the first year.'
          : (schedule.breakEvenYear ? 'On permanent savings alone, the plan has paid for itself by ' + (taxYear + schedule.breakEvenYear - 1) + '.'
            : 'On permanent savings alone, the plan does not pay for itself within ' + data.years + ' years.'));
      slides += '<div class="slide center">' +
        '<div class="eyebrow">Your investment, year by year</div>' +
        '<table class="small-table" style="font-size:' + size.toFixed(2) + 'vh"><thead><tr><th>Year</th><th>Permanent tax savings</th>' +
        (hasPlanCosts ? '<th>Your plan costs</th>' : '') + '<th>Our fee</th><th>Net to you</th><th>Running total</th></tr></thead>' +
        '<tbody>' + rowsHtml +
        '<tr class="total-row"><td>' + data.years + ' years</td><td>' + signed(schedule.totals.savings) + '</td>' +
        (hasPlanCosts ? '<td>' + usd(schedule.totals.planCosts) + '</td>' : '') +
        '<td>' + usd(schedule.totals.fee) + '</td>' +
        '<td class="' + (schedule.totals.net >= 0 ? 'green' : 'red') + '">' + signed(schedule.totals.net) + '</td><td></td></tr>' +
        '</tbody></table>' +
        '<p class="note">' + breakEven +
        (hasOther ? ' Timing strategies and the carryforward are left out of this table.' : '') + '</p>' +
        '</div>';
    }

    // ---- What these figures assume.
    var p = data.profile || {};
    var entered = PROFILE_LINES.filter(function (l) { return p[l[0]]; })
      .map(function (l) { return l[1] + ' ' + signed(p[l[0]]); }).join(' &nbsp;·&nbsp; ');
    var deps = (p.kidsCTC || 0) + (p.otherDeps || 0);
    slides += '<div class="slide">' +
      '<div class="eyebrow">What these figures assume</div>' +
      '<h2>Estimates, built on your numbers</h2>' +
      '<ul class="assume">' +
      '<li>Filing status: ' + esc(FILING[p.filingStatus] || p.filingStatus || 'not entered') +
        (deps ? ', ' + deps + ' dependent' + (deps > 1 ? 's' : '') : '') + '</li>' +
      '<li>Your ' + taxYear + ' figures as entered: ' + (entered || 'none entered') + '</li>' +
      '<li>State income tax at ' + pct(p.stateRate) + ' of state income' +
        (p.caRules ? ', with California\'s differences from federal law applied' : '') + '</li>' +
      '<li>Income grows ' + pct(data.growthRate) + ' a year; ' + taxYear + ' tax law in every year, brackets indexed ' +
        pct(data.inflationRate) + ' a year</li>' +
      '<li>Each strategy is carried out and documented as described</li>' +
      '</ul>' +
      '<p class="note">These figures are estimates, not a guarantee. They rest on the information you gave us and on ' +
      taxYear + ' tax law, and they will change when your return is prepared from final numbers.</p></div>';

    var ordered = best.selections.slice().sort(function (a, b) { return a.strategy.applyOrder - b.strategy.applyOrder; });
    var PER_SLIDE = 5;
    for (var k = 0; k < ordered.length; k += PER_SLIDE) {
      var chunk = ordered.slice(k, k + PER_SLIDE);
      slides += '<div class="slide">' +
        '<div class="eyebrow">What these figures assume' + (ordered.length > PER_SLIDE ? ' &middot; ' + (k / PER_SLIDE + 1) + ' of ' + Math.ceil(ordered.length / PER_SLIDE) : '') + '</div>' +
        '<table class="small-table assume-table"><thead><tr><th>Strategy</th><th>What we assumed</th></tr></thead><tbody>' +
        chunk.map(function (sel) {
          return '<tr><td>' + esc(sel.strategy.name) + '</td><td>' + assumedInputs(sel) + '</td></tr>';
        }).join('') +
        '</tbody></table>' +
        '<p class="note">Change any of these and the figures change with them. We confirm each one against your records before the plan is final.</p>' +
        '</div>';
    }

    slides += '<div class="slide center">' +
      '<h2>Ready to put the plan in place?</h2>' +
      '<ul style="text-align:left">' +
      '<li>We confirm every assumption on these pages against your records</li>' +
      '<li>We build the complete written tax plan with the law behind it</li>' +
      '<li>We handle the elections, filings, and documentation</li>' +
      '<li>We review the numbers with you every year</li></ul></div>';

    TSIQ.render.openDeck('Tax Savings Proposal — ' + data.clientName, slides);
  };
})();
