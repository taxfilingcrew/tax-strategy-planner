/* ============================================================================
 * STRATEGY: Family Management Company (FMC)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'family-management-company',
  name: 'Family Management Company (FMC)',
  category: 'Payroll & Family',
  applyOrder: 33,
  modeled: false,

  advisor: {
    summary:
      'The under-18 FICA exemption of §3121(b)(3)(A) requires the employer to ' +
      'be the child\'s parent — a sole proprietorship or a partnership owned ' +
      'solely by the parents. An S corporation is a separate employer, so ' +
      'children on S-corp payroll owe full FICA. The FMC workaround: the ' +
      'parents form a sole-proprietorship (or parent-only partnership) ' +
      'management company that employs the children and provides genuine ' +
      'family-labor services — scheduling, content, admin support — to the ' +
      'S corporation under a written services agreement for an arm\'s-length ' +
      'management fee. The S corp deducts the fee under §162; the FMC pays ' +
      'the children FICA-free; the FMC\'s fee income net of wages is roughly ' +
      'zero, so it adds little or no SE tax. STATUS: this is an UNTESTED ' +
      'position. No Code section, regulation, IRS ruling or court decision ' +
      'approves routing children\'s wages through a parent-owned management ' +
      'company to recover the FICA exemption an S corporation does not have, ' +
      'and commentators treat it as an economic-substance risk when the ' +
      'company exists only for that purpose. Present it to a client as an ' +
      'aggressive option with a documented downside, never as settled law. ' +
      'The conservative alternative is to pay the children on the S ' +
      'corporation\'s payroll and accept the 15.3%: the income shift to the ' +
      'child\'s 0% bracket still works.',
    mechanics: [
      'Parents form a sole prop (one parent) or a general partnership owned ' +
      'only by the two parents — critically NOT an LLC taxed as a corporation ' +
      'and not owned by anyone but the parents, or §3121(b)(3)(A) fails.',
      'A written management services agreement between the FMC and the S corp ' +
      'specifies the services (marketing content, filing, cleaning, mailings, ' +
      'scheduling) and the fee methodology.',
      'The children are employees of the FMC. Because the FMC employer is the ' +
      'parent, wages to under-18 children are FICA-exempt (§3121(b)(3)(A)) ' +
      'and FUTA-exempt to 21 (§3306(c)(5)).',
      'The S corp pays the management fee and deducts it under §162. The fee ' +
      'must be arm\'s-length for services actually delivered — related-party ' +
      'pricing that exists only to move money invites reallocation (§482 ' +
      'principles) or outright disallowance.',
      'FMC economics: fee income minus child wages minus a modest admin ' +
      'margin nets near zero, so the parent picks up little or no additional ' +
      'SE income. Any positive FMC net IS SE income to the parent — price ' +
      'the fee to cover wages plus actual costs.',
      'How it can fail: (1) common-law employer — if the S corporation ' +
      'directs the children\'s work and receives its benefit, the IRS can ' +
      'treat the S corporation as the true employer and assess FICA, ' +
      'penalties and interest; (2) economic substance (§7701(o)) — a company ' +
      'whose fee equals the wages it pays has no profit motive and no purpose ' +
      'but the exemption, exposing the 20% penalty (40% if undisclosed) of ' +
      '§6662(b)(6), which has no reasonable-cause defense; (3) §162/§482 — a ' +
      'fee out of line with the services is disallowed or reallocated.',
      'If the structure is respected, the endpoint is identical ' +
      'to the sole-prop version: deductible to the operating business, ' +
      'FICA-free wages, income-tax-free to the child up to the standard ' +
      'deduction ($16,100 in 2026).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §3121(b)(3)(A)', note: 'FICA exemption for a child under 18 employed by a parent — the reason the FMC must be a parent sole prop or parent-only partnership, not a corporation.' },
      { type: 'IRC', cite: 'IRC §3306(c)(5)', note: 'Parallel FUTA exemption through age 20 for a child employed by a parent.' },
      { type: 'IRC', cite: 'IRC §162(a)', note: 'S corp deduction for the management fee — ordinary, necessary, and reasonable in amount for services actually rendered.' },
      { type: 'IRC', cite: 'IRC §482', note: 'Commissioner\'s authority to reallocate income among commonly controlled businesses — the arm\'s-length standard the fee must survive.' },
      { type: 'IRC', cite: 'IRC §7701(o); §6662(b)(6), (i)', note: 'Codified economic substance doctrine and its strict-liability penalty (20%; 40% if the transaction is not disclosed) — the principal risk for a management company with no purpose beyond the payroll-tax exemption.' },
      { type: 'Admin', cite: 'No direct authority', note: 'No ruling, regulation or reported case approves (or specifically rejects) the family-management-company structure. The position rests on the general rules above; treat it as untested.' },
      { type: 'IRC', cite: 'IRC §1402(a)', note: 'Any FMC net profit after wages and costs is SE income to the parent — a reason to price the fee at cost plus a thin margin.' },
      { type: 'IRC', cite: 'IRC §63(c)(5)(B)', note: 'The child\'s standard deduction covers earned income up to $16,100 (2026), keeping the wages income-tax-free on the child\'s side.' }
    ],
    requirements: [
      'FMC formed as a parent sole prop or parent-only partnership with its own EIN, bank account, and payroll registration.',
      'Written services agreement between the FMC and the operating S corp, with a fee tied to documented services.',
      'Children do genuine, age-appropriate work tracked with timesheets; wages at market rate.',
      'Monthly (or at least regular) invoicing from the FMC to the S corp with actual payment — no year-end catch-up entries.'
    ],
    risks: [
      'The extra entity is the extra audit surface: an FMC with no invoices, no timesheets, and a fee that exactly equals the kids\' wages looks like what it is. Substance and paper trail are mandatory.',
      'A management fee out of proportion to the services can be reallocated or disallowed under §162/§482 principles — the S corp loses the deduction while payroll consequences remain.',
      'If the FMC is formed as (or elects to be) a corporation, or admits a non-parent owner, the §3121(b)(3)(A) exemption is lost entirely.',
      'FMC net profit above wages and costs picks up SE tax at the parent level, eroding the benefit — monitor annually.',
      'No authority: the structure has never been approved by the IRS or a court. If it is challenged the family owes the payroll tax it was avoiding plus penalties — tell the client that in writing.',
      'California: a minor generally needs a work permit and the employer a permit to employ; hours are limited on school days; children under 12 cannot be employed in most businesses, and the parent exemption covers only agricultural, horticultural and domestic work on the parent\'s own premises (Labor Code §1394). The FMC also needs its own EDD payroll account and workers\' compensation analysis. A sole proprietorship owes no $800 tax; an LLC would.'
    ],
    bestFit: [
      'S-corp owners with children under 18 (and old enough to work legally) doing real, separately managed work, who understand and accept an untested position.',
      'Families already committed to the Hiring Children strategy where the operating entity form blocks it.',
      'Owners disciplined enough to run a second small entity properly (invoices, payroll, separate account).'
    ],
    implementation: [
      'Form the FMC as a parent sole prop or parent-only partnership; obtain an EIN and open a dedicated bank account.',
      'Draft and sign a management services agreement between the FMC and the S corp; document how the fee was set (wages + payroll costs + modest admin margin).',
      'Register the FMC for payroll; onboard the children with job descriptions, W-4s, and timesheets; mark wages FICA-exempt.',
      'Invoice the S corp monthly; pay by traceable transfer; run FMC payroll on a regular cadence into accounts owned by the children.',
      'File the FMC\'s Schedule C (or Form 1065) and issue the children\'s W-2s each January.',
      'Give the client the comparison in writing: FMC (no FICA, untested) versus S-corp payroll (15.3% FICA, settled) — on $8,000 of wages the difference is about $1,200 a year per child.',
      'Review annually: services still real, fee still arm\'s-length, children still under 18 (the FICA exemption — and this structure\'s purpose — ends at 18).'
    ]
  },

  client: {
    teaser: 'A way to pay your kids without payroll tax when your business is a corporation — with a risk you should understand first',
    headline: 'A family payroll company for the kids-on-payroll tax break',
    plainEnglish: [
      'Paying your kids for real work in the business is one of the best family tax moves available — their wages are deductible to the business and taxed at the child\'s low rate. When a parent personally employs their own child under 18, the wages are also free of Social Security and Medicare tax. But that rule only works when the parent, personally, is the employer. If your business is an S corporation, the corporation is the employer, and the payroll-tax break does not apply.',
      'One approach some families use is a small side business, owned just by the parents, that does real work for the company — marketing content, filing, mailings, scheduling. The company pays that side business a fair monthly fee, and the side business employs the kids. Because the kids then work for their parents directly, the payroll-tax break may apply.',
      'We want to be straight about this one: neither the IRS nor any court has approved this arrangement. If it were challenged and lost, you would owe the payroll tax you skipped, plus penalties. The safe alternative is simply to pay your kids through the corporation and pay the payroll tax — about 15 cents on the dollar — which still moves income to your child\'s low tax rate. We will show you both sets of numbers and let you choose.'
    ],
    analogy: 'Your company already outsources things like cleaning or marketing to outside vendors. This makes your family the vendor — which may qualify for a tax break the company cannot get, but it is a path no court has walked yet.',
    benefits: [
      'May remove Social Security and Medicare tax on your kids\' wages',
      'The company deducts the fee like any other vendor expense',
      'Kids can earn up to $16,100 in 2026 with no federal income tax',
      'Their earnings can fund Roth IRAs and college savings'
    ],
    steps: [
      'We compare this with simply paying your kids through the corporation',
      'If you choose it, we set up the family company, its bank account and a written services agreement',
      'Your kids do the work; the family company pays them properly, with work permits where California requires them',
      'We handle the invoices, payroll forms, and year-end filings'
    ],
    considerations: [
      'This arrangement has not been approved by the IRS or the courts. If it fails, the payroll tax comes due with penalties.',
      'It adds a second small business to maintain — the records have to be kept up, and we weigh that effort against the savings before recommending it.',
      'The work and the fee must both be real and defensible; we document everything so it holds up.',
      'California limits what work children can do and at what age, and usually requires a work permit.'
    ]
  },

  inputs: [],

  appliesTo: function (profile) {
    return true;
  },

  apply: function (profile, params, yearIndex, state) {
    return { profile: profile, notes: yearIndex === 0
      ? ['Advisory strategy — appears in the plan documents but does not change the scenario math. Model the wage deduction itself with the Hiring Children strategy once the FMC is in place.']
      : [] };
  }
});
