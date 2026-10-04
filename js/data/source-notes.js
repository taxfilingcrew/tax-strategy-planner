/* ============================================================================
 * SOURCE NOTES — where each entry field comes from on the client's prior-year
 * return. Shown under the fields on the opening page.
 *
 * Line numbers are specific to the form year below. Re-check every line
 * against the new forms when the tables move to the next tax year (the 2025
 * Form 1040 renumbered capital gains to 7a and AGI to 11a/11b, for example).
 *
 *   from  — the form and line to read the figure from
 *   check — where to look if that line is blank, combined, or needs adjusting
 * ==========================================================================*/
window.TSIQ = window.TSIQ || {};

TSIQ.SOURCE_NOTES = {
  returnYear: 2025,
  fields: {
    filingStatus: {
      from: '1040, page 1 — Filing Status boxes',
      check: 'Confirm nothing changed for this year (marriage, divorce, death of a spouse).'
    },
    kidsCTC: {
      from: 'Schedule 8812, line 4',
      check: 'Or count the child tax credit boxes in the 1040 Dependents section. Drop a child who turns 17 this year.'
    },
    otherDeps: {
      from: 'Schedule 8812, line 6',
      check: 'Or count the "credit for other dependents" boxes in the 1040 Dependents section.'
    },
    wages: {
      from: '1040, line 1z',
      check: 'Subtract the owner\'s W-2 from their own S corp (that goes in Owner W-2 wages). Line 1a is the W-2 box 1 total.'
    },
    scheduleCNet: {
      from: 'Schedule C, line 31',
      check: 'More than one Schedule C: use Schedule 1, line 3 (the total).'
    },
    passthroughK1: {
      from: 'Schedule E page 2, line 32',
      check: 'Ties to box 1 of each K-1 (1120-S or 1065). Leave rentals out; they go in Rental net income.'
    },
    ownerWages: {
      from: 'Owner\'s W-2 from the S corp, box 1',
      check: 'Or Form 1120-S, line 7 (compensation of officers) when there is one owner-officer.'
    },
    entityW2Wages: {
      from: 'Form 8995-A, Part II, line 4',
      check: 'If Form 8995 was filed instead: the K-1 Section 199A statement (1120-S box 17 code V; 1065 box 20 code Z), or Form 1120-S lines 7 + 8.'
    },
    rentalNet: {
      from: 'Schedule E page 1, line 21 — add all properties',
      check: 'Use line 21, not line 26: line 26 is after the passive-loss limit, and the tool applies that limit itself. Form 8582 shows what was suspended.'
    },
    ltcg: {
      from: 'Schedule D, line 15',
      check: '1040 line 7a mixes short- and long-term. Take out any one-off sale and enter it under One-time gain.'
    },
    oneTimeGain: {
      from: 'Not on last year\'s return',
      check: 'This year\'s expected sale: price less basis and selling costs. A sale already reported is on Form 4797 or Form 8949.'
    },
    qualDiv: {
      from: '1040, line 3a',
      check: 'Detail on Form 1099-DIV, box 1b.'
    },
    interest: {
      from: '1040, line 2b plus (line 3b minus line 3a)',
      check: 'Taxable interest plus the dividends that are not qualified. Leave out tax-exempt interest (line 2a).'
    },
    otherIncome: {
      from: '1040 lines 4b + 5b + 6b, plus Schedule 1 line 10 less its lines 3 and 5',
      check: 'Add net short-term gains (Schedule D, line 7). Drop one-offs that will not repeat.'
    },
    propertyTax: {
      from: 'Schedule A, line 5b (plus 5c)',
      check: 'No Schedule A: the county tax bills, or Form 1098 box 10 if the lender reports it. The client\'s own home, not rentals; not state income tax.'
    },
    mortgageInterest: {
      from: 'Schedule A, line 8e',
      check: 'No Schedule A: Form 1098, box 1.'
    },
    charitable: {
      from: 'Schedule A, lines 11 + 12',
      check: 'Line 14 also includes carryovers from earlier years. No Schedule A: ask the client.'
    },
    otherItemized: {
      from: 'Schedule A, lines 4 + 6 + 9 + 15 + 16',
      check: 'Medical over the floor, other taxes, investment interest, casualty, other. Leave out state income tax (line 5a); the tool computes it.'
    },
    fedWithholding: {
      from: 'This year\'s pay stubs — federal tax withheld year to date',
      check: 'Last year for scale: 1040, line 25d.'
    },
    fedEstimates: {
      from: 'IRS online account or the client\'s payment records',
      check: 'Last year for scale: 1040, line 26.'
    },
    stateWithholding: {
      from: 'This year\'s pay stubs — state tax withheld year to date',
      check: 'Last year for scale: CA 540, line 71.'
    },
    stateEstimates: {
      from: 'MyFTB account or the client\'s payment records',
      check: 'Last year for scale: CA 540, line 72.'
    },
    stateRatePct: {
      from: 'CA 540: line 64 divided by line 17, times 100',
      check: 'Total tax over California AGI. Add back any pass-through entity tax credit used. Other states: total tax over state AGI.'
    },
    isSSTB: {
      from: 'Form 8995-A, Part I, column (b) checked',
      check: 'Or the K-1 Section 199A statement. No form below the income threshold: decide from the type of business.'
    },
    rentalLossesUsable: {
      from: 'Schedule E, line 43 filled in (real estate professional)',
      check: 'Or tick when other passive income absorbs the loss (Form 8582, Part I). Do not tick for the $25,000 allowance alone; the tool applies that itself.'
    },
    oneTimeGainActive: {
      from: 'Not on the return',
      check: 'Ask the client: did they work in the business being sold?'
    }
  }
};
