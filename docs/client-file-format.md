# Client File Format (`*.tsiq.json`)

The interchange format between Claude (reading a prior-year tax return) and the
app's **Import Client File** button. One file per client. **Export Client File**
writes the same format, including the strategies checked in each scenario and
their parameters, so a plan can be reopened exactly as it was left.

## Rules for producing a client file from a tax return

1. **Never invent numbers.** Extract only what the return shows. If a value is
   not determinable, omit the key (the app keeps its default) and add a
   question to `notes` (e.g., "Could not find K-1 ordinary income — confirm").
2. Map to **the profile keys below** — they match the app's Section 1 fields.
3. All dollar amounts are plain numbers (no strings, no commas).
4. `suggestedStrategies` is a shortlist (typically 3–8) of strategy `id`s from
   `js/data/strategies/` that plausibly apply, each with a one-sentence
   `reason` grounded in the return data ("$210k Schedule C profit with no
   entity — SE tax exposure"). Optionally include `params` (matching the
   strategy's `inputs` keys) when the return supports an estimate.
5. Suggestions are leads for the CPA to evaluate — never present them as
   conclusions. The advisor validates every one.
6. Prior-year returns use prior-year law; the app computes 2026. Flag any
   figure that is likely to change materially in `notes`.

## Schema

```json
{
  "format": "tsiq-client-v1",
  "clientName": "Jane & John Sample",
  "sourceReturn": "2025 Form 1040",
  "profile": {
    "filingStatus": "mfj",          // single | mfj | mfs | hoh
    "wages": 0,                      // W-2 wages from outside jobs
    "scheduleCNet": 0,               // Schedule C net profit
    "passthroughK1": 0,              // S-corp/partnership ordinary income
    "ownerWages": 0,                 // client's own W-2 salary from their S-corp
                                     //   (NOT also in "wages")
    "entityW2Wages": 0,              // total W-2 wages paid by the entity,
                                     //   including the owner's (§199A)
    "isSSTB": false,
    "rentalNet": 0,                  // Schedule E net rental
    "rentalLossesUsable": false,     // true only for a real estate professional, an STR
                                     //   with material participation, or other passive income
    "ltcg": 0,                       // RECURRING long-term gains (repeat every year)
    "oneTimeGain": 0,                // gain from a one-off sale — taxed in year 1 only
    "oneTimeGainActive": false,      // true = business the client actively runs (no NIIT)
    "qualDiv": 0, "interest": 0, "otherIncome": 0,
    "propertyTax": 0, "mortgageInterest": 0, "charitable": 0, "otherItemized": 0,
    "kidsCTC": 0,                    // qualifying children under 17
    "otherDeps": 0,
    "fedWithholding": 0, "fedEstimates": 0,
    "stateWithholding": 0, "stateEstimates": 0,
    "stateRatePct": 5,               // percent, not decimal
    "years": 10, "growthPct": 3,
    "inflationPct": 2.5,             // bracket indexing for projection years
    "caRules": true                  // apply California non-conformity and entity taxes
  },
  "scenarios": {                     // optional — written by Export
    "sc2": {
      "label": "Scenario 2",
      "strategies": [
        { "id": "s-corp-election",
          "params": { "salary": 95000, "adminCost": 2500,
                      "entityTaxRatePct": 1.5, "entityTaxMin": 800 } }
      ]
    },
    "sc3": { "label": "Scenario 3 (optional)", "strategies": [] }
  },
  "suggestedStrategies": [
    {
      "id": "s-corp-election",
      "reason": "$210k Schedule C profit, no entity — every dollar bears SE tax.",
      "params": { "salary": 95000 }
    }
  ],
  "notes": [
    "Rental depreciation on Sch E looked like straight-line only — cost seg candidate.",
    "Confirm whether either spouse has an employer 401(k)."
  ]
}
```

## Notes on specific keys

- **`wages` vs. `ownerWages`** — Form 1040 line 1 combines them. Split the
  owner's salary from their own S corporation into `ownerWages` (the engine
  charges both halves of FICA on it, and it drives retirement and
  self-employed-health-insurance limits). If the split is not determinable from
  the return, leave it all in `wages` and add a question to `notes`.
- **`ltcg` vs. `oneTimeGain`** — Form 1040 line 7 does not distinguish them.
  A gain from selling a business, a building or a block of stock goes in
  `oneTimeGain`; the projection taxes it in year 1 only. Everything in `ltcg`
  is repeated (and grown) every projection year. The sale strategies
  (installment sale, §1031, opportunity zone, QSBS) act on `oneTimeGain` only.
- **`rentalLossesUsable`** — leave `false` unless the return shows the client
  is a real estate professional or has passive income absorbing the losses.
  When false, the engine allows the $25,000 rental loss allowance (phased out
  between $100,000 and $150,000 of income) and suspends the rest.
- **`scenarios`** — optional. When present, importing clears both scenario
  pickers and restores the saved strategies and parameters; strategy ids no
  longer in the library are skipped and reported. Files without it (older
  exports, or files produced from a return review) leave the pickers alone.
  `params` keys match each strategy's `inputs` keys.
- Any key left out keeps the app's default, so files written before a field
  existed still import.

## Confidentiality

Do not include SSNs, EINs, addresses, or account numbers in the client file —
the app never needs them. When asking Claude to read a return, redacting the
SSN first is good practice.
