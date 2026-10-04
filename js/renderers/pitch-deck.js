/* ============================================================================
 * PITCH DECK RENDERER — pre-engagement sales deck. Deliberately does NOT
 * reveal which strategies are used: each appears as "Strategy #1", "#2", …
 * with only its non-revealing one-line teaser (strategy.client.teaser) and
 * its incremental savings. Full strategy content is reserved for the client
 * slideshow / PDF after the engagement is signed.
 *
 * Incremental attribution: strategies are added one at a time in applyOrder
 * (TSIQ.incrementalSavings). A recurring saving shows its first-year figure
 * with the projection total beneath it. A timing strategy (deferral,
 * accelerated depreciation) shows its net over the projection, never the
 * year-one deferral as if it were a permanent saving.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.render = TSIQ.render || {};

(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };

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
    var firstYearSavings = baseYr1 - best.result.years[0].totalBurden;
    var cumSavings = data.baseline.totals.totalBurden - best.result.totals.totalBurden;

    // What each strategy adds on top of the ones before it.
    var steps = TSIQ.incrementalSavings(data.profile, best.selections,
      data.years, data.growthRate, data.inflationRate);

    var fees = data.fees || { planning: 0, annual: 0 };
    var totalFees = fees.planning + fees.annual * data.years;
    var netBenefit = cumSavings - totalFees;
    var yr1Cost = fees.planning + fees.annual;
    var roi = yr1Cost > 0 ? (firstYearSavings / yr1Cost) : 0;

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
      '<p class="sub">Each one is established tax law — used correctly, documented properly, ' +
      'and defended by us. Here is what each is worth.</p></div>';

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
        '<div class="eyebrow">Strategy #' + (i + 1) + '</div>' + numberBlock +
        (step.strategy.client.teaser
          ? '<p class="sub" style="margin-top:4vh">&ldquo;' + esc(step.strategy.client.teaser) + '&rdquo;</p>'
          : '') +
        '</div>';
    });

    slides += '' +
      '<div class="slide center">' +
      '<div class="eyebrow">All together — first year</div>' +
      '<div class="big">' + usd(firstYearSavings) + '</div>' +
      '<div class="big-label">Estimated ' + TSIQ.TABLES_2026.taxYear + ' tax savings</div></div>' +

      '<div class="slide center">' +
      '<div class="eyebrow">Over ' + data.years + ' years</div>' +
      '<div class="big">' + usd(cumSavings) + '</div>' +
      '<div class="big-label">Estimated cumulative savings</div>' +
      '<p class="sub" style="margin-top:4vh">Money that compounds in your business and your ' +
      'investments instead of leaving every April.</p></div>';

    if (yr1Cost > 0) {
      slides += '<div class="slide center">' +
        '<div class="eyebrow">Your investment</div>' +
        '<table><tbody>' +
        '<tr><td>Tax plan (one-time)</td><td>' + usd(fees.planning) + '</td></tr>' +
        (fees.annual > 0
          ? '<tr><td>Annual implementation &amp; maintenance</td><td>' + usd(fees.annual) + '/yr</td></tr>'
          : '') +
        '<tr><td>Estimated first-year savings</td><td class="green">' + usd(firstYearSavings) + '</td></tr>' +
        '<tr class="total-row"><td>Estimated ' + data.years + '-year net benefit</td>' +
        '<td class="green">' + usd(netBenefit) + '</td></tr>' +
        '</tbody></table>' +
        (roi >= 1.5
          ? '<p class="sub" style="margin-top:4vh">Roughly a <strong>' + roi.toFixed(1) +
            '&times; return</strong> on your investment in year one alone.</p>'
          : '') +
        '</div>';
    }

    slides += '<div class="slide center">' +
      '<h2>Ready to see the full plan?</h2>' +
      '<ul style="text-align:left">' +
      '<li>Sign the engagement and we reveal every strategy by name</li>' +
      '<li>We build the complete written tax plan with the law behind it</li>' +
      '<li>We handle the elections, filings, and documentation</li>' +
      '<li>We review the numbers with you every year</li></ul></div>';

    TSIQ.render.openDeck('Tax Savings Proposal — ' + data.clientName, slides);
  };
})();
