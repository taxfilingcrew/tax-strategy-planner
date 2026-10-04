# Strategy Authoring Spec

Read this fully, plus `CLAUDE.md`, `js/data/strategies/cost-segregation.js` (a
MODELED example) and `js/data/strategies/augusta-rule.js` (note its validation
pattern) before writing any strategy file. Follow the existing files' style
exactly: same header comment format, same `TSIQ.strategyModules.push({...})`
registration, plain ES5 JavaScript (no arrow functions, no template literals,
no `const`/`let`).

## File location and naming

One strategy per file in `js/data/strategies/<id>.js`. The `id` is kebab-case
and matches the filename. Do NOT edit any shared file (index.html, engine,
app.js, other strategies) — your files are picked up by a registry rebuild.

## Required schema

```js
{
  id, name, category, applyOrder,          // category and applyOrder assigned in your task
  modeled: true|false,                     // false = advisory-only (see below)
  advisor: {
    summary,                               // 3-6 sentence technical summary
    mechanics: [...],                      // 4-6 bullets, full technical depth
    authority: [{type, cite, note}, ...],  // 4-8 entries — see citation discipline
    requirements: [...],                   // 3-5 bullets
    risks: [...],                          // 3-6 bullets incl. exam issues
    bestFit: [...],                        // 2-4 bullets
    implementation: [...]                  // 4-6 concrete steps with forms/deadlines
  },
  client: {
    teaser,                                // ONE line, enticing but must NOT identify
                                           // the strategy (used in anonymized pitch deck)
    headline,                              // one line
    plainEnglish: [...],                   // 2-3 paragraphs, 8th-grade level, no jargon/cites
    analogy,                               // one relatable sentence or two
    benefits: [...],                       // 3-4 bullets
    steps: [...],                          // 3-4 bullets ("we handle it" tone)
    considerations: [...]                  // 1-3 honest caveats in plain language
  },
  inputs: [...],                           // [] for advisory strategies
  appliesTo: function (profile) { return true; },
  apply: function (profile, params, yearIndex, state) { ... }
}
```

`authority.type` is one of: `'IRC'`, `'Reg'`, `'Case'`, `'Admin'` (rev procs,
rev ruls, notices, forms, IRS guides).

## Citation discipline (non-negotiable — built by a CPA, accuracy over speed)

- Cite ONLY authorities you are highly confident exist and say what you claim.
  IRC sections and major regs are usually safe; court cases are where
  hallucinations happen. If you are not certain of a case name + citation,
  OMIT IT — an entry list without a case is fine; a fabricated case is not.
- OBBBA (P.L. 119-21, July 2025) changed many provisions. Use the 2026 figures
  in `js/data/tax-tables-2026.js` (`TSIQ.TABLES_2026.limits`) — reference them
  in code via the tables object where used in `apply()`, and you may state them
  in advisor text.
- Post-OBBBA facts to respect where relevant: 100% bonus depreciation permanent
  (§168(k), property acquired after 1/19/25); §179 max $2,560,000 / phase-out
  $4,090,000 (2026); QBI permanent with widened phase-in; SALT cap $40,400 with
  phase-down; estate/gift exemption $15M PERMANENT (no sunset — do not say
  "before the sunset"); §1202 QSBS tiered 50/75/100% at 3/4/5 years with $15M
  cap for stock acquired after 7/4/25; residential clean energy credit (§25D)
  terminated after 2025; §174 domestic R&D expensing restored; misc 2% itemized
  deductions permanently gone; kiddie-tax threshold $2,700 (2026); DCFSA $7,500
  (2026); business mileage $0.725/mi Jan–Jun 2026 and $0.76/mi Jul–Dec 2026
  (midyear increase — `limits.mileageRateBusiness.janJun` / `.julDec`).

## MODELED vs ADVISORY strategies

**Modeled (`modeled: true`)**: has `inputs` and an `apply()` that transforms the
profile so the engine can quantify it. Never invent precision — model the
mechanical tax effect of advisor-entered amounts, and validate applicability
(see augusta-rule.js: if the profile lacks what the strategy needs, return the
profile unchanged with an explanatory note telling the advisor what's missing).

**Advisory (`modeled: false`)**: structural/planning strategies whose value
can't be honestly computed from return inputs (e.g., buy-sell agreements,
series LLCs). Full advisor + client content, `inputs: []`, and:

```js
apply: function (profile, params, yearIndex, state) {
  return { profile: profile, notes: yearIndex === 0
    ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
    : [] };
}
```

## Profile fields available to apply()

Never mutate — copy with `var p = Object.assign({}, profile);` and return
`{ profile: p, notes: [...] }`. Push user-facing notes only in `yearIndex === 0`
unless the note is year-specific.

| Field | Meaning |
|---|---|
| `wages` | outside W-2 wages |
| `ownerWages` | W-2 wages from client's own entity (engine charges both FICA halves) |
| `scheduleCNet` | sole-prop net profit (SE tax + QBI) |
| `passthroughK1` | S-corp/partnership ordinary income (QBI, no SE) |
| `entityW2Wages` | entity W-2 wages, drives §199A wage limit |
| `isSSTB` | SSTB flag |
| `rentalNet` | Schedule E net; `rentalLossesUsable` gates §469 losses |
| `ltcg`, `qualDiv`, `interest`, `otherIncome` | investment/other income |
| `propertyTax`, `mortgageInterest`, `charitable`, `otherItemized` | itemized |
| `adjustments` | ADD above-the-line deductions here (retirement, SE health, HSA) |
| `qbiReduction` | ADD amounts that also reduce §199A QBI (e.g., SE retirement contributions) |
| `otherCredits` | ADD nonrefundable federal credits (R&D, WOTC, 45F, §44, 45S) |
| `corpTaxPaid` | ADD entity-level federal tax (C-corp modeling, 21% via `TSIQ.TABLES_2026.corporateRate`) |
| `oneTimeGain` | gain from a one-off sale — present in year 1 only; sale strategies act on THIS, never on `ltcg`. Add later installments / inclusions to it in the year they are recognized |
| `spouseWages` | ADD W-2 wages paid to the spouse by the client's business (income, but not counted against the owner's Social Security wage base) |
| `otherTaxes` | ADD payroll or other federal taxes the strategy creates (e.g., both halves of FICA on a spouse's or child's wages) |
| `planCosts` | ADD the non-tax cash cost of running the strategy (payroll service, compliance, study fees). Counted in total burden, so savings are net of it. A cost that is also deductible is deducted from income AND added here |
| `ptetPaid` | entity-level STATE tax (PTET pattern) — credited against personal state tax; the engine adds it back to the state base, so state tax is unchanged |
| `entityStateTax` | ADD non-creditable entity-level state tax (e.g., CA 1.5% S-corp franchise tax); also subtract it from `passthroughK1` |
| `kidsCTC`, `otherDeps` | dependents |
| `stateRate` | flat state rate (decimal) |

Multi-year memory: use the shared `state` object (see cost-segregation.js's
suspended-loss pattern) — namespace your keys (`state.myStrategyThing`).

## State conformity (California)

`profile.caRules` is true when the advisor has "Apply California rules" on.
State tax is a flat rate on AGI, so a federal deduction the state does not
allow must be taken back out for the state:

- `TSIQ.stateAdjust(p, field, amount)` — the state's view of one profile
  field. After lowering `rentalNet` (or `scheduleCNet`, `passthroughK1`) by a
  deduction California does not allow (bonus depreciation, §179 above $25,000,
  §179D), call it with the same amount to put the income back for the state,
  and with the negative of each later give-back. The engine runs the adjusted
  profile through the passive-loss rules again, so a loss suspended federally
  is not double counted. `TSIQ.stateAdjust(p, 'rentalLossesUsable', false)`
  keeps rentals passive for the state (no real estate professional exception).
- `TSIQ.stateAddBack(p, amount)` — a flat add-back to the state base for items
  outside those fields (HSA deduction, QSBS or opportunity-zone gain excluded
  federally). Negative when the federal inclusion comes later.

Both do nothing when `caRules` is off. State entity taxes (California 1.5%
S-corp, 8.84% C-corp, $800 minimum) go in `entityStateTax`; rates are in
`TSIQ.TABLES_2026.california`.

## Shared limits and helpers

Strategies that share one legal limit coordinate through helpers in
`js/data/tax-tables-2026.js`. Use them instead of re-deriving the limit:

- `TSIQ.plan` — retirement plans. `TSIQ.plan.owner(p, state)` returns the
  owner's plan compensation (`route` `'se'` = Schedule C earned income, net
  profit less half of SE tax; `'w2'` = wages from the owner's corporation; a
  K-1 share of profit is not compensation). `TSIQ.plan.year(state)` is the
  running record of what earlier retirement strategies contributed this year
  (`deferral`, `catchUp`, `employer`, `db`, `simple`, `stack`); add to it after
  applying. `employerRoom`, `dbCeiling`, `combinedDisallowed` (§404(a)(7)) and
  `staffCost` cover the common limits. A SIMPLE IRA blocks every other plan.
- `TSIQ.health.year(state)` — health premiums already deducted this year, so
  one premium is never counted by two strategies.
- `TSIQ.staffBenefit` — benefits paid to non-owner staff (ICHRA, QSEHRA,
  §127). They are money out of the business: model them either in place of
  the same taxable pay (saving = employer payroll tax) or as a new benefit
  (deducted and added to `planCosts`). Require staff payroll
  (`entityW2Wages` above `ownerWages`).
- `TSIQ.credit` — `hasBusiness(p)` and `addBack(p, amount)` for the credits
  whose deduction is disallowed (§280C, §44(d)(7), §45F(f)).

A cost the client pays to get a benefit (staff contributions, plan fees) goes
in `planCosts`; never present a deduction for money spent as a saving on its
own. A default must not assume an amount the client may not have: default to
0, or derive it from Section 1 with `defaultFrom(profile)` (which may also
return a select value).

## Projection context

`state.yearIndex`, `state.projectionYears` and `state.growthFactor`
(income growth to date) are set each year. `state.applied[id]` is true for
strategies that already ran this year — use it so strategies sharing one legal
limit, or the same dollars, do not stack. Grow advisor-entered salaries and
similar amounts with `state.growthFactor` unless there is a reason not to.
Unused nonrefundable credits carry forward automatically.

Costs: an admin cost or study fee is a deduction AND an outlay — add it to
`planCosts` or raising the cost will raise the "savings". A credit that
cancels a deduction (§280C wage credits, §44, §45F) must add the credit back
to business income.

Projection years: `state.tables` holds the current year's tables (brackets,
standard deduction, §199A threshold, SS wage base indexed by the advisor's
inflation input). Read indexed amounts from `(state && state.tables) ||
TSIQ.TABLES_2026`; plan limits and other un-indexed constants stay on
`TSIQ.TABLES_2026`.

`inputs[]` entries: `{ key, label, type: 'currency'|'percent'|'number'|'select',
default, max?, options?, defaultFrom? }`. Optional `defaultFrom(profile)` returns
a default drawn from the client data (e.g., PTET rate from `profile.stateRate`);
the app applies it until the advisor edits the field. Keep a plain `default` too
— the validator and saved files use it.

## Modeling honesty rules

- If a benefit is TIMING (acceleration/deferral), model the give-back in later
  years like cost-segregation.js does — never show acceleration as free money.
- If a strategy merely enables another (e.g., late S-election), be advisory and
  say so in notes.
- If the client-side of an income shift isn't modeled (e.g., a child's own
  return), cap defaults so the unmodeled side is ~zero tax and say so in a note.
- Deductions against `scheduleCNet` also save SE tax; against `passthroughK1`
  they don't; via `adjustments` they save neither SE tax nor state-SALT quirks.
  Route the dollars to the correct field.

## Tone

Advisor content: written CPA-to-CPA, full depth, forms and deadlines named.
Client content: plain English, no section numbers, honest about caveats.
Teasers must not name the mechanism (see existing files for calibration).

## Output

Create exactly the files assigned to you, then reply with: the list of file
paths created, which are modeled vs advisory, and any point where you were
uncertain about a figure or authority (so it can be verified).
