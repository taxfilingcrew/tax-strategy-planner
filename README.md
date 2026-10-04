[README.md](https://github.com/user-attachments/files/30095645/README.md)
# Tax Strategy Planner

A tax planning tool: input client return data, apply strategies from the library,
and compare **Baseline vs. Scenario 2 vs. Scenario 3** with a 10-year savings
projection. Produces an advisor technical view, a client-facing PDF, and a
client-facing slideshow — all from the same strategy library.

## How to run it

**As a desktop app (recommended):** double-click **`Add Desktop Shortcut.cmd`**
once — it puts a "Tax Strategy Planner" icon on your Desktop and Start Menu.
From then on, launch it like any program: a standalone window with its own
taskbar icon, no browser tabs or address bar. (Under the hood it uses the
Edge/Chrome app mode already on every Windows machine — nothing to install,
no security warnings, and it travels with the folder when shared.)

**Or in a browser:** double-click **`index.html`**. Same app either way.

## White-labeling (sharing with other firms)

Click **Brand Settings** in the header to set the firm name, brand color, and
logo. The branding flows through the whole app plus every client output
(PDF report, per-strategy handouts, slideshow, pitch deck) and is saved on
that computer. To give the tool to another firm, copy the whole
`tax-strategy-tool` folder — they open `index.html`, set their brand once,
and everything is theirs.

## Importing a prior-year return

Two ways to get a return into the app:

- **Import Return (PDF)** — reads a software-generated return PDF directly in
  your browser (nothing leaves your computer, no AI involved). Parsed figures
  appear in a review screen with the return's own AGI/taxable-income/total-tax
  lines for tie-out; nothing fills in until you click Apply. Scanned returns
  aren't supported (no text layer) — use the Claude workflow for those.
- **Import Client File** — loads a `.tsiq.json` produced by the Claude review
  workflow (which also suggests strategies with reasons) or by Export.

**Export Client File** saves the client's figures *and* the strategies checked
in each scenario with their parameters, so importing the file later reopens the
plan where you left it. Keep client files out of this repository — they belong
in the client's folder.

**One-off sales:** a gain from selling a business, a property or a block of
stock goes in **One-time gain this year**, not in recurring capital gains —
otherwise the projection repeats it every year. The installment-sale, §1031,
opportunity-zone and QSBS strategies work only on the one-time gain.

**Rental losses:** leave **Rental losses fully usable** unchecked unless the
client is a real estate professional, materially participates in a short-term
rental, or has other passive income. Unchecked, the tool allows the $25,000
rental-loss allowance (phased out between $100,000 and $150,000 of income) and
suspends the rest.

**California:** **Apply California rules** (on by default) removes state
savings California does not give — bonus depreciation, §179 above $25,000,
§179D, HSAs, QSBS, opportunity zones, real estate professional losses — and
applies California's S-corp (1.5%), C-corp (8.84%) and $800 minimum taxes where
a strategy creates an entity. Turn it off for a client in a conforming state.

**Existing S-corp owners:** enter the owner's own salary in **Owner W-2 wages
from own S-corp**, not in outside W-2 wages. The tool charges payroll tax on it
and uses it for retirement-plan and health-insurance limits.

## How to use it

1. **Section 1** — enter the client's tax return data (2026 figures or projections).
2. **Section 2** — browse the strategy library. Click any card for the full
   technical detail: mechanics, IRC citations, case law, risks, implementation.
3. **Section 3** — check the strategies for Scenario 2 (and optionally a different
   mix in Scenario 3), adjust each strategy's parameters (salary, building basis,
   PTET rate, etc.).
4. **Run Comparison** — see the side-by-side first-year columns and the
   multi-year projection with cumulative savings.
5. **Generate Client PDF Report** — opens a print window; choose "Save as PDF"
   in the print dialog.
6. **Launch Client Slideshow** — full-screen deck for presenting; navigate with
   arrow keys or the on-screen buttons.
7. **Launch Pitch Deck (strategies hidden)** — pre-engagement sales deck. Shows
   the baseline, each strategy anonymized as "Strategy #1, #2, …" with its
   incremental savings, the 10-year total, and your fee with the net benefit.
   Set the one-time plan fee and optional annual fee next to the button first.
   Strategy names are only revealed in the PDF/slideshow after they sign.

> Both outputs open in a new window — allow pop-ups for this page the first time.

## The strategy library

100 strategies across 10 categories (Entity Structure, QBI Optimization,
Payroll & Family, Retirement, Health & Fringe, Real Estate & Cost Recovery,
Business Expenses, Income Timing & Character, Credits & Incentives,
Succession & Exit). 56 are **modeled** (they change the scenario math);
44 are **advisory** (structural/planning items shown in the library and plan
documents without pretending to have computable savings). Use the search box
in Section 2 to find anything fast.

## Adding a strategy

1. Copy any file in `js/data/strategies/` as a template (see
   `docs/strategy-authoring-spec.md` for the full authoring rules).
2. Fill in the advisor content, client content, inputs, and the `apply()` math.
3. Run `node scripts/build-index.js` (registers it in index.html), then
   `node scripts/validate-strategies.js` (schema + math smoke tests) and
   `node scripts/test-engine.js` (hand-checked engine and strategy figures).

The library cards, scenario checkboxes, PDF, slideshow, and pitch deck all
pick it up automatically.

## Working on this with Claude Code

`CLAUDE.md` in this folder is read automatically at the start of every session —
it carries the project context (architecture rules, 2026 tables, accuracy-first).
Just open a session in this folder and ask for what you want, e.g.:

- "Add a Solo 401(k) strategy to the library"
- "Add a QSBS §1202 strategy"
- "Show effective tax rate in the comparison table"
- "Update the tables for 2027 when Rev. Proc. drops"

## Scope notes (v1)

Federal 2026 law per Rev. Proc. 2025-32 / OBBBA, including the 0.5%-of-AGI
charitable floor, the $1,000 / $2,000 charitable deduction for non-itemizers,
the 35% cap on itemized deductions for 37%-bracket filers, the $400 minimum
QBI deduction, the $25,000 rental-loss allowance, and both 2026 business
mileage rates (72.5¢ Jan–Jun, 76¢ Jul–Dec). Unused business credits carry
forward. State tax uses a flat effective rate, with California non-conformity
applied where a strategy models it.

Savings are net of the cash cost of running a strategy (payroll service,
compliance, study fees) where the strategy records one. The pitch deck and
slideshow show a timing strategy's net over the projection, not its
first-year deferral.

The multi-year projection applies 2026 law to every year. Brackets, the
standard deduction, capital-gain breakpoints, the §199A threshold, and the
Social Security wage base are indexed at the **Bracket inflation indexing**
rate in Section 1 (set it to 0 to hold 2026 amounts). The SALT cap is held at
its 2026 amount in every year.

Not yet modeled: AMT, depreciation recapture on sale, §461(l), AGI percentage
limits on charitable gifts, the 25% rate on unrecaptured §1250 gain, and the
scheduled SALT-cap changes after 2026.

**Library status:** an October 2026 review found problems in most strategies.
Fixed so far: the engine-level problems, the sale strategies, spouse payroll,
C-corp conversion, WOTC, the California treatment of the depreciation, HSA,
PTET and real-estate-professional strategies, and all of the retirement,
health/fringe and credit strategies (shared plan limits, pay-based ceilings,
premiums counted once, staff benefits shown at their real cost, credit limits
and add-backs). Still open: the business-expense strategies (accountable plan,
Augusta rule, home office, vehicle, donor-advised fund, aircraft, prepaid
expenses), a handful of others (NOL planning, gain/loss harvesting, hiring
children, QBI aggregation, partial disposition, short-term rental), and the
advisory write-ups — check those figures before a client sees them.
