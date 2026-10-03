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
near('PTET input default from profile', S('ptet').inputs[0].defaultFrom({ stateRate: 0.093 }), 9.3, 1e-9);

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

console.log('Engine tests: ' + passed + ' passed, ' + failures + ' failed.');
if (failures) process.exit(1);
