/* ============================================================================
 * STRATEGY: Installment Sale on Business Sale (§453)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'installment-sale-business',
  name: 'Installment Sale on Business Sale',
  category: 'Income Timing & Character',
  applyOrder: 2,
  modeled: true,

  advisor: {
    summary:
      'When a business or other capital asset is sold with at least one payment ' +
      'received after the year of sale, §453 spreads gain recognition across the ' +
      'payment years in proportion to the gross profit ratio. Instead of stacking ' +
      'the entire gain into one year — pushing it through the 20% bracket and the ' +
      'OBBBA SALT phase-down all at once — the seller recognizes gain as ' +
      'payments arrive, keeping each year in lower LTCG brackets. NIIT is a ' +
      'factor only for a passive owner: gain on a business the seller materially ' +
      'participates in is not net investment income (§1411(c)(4)). §1245/§1250 depreciation recapture is recognized ' +
      'in full in the year of sale regardless of payments (§453(i)), and large ' +
      'obligations carry a §453A interest charge. Installment treatment is ' +
      'automatic; electing out (§453(d)) is the affirmative choice when a ' +
      'lump-sum year is actually cheaper.',
    mechanics: [
      'Gross profit ratio (gross profit ÷ total contract price) determines the ' +
      'taxable slice of each payment (§453(c)); the rest is basis recovery. ' +
      'Interest on the note is ordinary income, stated or imputed (§483/§1274).',
      'Bracket arbitrage: 2026 LTCG breakpoints put the 20% rate above roughly ' +
      '$613,700 taxable (MFJ) — a $5M gain in one year is mostly 20% (plus 3.8% NIIT for a passive owner), ' +
      'while $1M/year over five years keeps much of it at 15%.',
      '§453(i): all §1245 and §1250 recapture is recognized in the year of sale, ' +
      'even if no cash is received — model the year-1 cash need for asset sales ' +
      'with heavy depreciation.',
      '§453A: if deferred obligations from sales over $150k exceed $5M ' +
      'outstanding at year end, an interest charge applies to the deferred tax ' +
      'liability — large deals sacrifice part of the deferral benefit.',
      'Ineligible property: inventory, dealer property, and publicly traded ' +
      'securities cannot use §453. Related-party resales within two years can ' +
      'accelerate the gain (§453(e)).',
      'Electing out (§453(d)) on a timely return recognizes everything in year ' +
      'one — worth modeling when the sale year is unusually low-rate or the ' +
      'seller expects rates to rise.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §453', note: 'Installment method — gain recognized proportionally as payments are received; automatic unless the taxpayer elects out.' },
      { type: 'IRC', cite: 'IRC §453(i)', note: 'Depreciation recapture (§1245/§1250 amounts) recognized in full in the year of disposition regardless of payment schedule.' },
      { type: 'IRC', cite: 'IRC §453A', note: 'Interest charge on the deferred tax liability where obligations from >$150k sales exceed $5M outstanding.' },
      { type: 'IRC', cite: 'IRC §453(d)', note: 'Election out of installment treatment on a timely filed return (irrevocable without IRS consent).' },
      { type: 'IRC', cite: 'IRC §453(e)', note: 'Related-party resale rule — a second disposition within two years accelerates the first seller\'s gain.' },
      { type: 'Reg', cite: 'Temp. Reg. §15a.453-1', note: 'Operating rules for the installment method: contract price, gross profit ratio, contingent-payment sales.' },
      { type: 'IRC', cite: 'IRC §§483, 1274', note: 'Imputed/unstated interest — a portion of deferred payments is recharacterized as ordinary interest if the note rate is below AFR.' },
      { type: 'Admin', cite: 'Form 6252', note: 'Installment Sale Income — filed in the sale year and each year a payment is received.' }
    ],
    requirements: [
      'A sale with at least one payment after the close of the sale year, evidenced by a written note with market-rate stated interest (AFR or better).',
      'Eligible property — not inventory, dealer property, or marketable securities.',
      'Asset-by-asset allocation for a business sale (§1060): the installment method applies to the capital-gain assets; recapture is year-one income.',
      'Seller comfort with buyer credit risk, usually via security interest, personal guarantee, or standby letter of credit.'
    ],
    risks: [
      'Buyer default: the seller may repossess a damaged business after paying tax on early installments — collateral and covenants matter more than tax math.',
      '§453A interest charge erodes the benefit above $5M of outstanding obligations.',
      'Recapture surprise: heavily depreciated assets create year-one ordinary income with no matching cash (§453(i)).',
      'Rate risk: future LTCG rates could rise; the spread bets that they will not.',
      'Pledging the note or receiving a demand note/readily tradable note triggers gain (§453A(d), §453(f)).',
      'Death during the term: the note is income in respect of a decedent — no basis step-up on the deferred gain (§691; §1014(c)).'
    ],
    bestFit: [
      'Business or real-estate sales of roughly $1M+ of gain where a lump sum would ride the 20% bracket (and NIIT, for a passive owner) for most of the gain.',
      'Sellers who do not need all cash at closing and can hold a secured note.',
      'Sellers whose other income will drop after the sale (retirement) — spreading lands gain in low-bracket years.'
    ],
    implementation: [
      'Model lump-sum vs. spread in this tool before the LOI is signed — payment terms are negotiated, not retrofitted.',
      'Draft the note: term, market-rate stated interest (at least AFR), security, and default remedies.',
      'Allocate purchase price among asset classes (Form 8594, §1060); identify recapture recognized in year one.',
      'File Form 6252 with the sale-year return and each collection year; report note interest as ordinary income.',
      'Track outstanding obligations against the $5M §453A threshold each December.',
      'Calendar the related-party two-year resale window if the buyer is related.'
    ]
  },

  client: {
    teaser: 'Turns one giant tax bill from a sale into several much smaller ones',
    headline: 'Sell your business, spread the tax',
    plainEnglish: [
      'When you sell a business in one lump sum, the entire profit lands on a single tax return. A big number in one year gets pushed into the highest tax rates — you can lose a noticeably bigger slice than if the same profit had arrived over several years.',
      'An installment sale means the buyer pays you over time — say, five annual payments — and you pay tax only as the money actually arrives. Each year\'s slice is smaller, so more of it is taxed at lower rates, and some extra surcharges may not apply at all.',
      'You also earn interest on the unpaid balance, so the buyer is paying you for the privilege of paying over time. We structure the note so you are protected if the buyer runs into trouble.'
    ],
    analogy: 'Pouring a gallon of water into a small funnel all at once makes a mess; pouring it in steadily gets every drop through. Spreading the payments gets more of your sale price through the low-tax funnel.',
    benefits: [
      'More of your sale profit taxed at lower rates instead of the top rate',
      'Tax is due only as cash actually arrives — no giant year-one bill',
      'You collect interest on the unpaid balance',
      'Steady income stream, useful if you\'re stepping back or retiring'
    ],
    steps: [
      'We model the lump-sum tax bill next to several payment schedules so you see the difference before you negotiate',
      'Your attorney and we structure the note — payment schedule, interest rate, and security protecting you',
      'We handle the tax filings in the sale year and each payment year',
      'We monitor the plan yearly and adjust if your situation changes'
    ],
    considerations: [
      'You are trusting the buyer to keep paying — we insist on collateral and guarantees, but there is real risk if the business struggles under new ownership.',
      'Some parts of a sale (like previously written-off equipment) are taxed in year one no matter what — we identify those up front.',
      'Very large deals (over $5 million carried) owe interest to the IRS on the deferred tax, which trims the benefit.'
    ]
  },

  inputs: [
    { key: 'totalGain', label: 'Total capital gain on the sale', type: 'currency', default: 1000000 },
    { key: 'spreadYears', label: 'Years the payments are spread over', type: 'number', default: 5, max: 20 }
  ],

  appliesTo: function (profile) {
    return true; // validated in apply(): needs the sale gain in "One-time gain"
  },

  /**
   * The sale gain is a ONE-TIME item: it must be in the profile's oneTimeGain
   * field (Section 1, "One-time gain this year"), which the projection taxes
   * in year 1 only. The baseline therefore recognizes the whole gain in the
   * sale year. This strategy replaces that lump with gain/N in year 1 and adds
   * gain/N in each of years 2..N.
   * The year-1 difference is DEFERRAL, not savings — the real benefit is the
   * total over the projection (lower brackets, NIIT avoided), which is what
   * the results and the pitch deck lead with.
   * The gain modeled is capped at the one-time gain actually entered, so the
   * strategy can never create a negative gain.
   * Not modeled: §1245 recapture (all in year 1), unrecaptured §1250 gain at
   * up to 25%, note interest income, and the §453A interest charge.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var key = 'instSaleBusiness';

    if (yearIndex === 0) {
      var n = Math.max(2, Math.round(params.spreadYears || 5));
      var requested = Math.max(0, params.totalGain || 0);
      var available = Math.max(0, p.oneTimeGain || 0);
      var gain = Math.min(requested, available);
      state[key] = { gain: gain, n: n };

      if (gain <= 0) {
        notes.push('No one-time gain found. Enter the sale gain in "One-time gain this year" ' +
          'in Section 1 (not in recurring capital gains) so the baseline shows the lump-sum ' +
          'sale and this strategy can spread it. No benefit modeled.');
        return { profile: p, notes: notes };
      }
      if (gain < requested) {
        notes.push('Gain to spread capped at the ' + TSIQ.fmt.usd(available) +
          ' one-time gain entered in Section 1.');
      }
      p.oneTimeGain = p.oneTimeGain - gain + gain / n;
      notes.push('Installment sale (§453): ' + TSIQ.fmt.usd(gain) + ' gain recognized over ' + n +
        ' years, ' + TSIQ.fmt.usd(gain / n) + ' a year, instead of all in ' +
        TSIQ.TABLES_2026.taxYear + '. The first-year difference is deferral — the tax saved is ' +
        'the total over the projection.');
      var horizon = state.projectionYears || n;
      if (n > horizon) {
        notes.push('The payment schedule runs past the ' + horizon + '-year projection: ' +
          TSIQ.fmt.usd(gain * (n - horizon) / n) + ' of gain is recognized after the window, ' +
          'so the total shown overstates the benefit. Lengthen the projection to see it all.');
      }
      if (!p.oneTimeGainActive) {
        notes.push('The gain is being treated as net investment income (3.8% NIIT). If the seller ' +
          'actively ran the business, check "One-time gain is from a business the client actively ' +
          'runs" in Section 1 — the gain is then outside NIIT (§1411(c)(4)) and the benefit of ' +
          'spreading it is smaller.');
      }
      notes.push('Not modeled: §1245 depreciation recapture is ordinary income in full in the ' +
        'year of sale regardless of payments (§453(i)); unrecaptured §1250 gain is taxed at up ' +
        'to 25%; note interest is ordinary income; the §453A interest charge applies to ' +
        'balances over $5M.');
    } else if (state[key] && state[key].gain > 0 && yearIndex < state[key].n) {
      // Later installments: one more equal slice each year.
      p.oneTimeGain = (p.oneTimeGain || 0) + state[key].gain / state[key].n;
    }
    return { profile: p, notes: notes };
  }
});
