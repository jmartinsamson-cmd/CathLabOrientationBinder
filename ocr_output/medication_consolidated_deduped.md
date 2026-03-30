# Consolidated Medication Reference (Deduplicated)

**Scope:** Merged from:

1. `ocr_output/corrected_transcript_best_effort.txt` (photo OCR)
2. `ocr_output/icu_guide_extracted.txt` (ED ICU Drug Guide extraction)
3. Web references used only where OCR was uncertain

> Safety note: This is an orientation aid, not a prescribing order set. Always follow local policy, pharmacist guidance, and active provider orders.

## Source priority used

1. ICU guide extracted text (when same medication appears in both)
2. Clear values from photo OCR cards
3. Web reference (only to resolve uncertainty)

## Deduplicated medication entries

| Medication | Consolidated values | Primary source | Uncertainty status |
| --- | --- | --- | --- |
| **Nitroglycerin (Tridil)** | Photo card shows low dose **5–50 mcg/min**, increase by **5 mcg every 5 min**, high dose **50–100 mcg/min**; card notes mix in glass / pre-mixed. ICU infusion table lists start **5–20 mcg/min**, up-titrate **5–20 mcg/min q3–5 min**, suggested max **400 mcg/min**. | Photo + ICU guide page 16 table | Keep both contexts (Cath card vs ICU table). |
| **Dobutamine (Dobutrex)** | Mix **500 mg / 250 mL** (photo). ICU infusion table: start **2.5–10 mcg/kg/min**, up **2.5 mcg/kg/min q15 min**, max **20 mcg/kg/min**, down **2.5 mcg/kg/min q15 min**. | Photo + ICU guide page 16 table | OCR dosing grid replaced by ICU table values. |
| **Dopamine** | Photo: **400 mg / 250 mL** (OCR concentration line likely misread). ICU infusion table: start **2.5–10 mcg/kg/min**, up **2.5–5 mcg/kg/min q5 min**, max **20 mcg/kg/min**, down **1 mcg/kg/min q30 min**. | Photo + ICU guide page 16 table | Concentration text uncertainty resolved by math + ICU titration table. |
| **Insulin (regular) drip** | Mix **100 units regular insulin in 100 mL NS**; **1 unit = 1 mL**; **10 units/hr = 10 mL/hr**. | Photo | No duplicate ICU row found in extracted titration table. |
| **Norepinephrine (Levophed)** | Photo card uses **single strength 4 mg/250 mL (16 mcg/mL)** and **double strength 8 mg/250 mL (32 mcg/mL)** with mL/hr conversions. ICU infusion table (weight-based): start **0.02–0.2 mcg/kg/min**, up **0.02 mcg/kg/min q5 min**, max **3 mcg/kg/min**, down **0.02 mcg/kg/min q15 min**. | Photo + ICU guide page 16 table | Keep both concentration-based bedside card and ICU weight-based guidance. |
| **Lidocaine** | Photo: bolus **50–100 mg**, infusion **1–4 mg/min**; single and double strength concentration card present. ICU table: start **1 mg/min**, up **0.5 mg/min q10 min**, max **4 mg/min**, down **0.25 mg/min q30 min**. | Photo + ICU guide page 16 table | OCR conversion rows replaced/confirmed by ICU titration row. |
| **Phenylephrine (Neo-Synephrine)** | Photo: mix **10 mg/250 mL D5W**, rapid BP support **100–180 mcg/min**, maintenance **40–60 mcg/min**, or weight-based titration. ICU table: start **0.5 mcg/kg/min**, up **0.5 mcg/kg/min q5 min**, max **5 mcg/kg/min**, down **0.1 mcg/kg/min q15 min**. | Photo + ICU guide page 16 table | Consolidated as dual mode (fixed-dose and weight-based). |
| **Nicardipine (Cardene)** | Photo: pre-mixed **20 mg/200 mL D5W**, start **5 mg/hr**, titrate by **2.5 mg/hr q10–15 min**, range **2.5–15 mg/hr**. ICU table: start **2.5–5 mg/hr**, up **2.5 mg/hr q5–15 min**, max **15 mg/hr**, down **1 mg/hr q10 min**. | Photo + ICU guide page 16 table | Well aligned between sources. |
| **Nitroprusside (Nipride)** | Photo: protect from light; mix **50 mg/250 mL D5W**; adjust **0.5 mcg/kg/min q3–5 min** (photo OCR). ICU table: start **0.3 mcg/kg/min**, up **0.2 mcg/kg/min q3–5 min**, max **10 mcg/kg/min**, down **0.1 mcg/kg/min q15 min**. | Photo + ICU guide page 16 table | ICU table used to stabilize uncertain OCR lines. |
| **Dexmedetomidine (Precedex)** | Photo: pre-mixed NS, total volume 100 mL, infusion ~**0.2–0.7 mcg/kg/hr**. ICU table: start **0.2–0.5 mcg/kg/hr**, up **0.1 mcg/kg/hr q30 min**, max **1.4 mcg/kg/hr**, down **0.1 mcg/kg/hr q15 min**. Web reference confirms maintenance range **0.2–0.7 mcg/kg/hr** for ICU sedation. | Photo + ICU guide + web | Resolved OCR ambiguity with ICU + web consistency. |
| **Flumazenil (Romazicon)** | Photo indicated: **0.2 mg IVP to start**, supplied as **0.1 mg/mL**. Web reference confirms repeat **0.2 mg every 1 minute** up to total **1 mg** (for sedation reversal). | Photo + web | Interval clarified from web. |
| **Naloxone (Narcan)** | Photo indicated: **0.4–2 mg IVP**, OCR uncertain interval. Web reference confirms repeat dosing typically every **2–3 minutes** to response. | Photo + web | Interval corrected from web. |
| **Vasopressin** | Photo: **100 units/100 mL NS**, start **0.04 units/min (2.4 mL/hr)**, titrate by **0.01 units/min q10–15 min**, max **0.07 units/min**; code note includes **40 units** one-time substitution statement [verify against local protocol]. ICU extracted text includes a line referencing vasopressin at **0.04 units/min** in shock context. | Photo + ICU text | Keep code-dose statement marked local-protocol dependent. |
| **Diamondback / Rotablator cocktails** | Photo-specific procedural mixes (verapamil/NTG/ViperSlide; Rotaglide/heparin/verapamil). | Photo | No reliable duplicate in ICU guide extract; treat as lab-specific local content. |

## Web reconciliations used

- Flumazenil dosing: [drugs.com/dosage/flumazenil](https://www.drugs.com/dosage/flumazenil.html)
- Naloxone dosing: [drugs.com/dosage/naloxone](https://www.drugs.com/dosage/naloxone.html)
- Dexmedetomidine dosing: [drugs.com/dosage/dexmedetomidine](https://www.drugs.com/dosage/dexmedetomidine.html)

## Remaining items to verify locally

- Exact concentration line on Dopamine card (OCR conflict)
- Any nonstandard conversion table rows on Levophed/Lidocaine cards
- Full heparin amount in Rotablator cocktail line
- Vasopressin code-dose wording against your current institutional protocol
