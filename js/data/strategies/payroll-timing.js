/* ============================================================================
 * STRATEGY: Payroll & Bonus Timing
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'payroll-timing',
  name: 'Payroll & Bonus Timing',
  category: 'Payroll & Family',
  applyOrder: 38,
  modeled: false,

  advisor: {
    summary:
      'Compensation timing lets an accrual-basis business take this year\'s ' +
      'deduction for STAFF bonuses paid early next year — the owner gets the ' +
      'deduction a year before the employees report the income. It does NOT ' +
      'let a pass-through owner move his own income between years by timing ' +
      'his own bonus: the wage and the entity\'s deduction for it land on the ' +
      'same return in the same year and cancel. ' +
      'The accrual rules give a 2.5-month window: a bonus fixed and ' +
      'determinable at year-end and paid within 2.5 months after year-end is ' +
      'deductible in the accrual year rather than treated as deferred ' +
      'compensation (Reg. §1.404(b)-1T). The hard stop is §267(a)(2): for ' +
      'amounts owed to a RELATED payee — including any S corporation ' +
      'shareholder, at any ownership level, via §267(e) — the deduction is ' +
      'forced onto the cash method, deferred until the year the payee ' +
      'includes the income. Owner bonuses therefore cannot be accrued and ' +
      'deducted ahead of payment. For an S-corp owner the payment date of his ' +
      'own bonus changes payroll tax and the §199A wage limit, not taxable ' +
      'income; only a C-corp owner (whose bonus moves income off the ' +
      'corporate return onto his own) has a real December-versus-January ' +
      'choice. Advisory: the value depends on rate differentials between ' +
      'years the tool projects at flat law.',
    mechanics: [
      'Accrual-basis rule for NON-owner employees: a bonus is deductible in ' +
      'year 1 if all events fixing the liability have occurred by year-end ' +
      '(amount determinable, obligation fixed — beware plans where bonuses ' +
      'are forfeited on pre-payment termination and revert to the employer) ' +
      'and payment occurs within 2.5 months after year-end. Beyond 2.5 ' +
      'months it is deferred compensation, deductible only when paid ' +
      '(Reg. §1.404(b)-1T; §404(a)(5)).',
      'Related-party override: §267(a)(2) defers the employer\'s deduction ' +
      'on any accrual to a related person until that person includes it in ' +
      'income. §267(e) makes EVERY shareholder of an S corporation related ' +
      'for this purpose — even 1% owners — and family attribution sweeps in ' +
      'spouses and children on payroll.',
      'Practical owner rule: an owner/family bonus is deductible when PAID ' +
      'and included on the W-2 — a December accrual paid in January belongs ' +
      'to next year. December vs. January payment is the actual lever.',
      'S-corp (and partnership) owners — no income shift: a bonus to the ' +
      'owner raises W-2 wages and lowers K-1 income by the same amount in ' +
      'the same year. Paying it in December instead of January does not ' +
      'move income into the "cheaper" year. What it does change: Social ' +
      'Security and Medicare tax (15.3% up to the $184,500 wage base for ' +
      '2026, 2.9% above, plus 0.9% additional Medicare), the §199A wage ' +
      'limit, and the reasonable-compensation record. An unneeded bonus is a ' +
      'net COST — a $100,000 year-end bonus to an S-corp owner on $80,000 of ' +
      'salary and $150,000 of K-1 income raises the household\'s total tax by ' +
      'about $17,700.',
      'Where an owner bonus does help: above the §199A threshold ($403,500 ' +
      'MFJ taxable income for 2026) with a wage-limited deduction, extra ' +
      'W-2 wages can raise the QBI deduction (see QBI Wage Optimization); ' +
      'and salary that is too low for reasonable compensation should be ' +
      'trued up before year-end.',
      'C-corp owners — a real timing choice: the bonus is deducted on the ' +
      'corporate return and taxed on the owner\'s, so December versus ' +
      'January (and bonus versus retained profit at 21%) genuinely moves ' +
      'income between years and taxpayers.',
      'Cash-method businesses: staff bonuses are deducted when paid, so ' +
      'paying them in late December rather than January moves the DEDUCTION ' +
      '(and so the owner\'s pass-through income) into the current year.',
      'Payroll mechanics matter: the bonus must actually run through payroll ' +
      'with deposits by the applicable schedule; a journal entry is not ' +
      'payment.'
    ],
    authority: [
      { type: 'Reg', cite: 'Reg. §1.404(b)-1T', note: 'The 2.5-month rule: compensation paid within 2.5 months after year-end is presumed NOT deferred compensation; later payment falls into §404(a)(5) paid-year deduction.' },
      { type: 'IRC', cite: 'IRC §267(a)(2)', note: 'Accrual deduction to a related payee deferred until the payee\'s inclusion — the matching rule that blocks accrued owner bonuses.' },
      { type: 'IRC', cite: 'IRC §267(e)', note: 'For pass-through entities, ANY shareholder/owner is a related person for §267(a)(2) — no 50% threshold protects a minority S-corp owner.' },
      { type: 'IRC', cite: 'IRC §404(a)(5)', note: 'Deferred compensation deductible only in the year the recipient includes it.' },
      { type: 'Reg', cite: 'Reg. §1.461-1(a)(2)', note: 'All-events test for accrual deductions: liability fixed, amount determinable, economic performance.' }
    ],
    requirements: [
      'Knowledge of the business\'s accounting method — the 2.5-month window is an accrual-method benefit only; cash-method businesses deduct when paid, full stop.',
      'A bonus obligation genuinely fixed by year-end for non-owner accruals (board resolution/bonus plan; watch forfeiture-with-reversion terms).',
      'A current-year and next-year household rate projection to decide which year should carry the STAFF bonus deduction (and, for a C-corp owner, the owner\'s bonus).',
      'Payroll capacity to run an actual year-end bonus cycle with timely deposits.'
    ],
    risks: [
      'Accruing and deducting an owner bonus paid in January is a straightforward exam adjustment under §267(a)(2) — common in S corps that treat owners like other employees.',
      'Bonus pools where a departing employee\'s share reverts to the employer can fail the all-events test at year-end, deferring even non-owner accruals.',
      'Telling an S-corp owner to "pay the bonus in the cheaper year" is wrong: it moves no income and adds payroll tax. Check the entity type before giving timing advice.',
      'Timing plays assume next year\'s rates: legislation, income surprises, or a filing-status change can invert the arbitrage.',
      'Shifting owner comp across years interacts with reasonable compensation, the SS wage base restart, and QBI wage limits — optimize the system, not one variable.'
    ],
    bestFit: [
      'Accrual-basis businesses with a non-owner bonus pool — the 2.5-month rule is nearly free money for them.',
      'Owners with lumpy income who have a staff bonus pool — the deduction can be placed in the higher-rate year (accrual: by fixing the liability at year-end; cash: by paying before or after December 31).',
      'C-corp owners choosing between a December and a January bonus.',
      'S corps coordinating year-end owner comp with §199A wage-limit and reasonable-compensation needs (not for shifting income).'
    ],
    implementation: [
      'Confirm the accounting method and identify owner vs. non-owner bonus recipients (apply §267(e) broadly for S corps — every owner counts).',
      'For non-owner bonuses: fix the liability by year-end via board resolution or written plan; calendar payment inside the 2.5-month window.',
      'For owner bonuses: identify the entity type first. S corp or partnership — size the bonus for reasonable compensation and the §199A wage limit, and pay it by December 31 if it is needed for either; do not present it as moving income between years. C corp — project both years and run the bonus in December or the first quarter accordingly.',
      'Document the resolution and payroll records; deposit employment taxes on schedule.',
      'Re-run the projection every November — the right answer changes year to year.'
    ]
  },

  client: {
    teaser: 'Deduct this year\'s staff bonuses now, even if you pay them early next year',
    headline: 'Time your bonuses so the deduction lands in the right year',
    plainEnglish: [
      'If your business keeps its books on the accrual method, it can often deduct this year a bonus to your employees that it does not actually pay until early next year — as long as the commitment was locked in by December 31 and the bonus is paid within two and a half months. You get the write-off a year sooner and keep the cash a little longer.',
      'If your business is on the cash method, the rule is simpler: a bonus is deducted in the year you pay it. So choosing to pay staff bonuses in late December or in early January decides which year gets the deduction — useful when one year\'s income is much higher than the other.',
      'Your own bonus works differently. If your business is an S corporation or a partnership, paying yourself a bonus in December instead of January does not move your income into a cheaper year — the bonus and the business\'s deduction for it show up on the same tax return and cancel out, and the bonus adds Social Security and Medicare tax. We set your own pay for other reasons (a salary the IRS will accept, and the rules for the business-income deduction). Only owners of regular C corporations have a real December-or-January choice on their own bonus.'
    ],
    analogy: 'It\'s like deciding which month to book a large expense you were going to pay anyway — the amount does not change, but the year it counts in can.',
    benefits: [
      'Employee bonuses can be deducted before they are even paid (accrual businesses)',
      'The deduction lands in the year where it saves the most',
      'Your own pay is set at the right level, not just the right date',
      'Costs nothing — it is scheduling, not spending'
    ],
    steps: [
      'Each fall we project your taxes for this year and next, side by side',
      'We recommend which year should carry the staff bonus deduction',
      'Employee bonus commitments get documented before year-end',
      'Payroll runs on the dates we set — that\'s it'
    ],
    considerations: [
      'The plan is only as good as the projection — a surprise late-year income swing can change the right answer, so we revisit before the final payroll.',
      'Owner bonuses follow stricter rules than employee bonuses; the deduction always matches the year you are actually paid.',
      'For S corporation owners, an extra bonus to yourself usually raises your total tax rather than lowering it — we only recommend one when your salary needs to be higher for other reasons.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. Timing value depends on year-over-year rate differences; model specific shifts by adjusting income inputs across scenarios.']
      : [] };
  }
});
