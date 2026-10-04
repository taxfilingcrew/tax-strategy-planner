/* ============================================================================
 * STRATEGY: Multi-Entity QBI Structuring (ADVISORY)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'multi-entity-qbi',
  name: 'Multi-Entity QBI Structuring',
  category: 'QBI Optimization',
  applyOrder: 24,
  modeled: false,

  advisor: {
    summary:
      'An SSTB owner above the §199A threshold gets no QBI deduction on the ' +
      'SSTB — but activities that are NOT specified services (real estate ' +
      'rented to outsiders, product sales, admin/billing operations serving ' +
      'outside customers at genuine arm\'s length) can be separated into ' +
      'distinct entities whose income keeps the deduction. The final ' +
      'regulations closed the aggressive "crack and pack" version: under Reg. ' +
      '§1.199A-5(c)(2), when an entity with 50%+ common ownership provides ' +
      'property or services to a commonly owned SSTB, the PORTION provided to ' +
      'the SSTB is treated as a separate SSTB — a straight pro rata rule. ' +
      '(The 80% all-or-nothing test appeared only in the proposed ' +
      'regulations and was dropped from the final rule.) So income earned ' +
      'from the client\'s own practice never qualifies — including rent the ' +
      'practice pays on a building the owner holds — and only revenue from ' +
      'genuine outside customers or outside tenants keeps the deduction. Value depends on facts that cannot be honestly computed from ' +
      'return inputs, so this strategy is advisory-only.',
    mechanics: [
      'SSTB status is determined activity by activity: a medical practice is an ' +
      'SSTB, but the building it operates from, a medical-products line, an ' +
      'imaging center, or a billing company serving many practices need not be ' +
      '(Reg. §1.199A-5(b) defines the tainted fields).',
      'Anti-abuse rule (Reg. §1.199A-5(c)(2), final): with 50%+ common ' +
      'ownership (direct or indirect, §§267(b)/707(b) attribution), the ' +
      'portion of a separated entity\'s business that provides property or ' +
      'services to the SSTB is treated as a separate SSTB; the rest is not. ' +
      'There is no 80% cliff. An entity doing 90% of its business with the ' +
      'practice keeps the deduction on the other 10%; one doing 30% loses it ' +
      'on that 30%. The benefit is therefore exactly as large as the outside ' +
      'revenue (or the share owned by non-common owners).',
      'De minimis trap in the other direction (Reg. §1.199A-5(c)(1)): a ' +
      'non-SSTB entity with gross receipts ≤ $25M is wholly tainted as an SSTB ' +
      'if more than 10% of receipts come from specified services (5% above ' +
      '$25M) — keep professional services out of the clean entity entirely.',
      'The self-rental rule cuts favorably here: rental to a commonly controlled ' +
      'passthrough is treated as a trade or business for §199A (Reg. ' +
      '§1.199A-1(b)(14)) — but if the tenant is a commonly owned SSTB, the ' +
      'rental income is itself treated as SSTB income (Reg. §1.199A-5(c)(2)). ' +
      'Outside tenants and non-SSTB tenants are what keep rental QBI clean.',
      'Substance requirements are the whole ballgame: the separated entity needs ' +
      'its own employees (or a genuine employee-leasing arrangement), written ' +
      'intercompany contracts, arm\'s-length market pricing (transfer-pricing ' +
      'discipline), separate books, bank accounts, and licenses. Paper entities ' +
      'invite §482 reallocation and sham/substance attack.',
      'Composition with other strategies: the clean non-SSTB entities can then ' +
      'use W-2 wage optimization and Reg. §1.199A-4 aggregation among ' +
      'themselves (SSTBs can never aggregate).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §199A(d)(2)', note: 'SSTB definition — the fence this structuring works around; non-SSTB activities are outside it even when owned by the same taxpayer.' },
      { type: 'Reg', cite: 'Reg. §1.199A-5(c)(2)', note: 'The anti-"crack and pack" rule in the final regulations: where a 50%+ commonly owned business provides property or services to an SSTB, that portion is treated as a separate SSTB (pro rata). The proposed regulations\' 80% test was not adopted.' },
      { type: 'Reg', cite: 'Reg. §1.199A-5(c)(1)', note: 'De minimis rule: >10% of gross receipts from specified services (5% if receipts >$25M) taints the entire business as an SSTB.' },
      { type: 'Reg', cite: 'Reg. §1.199A-5(b)', note: 'Field-by-field definitions of specified services — the map of what can and cannot be separated cleanly.' },
      { type: 'Reg', cite: 'Reg. §1.199A-1(b)(14)', note: 'Self-rental to a commonly controlled passthrough is a §199A trade or business — the hook that gives separated real estate QBI status (subject to the SSTB-tenant taint).' },
      { type: 'IRC', cite: 'IRC §482', note: 'IRS authority to reallocate income among commonly controlled entities where intercompany pricing is not arm\'s length.' },
      { type: 'Case', cite: 'Moline Properties, Inc. v. Comm\'r, 319 U.S. 436 (1943)', note: 'A separate entity is respected only if it engages in actual business activity — the substance baseline every spun-off entity must meet.' }
    ],
    requirements: [
      'A genuinely separable non-SSTB activity: owned real estate, a products line, equipment, or a service operation with real or realistically obtainable third-party customers.',
      'Meaningful OUTSIDE revenue in the separated entity (only that share keeps the deduction), or an ownership structure below 50% common ownership after attribution.',
      'Full operational substance: employees, contracts, market pricing, separate books, licenses, and insurance in the separated entity.',
      'Professional-service receipts kept below the 10%/5% de minimis line in the clean entity.'
    ],
    risks: [
      'Reg. §1.199A-5(c)(2) recharacterization is the headline risk: whatever the separated entity earns from the commonly owned SSTB is SSTB income. A captive entity serving only the practice accomplishes nothing but cost — and that includes a building whose only tenant is the practice.',
      '§482 reallocation where intercompany pricing is off-market (management fees, rent, or service charges set to shift income rather than reflect value).',
      'Sham-entity/substance-over-form attack where the spun-off entity has no employees or independent activity (Moline Properties baseline).',
      'Ongoing cost and friction: separate returns, payroll, insurance, licenses, and intercompany accounting — the deduction recovered must clear this hurdle annually.',
      'State-level consequences multiply with each new entity. California: $800 a year per LLC plus the gross-receipts fee (or 1.5% for an S corp), a separate return for each, and no state benefit at all — California has no QBI deduction.'
    ],
    bestFit: [
      'SSTB owners well above the threshold (where threshold management alone cannot reach) with a substantial non-service component: practice-owned real estate, product/device sales, imaging or lab operations, or admin services marketable to outsiders.',
      'Groups already operating quasi-independent divisions that only need formal separation and outside revenue development.',
      'Clients with the discipline and scale to sustain real intercompany governance.'
    ],
    implementation: [
      'Inventory the practice\'s activities and revenue streams; identify components that are non-SSTB under Reg. §1.199A-5(b) and could serve outside customers.',
      'Test the structure against the 50% common-ownership rule and the 10%/5% de minimis rule using realistic revenue projections. Size the benefit on OUTSIDE revenue only — if the separated entity cannot get real outside revenue, stop here.',
      'Form the entity; move (or hire) the employees, assets, and licenses it needs to operate; open separate books and accounts.',
      'Paper the intercompany relationships: leases, service agreements, and pricing studies supporting arm\'s-length rates.',
      'Coordinate with the wage-optimization and aggregation strategies for the clean entities; revisit the outside-revenue share and the de minimis test annually as revenue mix shifts.'
    ]
  },

  client: {
    teaser: 'Parts of your business may qualify for a deduction the rest of it lost — if they stand on their own',
    headline: 'Separate what qualifies, so part of your income wins back the 20% deduction',
    plainEnglish: [
      'For certain professions, the 20% business-income deduction disappears at higher income levels. But the rule targets the professional services themselves — not everything you do. A building you rent to outside tenants, products you sell, or an administrative operation that serves other businesses can still qualify. Money your own practice pays to another company you own — including rent on your own building — does not.',
      'The problem is that when everything sits inside one company, the tax law paints it all with the same brush. By moving the qualifying activities into their own properly run companies — with their own staff, contracts, and customers — the income they earn can qualify for the deduction again.',
      'This only works when the separation is real. The IRS has specific rules against paper-only spin-offs, so we design structures with genuine substance: real operations, market pricing, and ideally real outside customers.'
    ],
    analogy: 'Think of your practice as a house where one smoker gets the whole house declared a smoking zone. Move the other activities into their own buildings and each one gets judged on its own air.',
    benefits: [
      'Recovers the 20% deduction on the parts of your income that can qualify',
      'Often adds liability protection and cleaner books as side benefits',
      'Creates building blocks for other tax strategies down the road',
      'Scales with your business — new qualifying activities can join the structure'
    ],
    steps: [
      'We inventory everything your business does and earns',
      'We identify which pieces can genuinely qualify on their own',
      'We design the structure, contracts, and pricing to meet the IRS rules',
      'We coordinate the new entities\' returns and revisit the numbers each year'
    ],
    considerations: [
      'The IRS rules count only what a separate company earns from OUTSIDE customers. Whatever it earns from your own practice is treated the same as the practice. We only recommend this when real outside revenue is achievable.',
      'More entities mean more ongoing cost — extra returns, payroll, bookkeeping, and in California at least $800 a year for each — so the recovered deduction has to clearly outweigh them, every year. The deduction is federal only; California does not have it.',
      'Because the benefit depends on facts we design together (customers, pricing, staffing), this plan shows it as a structural recommendation rather than a computed dollar amount.'
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
