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

/* ---------------------------------------------------------------------------
 * Retirement, health/fringe and credit strategies (second fix round).
 * ------------------------------------------------------------------------- */
function runMany(profile, list, years, growth, infl) {
  return TSIQ.computeScenario(profile, list.map(function (x) { return { strategy: S(x[0]), params: x[1] }; }),
    years || 1, growth || 0, infl || 0);
}
function defaults(id, over) {
  var out = {};
  S(id).inputs.forEach(function (i) { out[i.key] = i.default; });
  return Object.assign(out, over || {});
}

/* 24. Solo 401(k), self-employed. Single, Sch C 150,000.
 *     SE tax 138,525 × 15.3% = 21,194.33; half 10,597.16; earned income
 *     139,402.84. Employer limit 20% = 27,880.57. Deferral 24,500 + 8,000
 *     catch-up. Total 60,380.57 (catch-up is deductible for the self-employed). */
var k1 = run({ filingStatus: 'single', scheduleCNet: 150000 }, 'solo-401k',
  { employeeDeferral: 32500, employerContribution: 60000, age50Plus: 'yes' });
near('solo 401k SE: employer limited to 20% of earned income', k1.years[0].profile.adjustments, 60380.57, 0.01);
near('solo 401k SE: reduces QBI', k1.years[0].profile.qbiReduction, 60380.57, 0.01);

/* 25. Solo 401(k), S-corp owner over $150,000 of wages: catch-up is Roth.
 *     Wages 200,000: employer 25% = 50,000; §415(c) 72,000 − 24,500 = 47,500.
 *     Deducted: 24,500 deferral (no catch-up) + 47,500 off K-1. */
var k2 = run({ filingStatus: 'mfj', ownerWages: 200000, passthroughK1: 300000, entityW2Wages: 200000 },
  'solo-401k', { employeeDeferral: 32500, employerContribution: 60000, age50Plus: 'yes' });
near('solo 401k W-2: Roth catch-up not deducted', k2.years[0].profile.adjustments, 24500);
near('solo 401k W-2: employer held to §415(c)', k2.years[0].profile.passthroughK1, 252500);

/* 26. 100%-of-pay limit. Wages 30,000: employer 25% = 7,500, but deferral +
 *     employer cannot exceed 30,000 → employer 5,500. K-1 profit is not pay. */
var k3 = run({ filingStatus: 'mfj', ownerWages: 30000, passthroughK1: 200000, entityW2Wages: 30000 },
  'solo-401k', { employeeDeferral: 24500, employerContribution: 20000, age50Plus: 'no' });
near('solo 401k: 100% of pay limit', k3.years[0].profile.passthroughK1, 194500);
var k4 = run({ filingStatus: 'mfj', passthroughK1: 200000 }, 'solo-401k', defaults('solo-401k'));
near('solo 401k: K-1 alone is not compensation', k4.years[0].profile.adjustments || 0, 0);

/* 27. One employer, one set of limits. Wages 80,000, K-1 150,000.
 *     401(k) employer 20,000 = the full 25% of wages → SEP adds nothing.
 *     SIMPLE cannot be combined with another plan at all. */
var sP = { filingStatus: 'mfj', ownerWages: 80000, passthroughK1: 150000, entityW2Wages: 80000 };
var both = runMany(sP, [['solo-401k', defaults('solo-401k')], ['sep-ira', defaults('sep-ira')]]);
near('401k + SEP: SEP adds nothing', both.years[0].profile.passthroughK1, 130000);
var withSimple = runMany(sP, [['solo-401k', defaults('solo-401k')], ['simple-ira', defaults('simple-ira')]]);
near('401k + SIMPLE: SIMPLE not modeled', withSimple.years[0].profile.adjustments, 24500);
near('401k + SIMPLE: no SIMPLE match', withSimple.years[0].profile.passthroughK1, 130000);

/* 28. SEP with staff. Owner wages 100,000, staff payroll 200,000.
 *     Owner limit 25% = 25,000 → staff must get 25% × 200,000 = 50,000.
 *     K-1 200,000 − 25,000 − 50,000 = 125,000; 50,000 is a plan cost. */
var staffP = { filingStatus: 'mfj', ownerWages: 100000, passthroughK1: 200000, entityW2Wages: 300000 };
var sep = run(staffP, 'sep-ira', { contribution: 30000, staffEligiblePct: 100 });
near('SEP: staff contribution deducted', sep.years[0].profile.passthroughK1, 125000);
near('SEP: staff contribution is a cost', sep.years[0].planCosts, 50000);

/* 29. SIMPLE IRA, 25 or fewer employees, age 60–63: 18,100 + 5,250 = 23,350.
 *     Match 3% × 100,000 = 3,000. Staff match 6,000 deducted and costed. */
var simp = run(staffP, 'simple-ira', { deferral: 25000, matchAmount: 5000, smallEmployer: 'yes', age: '60to63', staffMatch: 6000 });
near('SIMPLE: small-employer limit + 60–63 catch-up', simp.years[0].profile.adjustments, 23350);
near('SIMPLE: match and staff match off K-1', simp.years[0].profile.passthroughK1, 191000);
near('SIMPLE: staff match is a cost', simp.years[0].planCosts, 6000);

/* 30. Defined benefit tied to pay. Wages 30,000 → ceiling 1.28 × 30,000 =
 *     38,400 (K-1 300,000 → 261,600). Sch C 150,000 → earned income 139,402.84. */
var db1 = run({ filingStatus: 'mfj', ownerWages: 30000, passthroughK1: 300000, entityW2Wages: 30000 },
  'defined-benefit-plan', { annualContribution: 150000 });
near('DB: held to 1.28 × owner wages', db1.years[0].profile.passthroughK1, 261600);
var db2 = run({ filingStatus: 'single', scheduleCNet: 150000 }, 'defined-benefit-plan', { annualContribution: 150000 });
near('DB: self-employed held to earned income', db2.years[0].profile.adjustments, 139402.84, 0.01);
is('DB: AGI not negative', db2.years[0].agi >= 0, true);

/* 31. §404(a)(7). 401(k) employer 20,000 on wages 80,000; 6% = 4,800, so
 *     15,200 is not deductible beside a 100,000 pension.
 *     K-1 150,000 − 20,000 − (100,000 − 15,200) = 45,200. */
var combo = runMany(sP, [['solo-401k', defaults('solo-401k')], ['defined-benefit-plan', { annualContribution: 100000 }]]);
near('401k + DB: employer money over 6% disallowed', combo.years[0].profile.passthroughK1, 45200);

/* 32. Cash balance stack is the owner's TOTAL. With a 44,500 401(k) already
 *     modeled, a 131,000 stack adds 86,500 (ceiling 24,500 + 4,800 + 102,400). */
var stack = runMany(sP, [['solo-401k', defaults('solo-401k')], ['cash-balance-stack', { combinedContribution: 131000, age50Plus: 'no' }]]);
near('stack: only the difference is added', stack.years[0].profile.passthroughK1, 43500);
near('stack: deferral not doubled', stack.years[0].profile.adjustments, 24500);

/* 33. Profit sharing: employer money needs pay; staff contribution is a cost. */
var ps0 = run({ filingStatus: 'mfj', passthroughK1: 200000 }, 'profit-sharing-new-comparability', { ownerAllocation: 40000, staffCost: 8000 });
near('profit sharing: nothing for a K-1-only owner', ps0.years[0].profile.passthroughK1, 200000);
var ps1 = run(staffP, 'profit-sharing-new-comparability', { ownerAllocation: 40000, staffCost: 10000 });
near('profit sharing: owner held to 25% of wages', ps1.years[0].profile.passthroughK1, 165000);
near('profit sharing: staff contribution is a cost', ps1.years[0].planCosts, 10000);

/* 34. Self-employed health insurance. Single, Sch C 50,000: half SE tax
 *     3,532.39 → earned 46,467.61, less a 24,500 deferral = 21,967.61 cap.
 *     Premiums already deducted on the return are not counted again. */
var seP = { filingStatus: 'single', scheduleCNet: 50000 };
var sehi = runMany(seP, [['solo-401k', { employeeDeferral: 24500, employerContribution: 0, age50Plus: 'no' }],
  ['se-health-insurance', { annualPremiums: 30000, alreadyDeducted: 0 }]]);
near('SEHI: capped at earned income after retirement', sehi.years[0].profile.adjustments, 46467.61, 0.01);
var sehi0 = run({ filingStatus: 'single', scheduleCNet: 150000 }, 'se-health-insurance', { annualPremiums: 18000, alreadyDeducted: 18000 });
near('SEHI: already deducted → nothing new', sehi0.years[0].profile.adjustments || 0, 0);

/* 35. §105 plan. Needs a spouse. MFJ Sch C 150,000: 15,000 reimbursed, 12,000
 *     of it already deducted above the line (moved, not added), 6,000 cash
 *     wage (FICA both halves 918, employer half 459 deducted).
 *     Sch C = 150,000 − 15,000 − 6,000 − 459 = 128,541. */
var merpS = run({ filingStatus: 'single', scheduleCNet: 150000 }, 'section-105-merp', defaults('section-105-merp'));
near('MERP: not for an unmarried owner', merpS.years[0].profile.scheduleCNet, 150000);
var mfjC = { filingStatus: 'mfj', scheduleCNet: 150000 };
var merp = run(mfjC, 'section-105-merp', { annualMedicalReimbursed: 15000, alreadyDeducted: 12000, spouseCashWage: 6000 });
near('MERP: Schedule C', merp.years[0].profile.scheduleCNet, 128541);
near('MERP: existing deduction moved', merp.years[0].profile.adjustments, -12000);
near('MERP: FICA on spouse wage', merp.years[0].otherTaxes, 918);
var merpSehi = runMany(mfjC, [['section-105-merp', defaults('section-105-merp')], ['se-health-insurance', defaults('se-health-insurance')]]);
near('MERP + SEHI: only the uncovered 3,000', merpSehi.years[0].profile.adjustments, 3000);
var shs = runMany(sP, [['spouse-health-s-corp', defaults('spouse-health-s-corp')], ['se-health-insurance', defaults('se-health-insurance')]]);
near('S-corp health + SEHI: premiums counted once', shs.years[0].profile.adjustments, 18000);
near('S-corp health: reduces QBI', shs.years[0].profile.qbiReduction, 18000);

/* 36. Staff benefits. No staff → nothing. In place of pay: employer FICA
 *     saved 8,000 × 7.65% = 612. As a new benefit: 8,000 deducted and costed.
 *     QSEHRA and ICHRA cannot be combined. §127: 5,250 per recipient. */
var ich0 = run(sP, 'ichra', defaults('ichra'));
near('ICHRA: no staff, no benefit', ich0.years[0].profile.passthroughK1, 150000);
var ich1 = run(staffP, 'ichra', { annualReimbursement: 8000, replaces: 'wages' });
near('ICHRA in place of pay: payroll tax saved', ich1.years[0].otherTaxes, -612);
near('ICHRA in place of pay: profit up by the same', ich1.years[0].profile.passthroughK1, 200612);
var ich2 = run(staffP, 'ichra', { annualReimbursement: 8000, replaces: 'new' });
near('ICHRA new benefit: cost shown', ich2.years[0].planCosts, 8000);
is('ICHRA new benefit: a net cost', ich2.years[0].totalBurden > run(staffP).years[0].totalBurden, true);
var hra2 = runMany(staffP, [['qsehra', { annualReimbursement: 6000, replaces: 'wages' }], ['ichra', { annualReimbursement: 8000, replaces: 'wages' }]]);
near('QSEHRA + ICHRA: ICHRA not modeled', hra2.years[0].profile.passthroughK1, 200459);
var edu = run(staffP, 'section-127-education', { annualAssistance: 20000, recipients: 2, replaces: 'wages' });
near('§127: 5,250 per recipient', edu.years[0].otherTaxes, -803.25, 0.01);

/* 37. Dependent care FSA nets the §21 credit given up. MFJ wages 180,000,
 *     two children: rate 35 − ceil(30,000 / 4,000) = 27%; 27% × 6,000 = 1,620.
 *     Single 100,000, one child: 35 − ceil(25,000 / 2,000) = 22%; × 3,000 = 660. */
var dc1 = run({ filingStatus: 'mfj', wages: 180000, kidsCTC: 2 }, 'dependent-care-fsa', { annualElection: 7500 });
near('DCFSA: credit given up, two children', dc1.years[0].otherTaxes, 1620);
var dc2 = run({ filingStatus: 'single', wages: 100000, kidsCTC: 1 }, 'dependent-care-fsa', { annualElection: 7500 });
near('DCFSA: credit given up, one child', dc2.years[0].otherTaxes, 660);
is('HSA: self-only default for a single filer with no dependents',
  S('hsa-contributions').inputs[0].defaultFrom({ filingStatus: 'single' }), 'self');

/* 38. R&D credit, §41(g). Founder with a business loss and wage income: no
 *     tax on business income → nothing usable. MFJ wages 150,000, K-1 100,000:
 *     taxable 197,800, tax 32,940, business share 100,000 / 197,800 → 16,653.19.
 *     Payroll offset: 7.65% × 120,000 payroll = 9,180. */
var founder = { filingStatus: 'mfj', wages: 250000, passthroughK1: -50000, entityW2Wages: 120000 };
var rd0 = run(founder, 'rd-credit', { creditAmount: 25000, qres: 0, payrollOffset: 'no' });
near('R&D: no use against tax on other income', rd0.years[0].otherCreditsAllowed, 0);
var rd1 = run(founder, 'rd-credit', { creditAmount: 25000, qres: 0, payrollOffset: 'yes' });
near('R&D: payroll offset', rd1.years[0].otherTaxes, -9180);
var rd2 = run({ filingStatus: 'mfj', wages: 150000, passthroughK1: 100000, entityW2Wages: 60000 },
  'rd-credit', { creditAmount: 0, qres: 400000, payrollOffset: 'no' });
near('R&D: limited to tax on business income', rd2.years[0].otherCreditsAllowed, 16653.19, 0.01);
near('R&D: nothing by default', run(founder, 'rd-credit', defaults('rd-credit')).years[0].otherCreditsAllowed, 0);

/* 39. Other credits: one year by default, net of the deduction they cancel,
 *     and only for a business with staff where the credit is for staff. */
var da = run(staffP, 'disabled-access-credit', defaults('disabled-access-credit'), 2);
near('§44: applied in year 1', da.years[0].otherCreditsAllowed, 5000);
near('§44: deduction added back', da.years[0].profile.passthroughK1, 205000);
near('§44: not repeated', da.years[1].otherCreditsAllowed, 0);
near('§45F: no staff, no credit', run(sP, 'childcare-credit-45f', defaults('childcare-credit-45f')).years[0].otherCreditsAllowed, 0);
var cc45 = run(staffP, 'childcare-credit-45f', { creditAmount: 20000 });
near('§45F: deduction added back', cc45.years[0].profile.passthroughK1, 220000);
var pf = run(staffP, 'pfml-credit-45s', { leaveWages: 4000, replacementPct: 100 });
near('§45S: 25% at full pay', pf.years[0].otherCreditsAllowed, 1000);
near('§45S: wage deduction added back', pf.years[0].profile.passthroughK1, 201000);
near('§45S: 12.5% at half pay', run(staffP, 'pfml-credit-45s', { leaveWages: 4000, replacementPct: 50 }).years[0].otherCreditsAllowed, 500);
near('energy credit: needs a business or rental', run({ filingStatus: 'single', wages: 150000 }, 'energy-credits', { creditAmount: 30000 }).years[0].otherCreditsAllowed, 0);

/* ---------------------------------------------------------------------------
 * Business-expense strategies and the remaining modeled strategies (third round).
 * ------------------------------------------------------------------------- */

/* 40. Accountable plan: only expenses nobody deducts today are new. A sole
 *     proprietor converting to an S corp already has them on Schedule C. */
near('accountable plan: new expenses', run(sP, 'accountable-plan', { annualAmount: 6000, status: 'new' }).years[0].profile.passthroughK1, 144000);
near('accountable plan: already deducted', run(sP, 'accountable-plan', { annualAmount: 6000, status: 'already' }).years[0].profile.passthroughK1, 150000);
is('accountable plan: default for a Schedule C client', S('accountable-plan').inputs[1].defaultFrom({ scheduleCNet: 150000 }), 'already');
near('Augusta rule: default 12 days × $500', run(sP, 'augusta-rule', defaults('augusta-rule')).years[0].profile.passthroughK1, 144000);
var apv = runMany(sP, [['accountable-plan', { annualAmount: 6000, status: 'new' }], ['vehicle-expense-method', defaults('vehicle-expense-method')]]);
near('accountable plan + vehicle: mileage not deducted twice', apv.years[0].profile.passthroughK1, 144000);

/* 41. Home office, actual method, 10% office: 10% of mortgage interest
 *     (22,000) and property tax (9,000) leaves Schedule A. */
var hoP = { filingStatus: 'mfj', scheduleCNet: 150000, mortgageInterest: 22000, propertyTax: 9000 };
var ho = run(hoP, 'home-office-deduction', { method: 'actual', annualAmount: 6000, alreadyClaimed: 0, officeSharePct: 10 });
near('home office: Schedule C', ho.years[0].profile.scheduleCNet, 144000);
near('home office: mortgage interest off Schedule A', ho.years[0].profile.mortgageInterest, 19800);
near('home office: property tax off Schedule A', ho.years[0].profile.propertyTax, 8100);
var hoS = run(hoP, 'home-office-deduction', { method: 'simplified', annualAmount: 6000, alreadyClaimed: 0, officeSharePct: 10 });
near('home office simplified: $1,500 cap', hoS.years[0].profile.scheduleCNet, 148500);
near('home office simplified: Schedule A untouched', hoS.years[0].profile.mortgageInterest, 22000);
near('home office: already claimed → nothing new', run(hoP, 'home-office-deduction', { method: 'actual', annualAmount: 6000, alreadyClaimed: 6000, officeSharePct: 10 }).years[0].profile.scheduleCNet, 150000);

/* 42. Vehicle: 12,000 miles, half at each rate = 8,910; the return already
 *     takes 7,000 → 1,910 new. */
var veh = run({ filingStatus: 'single', scheduleCNet: 100000 }, 'vehicle-expense-method',
  { businessMiles: 12000, method: 'standard', actualAmount: 0, janJunPct: 50, alreadyClaimed: 7000 });
near('vehicle: only the difference is new', veh.years[0].profile.scheduleCNet, 98090);

/* 43. DAF bunching re-times existing giving. None → nothing. 8,000 a year →
 *     24,000 default, 0 in off years, last bunch scaled to the years left. */
near('DAF: no giving, no benefit', run({ filingStatus: 'mfj', wages: 200000 }, 'daf-bunching', { bunchedContribution: 30000, bunchEveryNYears: 3 }).years[0].profile.charitable || 0, 0);
near('DAF: default is three years of giving', S('daf-bunching').inputs[0].defaultFrom({ charitable: 8000 }), 24000);
var daf = run({ filingStatus: 'mfj', wages: 200000, charitable: 8000 }, 'daf-bunching', { bunchedContribution: 24000, bunchEveryNYears: 3 }, 10);
near('DAF: bunch year', daf.years[0].profile.charitable, 24000);
near('DAF: off year', daf.years[1].profile.charitable, 0);
near('DAF: final bunch scaled to one year', daf.years[9].profile.charitable, 8000);

/* 44. Aircraft: nothing by default; held to business income; purchase-year
 *     depreciation in year 1 only. */
var airP = { filingStatus: 'mfj', scheduleCNet: 150000 };
near('aircraft: nothing by default', run(airP, 'personal-aircraft', defaults('personal-aircraft')).years[0].profile.scheduleCNet, 150000);
var air = run(airP, 'personal-aircraft', { purchaseYearDeduction: 400000, annualDeduction: 30000 }, 2);
near('aircraft: no loss created', air.years[0].profile.scheduleCNet, 0);
near('aircraft: later years operating costs only', air.years[1].profile.scheduleCNet, 120000);

/* 45. Prepaid expenses: pulled forward in year 1, reversed in the last year
 *     unless the client keeps prepaying. */
var pre = run(airP, 'prepaid-expenses', { prepaidAmount: 15000, keepsPrepaying: 'no' }, 3);
near('prepaid: year 1', pre.years[0].profile.scheduleCNet, 135000);
near('prepaid: middle year unchanged', pre.years[1].profile.scheduleCNet, 150000);
near('prepaid: unwinds in the last year', pre.years[2].profile.scheduleCNet, 165000);
near('prepaid: no unwind if permanent', run(airP, 'prepaid-expenses', { prepaidAmount: 15000, keepsPrepaying: 'yes' }, 3).years[2].profile.scheduleCNet, 150000);

/* 46. NOL: 80% of taxable income before the NOL, earliest years first.
 *     Single, wages 100,000: 80% × (100,000 − 16,100) = 67,120 a year;
 *     200,000 → 67,120 + 67,120 + 65,760. Labeled as an existing carryforward. */
var nolP = { filingStatus: 'single', wages: 100000 };
var nol = run(nolP, 'nol-planning', { nolAvailable: 200000 }, 4);
near('NOL: 80% limit, year 1', nol.years[0].profile.adjustments, 67120);
near('NOL: year 2', nol.years[1].profile.adjustments, 67120);
near('NOL: remainder in year 3', nol.years[2].profile.adjustments, 65760);
near('NOL: used up', nol.years[3].profile.adjustments || 0, 0);
is('NOL: shown as an existing carryforward',
  TSIQ.incrementalSavings(nolP, [{ strategy: S('nol-planning'), params: { nolAvailable: 200000 } }], 4, 0, 0)[0].kind, 'existing');

/* 47. Loss harvesting: 100,000 of losses against 60,000 of gains → −3,000 this
 *     year, 37,000 carried and used next year; the gain comes back when the
 *     replacement positions are sold (final year) unless held until death. */
var ghP = { filingStatus: 'mfj', wages: 200000, ltcg: 60000 };
near('harvesting: nothing by default', run(ghP, 'gain-loss-harvesting', defaults('gain-loss-harvesting')).years[0].profile.ltcg, 60000);
var gh = run(ghP, 'gain-loss-harvesting', { lossesHarvested: 100000, gainsHarvested: 0, outcome: 'sold' }, 3);
near('harvesting: $3,000 limit', gh.years[0].profile.ltcg, -3000);
near('harvesting: carryforward used', gh.years[1].profile.ltcg, 23000);
near('harvesting: gain returns on sale', gh.years[2].profile.ltcg, 160000);
near('harvesting: held until death', run(ghP, 'gain-loss-harvesting', { lossesHarvested: 100000, gainsHarvested: 0, outcome: 'held' }, 3).years[2].profile.ltcg, 60000);

/* 48. Hiring children through an S corp: 8,000 wages + 612 employer FICA off
 *     K-1; 1,224 of payroll tax; stops after the years entered. */
is('hire children: S corp owner defaults to payroll', S('hire-children').inputs[2].defaultFrom({ passthroughK1: 150000 }), 'scorp');
is('hire children: sole proprietor pays directly', S('hire-children').inputs[2].defaultFrom({ scheduleCNet: 150000 }), 'fmc');
var hk = run(sP, 'hire-children', { numChildren: 1, wagesPerChild: 8000, payer: 'scorp', years: 2 }, 3);
near('hire children: K-1', hk.years[0].profile.passthroughK1, 141388);
near('hire children: payroll tax', hk.years[0].otherTaxes, 1224);
near('hire children: ends after the years entered', hk.years[2].profile.passthroughK1, 150000);

/* 49. QBI aggregation. Single, 600,000 of income of which 100,000 is the
 *     sibling's; main wages 50,000, sibling wages 100,000. Separate:
 *     min(100,000, 25,000) + min(20,000, 50,000) = 45,000. Aggregated:
 *     min(120,000, 75,000) = 75,000. Gain 30,000 = 50% × 60,000 spare wages. */
var agP = { filingStatus: 'single', passthroughK1: 600000, entityW2Wages: 50000 };
var ag = run(agP, 'qbi-aggregation', { aggregatedW2Wages: 100000, siblingQbi: 100000 });
near('QBI aggregation: gain is the spare wages only', ag.years[0].qbiDeduction - run(agP).years[0].qbiDeduction, 30000);
near('QBI aggregation: nothing by default', run(agP, 'qbi-aggregation', defaults('qbi-aggregation')).years[0].qbiDeduction, run(agP).years[0].qbiDeduction);

/* 50. Partial disposition: 25,000 with 20 years left → 23,750 net in year 1,
 *     1,250 a year given back. Short-term rental frees only its own loss.
 *     QIP: baseline is 15-year straight-line (150,000 → 10,000 a year). */
var pad = run({ filingStatus: 'mfj', wages: 100000, rentalNet: 30000 }, 'partial-asset-disposition', { abandonedBasis: 25000, remainingYears: 20 }, 2);
near('partial disposition: year 1 net of baseline depreciation', pad.years[0].profile.rentalNet, 6250);
near('partial disposition: give-back', pad.years[1].profile.rentalNet, 31250);
var str = run({ filingStatus: 'mfj', wages: 300000, rentalNet: -50000 }, 'str-loophole', { otherRentalNet: -20000 });
near('short-term rental: only its own loss is freed', str.years[0].agi, 270000);
near('short-term rental: whole portfolio when no other rentals', run({ filingStatus: 'mfj', wages: 300000, rentalNet: -50000 }, 'str-loophole', { otherRentalNet: 0 }).years[0].agi, 250000);
var qip = run({ filingStatus: 'mfj', scheduleCNet: 300000 }, 'qip-bonus', { qipBasis: 150000, targetIncome: 'business' }, 2);
near('QIP: year 1 vs 15-year straight-line', qip.years[0].profile.scheduleCNet, 160000);
near('QIP: give-back', qip.years[1].profile.scheduleCNet, 310000);

/* 51. PTET is figured after the other entity deductions: K-1 150,000 less a
 *     20,000 employer 401(k) contribution = 130,000 × 9.3% = 12,090. */
var ptAfter = runMany(sP, [['ptet', { ptetRatePct: 9.3 }], ['solo-401k', defaults('solo-401k')]]);
near('PTET: on income after retirement contributions', ptAfter.years[0].ptetPaid, 12090);
is('SSTB suggestion: not below the phase-out', S('sstb-threshold-management').suggest({ filingStatus: 'mfj', isSSTB: true, passthroughK1: 300000 }), null);
is('SSTB suggestion: inside the phase-out', !!S('sstb-threshold-management').suggest({ filingStatus: 'single', isSSTB: true, passthroughK1: 250000 }), true);
near('S-corp suggestion: salary placeholder is half of profit', S('s-corp-election').suggest({ scheduleCNet: 150000 }).params.salary, 75000);

/* ---------------------------------------------------------------------------
 * Proposal figures: permanent savings vs. timing vs. existing value, and the
 * year-by-year comparison with the fee.
 * ------------------------------------------------------------------------- */

/* 52. valueSummary on a hand-built set of steps (3 years):
 *     savings 4,000 a year after 1,000 of plan costs; a staff benefit costing
 *     2,000 a year net (3,000 of plan costs); a deferral of 9,000 that comes
 *     back as 4,650 twice; a 5,000 carryforward.
 *     Permanent net = 4,000 − 2,000 = 2,000 a year; plan costs 4,000;
 *     gross 6,000. Timing: 9,000 first year, −300 net. Existing: 5,000. */
var vs = TSIQ.valueSummary([
  { kind: 'savings', firstYear: 4000, cumulative: 12000, byYear: [4000, 4000, 4000], planCostsByYear: [1000, 1000, 1000] },
  { kind: 'cost', firstYear: -2000, cumulative: -6000, byYear: [-2000, -2000, -2000], planCostsByYear: [3000, 3000, 3000] },
  { kind: 'timing', firstYear: 9000, cumulative: -300, byYear: [9000, -4650, -4650], planCostsByYear: [0, 0, 0] },
  { kind: 'existing', firstYear: 5000, cumulative: 5000, byYear: [5000, 0, 0], planCostsByYear: [0, 0, 0] }
], 3);
near('value: permanent first year', vs.permanent.firstYear, 2000);
near('value: permanent total', vs.permanent.total, 6000);
near('value: permanent gross', vs.permanent.gross[1], 6000);
near('value: plan costs', vs.permanent.planCosts[1], 4000);
near('value: deferral kept out of savings', vs.timing.firstYear, 9000);
near('value: deferral net over the projection', vs.timing.total, -300);
near('value: carryforward kept out of savings', vs.existing.total, 5000);

/* 53. feeSchedule. Gross savings 10,000 / 12,000 / 12,000, plan costs 2,500
 *     a year, fee 9,000 once plus 1,000 a year.
 *     Year 1: 10,000 − 2,500 − 10,000 = −2,500. Year 2: 12,000 − 2,500 −
 *     1,000 = 8,500 → running 6,000 (break-even). Year 3: 8,500 → 14,500. */
var fsch = TSIQ.feeSchedule({ years: 3, permanent: { gross: [10000, 12000, 12000], planCosts: [2500, 2500, 2500] } },
  { planning: 9000, annual: 1000 });
near('fee table: year 1 net', fsch.rows[0].net, -2500);
near('fee table: year 1 fee includes the plan fee', fsch.rows[0].fee, 10000);
near('fee table: year 2 running total', fsch.rows[1].cumulative, 6000);
is('fee table: break-even year', fsch.breakEvenYear, 2);
near('fee table: total net', fsch.totals.net, 14500);
near('fee table: total fee', fsch.totals.fee, 12000);
is('fee table: no break-even is reported as none',
  TSIQ.feeSchedule({ years: 1, permanent: { gross: [1000], planCosts: [0] } }, { planning: 5000, annual: 0 }).breakEvenYear, null);

/* 54. On a real plan the three parts add up to the whole, plan costs are
 *     attributed to the strategy that causes them, and a strategy that gives
 *     back more than a quarter of its first-year figure is timing. */
var vp = { filingStatus: 'single', scheduleCNet: 150000 };
var vsel = [
  { strategy: S('s-corp-election'), params: { salary: 80000, adminCost: 2500, entityTaxRatePct: 0, entityTaxMin: 0 } },
  { strategy: S('prepaid-expenses'), params: { prepaidAmount: 15000, keepsPrepaying: 'no' } },
  { strategy: S('nol-planning'), params: { nolAvailable: 20000 } }
];
var vsteps = TSIQ.incrementalSavings(vp, vsel, 3, 0, 0);
var vsum = TSIQ.valueSummary(vsteps, 3);
var vwhole = TSIQ.computeBaseline(vp, 3, 0, 0).totals.totalBurden - TSIQ.computeScenario(vp, vsel, 3, 0, 0).totals.totalBurden;
near('value: parts add up to the whole', vsum.permanent.total + vsum.timing.total + vsum.existing.total, vwhole, 0.01);
var scStep = vsteps.filter(function (x) { return x.strategy.id === 's-corp-election'; })[0];
near('value: S-corp admin cost attributed to the S-corp step', scStep.planCostsByYear[0], 2500);
near('value: permanent gross less plan costs = net', vsum.permanent.gross[0] - vsum.permanent.planCosts[0], vsum.permanent.net[0], 0.01);
is('value: prepaid expenses counted as timing', vsteps.filter(function (x) { return x.strategy.id === 'prepaid-expenses'; })[0].kind, 'timing');
is('value: NOL counted as existing', vsteps.filter(function (x) { return x.strategy.id === 'nol-planning'; })[0].kind, 'existing');
var dafSteps = TSIQ.incrementalSavings({ filingStatus: 'mfj', wages: 200000, stateRate: 0.08, propertyTax: 8000, mortgageInterest: 4000, charitable: 8000 },
  [{ strategy: S('daf-bunching'), params: { bunchedContribution: 24000, bunchEveryNYears: 3 } }], 10, 0.03, 0.025);
is('value: a strategy that gives back in off years is timing', dafSteps[0].kind, 'timing');
is('value: its net over the projection is still positive', dafSteps[0].cumulative > 0, true);

console.log('Engine tests: ' + passed + ' passed, ' + failures + ' failed.');
if (failures) process.exit(1);
