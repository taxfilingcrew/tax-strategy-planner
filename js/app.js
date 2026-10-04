/* ============================================================================
 * APP — wires the form, the strategy library, the scenario builders, and the
 * results view together. Fully data-driven: iterates TSIQ.STRATEGIES; adding
 * a strategy file requires no changes here.
 * ==========================================================================*/
(function () {
  var esc = function (s) { return TSIQ.esc(s); };
  var usd = function (n) { return TSIQ.fmt.usd(n); };
  var $ = function (id) { return document.getElementById(id); };

  var lastRun = null; // cache of the latest computation for the renderers

  /* ------------------- brand / white-label settings ---------------------- */
  var DEFAULT_BRAND = { name: 'Your Firm', color: '#8a6d3b', logo: '' };

  function loadBrand() {
    try {
      return Object.assign({}, DEFAULT_BRAND, JSON.parse(localStorage.getItem('tsiq-brand') || '{}'));
    } catch (e) { return Object.assign({}, DEFAULT_BRAND); }
  }

  function applyBrand(b) {
    TSIQ.brand = b; // renderers read this for PDFs, decks, handouts
    document.documentElement.style.setProperty('--accent', b.color);
    $('brand-name-display').textContent = b.name;
    document.title = b.name + ' — Tax Strategy Planner';
    var logo = $('brand-logo');
    if (b.logo) { logo.src = b.logo; logo.classList.add('show'); }
    else { logo.removeAttribute('src'); logo.classList.remove('show'); }
    if ($('firmName')) $('firmName').value = b.name;
  }

  function initBrand() {
    applyBrand(loadBrand());
    var pendingLogo = null;

    $('brand-settings-btn').addEventListener('click', function () {
      var b = TSIQ.brand;
      $('brand-name-input').value = b.name;
      $('brand-color-input').value = b.color;
      pendingLogo = b.logo || null;
      var prev = $('brand-logo-preview');
      if (b.logo) { prev.src = b.logo; prev.classList.add('show'); }
      else { prev.removeAttribute('src'); prev.classList.remove('show'); }
      $('brand-modal').classList.add('open');
    });
    $('brand-close').addEventListener('click', function () { $('brand-modal').classList.remove('open'); });
    $('brand-modal').addEventListener('click', function (e) {
      if (e.target === $('brand-modal')) $('brand-modal').classList.remove('open');
    });
    var swatches = document.querySelectorAll('.swatch');
    for (var i = 0; i < swatches.length; i++) {
      swatches[i].addEventListener('click', function (e) {
        $('brand-color-input').value = e.currentTarget.getAttribute('data-color');
      });
    }
    $('brand-logo-input').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        pendingLogo = reader.result;
        var prev = $('brand-logo-preview');
        prev.src = pendingLogo; prev.classList.add('show');
      };
      reader.readAsDataURL(file);
    });
    $('brand-save').addEventListener('click', function () {
      var b = {
        name: $('brand-name-input').value.trim() || DEFAULT_BRAND.name,
        color: $('brand-color-input').value || DEFAULT_BRAND.color,
        logo: pendingLogo || ''
      };
      try { localStorage.setItem('tsiq-brand', JSON.stringify(b)); }
      catch (e) { alert('Logo image is too large to save — try a smaller file (under ~2MB).'); return; }
      applyBrand(b);
      $('brand-modal').classList.remove('open');
    });
    $('brand-reset').addEventListener('click', function () {
      localStorage.removeItem('tsiq-brand');
      pendingLogo = null;
      applyBrand(Object.assign({}, DEFAULT_BRAND));
      $('brand-modal').classList.remove('open');
    });
  }

  /* ------------------------- strategy library UI ------------------------- */
  // Canonical display order; any unlisted category appends at the end.
  var CATEGORY_ORDER = [
    'Entity Structure', 'QBI Optimization', 'Payroll & Family',
    'Retirement', 'Health & Fringe', 'Real Estate & Cost Recovery',
    'Business Expenses', 'Income Timing & Character',
    'Credits & Incentives', 'Succession & Exit'
  ];

  function categories() {
    var out = [];
    TSIQ.STRATEGIES.forEach(function (s) {
      if (out.indexOf(s.category) === -1) out.push(s.category);
    });
    out.sort(function (a, b) {
      var ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return out;
  }

  function card(s) {
    return '<div class="strategy-card" data-id="' + s.id + '" data-search="' +
      esc((s.name + ' ' + s.category + ' ' + s.advisor.summary).toLowerCase()) + '">' +
      '<span class="category-badge">' + esc(s.category) + '</span>' +
      (s.modeled === false ? '<span class="advisory-badge">Advisory</span>' : '') +
      '<h4>' + esc(s.name) + '</h4>' +
      '<p>' + esc(s.advisor.summary.slice(0, 150)) + '&hellip;</p>' +
      '<div class="card-actions">' +
      '<span class="link card-detail">Technical detail &rarr;</span>' +
      '<span class="link card-pdf">Client handout (PDF)</span>' +
      '</div></div>';
  }

  function buildLibrary() {
    var host = $('library-cards');
    host.innerHTML = categories().map(function (cat) {
      var inCat = TSIQ.STRATEGIES.filter(function (s) { return s.category === cat; });
      return '<div class="lib-category" data-cat="' + esc(cat) + '">' +
        '<h3 class="lib-cat-title">' + esc(cat) + ' <span class="count">(' + inCat.length + ')</span></h3>' +
        '<div class="lib-cat-cards">' + inCat.map(card).join('') + '</div></div>';
    }).join('');

    $('library-search').addEventListener('input', function (e) {
      var q = e.target.value.trim().toLowerCase();
      var cards = host.querySelectorAll('.strategy-card');
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.display = (!q || cards[i].getAttribute('data-search').indexOf(q) > -1) ? '' : 'none';
      }
      var groups = host.querySelectorAll('.lib-category');
      for (var g = 0; g < groups.length; g++) {
        var visible = groups[g].querySelectorAll('.strategy-card:not([style*="none"])').length;
        groups[g].style.display = visible ? '' : 'none';
      }
    });

    host.addEventListener('click', function (e) {
      var card = e.target.closest('.strategy-card');
      if (!card) return;
      var strategy = TSIQ.getStrategy(card.getAttribute('data-id'));
      if (e.target.closest('.card-pdf')) {
        TSIQ.render.strategyHandout(strategy, $('firmName').value || TSIQ.brand.name);
        return;
      }
      $('detail-body').innerHTML = TSIQ.render.advisorDetail(strategy);
      $('detail-modal').classList.add('open');
    });
    $('detail-close').addEventListener('click', function () {
      $('detail-modal').classList.remove('open');
    });
    $('detail-modal').addEventListener('click', function (e) {
      if (e.target === $('detail-modal')) $('detail-modal').classList.remove('open');
    });
  }

  /* ------------------------ scenario builders UI ------------------------- */
  function paramInput(scKey, strategy, inp) {
    var id = scKey + '-' + strategy.id + '-' + inp.key;
    var label = '<label for="' + id + '">' + esc(inp.label) + '</label>';
    if (inp.type === 'select') {
      return '<div class="param">' + label + '<select id="' + id + '">' +
        inp.options.map(function (o) {
          return '<option value="' + esc(o.value) + '"' +
            (o.value === inp.default ? ' selected' : '') + '>' + esc(o.label) + '</option>';
        }).join('') + '</select></div>';
    }
    return '<div class="param">' + label +
      '<input id="' + id + '" type="number" step="any" value="' + inp.default + '"' +
      (inp.max !== undefined ? ' max="' + inp.max + '"' : '') + '></div>';
  }

  function buildScenarioPicker(scKey, hostId) {
    $(hostId).innerHTML = categories().map(function (cat) {
      var inCat = TSIQ.STRATEGIES.filter(function (s) { return s.category === cat; });
      return '<details class="pick-category"><summary>' + esc(cat) +
        ' <span class="count">(' + inCat.length + ')</span></summary>' +
        inCat.map(function (s) {
          return '<div class="strategy-pick">' +
            '<label class="pick-label"><input type="checkbox" id="' + scKey + '-' + s.id + '"> ' +
            esc(s.name) +
            (s.modeled === false ? ' <span class="advisory-badge" title="Included in plan documents; does not change scenario math">Advisory</span>' : '') +
            '</label>' +
            '<div class="params" id="' + scKey + '-' + s.id + '-params" style="display:none">' +
            s.inputs.map(function (inp) { return paramInput(scKey, s, inp); }).join('') +
            '</div></div>';
        }).join('') + '</details>';
    }).join('');
    TSIQ.STRATEGIES.forEach(function (s) {
      $(scKey + '-' + s.id).addEventListener('change', function (e) {
        $(scKey + '-' + s.id + '-params').style.display = e.target.checked ? 'grid' : 'none';
        if (e.target.checked) syncProfileDefaults(scKey, s);
      });
      // Once the advisor edits a parameter, profile-driven defaults leave it alone.
      s.inputs.forEach(function (inp) {
        var el = $(scKey + '-' + s.id + '-' + inp.key);
        el.addEventListener('input', function () { el.setAttribute('data-touched', '1'); });
        el.addEventListener('change', function () { el.setAttribute('data-touched', '1'); });
      });
    });
  }

  // Inputs may declare defaultFrom(profile) — a default drawn from the client
  // data in Section 1 (e.g., PTET rate starts at the client's state rate).
  // Applied until the advisor edits the field.
  function syncProfileDefaults(scKey, strategy) {
    var profile = null;
    strategy.inputs.forEach(function (inp) {
      if (typeof inp.defaultFrom !== 'function') return;
      var el = $(scKey + '-' + strategy.id + '-' + inp.key);
      if (el.getAttribute('data-touched')) return;
      profile = profile || readProfile();
      var v = inp.defaultFrom(profile);
      if (v !== undefined && v !== null && (inp.type === 'select' || isFinite(v))) el.value = v;
    });
  }

  // Programmatic check/uncheck (import, suggestions) — keeps the params panel in step.
  function setPick(scKey, id, checked) {
    var box = $(scKey + '-' + id);
    if (!box) return false;
    box.checked = !!checked;
    $(scKey + '-' + id + '-params').style.display = checked ? 'grid' : 'none';
    return true;
  }

  function setParam(scKey, id, key, value) {
    var el = $(scKey + '-' + id + '-' + key);
    if (!el) return;
    el.value = value;
    el.setAttribute('data-touched', '1');
  }

  function readSelections(scKey) {
    var out = [];
    TSIQ.STRATEGIES.forEach(function (s) {
      if (!$(scKey + '-' + s.id).checked) return;
      syncProfileDefaults(scKey, s);
      var params = {};
      s.inputs.forEach(function (inp) {
        var el = $(scKey + '-' + s.id + '-' + inp.key);
        params[inp.key] = (inp.type === 'select') ? el.value : parseFloat(el.value) || 0;
      });
      out.push({ strategy: s, params: params });
    });
    return out;
  }

  /* ----------------------------- profile IO ------------------------------ */
  function num(id) { return parseFloat($(id).value) || 0; }

  function readProfile() {
    return {
      filingStatus: $('filingStatus').value,
      wages: num('wages'),
      scheduleCNet: num('scheduleCNet'),
      passthroughK1: num('passthroughK1'),
      ownerWages: num('ownerWages'),
      // The owner's own salary is part of the entity's W-2 wages for §199A.
      entityW2Wages: Math.max(num('entityW2Wages'), num('ownerWages')),
      isSSTB: $('isSSTB').checked,
      rentalNet: num('rentalNet'),
      rentalLossesUsable: $('rentalLossesUsable').checked,
      ltcg: num('ltcg'), qualDiv: num('qualDiv'),
      oneTimeGain: num('oneTimeGain'),
      oneTimeGainActive: $('oneTimeGainActive').checked,
      caRules: $('caRules').checked,
      interest: num('interest'), otherIncome: num('otherIncome'),
      propertyTax: num('propertyTax'), mortgageInterest: num('mortgageInterest'),
      charitable: num('charitable'), otherItemized: num('otherItemized'),
      kidsCTC: num('kidsCTC'), otherDeps: num('otherDeps'),
      fedWithholding: num('fedWithholding'), fedEstimates: num('fedEstimates'),
      stateWithholding: num('stateWithholding'), stateEstimates: num('stateEstimates'),
      stateRate: num('stateRatePct') / 100
    };
  }

  /* ------------------------------ results -------------------------------- */
  function detailRows(cols) {
    var lines = [
      ['Adjusted gross income', function (r) { return r.agi; }],
      ['Deduction (std/itemized)', function (r) { return -r.deduction; }],
      ['QBI deduction (§199A)', function (r) { return -r.qbiDeduction; }],
      ['Taxable income', function (r) { return r.taxableIncome; }],
      ['Federal income tax (before credits)', function (r) { return r.incomeTaxBeforeCredits; }],
      ['Child tax credit / ODC', function (r) { return -r.ctcAllowed; }],
      ['Other credits (R&D, WOTC, etc.)', function (r) { return -r.otherCreditsAllowed; }],
      ['C-corp tax (entity level)', function (r) { return r.corpTaxPaid; }],
      ['Other payroll taxes and credits given up', function (r) { return r.otherTaxes; }],
      ['SE tax', function (r) { return r.seTax; }],
      ['Payroll tax (owner W-2)', function (r) { return r.ownerPayrollTax; }],
      ['Additional Medicare (0.9%)', function (r) { return r.addlMedicare; }],
      ['NIIT (3.8%)', function (r) { return r.niit; }],
      ['Total federal', function (r) { return r.totalFederal; }],
      ['State tax (personal)', function (r) { return r.personalStateTax; }],
      ['PTET (entity-level state)', function (r) { return r.ptetPaid; }],
      ['State entity tax (S-corp / C-corp franchise)', function (r) { return r.entityStateTax; }],
      ['Cost of running the plan (payroll, filings, fees)', function (r) { return r.planCosts; }]
    ];
    var html = '';
    lines.forEach(function (line) {
      html += '<tr><td>' + esc(line[0]) + '</td>' + cols.map(function (c) {
        return '<td>' + usd(line[1](c.r)) + '</td>';
      }).join('') + '</tr>';
    });
    return html;
  }

  function renderResults(run) {
    var base = run.baseline.years[0];
    var cols = [{ label: 'Baseline', r: base }].concat(run.scenarios.map(function (sc) {
      return { label: sc.label, r: sc.result.years[0] };
    }));

    // Headline KPIs from the best scenario
    var best = run.scenarios.reduce(function (a, b) {
      return b.result.totals.totalBurden < a.result.totals.totalBurden ? b : a;
    }, run.scenarios[0]);
    var yr1Savings = base.totalBurden - best.result.years[0].totalBurden;
    var cumSavings = run.baseline.totals.totalBurden - best.result.totals.totalBurden;

    var yr1Pct = base.totalBurden > 0 ? Math.round(yr1Savings / base.totalBurden * 100) : 0;
    var strategyCount = best.strategies.length;

    // Presentation context line: whose numbers these are
    var html = '<div class="results-context">' +
      '<span class="rc-client">' + esc(run.clientName) + '</span>' +
      '<span class="rc-meta">' + esc(TSIQ.FILING_STATUS_LABELS[run.profile.filingStatus]) +
      ' &middot; ' + strategyCount + (strategyCount === 1 ? ' strategy' : ' strategies') +
      ' &middot; ' + run.years + '-year projection &middot; Tax Year ' + TSIQ.TABLES_2026.taxYear +
      '</span></div>';

    // KPI cards — savings are the hero (count-up animated after render)
    html += '<div class="kpi-row">' +
      '<div class="kpi bad"><div class="kpi-label">Baseline ' + TSIQ.TABLES_2026.taxYear + ' tax</div>' +
      '<div class="kpi-value" data-target="' + Math.round(base.totalBurden) + '">' + usd(base.totalBurden) + '</div></div>' +
      '<div class="kpi"><div class="kpi-label">With plan (' + esc(best.label) + ')</div>' +
      '<div class="kpi-value" data-target="' + Math.round(best.result.years[0].totalBurden) + '">' + usd(best.result.years[0].totalBurden) + '</div></div>' +
      '<div class="kpi good"><div class="kpi-label">First-year savings</div>' +
      '<div class="kpi-value" data-target="' + Math.round(yr1Savings) + '">' + usd(yr1Savings) + '</div>' +
      (yr1Pct > 0 ? '<span class="kpi-chip">&#9660; ' + yr1Pct + '% less tax</span>' : '') + '</div>' +
      '<div class="kpi good"><div class="kpi-label">' + run.years + '-year savings</div>' +
      '<div class="kpi-value" data-target="' + Math.round(cumSavings) + '">' + usd(cumSavings) + '</div></div>' +
      '</div>';

    // Cumulative-burden bar chart — bars animate from 0 (width set post-render)
    var chartRows = [{ label: 'Baseline', total: run.baseline.totals.totalBurden, scenario: false }]
      .concat(run.scenarios.map(function (sc) {
        return { label: sc.label, total: sc.result.totals.totalBurden, scenario: true };
      }));
    var maxTotal = Math.max.apply(null, chartRows.map(function (r) { return r.total; })) || 1;
    var baseCum = run.baseline.totals.totalBurden;
    html += '<h3>' + run.years + '-Year Cumulative Tax</h3><div class="bar-chart">' +
      chartRows.map(function (r) {
        var deltaPct = (r.scenario && baseCum > 0)
          ? Math.round((baseCum - r.total) / baseCum * 100) : 0;
        return '<div class="bar-row' + (r.scenario ? ' scenario' : '') + '">' +
          '<div class="bar-label">' + esc(r.label) + '</div>' +
          '<div class="bar-track"><div class="bar-fill" data-width="' +
          Math.max(2, Math.round(r.total / maxTotal * 100)) + '"></div></div>' +
          '<div class="bar-value">' + usd(r.total) +
          (deltaPct > 0 ? '<span class="bar-delta">&minus;' + deltaPct + '%</span>' : '') +
          '</div></div>';
      }).join('') + '</div>';

    html += '<h3>First-Year Comparison (Tax Year ' + TSIQ.TABLES_2026.taxYear + ')</h3>' +
      '<table class="results-table"><thead><tr><th></th>' +
      cols.map(function (c) { return '<th>' + esc(c.label) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + detailRows(cols) +
      '<tr class="total-row"><td>Total tax and plan costs</td>' + cols.map(function (c) {
        return '<td>' + usd(c.r.totalBurden) + '</td>';
      }).join('') + '</tr>' +
      '<tr class="savings-row"><td>Savings vs. baseline</td>' + cols.map(function (c, i) {
        return '<td>' + (i === 0 ? '—' : usd(base.totalBurden - c.r.totalBurden)) + '</td>';
      }).join('') + '</tr>' +
      '<tr><td>Payments to date (W/H + estimates)</td>' + cols.map(function (c) {
        return '<td>' + usd(-c.r.totalPayments) + '</td>';
      }).join('') + '</tr>' +
      '<tr class="due-row"><td>Estimated remaining balance due</td>' + cols.map(function (c) {
        return '<td>' + usd(c.r.totalBalanceDue) + '</td>';
      }).join('') + '</tr></tbody></table>';

    // multi-year projection
    html += '<h3>' + run.years + '-Year Projection (' + (run.growthRate * 100).toFixed(1) +
      '% annual income growth, ' + ((run.inflationRate || 0) * 100).toFixed(1) +
      '% bracket indexing)</h3>' +
      '<table class="results-table"><thead><tr><th>Year</th><th>Baseline</th>' +
      run.scenarios.map(function (sc) {
        return '<th>' + esc(sc.label) + '</th><th class="sav">Savings</th>';
      }).join('') + '</tr></thead><tbody>';
    var cum = run.scenarios.map(function () { return 0; });
    for (var y = 0; y < run.years; y++) {
      var b = run.baseline.years[y].totalBurden;
      html += '<tr><td>' + run.baseline.years[y].taxYear + '</td><td>' + usd(b) + '</td>';
      run.scenarios.forEach(function (sc, i) {
        var v = sc.result.years[y].totalBurden;
        cum[i] += b - v;
        html += '<td>' + usd(v) + '</td><td class="sav">' + usd(b - v) + '</td>';
      });
      html += '</tr>';
    }
    html += '<tr class="total-row"><td>Cumulative</td><td>' +
      usd(run.baseline.totals.totalBurden) + '</td>';
    run.scenarios.forEach(function (sc, i) {
      html += '<td>' + usd(sc.result.totals.totalBurden) + '</td><td class="sav">' + usd(cum[i]) + '</td>';
    });
    html += '</tr></tbody></table>';

    // planning notes from the strategies + engine
    var allNotes = [];
    run.scenarios.forEach(function (sc) {
      sc.result.notes.forEach(function (n) {
        var tagged = sc.label + ': ' + n;
        if (allNotes.indexOf(tagged) === -1) allNotes.push(tagged);
      });
    });
    if (allNotes.length) {
      html += '<h3>Planning Notes</h3><ul class="notes">' +
        allNotes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
    }
    html += '<p class="fine-print">2026 federal figures per Rev. Proc. 2025-32 as amended by OBBBA. ' +
      'Projection applies 2026 law to all years; brackets, standard deduction, capital-gain ' +
      'breakpoints, the §199A threshold, and the Social Security wage base are indexed at the ' +
      'inflation rate entered in Section 1 (SALT cap held at its 2026 amount). ' +
      'State tax modeled at a flat effective rate' +
      (run.profile.caRules ? ', with California non-conformity applied where a strategy models it' : '') +
      '. Savings are net of plan costs shown above. A one-time gain is taxed in ' +
      TSIQ.TABLES_2026.taxYear + ' only. ' +
      'AMT, recapture on sale, and §461(l) are not modeled — see the README scope notes.</p>';

    $('results').innerHTML = html;
    $('output-actions').style.display = 'flex';
    animateResults();
  }

  // Count-up on KPI values + grow-in on chart bars. Pure presentation —
  // the final numbers are already in the DOM as fallback text.
  function animateResults() {
    var values = document.querySelectorAll('#results .kpi-value[data-target]');
    var start = null, DURATION = 800;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / DURATION);
      var ease = 1 - Math.pow(1 - t, 3);
      for (var i = 0; i < values.length; i++) {
        var target = parseFloat(values[i].getAttribute('data-target'));
        values[i].textContent = TSIQ.fmt.usd(target * ease);
      }
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    var bars = document.querySelectorAll('#results .bar-fill[data-width]');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var i = 0; i < bars.length; i++) {
          bars[i].style.width = bars[i].getAttribute('data-width') + '%';
        }
      });
    });
  }

  function compute() {
    var profile = readProfile();
    var years = Math.max(1, Math.round(num('years'))) || 10;
    var growthRate = num('growthPct') / 100;
    var inflationRate = Math.max(0, num('inflationPct')) / 100;

    var scenarios = [];
    var selA = readSelections('sc2');
    if (selA.length) {
      scenarios.push({
        label: $('sc2-label').value || 'Scenario 2',
        selections: selA,
        strategies: selA.map(function (s) { return s.strategy; }),
        result: TSIQ.computeScenario(profile, selA, years, growthRate, inflationRate)
      });
    }
    var selB = readSelections('sc3');
    if (selB.length) {
      scenarios.push({
        label: $('sc3-label').value || 'Scenario 3',
        selections: selB,
        strategies: selB.map(function (s) { return s.strategy; }),
        result: TSIQ.computeScenario(profile, selB, years, growthRate, inflationRate)
      });
    }
    if (!scenarios.length) {
      alert('Select at least one strategy in Scenario 2.');
      return;
    }

    lastRun = {
      clientName: $('clientName').value || 'Client',
      firmName: $('firmName').value || TSIQ.brand.name,
      profile: profile,
      baseline: TSIQ.computeBaseline(profile, years, growthRate, inflationRate),
      scenarios: scenarios,
      years: years,
      growthRate: growthRate,
      inflationRate: inflationRate
    };
    renderResults(lastRun);
    $('results-section').scrollIntoView({ behavior: 'smooth' });
  }

  /* --------------------- client file import / export --------------------- */
  // Format documented in docs/client-file-format.md (tsiq-client-v1).
  var PROFILE_FIELD_IDS = ['filingStatus', 'wages', 'scheduleCNet', 'passthroughK1',
    'ownerWages', 'entityW2Wages', 'rentalNet', 'ltcg', 'oneTimeGain', 'qualDiv', 'interest', 'otherIncome',
    'propertyTax', 'mortgageInterest', 'charitable', 'otherItemized',
    'kidsCTC', 'otherDeps', 'fedWithholding', 'fedEstimates',
    'stateWithholding', 'stateEstimates', 'stateRatePct', 'years', 'growthPct',
    'inflationPct'];
  var PROFILE_CHECKBOX_IDS = ['isSSTB', 'rentalLossesUsable', 'oneTimeGainActive', 'caRules'];
  var SCENARIO_KEYS = ['sc2', 'sc3'];

  // Scenario picks as plain data: { label, strategies: [{ id, params }] }.
  function scenarioToData(scKey) {
    return {
      label: $(scKey + '-label').value,
      strategies: readSelections(scKey).map(function (sel) {
        return { id: sel.strategy.id, params: sel.params };
      })
    };
  }

  // Restore a saved scenario: clears the picker first, then re-checks the saved
  // strategies with their parameters. Unknown ids (a strategy since removed or
  // renamed) are skipped and reported.
  function applyScenarioData(scKey, sc, skipped) {
    TSIQ.STRATEGIES.forEach(function (s) { setPick(scKey, s.id, false); });
    var details = $(scKey + '-strategies').querySelectorAll('details');
    for (var d = 0; d < details.length; d++) details[d].open = false;
    if (!sc) return;
    if (sc.label) $(scKey + '-label').value = sc.label;
    (sc.strategies || []).forEach(function (item) {
      if (!item || !TSIQ.getStrategy(item.id) || !setPick(scKey, item.id, true)) {
        if (item && item.id) skipped.push(item.id);
        return;
      }
      Object.keys(item.params || {}).forEach(function (k) {
        setParam(scKey, item.id, k, item.params[k]);
      });
      var det = $(scKey + '-' + item.id).closest('details');
      if (det) det.open = true;
    });
  }

  function exportClientFile() {
    var data = { format: 'tsiq-client-v1', clientName: $('clientName').value || 'Client', profile: {} };
    PROFILE_FIELD_IDS.forEach(function (id) {
      var el = $(id);
      data.profile[id] = (el.type === 'number') ? (parseFloat(el.value) || 0) : el.value;
    });
    PROFILE_CHECKBOX_IDS.forEach(function (id) { data.profile[id] = $(id).checked; });
    // Strategy picks and their parameters travel with the client file.
    data.scenarios = {};
    SCENARIO_KEYS.forEach(function (k) { data.scenarios[k] = scenarioToData(k); });
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (data.clientName.replace(/[^a-z0-9 _-]/gi, '') || 'client') + '.tsiq.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function renderSuggestions(suggestions, notes) {
    var host = $('suggestions');
    if ((!suggestions || !suggestions.length) && (!notes || !notes.length)) {
      host.style.display = 'none'; host.innerHTML = ''; return;
    }
    var known = (suggestions || []).filter(function (s) { return TSIQ.getStrategy(s.id); });
    var html = '<div class="suggest-box">';
    if (known.length) {
      html += '<h3>Suggested strategies from the return review</h3>' +
        '<p class="hint">Leads to evaluate — not conclusions. Loading them checks the boxes in Scenario 2 with any suggested parameters; you confirm every one.</p><ul>' +
        known.map(function (s) {
          var st = TSIQ.getStrategy(s.id);
          return '<li><strong>' + esc(st.name) + '</strong>' +
            (st.modeled === false ? ' <span class="advisory-badge">Advisory</span>' : '') +
            (s.reason ? ' — ' + esc(s.reason) : '') + '</li>';
        }).join('') + '</ul>' +
        '<button class="secondary" id="load-suggestions">Load into Scenario 2</button>';
    }
    if (notes && notes.length) {
      html += '<h3 style="margin-top:14px">Review notes</h3><ul>' +
        notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
    }
    host.innerHTML = html + '</div>';
    host.style.display = '';
    if (known.length) {
      $('load-suggestions').addEventListener('click', function () {
        known.forEach(function (s) {
          var box = $('sc2-' + s.id);
          if (!box) return;
          if (!box.checked) box.click();
          Object.keys(s.params || {}).forEach(function (k) {
            setParam('sc2', s.id, k, s.params[k]);
          });
          var det = box.closest('details'); if (det) det.open = true;
        });
        $('sc2-strategies').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function importClientFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try { data = JSON.parse(reader.result); }
      catch (e) { alert('That file is not valid JSON.'); return; }
      if (!data || data.format !== 'tsiq-client-v1') {
        alert('Not a recognized client file (expected format "tsiq-client-v1").'); return;
      }
      if (data.clientName) $('clientName').value = data.clientName;
      var p = data.profile || {};
      // A key the file leaves out goes back to the form's default, so figures
      // from a previously loaded client never carry into this one.
      PROFILE_FIELD_IDS.forEach(function (id) {
        var el = $(id);
        if (p[id] !== undefined) { el.value = p[id]; return; }
        if (el.tagName === 'SELECT') {
          for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].defaultSelected) { el.selectedIndex = i; return; }
          }
          el.selectedIndex = 0;
        } else { el.value = el.defaultValue; }
      });
      PROFILE_CHECKBOX_IDS.forEach(function (id) {
        $(id).checked = (p[id] !== undefined) ? !!p[id] : $(id).defaultChecked;
      });
      // Saved scenarios (files exported since scenarios were added). Older
      // files have no `scenarios` key — the pickers are left as they are.
      if (data.scenarios) {
        var skipped = [];
        SCENARIO_KEYS.forEach(function (k) { applyScenarioData(k, data.scenarios[k], skipped); });
        if (skipped.length) {
          alert('These saved strategies are not in this version of the library and were skipped: ' +
            skipped.join(', '));
        }
      }
      renderSuggestions(data.suggestedStrategies, data.notes);
      window.scrollTo(0, 0);
    };
    reader.readAsText(file);
  }

  /* ---------------------- PDF return import + review --------------------- */
  var PDF_FIELD_LABELS = {
    filingStatus: 'Filing status', wages: 'W-2 wages',
    interest: 'Interest / ordinary dividends', qualDiv: 'Qualified dividends',
    scheduleCNet: 'Schedule C net profit', rentalNet: 'Rental net income / (loss)',
    passthroughK1: 'K-1 ordinary income', ltcg: 'Long-term capital gains',
    otherIncome: 'Other income', propertyTax: 'Property tax',
    mortgageInterest: 'Mortgage interest', charitable: 'Charitable contributions'
  };

  function renderPdfReview(result, fileName) {
    var f = result.fields;
    var html = '<h2 style="font-weight:500;margin-bottom:4px">Review parsed return</h2>' +
      '<p class="hint" style="color:var(--muted);font-size:13px;margin-bottom:16px">' +
      esc(fileName) + (result.formYear ? ' &middot; tax year ' + result.formYear : '') +
      ' &middot; read directly from the PDF (no AI). Verify each figure against the return, ' +
      'then Apply — nothing touches the form until you do.</p>';

    html += '<div class="grid" style="margin-bottom:18px">';
    Object.keys(PDF_FIELD_LABELS).forEach(function (k) {
      if (f[k] === undefined) return;
      if (k === 'filingStatus') {
        html += '<div class="field"><label>' + PDF_FIELD_LABELS[k] + '</label>' +
          '<select id="pdfr-filingStatus">' +
          ['mfj', 'single', 'hoh', 'mfs'].map(function (s) {
            return '<option value="' + s + '"' + (f.filingStatus === s ? ' selected' : '') + '>' +
              esc(TSIQ.FILING_STATUS_LABELS[s]) + '</option>';
          }).join('') + '</select></div>';
      } else {
        html += '<div class="field"><label>' + PDF_FIELD_LABELS[k] + '</label>' +
          '<input type="number" id="pdfr-' + k + '" value="' + Math.round(f[k]) + '"></div>';
      }
    });
    html += '</div>';

    // Cross-check block: the return's own summary lines, for tie-out.
    var ref = result.reference;
    var refRows = [
      ['Total income (line 9)', ref.totalIncome], ['AGI (line 11)', ref.agi],
      ['Deduction (line 12)', ref.deduction], ['QBI deduction (line 13)', ref.qbiDeduction],
      ['Taxable income (line 15)', ref.taxableIncome], ['Total tax (line 24)', ref.totalTax],
      ['SE tax (Sch 2)', ref.seTax]
    ].filter(function (r) { return r[1] !== null && r[1] !== undefined; });
    if (refRows.length) {
      html += '<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:var(--accent);margin-bottom:8px">Cross-check — what the return itself says</h3>' +
        '<table class="results-table" style="margin-bottom:16px"><tbody>' +
        refRows.map(function (r) {
          return '<tr><td>' + esc(r[0]) + '</td><td>' + usd(r[1]) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }

    if (result.warnings.length) {
      html += '<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:0.8px;color:var(--accent);margin-bottom:8px">Review notes</h3>' +
        '<ul class="notes" style="margin-bottom:18px">' +
        result.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';
    }

    html += '<div class="actions"><button class="primary" id="pdfr-apply">Apply to Client Data</button></div>';

    $('pdf-review-body').innerHTML = html;
    $('pdf-review-modal').classList.add('open');
    $('pdfr-apply').addEventListener('click', function () {
      Object.keys(PDF_FIELD_LABELS).forEach(function (k) {
        var el = $('pdfr-' + k);
        if (!el) return;
        var target = $(k);
        if (target) target.value = el.value;
      });
      $('pdf-review-modal').classList.remove('open');
      // Form 1040 line 1 lumps an S-corp owner's own salary in with outside wages.
      var pdfNotes = result.warnings.slice();
      if (num('passthroughK1') > 0 && num('wages') > 0 && !(num('ownerWages') > 0)) {
        pdfNotes.push('K-1 income and W-2 wages are both present. If any of those wages are the ' +
          'client\'s own salary from their S-corp, move that amount from "W-2 wages (outside jobs)" ' +
          'to "Owner W-2 wages from own S-corp" so payroll tax, QBI, and retirement limits compute correctly.');
      }
      if (num('ltcg') >= 50000) {
        pdfNotes.push('Long-term gains of ' + usd(num('ltcg')) + ' were imported as recurring. If they ' +
          'came from a one-off sale (a business, a property), move the amount to "One-time gain" ' +
          'so the projection does not repeat it every year.');
      }
      runSuggestions(pdfNotes);
      window.scrollTo(0, 0);
    });
  }

  // Deterministic strategy screening over whatever is in the form now.
  function runSuggestions(extraNotes) {
    var suggestions = TSIQ.suggestStrategies(readProfile());
    var notes = (extraNotes || []).concat(suggestions.length
      ? ['Suggestions come from rule-of-thumb screens on the entered data — leads to evaluate, not conclusions.']
      : ['No rule-based screens fired on this data — browse the library for situational strategies.']);
    renderSuggestions(suggestions, notes);
  }

  function importReturnPdf(file) {
    var reader = new FileReader();
    reader.onload = function () {
      TSIQ.parseReturnPdf(new Uint8Array(reader.result))
        .then(function (result) { renderPdfReview(result, file.name); })
        .catch(function (e) { alert('Could not read that PDF: ' + e.message); });
    };
    reader.readAsArrayBuffer(file);
  }

  /* -------------------------------- init --------------------------------- */
  function initTabs() {
    var btns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        for (var b = 0; b < btns.length; b++) btns[b].classList.remove('active');
        e.currentTarget.classList.add('active');
        var pages = document.querySelectorAll('.tab-page');
        for (var p = 0; p < pages.length; p++) pages[p].style.display = 'none';
        $(e.currentTarget.getAttribute('data-tab')).style.display = '';
        window.scrollTo(0, 0);
      });
    }
    $('lib-count').textContent = '(' + TSIQ.STRATEGIES.length + ')';
  }

  /* ------------- source notes: prior-year return line for each field ------ */
  function initSourceNotes() {
    var sn = TSIQ.SOURCE_NOTES;
    if (!sn || !sn.fields) return;
    Object.keys(sn.fields).forEach(function (id) {
      var el = $(id), n = sn.fields[id];
      if (!el || !n) return;
      var field = el.closest('.field');
      if (!field || field.querySelector('.src-note')) return;
      var note = document.createElement('p');
      note.className = 'src-note';
      var from = document.createElement('b');
      from.textContent = n.from;
      note.appendChild(from);
      if (n.check) {
        var chk = document.createElement('span');
        chk.textContent = n.check;
        note.appendChild(chk);
      }
      field.appendChild(note);
      if (field.classList.contains('check')) field.classList.add('has-src');
      else if (field.parentNode.classList.contains('grid')) field.parentNode.classList.add('has-src');
    });
    $('src-legend-text').textContent = 'Under each field: where to find the figure on the client\'s ' +
      sn.returnYear + ' return (federal Form 1040 package unless marked CA). The first line is where to read it; the second is where to check.';
    $('src-legend').style.display = '';
    var off = false;
    try { off = localStorage.getItem('tsiq-src-notes') === 'off'; } catch (e) {}
    $('src-toggle').checked = !off;
    document.body.classList.toggle('src-off', off);
    $('src-toggle').addEventListener('change', function () {
      document.body.classList.toggle('src-off', !this.checked);
      try { localStorage.setItem('tsiq-src-notes', this.checked ? 'on' : 'off'); } catch (e) {}
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBrand();
    initSourceNotes();
    initTabs();
    buildLibrary();
    buildScenarioPicker('sc2', 'sc2-strategies');
    buildScenarioPicker('sc3', 'sc3-strategies');
    $('compute').addEventListener('click', compute);
    $('btn-pdf').addEventListener('click', function () {
      if (lastRun) TSIQ.render.clientReport(lastRun);
    });
    $('btn-slides').addEventListener('click', function () {
      if (lastRun) TSIQ.render.slideshow(lastRun);
    });
    if (window.pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
    }
    $('btn-import-pdf').addEventListener('click', function () { $('import-pdf-file').click(); });
    $('import-pdf-file').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) importReturnPdf(e.target.files[0]);
      e.target.value = '';
    });
    $('pdf-review-close').addEventListener('click', function () { $('pdf-review-modal').classList.remove('open'); });
    $('pdf-review-modal').addEventListener('click', function (e) {
      if (e.target === $('pdf-review-modal')) $('pdf-review-modal').classList.remove('open');
    });
    $('btn-suggest').addEventListener('click', function () { runSuggestions(); });
    $('btn-export').addEventListener('click', exportClientFile);
    $('btn-import').addEventListener('click', function () { $('import-file').click(); });
    $('import-file').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) importClientFile(e.target.files[0]);
      e.target.value = '';
    });
    $('btn-pitch').addEventListener('click', function () {
      if (!lastRun) return;
      lastRun.fees = { planning: num('feePlanning'), annual: num('feeAnnual') };
      TSIQ.render.pitchDeck(lastRun);
    });
  });
})();
