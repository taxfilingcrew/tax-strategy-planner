/* ============================================================================
 * STRATEGY: Self-Rental Structuring (Real Estate Held Separately)
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'self-rental-structuring',
  name: 'Self-Rental Structuring (Real Estate Held Separately)',
  category: 'Entity Structure',
  applyOrder: 18,
  modeled: false, // advisory-only: character/structure play; rent level and entity facts vary too much to model honestly

  advisor: {
    summary:
      'Hold the business\'s real estate personally or in a separate LLC and ' +
      'rent it to the operating entity at market rate. The rent is deductible ' +
      'to OpCo under §162; the rental income on the owner\'s side is excluded ' +
      'from self-employment income under §1402(a)(1). Who actually saves ' +
      'employment tax depends on the tenant: a PARTNER renting to his ' +
      'partnership converts SE-taxed profit into rent; a C-corp owner takes ' +
      'rent instead of wages or dividends; an S-corp owner saves nothing ' +
      '(distributions already escape SE tax); and a SOLE PROPRIETOR cannot ' +
      'do this at all — he and his business are one taxpayer, so there is no ' +
      'lease, no rent deduction and nothing to convert (a single-member LLC ' +
      'holding the building is disregarded and changes nothing). The catch is the self-rental recharacterization ' +
      'rule, Reg. §1.469-2(f)(6): net rental INCOME from property leased to a ' +
      'business in which the taxpayer materially participates is treated as ' +
      'NONPASSIVE — so it cannot absorb the client\'s passive losses — while ' +
      'net rental LOSSES from the same property remain passive and can be ' +
      'trapped. The Reg. §1.469-4 grouping election is the standard ' +
      'mitigation, and market-rate rent is the non-negotiable foundation.',
    mechanics: [
      'Structure: owner (or an LLC, often disregarded or husband-wife) holds ' +
      'the building; OpCo leases it under a written market-rate lease. OpCo ' +
      'deducts rent under §162(a)(3); owner reports the rental on Schedule E.',
      'Employment-tax character: rentals from real estate are excluded from ' +
      'SE income by §1402(a)(1). Rent paid by a PARTNERSHIP to a partner ' +
      'instead of additional distributive share avoids the 15.3%/2.9%/0.9% ' +
      'stack. S-corp distributions already avoid SE tax, so for S-corp ' +
      'owners there is NO employment-tax saving — the value is liability ' +
      'isolation, exit flexibility, and basis placement. A sole proprietor ' +
      'gets nothing: a taxpayer cannot rent to himself, and the building\'s ' +
      'depreciation, interest and taxes are simply Schedule C deductions.',
      'Tenant must be a separate taxpayer: S corp, C corp, or partnership. ' +
      'Rent a sole proprietor pays to a spouse works, at most, to the extent ' +
      'of the spouse\'s SEPARATE ownership, and draws scrutiny; for a ' +
      'building held as community property (the usual case in California) ' +
      'it generally fails for the same one-taxpayer reason.',
      'NIIT: self-rental income recharacterized as nonpassive (or grouped ' +
      'with the business) is excluded from the 3.8% net investment income ' +
      'tax (Reg. §1.1411-4(g)(6)) — often the largest real tax effect for an ' +
      'S-corp owner.',
      'Self-rental rule, Reg. §1.469-2(f)(6): if the tenant is a trade or ' +
      'business in which the taxpayer MATERIALLY participates, net rental ' +
      'income is recharacterized as nonpassive. It cannot shelter passive ' +
      'losses from other activities (the "PIG" play fails against a ' +
      'self-rental). Courts have consistently sustained the rule.',
      'The asymmetry: recharacterization applies only to net INCOME years. A ' +
      'net LOSS on the self-rental stays passive under the normal §469 rules ' +
      'and is usable only against passive income or on disposition (§469(g)) ' +
      '— so financing/depreciation that drives the rental negative can strand ' +
      'deductions.',
      'Mitigation — grouping: Reg. §1.469-4(d)(1) permits grouping the rental ' +
      'with the operating activity as one economic unit where they are under ' +
      'common control/ownership (each owner has the same proportionate ' +
      'interest). Grouped, the rental loses separate passive character and ' +
      'losses are not trapped; the election is disclosed, binding, and should ' +
      'be made deliberately.',
      'QBI: rental to a commonly controlled trade or business is treated as a ' +
      '§199A trade or business (Reg. §1.199A-1(b)(14)), so market rent ' +
      'generally keeps QBI character — unless the tenant is a commonly owned ' +
      'SSTB, in which case the rent is SSTB income too (Reg. §1.199A-5(c)(2)); §199A aggregation (Reg. §1.199A-4) can ' +
      'coordinate the wage/UBIA limits across the pair.',
      'Rent must be MARKET-RATE and paid under a real lease: above-market ' +
      'rent invites recharacterization/§482-style reallocation and (with a ' +
      'C-corp tenant) constructive-dividend exposure; below-market rent ' +
      'wastes the character benefit and distorts both entities\' economics.'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §162(a)(3)', note: 'OpCo\'s rent deduction — for property used in the trade or business in which the taxpayer has no equity/title, under a genuine lease at a reasonable amount.' },
      { type: 'IRC', cite: 'IRC §1402(a)(1)', note: 'Real estate rentals excluded from self-employment income — the character conversion at the heart of the strategy.' },
      { type: 'Reg', cite: 'Reg. §1.1411-4(g)(6)', note: 'Self-rental income treated as nonpassive under Reg. §1.469-2(f)(6), or grouped with the operating business, is not net investment income.' },
      { type: 'Reg', cite: 'Reg. §1.469-2(f)(6)', note: 'Self-rental recharacterization: net rental income from property rented to an activity in which the taxpayer materially participates is nonpassive; it cannot absorb passive losses.' },
      { type: 'Case', cite: 'Krukowski v. Comm\'r, 279 F.3d 547 (7th Cir. 2002)', note: 'Self-rental rule sustained as a valid exercise of regulatory authority — attorney\'s rental income from his own law firm tenant recharacterized as nonpassive.' },
      { type: 'Case', cite: 'Fransen v. United States, 191 F.3d 599 (5th Cir. 1999)', note: 'Same result — the recharacterization regulation upheld against a validity challenge.' },
      { type: 'Reg', cite: 'Reg. §1.469-4(d)(1)', note: 'Grouping election: rental and operating activities may be treated as one appropriate economic unit where ownership is proportionate — the standard mitigation for trapped self-rental losses.' },
      { type: 'Reg', cite: 'Reg. §1.199A-1(b)(14)', note: 'Self-rental to a commonly controlled trade or business is a §199A trade or business — preserves QBI treatment of the rent.' },
      { type: 'IRC', cite: 'IRC §469(g)', note: 'Suspended passive losses release in full on a fully taxable disposition of the activity — the eventual exit valve for trapped self-rental losses.' }
    ],
    requirements: [
      'A separate operating entity as tenant that is its own taxpayer (S corp, C corp or partnership — NOT a sole proprietorship or a disregarded LLC), and the real estate titled outside it (personally or in its own LLC).',
      'A written lease at documented market rent (appraisal or comparable leases in the file), actually invoiced and paid.',
      'Separate books, bank account, and insurance for the rental — the liability shield and the tax character both depend on real separateness.',
      'Deliberate §469 posture: decide up front whether to live with the recharacterization asymmetry or make the Reg. §1.469-4 grouping election (disclosure statement with the return).'
    ],
    risks: [
      'The self-rental trap: clients (and prior preparers) often plan to use self-rental income to absorb passive losses — Reg. §1.469-2(f)(6) forecloses it, and Krukowski/Fransen make the rule effectively unchallengeable.',
      'Loss stranding: heavy depreciation (e.g., a cost segregation study on the building) can drive the self-rental negative, and those losses are passive unless grouped — coordinate BEFORE commissioning the study.',
      'The grouping election is sticky: it binds future years and changes how material participation and dispositions are tested — model both postures before electing.',
      'Non-market rent is the exam wedge: above-market invites reallocation and constructive-dividend treatment; there is no safe harbor, only documentation.',
      'Moving a building OUT of an existing corporation to create this structure is a taxable event — the structure is for acquisitions and already-separate property, not corporate retrofits without a tax-cost analysis.',
      'Pitching SE-tax savings to the wrong client: a sole proprietor has none to get, and an S-corp owner already has them. Only partners (and C-corp owners, versus wages) see an employment-tax effect.',
      'California frictions: moving a building between an owner and an entity is a change in ownership that reassesses property tax under Prop 13 unless the proportional-interest exclusion applies (same owners, same percentages); documentary transfer tax may apply; a holding LLC owes the $800 annual tax plus the gross-receipts fee and files Form 568; lender consent is needed to re-title.'
    ],
    bestFit: [
      'Partners (and members of LLCs taxed as partnerships) about to buy a business building — the only owners for whom rent replaces SE-taxed profit.',
      'C-corp owners, for whom rent is a deductible way to take money out without payroll tax or a second layer of tax.',
      'S-corp owners who want the building out of the operating entity for liability and exit-flexibility reasons (no employment-tax saving — say so).',
      'Clients pairing the building with cost segregation, where grouping analysis determines whether accelerated losses are usable.',
      'Owners planning to sell the business someday but keep the real estate as a rental income stream.'
    ],
    implementation: [
      'Title the property personally or in a new LLC at acquisition (retrofits from a corporation need a tax-cost analysis first).',
      'Obtain market-rent support (appraisal or 2–3 comparable leases); execute a written lease with normal terms and actual monthly payment.',
      'Set up separate books, banking, and insurance for the rental activity.',
      'Run the §469 analysis both ways — recharacterization asymmetry vs. grouping — and if grouping wins, attach the Reg. §1.469-4 disclosure statement to the return for the first grouped year.',
      'Evaluate §199A aggregation for the wage/UBIA limits where relevant.',
      'Revisit rent against market annually and re-document; keep the lease renewed, not lapsed.'
    ]
  },

  client: {
    teaser: 'Keeps your building out of harm\'s way — and yours to keep if you ever sell the business',
    headline: 'Own your business\'s building the smart way',
    plainEnglish: [
      'Your business needs a place to operate, and someone is going to collect rent for that — it might as well be you. Instead of the business owning its building, you own the building personally (or in its own simple company) and lease it to your business at the going market rate.',
      'The main reasons to do this are protection and flexibility. If the business is ever sued, your real estate is not sitting inside it as a target. And if you sell the business someday, you can keep the building and its rent. The rent is a normal deductible expense for the business and income to you.',
      'Whether it also saves tax depends on how your business is set up. If your business is a partnership, rent is not hit with the 15.3% self-employment tax that your share of profit carries, so it reaches you with less tax. If it is an S corporation, your profits already avoid that tax, so there is no extra saving. And it does not work for a business you run in your own name — you cannot be your own landlord for tax purposes; the business has to be a separate company first.',
      'There is a technical wrinkle we manage for you: special IRS rules control how rental income and losses from your own building interact with the rest of your tax picture, and the right setup choice depends on your situation. We make that choice deliberately at the start — it is much easier to get right on day one than to fix later.'
    ],
    analogy: 'You become your business\'s landlord. The rent check it was always going to write just gets written to you — and the building stays yours no matter what happens to the business.',
    benefits: [
      'Your building is shielded from business lawsuits and debts',
      'For partnerships: rent reaches you without the self-employment tax on business profits (no added saving for S corporations)',
      'Keep the building — and its rent — even if you sell the business someday',
      'Sets up cleanly alongside depreciation strategies on the property'
    ],
    steps: [
      'We structure the ownership before (or as) you buy the property',
      'We document a fair market rent and put a real lease in place',
      'We make the technical elections that keep your deductions usable',
      'Each year we review the rent and records so it all stays defensible'
    ],
    considerations: [
      'The rent must be genuinely market-rate, with real payments and paperwork — this is an actual landlord relationship, not a label.',
      'If your building is already inside a corporation, moving it out can trigger tax — we check that math before recommending any change.',
      'In California, re-titling a building can raise its property tax assessment, and a separate company to hold it costs at least $800 a year — both go into the comparison.',
      'The IRS has special rules for renting to your own business; done casually they can trap deductions, which is exactly why we set the structure and elections deliberately.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math.']
      : [] };
  }
});
