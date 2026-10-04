/* ============================================================================
 * STRATEGY: Disabled Access Credit (§44)
 * One source object → advisor view, client PDF, client slideshow.
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};
TSIQ.strategyModules = TSIQ.strategyModules || [];

TSIQ.strategyModules.push({
  id: 'disabled-access-credit',
  name: 'Disabled Access Credit (§44)',
  category: 'Credits & Incentives',
  applyOrder: 84,

  advisor: {
    summary:
      'The §44 disabled access credit gives an eligible small business a ' +
      'credit equal to 50% of eligible access expenditures that exceed $250 ' +
      'but do not exceed $10,250 — a maximum credit of $5,000 per year. ' +
      'Eligible small business: gross receipts of $1,000,000 or less in the ' +
      'preceding year, OR no more than 30 full-time employees. Eligible ' +
      'expenditures are amounts paid to comply with the Americans with ' +
      'Disabilities Act — removing barriers, providing interpreters or ' +
      'readers, acquiring or modifying equipment, or making materials ' +
      'accessible. §44(d)(7) denies any deduction or other credit for the ' +
      'amount taken as credit. For larger projects, pair with the §190 ' +
      'architectural barrier removal deduction (up to $15,000/year) on the ' +
      'expenditures above the credit band.',
    mechanics: [
      'Credit = 50% × (eligible access expenditures − $250), with ' +
      'expenditures counted only up to $10,250 — maximum credit $5,000 per ' +
      'year. The band resets annually, so multi-year projects can capture the ' +
      'credit repeatedly.',
      'Eligible small business test (§44(b)): prior-year gross receipts ' +
      '≤ $1,000,000 OR ≤ 30 full-time employees (30+ hours/week for 20+ ' +
      'weeks). Not indexed — the receipts test has been $1M since enactment.',
      'Eligible access expenditures (§44(c)): removing architectural, ' +
      'communication, physical, or transportation barriers; qualified ' +
      'interpreters, readers, and similar services; acquiring or modifying ' +
      'equipment or devices for individuals with disabilities; accessible ' +
      'formats (braille, audio, large print). Must be reasonable and meet ADA ' +
      'accessibility standards. Barrier removal counts only for a facility ' +
      'FIRST PLACED IN SERVICE ON OR BEFORE NOVEMBER 5, 1990 (§44(c)(4)) — ' +
      'removing barriers in a newer building does not qualify, even though ' +
      'the building is \'existing\'. Interpreters, readers, accessible formats ' +
      'and adaptive equipment are not tied to the age of the building.',
      'No double benefit (§44(d)(7)): the credited amount cannot also be ' +
      'deducted, depreciated, or claimed under another credit — reduce the ' +
      'deduction/basis by the credit taken.',
      'Stacking: §44 credit on the first $10,250 band; §190 deduction (up to ' +
      '$15,000/year) for qualifying barrier-removal costs beyond it; remaining ' +
      'costs capitalized and depreciated (bonus-eligible where applicable).'
    ],
    authority: [
      { type: 'IRC', cite: 'IRC §44', note: 'The credit: 50% of eligible access expenditures between $250 and $10,250; eligible small business definition; ADA compliance standard.' },
      { type: 'IRC', cite: 'IRC §44(d)(7)', note: 'No double benefit — no deduction or other credit for amounts taken as the §44 credit.' },
      { type: 'IRC', cite: 'IRC §190', note: 'Companion deduction: up to $15,000/year of qualified architectural and transportation barrier removal expenses — usable alongside §44 on the excess.' },
      { type: 'Admin', cite: 'Form 8826', note: 'Disabled Access Credit computation; flows to Form 3800 general business credit.' },
      { type: 'IRC', cite: 'IRC §38 / §39', note: 'Nonrefundable general business credit; 1-year carryback, 20-year carryforward.' }
    ],
    requirements: [
      'Eligible small business status in the year claimed: prior-year gross receipts ≤ $1M or ≤ 30 full-time employees.',
      'Expenditures made to comply with the ADA. Barrier-removal expenditures qualify only for a facility first placed in service on or before 11/5/1990; services, accessible formats and equipment qualify regardless of the building\'s age.',
      'Costs must be reasonable and the modifications must meet applicable accessibility standards.',
      'Records: invoices, before/after documentation of the barrier removed or accommodation provided, and the deduction reduction for the credited amount.'
    ],
    risks: [
      'Barrier removal in any facility first placed in service after 11/5/1990 does not qualify (§44(c)(4)), nor does general remodeling — confirm the building\'s placed-in-service date before quoting the credit.',
      'The IRS has litigated abusive prepackaged schemes (e.g., pay-phone and ATM "accessibility" investments marketed purely for the credit) — the expenditure must serve the taxpayer\'s actual business and customers.',
      'Forgetting the §44(d)(7) deduction reduction is a common exam adjustment — the same dollars cannot be credited and depreciated.',
      'Nonrefundable; a no-tax year pushes the credit into carryforward (the tool carries it forward within the projection).'
    ],
    bestFit: [
      'Small practices and storefronts (medical/dental offices, restaurants, retail) making ADA improvements — ramps, restrooms, door hardware, signage.',
      'Businesses buying accessibility equipment or software (hearing loops, screen readers, accessible websites for customer use — confirm facts).',
      'Multi-year renovation plans that can spread eligible costs across years to reuse the $5,000 annual band.'
    ],
    implementation: [
      'Confirm eligible small business status (prior-year receipts ≤ $1M or ≤ 30 FTEs) before the spend.',
      'Identify the specific barrier or access need and document the ADA basis for the modification.',
      'Time the spending: costs up to $10,250 this year capture the full $5,000; defer additional eligible work to next year\'s band where practical.',
      'Reduce the related deduction/basis by the credit claimed (§44(d)(7)); apply §190 to qualifying excess up to $15,000.',
      'File Form 8826 with the return; retain invoices and before/after documentation.'
    ]
  },

  client: {
    teaser: 'A building upgrade where the government picks up half the tab',
    headline: 'Make your business accessible — at half price',
    plainEnglish: [
      'If your business spends money making itself accessible to people with disabilities — a ramp, an accessible restroom, wider doorways, better signage, hearing or vision equipment, even sign-language interpreters — the tax law reimburses half of it, up to $5,000 of credit each year.',
      'This is a credit, not a deduction: it comes straight off your tax bill, dollar for dollar. It is designed for small businesses, and the qualifying work is usually something you needed to do anyway to serve customers and comply with accessibility law.',
      'The limit resets every year. If you have a bigger accessibility project, we can plan the work across more than one year so you capture the credit more than once, and use a companion deduction for the larger costs.'
    ],
    analogy: 'It\'s like a 50%-off coupon on accessibility improvements — and you get a fresh coupon every year.',
    benefits: [
      'Half of your accessibility spending back, up to $5,000 off your taxes each year',
      'Covers equipment and services, not just construction',
      'The annual limit resets — bigger projects can be phased to claim it repeatedly',
      'Pairs with a separate deduction for larger renovation costs'
    ],
    steps: [
      'We confirm your business qualifies under the small-business rules',
      'We identify which of your planned improvements count',
      'We time the spending to make the most of the yearly limit',
      'We claim the credit and keep the records that support it'
    ],
    considerations: [
      'Physical changes to the building count only if the building was first in use by November 5, 1990 — newer buildings do not qualify for that part. Interpreters, accessible materials and adaptive equipment qualify either way.',
      'The same dollars cannot be both credited and deducted, so we do the coordination to keep the return clean.'
    ]
  },

  inputs: [
    { key: 'creditAmount', label: '§44 credit per year (max $5,000)', type: 'currency', default: 5000, max: 5000 },
    { key: 'years', label: 'Years the access spending recurs', type: 'number', default: 1 }
  ],

  appliesTo: function (profile) {
    return true; // eligible-small-business status certified by the advisor
  },

  /**
   * Adds the advisor-computed §44 credit (max $5,000) to otherCredits for the
   * number of years entered (default: year 1 only). §44(d)(7): the credited
   * amount cannot also be deducted, so business income is raised by the credit.
   */
  apply: function (profile, params, yearIndex, state) {
    var p = Object.assign({}, profile);
    var notes = [];
    var first = yearIndex === 0;
    if (!TSIQ.credit.hasBusiness(p)) {
      if (first) notes.push('The disabled access credit is a business credit — no business found in this profile. No benefit modeled.');
      return { profile: p, notes: notes };
    }
    var years = Math.max(1, Math.round(params.years || 1));
    if (yearIndex >= years) return { profile: p, notes: notes };
    var amt = Math.max(0, params.creditAmount || 0);
    if (amt > 5000) {
      amt = 5000;
      if (first) notes.push('§44 credit capped at the $5,000 statutory maximum (50% of expenditures between $250 and $10,250).');
    }
    p.otherCredits = (p.otherCredits || 0) + amt;
    TSIQ.credit.addBack(p, amt);
    if (first) {
      notes.push(TSIQ.fmt.usd(amt) + ' disabled access credit applied (nonrefundable) for ' +
        (years === 1 ? TSIQ.TABLES_2026.taxYear + ' only' : years + ' years') + ', net of the deduction it ' +
        'cancels (§44(d)(7) — the credited ' + TSIQ.fmt.usd(amt) + ' cannot also be deducted).');
      notes.push('Eligible small business only: prior-year gross receipts of $1 million or less, or no ' +
        'more than 30 full-time employees. Barrier-removal work counts only for a facility first ' +
        'placed in service on or before November 5, 1990.');
    }
    return { profile: p, notes: notes };
  }
});
