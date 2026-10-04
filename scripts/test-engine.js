/* ============================================================================
 * ENGINE REGRESSION TESTS — run with:  node scripts/test-engine.js
 * Hand-computed expected values for the engine rules and strategy math that
 * are easy to get wrong. Every expected number below was worked by hand from
 * the 2026 tables (see the comment on each case). Run after any engine,
 * tables, or strategy change, alongside validate-strategies.js.
 * ==========================================================================*/
var fs = require('fs');
var path = require('path');

global.window = global;
var root = path.join(__dirname, '..');
require(path.join(root, 'js/data/tax-tables-2026.js'));
var dir = path.join(root, 'js/data/strategies');
fs.readdirSync(dir).filter(function (f) { return f.slice(-3) === '.js'; }).sort()
  .forEach(function (f) { require(path.join(dir, f)); });
require(path.join(root, 'js/data/strategies-index.js'));
require(path.join(root, 'js/engine/tax-engine.js'));
require(path.join(root, 'js/engine/scenario-engine.js'));

var failures = 0, passed = 0;
function near(label, actual, expected, tol) {
  tol = tol === undefined ? 0.5 : tol;
  if (Math.abs(actual - expected) <= tol) { passed++; return; }
  failures++;
  console.log('  FAIL ' + label + ': expected ' + expected + ', got ' + actual);
}
function is(label, actual, expected) {
  if (actual === expected) { passed++; return; }
  failures++;
  console.log('  FAIL ' + label + ': expected ' + expected + ', got ' + actual);
}
function S(id) { return TSIQ.getStrategy(id); }
function run(profile, id, params, years, growth, infl) {
  return TSIQ.computeScenario(profile, id ? [{ strategy: S(id), params: params }] : [],
    years || 1, growth || 0, infl || 0);
}

/* 1. Existing S-corp owner: salary bears both FICA halves; K-1 does not.
 *    MFJ, owner wages 80,000, K-1 120,000, entity wages 80,000.
 *    Payroll tax 80,000 × 15.3% = 12,240. AGI 200,000 − std 32,200 = 167,800.
 *    QBI = 20% × 120,000 = 24,000 (cap 33,560). Taxable 143,800.
 *    Tax = 2,480 + 9,120 + 22% × 43,000 = 21,060. Federal = 33,300. */
var r = TSIQ.computeYear({ filingStatus: 'mfj', ownerWages: 80000, passthroughK1: 120000, entityW2Wages: 80000 });
near('owner wages: payroll tax', r.ownerPayrollTax, 12240);
near('owner wages: SE tax', r.seTax, 0);
near('owner wages: QBI', r.qbiDeduction, 24000);
near('owner wages: taxable income', r.taxableIncome, 143800);
near('owner wages: income tax', r.incomeTax, 21060);
near('owner wages: total federal', r.totalFederal, 33300);

/* 2. Charitable 0.5%-of-AGI floor. MFJ, wages 300,000, property tax 15,000,
 *    mortgage 20,000, charitable 10,000. Floor 1,500 → 8,500 allowed.
 *    Itemized 43,500. Taxable 256,500.
 *    Tax = 2,480 + 9,120 + 24,332 + 24% × 45,100 = 46,756. */
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 300000, propertyTax: 15000, mortgageInterest: 20000, charitable: 10000 });
near('charitable floor', r.charitableFloor, 1500);
near('charitable allowed', r.charitableAllowed, 8500);
near('charitable: deduction', r.deduction, 43500);
near('charitable: income tax', r.incomeTax, 46756);
// Giving below the floor is worth nothing; never negative.
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 300000, charitable: 1000 });
near('charitable below floor', r.charitableAllowed, 0);

/* 3. $400 minimum QBI deduction. Single, wages 60,000, Schedule C 1,500.
 *    SE tax = 1,500 × 0.9235 × 15.3% = 211.94; half = 105.97.
 *    QBI = 1,394.03 (≥ 1,000) → 20% = 278.81 → minimum 400. */
r = TSIQ.computeYear({ filingStatus: 'single', wages: 60000, scheduleCNet: 1500 });
near('QBI minimum applies', r.qbiDeduction, 400, 0.01);
near('QBI minimum: taxable income', r.taxableIncome, 61500 - 105.97 - 16100 - 400, 0.05);
// QBI under $1,000 → ordinary 20% (900 − 63.58 = 836.42 → 167.28).
r = TSIQ.computeYear({ filingStatus: 'single', wages: 60000, scheduleCNet: 900 });
near('QBI minimum not triggered under $1,000', r.qbiDeduction, 167.28, 0.01);
// SSTB fully phased out → no active QBI → no minimum.
r = TSIQ.computeYear({ filingStatus: 'single', wages: 400000, scheduleCNet: 5000, isSSTB: true });
near('QBI minimum: phased-out SSTB gets none', r.qbiDeduction, 0);
// Larger QBI is unaffected by the minimum.
r = TSIQ.computeYear({ filingStatus: 'single', scheduleCNet: 100000 });
is('QBI minimum leaves normal deduction alone', r.qbiDeduction > 400, true);

/* 4. Bracket indexing. 2.5% for one year, rounded to $50:
 *    MFJ std 32,200 → 33,005 → 33,000; 12% bracket start 24,800 → 25,420 → 25,400;
 *    SS wage base 184,500 → 189,112.50 → 189,100. Year 0 is never indexed. */
var t1 = TSIQ.indexTables(TSIQ.TABLES_2026, 1.025);
is('indexing: std deduction', t1.standardDeduction.mfj, 33000);
is('indexing: bracket start', t1.brackets.mfj[1][0], 25400);
is('indexing: SS wage base', t1.fica.ssWageBase, 189100);
is('indexing: QBI threshold', t1.qbi.threshold.mfj, 413600);
is('indexing: SALT cap not indexed', t1.salt.cap.mfj, 40400);
is('indexing: source tables untouched', TSIQ.TABLES_2026.standardDeduction.mfj, 32200);
var flat = run({ filingStatus: 'mfj', wages: 200000 }, null, null, 3, 0, 0);
var idx = run({ filingStatus: 'mfj', wages: 200000 }, null, null, 3, 0, 0.025);
near('indexing: year 1 identical', idx.years[0].totalBurden, flat.years[0].totalBurden, 0.001);
is('indexing: later years lower with flat income', idx.years[2].totalBurden < flat.years[2].totalBurden, true);
near('indexing: no inflation = old behavior', flat.years[2].totalBurden, flat.years[0].totalBurden, 0.001);
// Wages 200,000, year 2: std 33,000 → taxable 167,000;
// tax = 2,540 + 12% × (103,300 − 25,400) + 22% × (167,000 − 103,300) = 25,902.
near('indexing: year 2 income tax', idx.years[1].incomeTax, 25902);

/* 5. S-corp election with a California-style entity tax.
 *    Schedule C 200,000, salary 80,000, admin 2,500. Employer FICA 6,120.
 *    Entity net 111,380 → 1.5% = 1,670.70 → K-1 109,709.30. */
var base = { filingStatus: 'mfj', scheduleCNet: 200000, stateRate: 0.06 };
var ca = run(base, 's-corp-election', { salary: 80000, adminCost: 2500, entityTaxRatePct: 1.5, entityTaxMin: 800 });
var noCa = run(base, 's-corp-election', { salary: 80000, adminCost: 2500, entityTaxRatePct: 0, entityTaxMin: 0 });
near('CA S-corp tax amount', ca.years[0].entityStateTax, 1670.70, 0.01);
near('CA S-corp tax reduces K-1', ca.years[0].profile.passthroughK1, 109709.30, 0.01);
near('CA S-corp tax in state total', ca.years[0].totalState,
  ca.years[0].personalStateTax + 1670.70, 0.01);
near('no entity tax by default', noCa.years[0].entityStateTax, 0);
is('CA S-corp tax lowers the savings', ca.years[0].totalBurden > noCa.years[0].totalBurden, true);
// Thin profit: 100,000 − 80,000 − 6,120 − 2,500 = 11,380 → 1.5% = 170.70 → $800 minimum.
var thin = run({ filingStatus: 'mfj', scheduleCNet: 100000 }, 's-corp-election',
  { salary: 80000, adminCost: 2500, entityTaxRatePct: 1.5, entityTaxMin: 800 });
near('CA $800 minimum', thin.years[0].entityStateTax, 800);

/* 6. PTET falls back to the client's state rate when no rate is supplied. */
var pt = run({ filingStatus: 'mfj', passthroughK1: 300000, stateRate: 0.093 }, 'ptet', {});
near('PTET default = state rate', pt.years[0].ptetPaid, 27900);
pt = run({ filingStatus: 'mfj', passthroughK1: 300000, stateRate: 0.093 }, 'ptet', { ptetRatePct: 5 });
near('PTET explicit rate wins', pt.years[0].ptetPaid, 15000);
near('PTET input default from profile', S('ptet').inputs[0].defaultFrom({ stateRate: 0.05 }), 5, 1e-9);
near('PTET input default under California rules', S('ptet').inputs[0].defaultFrom({ stateRate: 0.05, caRules: true }), 9.3, 1e-9);
// A PTET credit larger than the state tax carries forward; it is not lost.
var ptc = {};
r = TSIQ.computeYear({ filingStatus: 'mfj', passthroughK1: 100000, stateRate: 0.05, ptetPaid: 9300 }, ptc);
near('PTET: credit limited to state tax', r.personalStateTax, 0);
near('PTET: excess credit carried', r.ptetCreditCarry, 9300 - 0.05 * 109300, 0.01);

/* 7. Solo 401(k) catch-up tiers. Schedule C 250,000; ask for more than the cap. */
var seP = { filingStatus: 'single', scheduleCNet: 250000 };
function deferralCap(tier) {
  var out = run(seP, 'solo-401k', { employeeDeferral: 99999, employerContribution: 0, age50Plus: tier });
  return out.years[0].profile.adjustments;
}
near('401(k) under 50', deferralCap('no'), 24500);
near('401(k) 50+', deferralCap('yes'), 32500);
near('401(k) 60–63', deferralCap('60to63'), 35750);

/* 8. SEHI cap. S-corp owner: limited to W-2 wages from the entity; K-1 never counts. */
var k1Only = run({ filingStatus: 'mfj', passthroughK1: 150000 }, 'se-health-insurance', { annualPremiums: 18000 });
near('SEHI: K-1 only gets nothing', k1Only.years[0].profile.adjustments, 0);
var lowWage = run({ filingStatus: 'mfj', passthroughK1: 150000, ownerWages: 10000, entityW2Wages: 10000 },
  'se-health-insurance', { annualPremiums: 18000 });
near('SEHI: capped at owner wages', lowWage.years[0].profile.adjustments, 10000);
var schC = run({ filingStatus: 'mfj', scheduleCNet: 90000 }, 'se-health-insurance', { annualPremiums: 18000 });
near('SEHI: Schedule C full deduction', schC.years[0].profile.adjustments, 18000);

/* 9. 2026 mileage: 72.5¢ Jan–Jun, 76¢ Jul–Dec; later years use 76¢.
 *    12,000 mi at 50/50 = 12,000 × 0.7425 = 8,910; year 2 = 9,120. */
var mi = run({ filingStatus: 'single', scheduleCNet: 100000 }, 'vehicle-expense-method',
  { businessMiles: 12000, method: 'standard', actualAmount: 0, janJunPct: 50 }, 2);
near('mileage: blended 2026', 100000 - mi.years[0].profile.scheduleCNet, 8910, 0.01);
near('mileage: later year', 100000 - mi.years[1].profile.scheduleCNet, 9120, 0.01);
mi = run({ filingStatus: 'single', scheduleCNet: 100000 }, 'vehicle-expense-method',
  { businessMiles: 12000, method: 'standard', actualAmount: 0, janJunPct: 100 });
near('mileage: all Jan–Jun', 100000 - mi.years[0].profile.scheduleCNet, 8700, 0.01);

/* 10. Projection growth carries owner and entity wages with the business. */
var g = run({ filingStatus: 'mfj', ownerWages: 80000, entityW2Wages: 80000, passthroughK1: 120000 },
  null, null, 2, 0.10, 0);
near('growth: owner wages', g.years[1].profile.ownerWages, 88000, 0.01);
near('growth: entity wages', g.years[1].profile.entityW2Wages, 88000, 0.01);

/* 11. A one-time gain is taxed in year 1 only and never grows.
 *     Installment sale, $300,000 over 5 years, MFJ wages 150,000, state 8%:
 *     independent year-by-year computation gives a 10-year benefit of $6,764
 *     (the NIIT avoided, 3.8% × 200,000 = 7,600, less a SALT effect). */
var sale = { filingStatus: 'mfj', wages: 150000, oneTimeGain: 300000, stateRate: 0.08 };
var b10 = run(sale, null, null, 10, 0.03, 0.025);
near('one-time gain: in year 1', b10.years[0].profile.oneTimeGain, 300000);
near('one-time gain: gone in year 2', b10.years[1].profile.oneTimeGain, 0);
var inst = run(sale, 'installment-sale-property', { totalGain: 300000, spreadYears: 5 }, 10, 0.03, 0.025);
near('installment (property): 10-year benefit', b10.totals.totalBurden - inst.totals.totalBurden, 6764, 1);
near('installment: year 1 slice', inst.years[0].profile.oneTimeGain, 60000);
near('installment: year 3 slice', inst.years[2].profile.oneTimeGain, 60000);
near('installment: nothing after year 5', inst.years[5].profile.oneTimeGain, 0);
// Gain entered is smaller than the gain to spread → capped, never negative.
var small = run({ filingStatus: 'mfj', wages: 300000, oneTimeGain: 60000 },
  'installment-sale-business', { totalGain: 1000000, spreadYears: 5 }, 5);
near('installment: capped at gain entered', small.years[0].profile.oneTimeGain, 12000);
// Recurring gains entered in `ltcg` are not touched.
var none = run({ filingStatus: 'mfj', wages: 300000, ltcg: 60000 },
  'installment-sale-business', { totalGain: 1000000, spreadYears: 5 });
near('installment: needs the one-time field', none.years[0].profile.ltcg, 60000);
// Active-business gain is outside NIIT: 3.8% × min(500,000, AGI over 250,000).
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 100000, oneTimeGain: 500000 });
near('one-time gain: NIIT when passive', r.niit, 0.038 * 350000);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 100000, oneTimeGain: 500000, oneTimeGainActive: true });
near('one-time gain: no NIIT when active', r.niit, 0);

/* 12. §469(i) $25,000 rental loss allowance, phased out $100k–$150k of MAGI. */
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 90000, rentalNet: -20000 });
near('rental allowance: full under $100k', r.agi, 70000);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 130000, rentalNet: -30000 });
near('rental allowance: 25,000 − 50% × 30,000 = 10,000', r.agi, 120000);
near('rental allowance: rest suspended', r.suspendedRentalLossAdded, 20000);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 200000, rentalNet: -30000 });
near('rental allowance: none over $150k', r.agi, 200000);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 200000, rentalNet: -30000, rentalLossesUsable: true });
near('rental loss fully usable when flagged', r.agi, 170000);

/* 13. Non-itemizer charitable deduction: $2,000 joint, $1,000 otherwise. */
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 100000, charitable: 5000 });
near('non-itemizer charitable (MFJ)', r.deduction, 34200);
r = TSIQ.computeYear({ filingStatus: 'single', wages: 100000, charitable: 600 });
near('non-itemizer charitable (single, under cap)', r.deduction, 16700);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 100000, charitable: 5000, charitableToDAF: true });
near('non-itemizer charitable: DAF gifts excluded', r.deduction, 32200);

/* 14. §68: 37%-bracket filers lose 2/37 of itemized deductions.
 *     MFJ wages 1,200,000; property tax 30,000 (SALT floor 10,000); mortgage
 *     30,000; charitable 50,000 less the 6,000 floor = 44,000. Itemized 84,000.
 *     Income over the 37% threshold (768,700) is 431,300 → reduction is
 *     2/37 × 84,000 = 4,540.54. Deduction 79,459.46. */
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 1200000, propertyTax: 30000, mortgageInterest: 30000, charitable: 50000 });
near('itemized limit: reduction', r.itemizedLimitReduction, 4540.54, 0.01);
near('itemized limit: deduction', r.deduction, 79459.46, 0.01);
r = TSIQ.computeYear({ filingStatus: 'mfj', wages: 300000, propertyTax: 15000, mortgageInterest: 20000, charitable: 10000 });
near('itemized limit: none below the 37% bracket', r.itemizedLimitReduction, 0);

/* 15. Unused credits carry forward. Single, wages 60,000: taxable 43,900;
 *     tax = 1,240 + 12% × 31,500 = 5,020. A 30,000 credit uses 5,020 a year. */
var cst = {};
r = TSIQ.computeYear({ filingStatus: 'single', wages: 60000, otherCredits: 30000 }, cst);
near('credit: limited to tax', r.otherCreditsAllowed, 5020);
near('credit: carryforward', r.creditCarryforward, 24980);
r = TSIQ.computeYear({ filingStatus: 'single', wages: 60000 }, cst);
near('credit: carryforward used next year', r.otherCreditsAllowed, 5020);

/* 16. PTET leaves state tax unchanged (the state allows no deduction for it). */
var owner = { filingStatus: 'mfj', ownerWages: 80000, passthroughK1: 150000, entityW2Wages: 80000, stateRate: 0.08 };
var ptb = run(owner), pts = run(owner, 'ptet', { ptetRatePct: 8 });
near('PTET: baseline state tax', ptb.years[0].totalState, 18400);
near('PTET: state tax unchanged', pts.years[0].totalState, 18400);
is('PTET: federal tax falls', pts.years[0].totalFederal < ptb.years[0].totalFederal, true);

/* 17. Spouse payroll charges both halves of FICA on the spouse's wages:
 *     30,000 × 15.3% = 4,590. Business income falls by 30,000 + 2,295. */
var sp = run({ filingStatus: 'mfj', scheduleCNet: 150000 }, 'spouse-payroll',
  { spouseSalary: 30000, spouse401kDeferral: 0 });
near('spouse payroll: FICA charged', sp.years[0].otherTaxes, 4590);
near('spouse payroll: business income', sp.years[0].profile.scheduleCNet, 117705);
near('spouse payroll: spouse wages', sp.years[0].profile.spouseWages, 30000);
var spBase = run({ filingStatus: 'mfj', scheduleCNet: 150000 });
is('spouse payroll: salary alone is not a saving',
  spBase.years[0].totalBurden - sp.years[0].totalBurden < 100, true);
var spSingle = run({ filingStatus: 'single', scheduleCNet: 150000 }, 'spouse-payroll',
  { spouseSalary: 30000, spouse401kDeferral: 24500 });
near('spouse payroll: joint returns only', spSingle.years[0].profile.scheduleCNet, 150000);

/* 18. California rules: no state saving from bonus depreciation or an HSA. */
var caP = { filingStatus: 'mfj', scheduleCNet: 150000, stateRate: 0.08, caRules: true };
var caBase = run(caP, null, null, 3);
var caBonus = run(caP, 'bonus-depreciation', { eligibleBasis: 100000, targetIncome: 'business' }, 3);
// The state sees the full 150,000 of profit (no bonus), less the federal
// deduction for half of the SE tax actually paid — which is smaller once
// bonus has cut SE tax, so state tax edges UP in year 1, never down.
near('CA: bonus not deducted for the state (yr 1)', caBonus.years[0].stateAgi,
  150000 - caBonus.years[0].seTax / 2, 0.01);
near('CA: no give-back for the state either (yr 2)', caBonus.years[1].stateAgi,
  150000 - caBonus.years[1].seTax / 2, 0.01);
is('CA: bonus gives no state saving', caBonus.years[0].totalState >= caBase.years[0].totalState, true);
is('CA: bonus still saves federal tax', caBonus.years[0].totalFederal < caBase.years[0].totalFederal, true);
var noCaBonus = run(Object.assign({}, caP, { caRules: false }), 'bonus-depreciation',
  { eligibleBasis: 100000, targetIncome: 'business' }, 1);
is('CA off: bonus lowers state tax', noCaBonus.years[0].totalState < caBase.years[0].totalState, true);
var caHsa = run(caP, 'hsa-contributions', { coverage: 'family', catchUp55: 'no' });
near('CA: HSA leaves state tax unchanged', caHsa.years[0].totalState, caBase.years[0].totalState, 0.01);
// Real estate professional: California keeps the rental loss passive.
var repsP = { filingStatus: 'mfj', wages: 300000, rentalNet: -40000, stateRate: 0.08, caRules: true };
var repsB = run(repsP), repsS = run(repsP, 'reps-qualification', {});
near('CA: REPS federal AGI', repsS.years[0].agi, 260000);
near('CA: REPS state tax unchanged', repsS.years[0].totalState, repsB.years[0].totalState, 0.01);

/* 19. C-corp conversion, California. Single, Sch C 300,000, salary 120,000,
 *     admin 3,000. Employer FICA 9,180. Corporate profit 167,820.
 *     CA tax 8.84% = 14,835.29; federal 21% × 152,984.71 = 32,126.79. */
var cc = run({ filingStatus: 'single', scheduleCNet: 300000, stateRate: 0.08, caRules: true },
  'c-corp-conversion', { ownerSalary: 120000, dividendsPaid: 0, adminCost: 3000, corpStateRatePct: 8.84, exitTax: 'yes' }, 10, 0.03, 0.025);
near('C-corp: California corporate tax', cc.years[0].entityStateTax, 14835.29, 0.01);
near('C-corp: federal corporate tax', cc.years[0].corpTaxPaid, 32126.79, 0.01);
near('C-corp: admin counted as a cost', cc.years[0].planCosts, 3000);
is('C-corp: retained earnings taxed in the final year',
  cc.years[9].profile.qualDiv > 1000000, true);

/* 20. WOTC: lapsed for 2026 hires — zero by default, year 1 only, net of §280C. */
var wBase = { filingStatus: 'mfj', scheduleCNet: 150000 };
var w0 = run(wBase, 'wotc', { creditAmount: 0 }, 2);
near('WOTC: nothing by default', w0.years[0].otherCreditsAllowed, 0);
var w1 = run(wBase, 'wotc', { creditAmount: 4800 }, 2);
near('WOTC: applied in year 1', w1.years[0].otherCreditsAllowed, 4800);
near('WOTC: wage deduction added back', w1.years[0].profile.scheduleCNet, 154800);
near('WOTC: not repeated', w1.years[1].otherCreditsAllowed, 0);

/* 21. QSBS: stock acquired after 7/4/2025 cannot be excluded in 2026;
 *     California taxes an excluded gain in full. */
var qP = { filingStatus: 'mfj', wages: 250000, oneTimeGain: 2000000, stateRate: 0.08, caRules: true };
var qPost = run(qP, 'qsbs-1202', { excludedGain: 2000000, acquisitionEra: 'post', holdYears: 3, stockBasis: 0 });
near('QSBS: no 2026 exclusion for post-7/4/2025 stock', qPost.years[0].profile.oneTimeGain, 2000000);
var qPre = run(qP, 'qsbs-1202', { excludedGain: 2000000, acquisitionEra: 'pre', holdYears: 5, stockBasis: 0 });
near('QSBS: gain excluded federally', qPre.years[0].profile.oneTimeGain, 0);
near('QSBS: California still taxes it', qPre.years[0].totalState, run(qP).years[0].totalState, 0.01);
var qCap = run(Object.assign({}, qP, { oneTimeGain: 20000000 }), 'qsbs-1202',
  { excludedGain: 20000000, acquisitionEra: 'pre', holdYears: 5, stockBasis: 0 });
near('QSBS: $10M per-issuer cap', qCap.years[0].profile.oneTimeGain, 10000000);

/* 22. Plan costs count against savings: a higher S-corp admin cost must
 *     lower the savings, not raise them. */
var scP = { filingStatus: 'single', scheduleCNet: 150000, stateRate: 0.08 };
var scB = run(scP).years[0].totalBurden;
function scSave(admin) {
  return scB - run(scP, 's-corp-election', { salary: 80000, adminCost: admin, entityTaxRatePct: 0, entityTaxMin: 0 }).years[0].totalBurden;
}
is('S-corp: admin cost reduces savings', scSave(10000) < scSave(2500) && scSave(2500) < scSave(0), true);
near('S-corp: plan cost recorded', run(scP, 's-corp-election', { salary: 80000, adminCost: 2500, entityTaxRatePct: 0, entityTaxMin: 0 }).years[0].planCosts, 2500);

/* 23. Per-strategy figures: a deferral is classed as timing, not savings. */
var steps = TSIQ.incrementalSavings({ filingStatus: 'mfj', scheduleCNet: 150000, stateRate: 0.08 },
  [{ strategy: S('bracket-management'), params: { amountDeferred: 50000, source: 'business' } }], 10, 0.03, 0.025);
is('incremental: bracket management is timing', steps[0].kind, 'timing');
is('incremental: first-year figure is large', steps[0].firstYear > 10000, true);
is('incremental: projection total is not', steps[0].cumulative < 1000, true);

console.log('Engine tests: ' + passed + ' passed, ' + failures + ' failed.');
if (failures) process.exit(1);
