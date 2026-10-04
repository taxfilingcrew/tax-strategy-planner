/* ============================================================================
 * STRATEGY: Self-Employed Health Insurance Optimization
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'se-health-insurance',
  name: 'Self-Employed Health Insurance Optimization',
  category: 'Health & Fringe',
  applyOrder: 76,

  advisor: {
    summary:
      '§162(l) allows self-employed individuals — Schedule C proprietors, ' +
      'partners, and >2% S-corp shareholders (via the W-2 premium add-back ' +
      'mechanic of Notice 2008-1) — an above-the-line deduction for health, ' +
      'dental, and qualified long-term-care premiums for the taxpayer, spouse, ' +
      'dependents, and under-27 children. The deduction is limited to earned ' +
      'income from the trade or business sponsoring the plan, and no deduction ' +
      'is allowed for any month the taxpayer or spouse is ELIGIBLE for ' +
      'subsidized employer coverage. It saves income tax only — not SE tax ' +
      '(the §1402 computation does not subtract it) — which is why the §105 ' +
      'spouse-employee plan out-performs it where available. The common ' +
      'failure mode is simply missing it: premiums paid personally by S-corp ' +
      'owners without the W-2 add-back, Medicare premiums overlooked, or ' +
      'premiums buried on Schedule A where the 7.5% AGI floor erases them. ' +
      'PTC coordination (§36B) requires the iterative calculation of ' +
      'Rev. Proc. 2014-41 when exchange subsidies are in play.',
    mechanics: [
      'Above-the-line deduction (Schedule 1) for medical/dental premiums plus ' +
      'age-indexed limits on qualified LTC premiums — no itemizing, no 7.5% ' +
      'AGI floor.',
      'Limited to earned income from the sponsoring business: Schedule C net ' +
      'profit (less ½ SE tax and SE retirement), or the >2% shareholder\'s ' +
      'W-2 wages from the S-corp. Excess premiums fall to Schedule A.',
      'S-corp mechanics (Notice 2008-1): the corporation pays or reimburses ' +
      'the premiums, includes them in the shareholder\'s Box 1 W-2 wages ' +
      '(exempt from FICA), and the shareholder deducts under §162(l). ' +
      'Premiums paid personally with no add-back get no §162(l) deduction.',
      'Month-by-month eligibility test: NO deduction for any month the ' +
      'taxpayer or spouse was eligible to participate in a subsidized employer ' +
      'plan (their own employer or the spouse\'s) — eligibility alone kills the ' +
      'month, even if they declined the coverage.',
      'Medicare Part B/D and Medigap premiums for the owner (and spouse, where ' +
      'paid or reimbursed by the business) qualify — routinely missed for ' +
      'owners 65+.',
      'Reduces income tax but NOT SE tax; per the Form 8995 instructions the ' +
      'deduction attributable to the business also reduces QBI — modeled here.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §162(l)', note: 'The deduction: self-employed health insurance for taxpayer, spouse, dependents, children under 27; earned-income limit; subsidized-plan-eligibility disallowance by month.' },
      { type: 'Admin', cite: 'Notice 2008-1', note: 'S-corp >2% shareholder mechanics: premiums paid/reimbursed by the corporation and included in W-2 wages qualify for §162(l).' },
      { type: 'IRC', cite: 'IRC §1372', note: '>2% S-corp shareholders treated as partners for fringe benefits — why the premiums land on the W-2 rather than staying excludable.' },
      { type: 'Admin', cite: 'Rev. Proc. 2014-41', note: 'Iterative/simplified calculation coordinating the §162(l) deduction with the §36B premium tax credit — each depends on the other.' },
      { type: 'IRC', cite: 'IRC §36B', note: 'Premium tax credit — only the net (unsubsidized) premium is deductible; interplay computed under Rev. Proc. 2014-41.' },
      { type: 'Admin', cite: 'Form 7206 and instructions', note: 'The computation form for the deduction and its earned-income limit.' }
    ],
    requirements: [
      'Positive earned income from the sponsoring business (Schedule C net profit, K-1 SE earnings, or S-corp W-2 wages).',
      'The plan established under the business: Schedule C — policy in the owner\'s or business\'s name; S-corp — corporate payment/reimbursement plus W-2 Box 1 inclusion.',
      'No month claimed in which the taxpayer or spouse was eligible for subsidized employer coverage.',
      'For exchange policies with PTC: the Rev. Proc. 2014-41 coordinated computation.'
    ],
    risks: [
      'S-corp owners who pay premiums personally without the corporate reimbursement/W-2 add-back lose the deduction — a mechanical foot-fault, fixable before year-end payroll closes.',
      'Claiming months in which the spouse\'s employer offered subsidized coverage — eligibility, not enrollment, is the test.',
      'Deduction capped at earned income: a loss-year Schedule C supports zero deduction; excess only survives on Schedule A above the 7.5% floor.',
      'Double-dipping with the premium tax credit — deducting premiums the PTC effectively paid.',
      'Stacking errors with a §105 spouse-employee plan — the same premium dollars cannot be deducted twice.'
    ],
    bestFit: [
      'Profitable Schedule C owners and S-corp shareholders paying their own family coverage without access to a spouse\'s employer plan.',
      'Owners 65+ paying Medicare Part B/D and Medigap premiums out of pocket.',
      'S-corp owners whose payroll setup has never routed premiums through the W-2 (immediate, cheap fix).',
      'Clients with exchange coverage where the PTC/§162(l) interplay has been left uncomputed.'
    ],
    implementation: [
      'Inventory all household health, dental, LTC, and Medicare premiums and who pays them.',
      'Verify no subsidized-employer-coverage eligibility month by month (both spouses).',
      'S-corp clients: set corporate payment/reimbursement of premiums and W-2 Box 1 inclusion before the final payroll of the year.',
      'Compute the deduction on Form 7206; apply the earned-income limit; route any excess to Schedule A.',
      'If exchange coverage with PTC: run the Rev. Proc. 2014-41 iterative calculation.',
      'Coordinate with any §105 spouse-employee plan so no premium is deducted twice.'
    ]
  },

  client: {
    teaser: 'A deduction for a bill you already pay every month — most owners claim less of it than they could',
    headline: 'Deduct your health insurance the right way',
    plainEnglish: [
      'If you work for yourself, the premiums you pay for health insurance — for you, your spouse, and your kids — are deductible. Not buried in itemized deductions where a threshold usually wipes them out, but right off the top of your income. Dental premiums, long-term-care premiums, and even Medicare premiums count too.',
      'You would be surprised how often this is claimed wrong or not at all. Owners of S-corporations, in particular, have to run the premiums through the company and their W-2 in a specific way — pay them personally and the deduction can be lost entirely. Owners on Medicare often never realize those premiums qualify.',
      'There are rules: the deduction cannot exceed what the business earns, and it is off the table for any month you or your spouse could have joined an employer\'s subsidized plan — even if you said no to it. We check each of those boxes and set the paperwork up so the full deduction sticks.'
    ],
    analogy: 'It is like finding out a bill you have been paying for years came with a rebate form nobody told you about — the money was always there; it just has to be claimed correctly.',
    benefits: [
      'Premiums come straight off your income — no itemizing needed',
      'Covers health, dental, long-term-care, and Medicare premiums',
      'Family coverage counts, including kids under 27',
      'Often an immediate fix with no change to your insurance at all'
    ],
    steps: [
      'We inventory every premium your household pays',
      'We check the eligibility rules month by month so the deduction holds up',
      'For S-corporation owners, we set up the payroll handling correctly before year-end',
      'We claim the full deduction and coordinate it with any insurance subsidies'
    ],
    considerations: [
      'If you or your spouse could join an employer\'s subsidized health plan, those months do not count — we verify rather than assume.',
      'The deduction cannot exceed what your business earns for the year.',
      'It saves income tax but not self-employment tax — where your situation allows, we may layer a stronger strategy on top.'
    ]
  },

  inputs: [
    { key: 'annualPremiums', label: 'Annual health/dental/LTC premiums', type: 'currency', default: 18000 },
    { key: 'alreadyDeducted', label: 'Premiums the return already deducts above the line', type: 'currency', default: 0 }
  ],

  suggest: function (p) {
    if (!(p.scheduleCNet > 0)) return null;
    return { reason: 'Self-employed with Schedule C profit — confirm health premiums are being deducted above the line. Enter what the return already deducts so only the missed amount is counted.' };
  },

  appliesTo: function (profile) {
    return true; // needs earned business income; validated in apply()
  },

  /**
   * Above-the-line §162(l) deduction via `adjustments` (income tax only — no
   * SE tax effect, correct per §1402). Only the part of the premiums that is
   * NOT already deducted counts: less the "already deducted" input, and less
   * premiums an earlier strategy in the scenario deducted (S-corp owner
   * health insurance, §105 plan).
   * Cap (§162(l)(2)(A)): earned income from the business — Schedule C profit
   * less half of SE tax and less the owner's retirement plan deductions —
   * plus the owner's W-2 wages from their own S corporation. K-1 ordinary
   * income is NOT earned income for a >2% S-corp shareholder. Also reduces
   * QBI (Form 8995 instructions) via `qbiReduction`.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    var tb = (state && state.tables) || TSIQ.TABLES_2026;
    var premiums = params.annualPremiums || 0;
    var already = Math.max(0, params.alreadyDeducted || 0);
    var health = TSIQ.health.year(state);
    var ret = TSIQ.plan.year(state);

    var seEarned = 0, planUsed = 0;
    if ((p.scheduleCNet || 0) > 0) {
      var o = TSIQ.plan.owner(p, state);
      planUsed = o.route === 'se' ? TSIQ.plan.total(ret) : 0;
      seEarned = Math.max(0, p.scheduleCNet - TSIQ.plan.halfSeTax(p, tb) - planUsed);
    }
    var earnedCap = seEarned + Math.max(0, p.ownerWages || 0);
    if (earnedCap <= 0) {
      if (first) {
        notes.push((p.passthroughK1 > 0)
          ? '§162(l) for an S-corp owner is limited to their W-2 wages from the corporation (premiums run through the W-2 per Notice 2008-1) — K-1 income does not count. Enter owner W-2 wages in Section 1, or pair with the S-Corp Election strategy. Partners: the limit is K-1 self-employment earnings, which this profile does not carry. No benefit modeled.'
          : '§162(l) is limited to earned income from the business — no business earnings found in this profile. No benefit modeled.');
      }
      return { profile: p, notes: notes };
    }
    var taken = already + health.covered;
    var remaining = Math.max(0, premiums - taken);
    var room = Math.max(0, earnedCap - already - health.sehi);
    var deductible = Math.min(remaining, room);
    p.adjustments = (p.adjustments || 0) + deductible;
    p.qbiReduction = (p.qbiReduction || 0) + deductible;
    health.covered += deductible;
    health.sehi += deductible;
    if (first) {
      notes.push(TSIQ.fmt.usd(deductible) + ' of health premiums counted as a NEW above-the-line deduction (§162(l)); also reduces QBI. Saves income tax only — no SE tax effect.');
      if (already <= 0 && health.covered === deductible && deductible > 0) {
        notes.push('This assumes the return deducts none of these premiums today. If it already does (Schedule 1, line 17), enter that amount in "Premiums the return already deducts" — otherwise the saving shown is not real.');
      }
      if (health.covered > deductible) {
        notes.push(TSIQ.fmt.usd(health.covered - deductible) + ' of premiums is already deducted by another strategy in this scenario (S-corp owner health insurance or the §105 plan) and is not counted again.');
      }
      if (deductible < remaining) {
        notes.push('Deduction capped at business earned income of ' + TSIQ.fmt.usd(earnedCap) +
          ' (Schedule C profit less half of SE tax' + (planUsed > 0 ? ' and ' + TSIQ.fmt.usd(planUsed) + ' of retirement plan deductions' : '') +
          ', plus owner W-2 wages — K-1 income excluded); the excess falls to Schedule A (7.5% AGI floor, not modeled).');
      }
      notes.push('No deduction for months eligible for a subsidized employer plan (either spouse); PTC interplay per Rev. Proc. 2014-41 not modeled.');
    }
    return { profile: p, notes: notes };
  }
});
