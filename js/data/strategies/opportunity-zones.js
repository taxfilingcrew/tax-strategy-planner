/* ============================================================================
 * STRATEGY: Opportunity Zone Investment
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'opportunity-zones',
  name: 'Opportunity Zone Investment',
  category: 'Real Estate & Cost Recovery',
  applyOrder: 54,

  advisor: {
    summary:
      '§1400Z-2 lets a taxpayer defer capital gain by reinvesting it in a ' +
      'Qualified Opportunity Fund (QOF) within 180 days, and — the real prize ' +
      '— exclude ALL appreciation on the QOF interest itself after a 10-year ' +
      'hold via a basis step-up to FMV. CRITICAL 2026 timing: under the ' +
      'original regime, every deferred gain is recognized no later than ' +
      '12/31/2026, so a gain invested in 2026 gets almost no deferral runway. ' +
      'OBBBA (P.L. 119-21) made the program permanent as "OZ 2.0" starting ' +
      '1/1/2027: new zone designations, a 5-year rolling deferral (gain ' +
      'recognized at the 5-year mark rather than a fixed date), a basis ' +
      'step-up for gains held 5 years, enhanced benefits for rural zones, and ' +
      'the 10-year appreciation exclusion retained. Straddling that boundary ' +
      'is the central planning question for gains realized in 2026.',
    mechanics: [
      'Eligible gain (capital gain, including from stock, business sales, or ' +
      'real estate) is deferred by investing the GAIN amount (not the ' +
      'proceeds) into a QOF within 180 days of recognition — unlike §1031, ' +
      'the rest of the proceeds stay in the client\'s pocket.',
      'Original-regime endpoint: deferred gains are included in income at the ' +
      'earlier of an inclusion event or 12/31/2026 — a 2026-realized gain ' +
      'invested under the old regime is recognized within months.',
      'OZ 2.0 (investments from 1/1/2027): rolling 5-year deferral — the ' +
      'deferred gain is recognized at the 5th anniversary of the investment — ' +
      'with a 10% basis step-up for gains held the full 5 years (30% for ' +
      'qualified rural funds), and refreshed zone maps on a recurring cycle.',
      'The 10-year benefit (both regimes): after a 10-year hold, basis in the ' +
      'QOF interest is stepped to FMV on sale — the entire post-investment ' +
      'appreciation escapes federal tax.',
      'QOFs self-certify (Form 8996) and must hold 90% qualified opportunity ' +
      'zone property; investors report deferrals and inclusion events on ' +
      'Form 8997 with Form 8949.',
      'Only the deferral is modeled here; the 10-year appreciation exclusion ' +
      'depends on unknowable future growth and is deliberately NOT quantified.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §1400Z-2', note: 'Deferral of reinvested capital gains, inclusion events, and the 10-year FMV basis step-up.' },
      { type: 'IRC', cite: 'IRC §1400Z-1', note: 'Zone designation framework; OBBBA provides recurring redesignations beginning with OZ 2.0.' },
      { type: 'IRC', cite: 'P.L. 119-21 (OBBBA) — Opportunity Zone provisions', note: 'Makes the program permanent from 2027: 5-year rolling deferral, 5-year basis step-up (enhanced for rural funds), new zone maps; original-regime deferrals still end 12/31/2026.' },
      { type: 'Reg', cite: 'Reg. §1.1400Z2(a)-1', note: '180-day investment window mechanics, including options for K-1 gains (owner may start the window at the entity year-end).' },
      { type: 'Admin', cite: 'Form 8997 / Form 8949', note: 'Annual investor reporting of QOF holdings, deferrals, and inclusion events.' },
      { type: 'Admin', cite: 'Form 8996', note: 'QOF self-certification and the 90% qualified-property asset test.' }
    ],
    requirements: [
      'An eligible capital gain and a QOF investment of the gain amount within 180 days of recognition (K-1 gains get flexible start dates).',
      'A fund that actually satisfies the 90% asset test — diligence the sponsor; the investor bears inclusion risk if the fund fails.',
      'Liquidity plan for the deferral endpoint: tax is due when the deferred gain comes back (12/31/2026 old regime; 5-year mark under OZ 2.0) without any sale proceeds arriving.',
      'A genuine 10-year horizon to capture the appreciation exclusion — the strategy is weak as a pure deferral play.'
    ],
    risks: [
      'The 2026 boundary: invest a 2026 gain under the wrong regime and the "deferral" evaporates at 12/31/2026 — timing the QOF investment into 2027 (where the 180-day window permits) may capture OZ 2.0\'s 5-year deferral instead. Model both.',
      'The deferred gain returns at a FUTURE year\'s rates — rate risk cuts both ways.',
      'Investment risk dominates: a bad fund loses more principal than the tax benefits save.',
      'Phantom income at the inclusion date — tax due with no distribution in many funds.',
      'Fund-level compliance failures (90% test) can trigger penalties and jeopardize benefits.',
      'California does not conform: it taxes the gain in the year of sale and taxes the appreciation at exit. For a California client the deferral and the 10-year exclusion are federal only.'
    ],
    bestFit: [
      'Clients realizing large capital gains (business sale, concentrated stock, real estate) with a 10+ year horizon.',
      'Investors who want diversification out of a concentrated position — only the gain must be reinvested, freeing the basis.',
      'Clients able to fund the deferral-end tax bill from other liquidity.'
    ],
    implementation: [
      'Confirm gain eligibility and map the 180-day window (including K-1 start-date options) against the 12/31/2026 / OZ 2.0 boundary.',
      'For 2026 gains, model the regimes side by side: immediate-recognition-anyway vs. a 2027 OZ 2.0 investment inside the same 180-day window.',
      'Diligence the QOF: sponsor track record, 90% test history, rural-fund status if the enhanced step-up matters.',
      'Wire the gain amount to the QOF within the window; retain the trade confirmations.',
      'File Form 8997 annually; calendar the deferral endpoint and the 10-year anniversary.'
    ]
  },

  client: {
    teaser: 'Park a big gain where its growth can become permanently tax-free',
    headline: 'Reinvest a capital gain — defer the tax, and let new growth grow tax-free',
    plainEnglish: [
      'When you sell something at a large profit — a business, stock, real estate — the tax is normally due that year. Opportunity Zone rules give you another option: reinvest the profit into a fund that builds in designated communities, and the tax on that profit is postponed for years.',
      'The bigger prize comes later. Hold the new investment for ten years, and all the growth on it is completely tax-free when you sell. The original tax eventually comes due, but everything the reinvested money earns on top can escape tax entirely.',
      'One important wrinkle right now: the program is changing at the end of 2026. The old version\'s postponement runs out on December 31, 2026, and an improved permanent version starts in 2027 with a full five-year postponement. For gains happening this year, the calendar — sometimes a matter of weeks — decides which set of rules you get, so timing the investment is a big part of our job.'
    ],
    analogy: 'It\'s like replanting the profit from one harvest into new ground where everything that grows from it is yours to keep, tax-free — as long as you let it grow for ten years.',
    benefits: [
      'Postpone the tax on a large gain instead of paying it now',
      'After a 10-year hold, growth on the reinvested money is free of federal tax',
      'Only the profit needs to be reinvested — the rest of your sale proceeds stay free',
      'The new permanent rules add extra benefits, especially for rural-area funds'
    ],
    steps: [
      'We confirm your gain qualifies and calculate your 180-day investment deadline',
      'We time the investment around the 2026-to-2027 rule change to get you the better deal',
      'You select a fund (we help you evaluate the tax mechanics, not pick investments)',
      'We handle the annual IRS reporting and calendar every milestone'
    ],
    considerations: [
      'The postponed tax does come due — under the new rules, five years after you invest — and usually without cash coming out of the fund, so we plan for that bill.',
      'This is a real investment with real risk; the tax benefits never rescue a bad fund.',
      'The ten-year tax-free growth only materializes if you can genuinely leave the money invested that long.',
      'California does not follow this program. You still owe California tax on the original gain this year, and California will tax the growth when you sell.'
    ]
  },

  inputs: [
    { key: 'gainDeferred', label: 'Capital gain deferred into QOF', type: 'currency', default: 200000 },
    { key: 'fundType', label: 'Fund type', type: 'select', default: 'standard',
      options: [{ value: 'standard', label: 'Standard fund (10% basis step-up)' },
        { value: 'rural', label: 'Qualified rural fund (30% basis step-up)' }] }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs the gain in "One-time gain"
  },

  /**
   * Models the post-2026 regime (the operative one for planning at the
   * 2026/2027 boundary): a 2026 gain invested in a QOF on or after 1/1/2027.
   * Year 1 removes the deferred gain from oneTimeGain. The gain comes back in
   * the tax year containing the date five years after the investment — 2032,
   * year index 6 — reduced by the 5-year basis step-up (10%; 30% for a
   * qualified rural fund), so 90% (70%) is recognized. Deferral is shown
   * honestly, not as free money.
   * California does not conform: with California rules on, the state taxes
   * the gain in year 1 and not again at the federal inclusion date.
   * Not modeled: the 10-year exclusion of post-investment appreciation
   * (depends on unknowable growth). A gain invested under the ORIGINAL regime
   * (before 2027) is recognized 12/31/2026 with no deferral — flagged in notes.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var INCLUSION_YEAR_INDEX = 6;
    var stepUp = params.fundType === 'rural' ? 0.30 : 0.10;
    if (yearIndex === 0) {
      var requested = Math.max(0, params.gainDeferred || 0);
      var deferred = Math.min(requested, Math.max(p.oneTimeGain || 0, 0));
      state.ozDeferred = deferred;
      if (deferred <= 0) {
        notes.push('No one-time gain found. Enter the realized gain in "One-time gain this year" ' +
          'in Section 1 for the QOF deferral to apply. No benefit modeled.');
        return { profile: p, notes: notes };
      }
      p.oneTimeGain = p.oneTimeGain - deferred;
      TSIQ.stateAddBack(p, deferred); // California taxes the gain now
      notes.push(TSIQ.fmt.usd(deferred) + ' of gain deferred into a Qualified Opportunity ' +
        'Fund. TIMING IS CRITICAL: this models an investment made on or after 1/1/2027, which ' +
        'works only if the 180-day window reaches into 2027 (a sale after about July 5, 2026, ' +
        'or a K-1 gain using the entity year-end start). A 2026 investment is taxed 12/31/2026 ' +
        'with no deferral.');
      notes.push('The gain is modeled as recognized in ' + (TSIQ.TABLES_2026.taxYear + INCLUSION_YEAR_INDEX) +
        ', less the ' + Math.round(stepUp * 100) + '% basis step-up: ' +
        TSIQ.fmt.usd(deferred * (1 - stepUp)) + ' taxable then.' +
        ((state.projectionYears || 99) <= INCLUSION_YEAR_INDEX
          ? ' That falls outside this projection, so the total shown is deferral only — lengthen the projection to at least ' +
            (INCLUSION_YEAR_INDEX + 1) + ' years.' : ''));
      if (p.caRules) {
        notes.push('California does not follow the opportunity zone rules: the state taxes the ' +
          'full gain in ' + TSIQ.TABLES_2026.taxYear + ' and will tax the fund\'s growth at exit. ' +
          'Only the federal deferral is shown.');
      }
      notes.push('Not modeled: the 10-year step-up that makes post-investment appreciation ' +
        'free of federal tax — the largest benefit, deliberately unquantified.');
    } else if (yearIndex === INCLUSION_YEAR_INDEX && state.ozDeferred > 0) {
      var recognized = state.ozDeferred * (1 - stepUp);
      p.oneTimeGain = (p.oneTimeGain || 0) + recognized;
      TSIQ.stateAddBack(p, -recognized); // already taxed by California in year 1
      notes.push((TSIQ.TABLES_2026.taxYear + INCLUSION_YEAR_INDEX) + ': ' + TSIQ.fmt.usd(recognized) +
        ' of OZ-deferred gain recognized — plan liquidity for this bill.');
    }
    return { profile: p, notes: notes };
  }
});
