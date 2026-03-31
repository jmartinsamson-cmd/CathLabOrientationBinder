/* eslint-env browser */
/* global document, localStorage, setTimeout */

const STORAGE_KEY = "cathLabOrientationBinderState_v1";

const sections = [
  {
    id: "rn-1",
    role: "rn",
    title: "RN Medication Administration Requirements",
    items: [
      "IV admixture",
      "Administers IV infusions via IV pump, pressure bag, gravity, and IV piggyback",
      "Administers moderate (procedural) sedation and monitors patient",
      "Administers titratable IV medications including vasopressors and antihypertensives",
      "Administers and titrates high-risk medications (insulin, heparin, IV anticoagulants)",
      "Labels medications removed from Pyxis on and off sterile field",
      "Demonstrates process for returning medications to Pyxis or pharmacy after discharge",
      "Demonstrates narcotic waste procedure and proper medication disposal",
      "AHA ACLS medications and protocols",
      "Alaris IV pump and Guardrails usage"
    ]
  },
  {
    id: "rn-med-library",
    role: "rn",
    title: "RN Medication Reference Library",
    items: [
      "Review ED ICU Drug Guide content relevant to cath/EP medication workflows",
      "Review extracted medication dataset and validate entries against unit policy",
      "Validate high-alert medication handling workflow with preceptor",
      "Validate vasoactive infusion setup and titration guardrails",
      "Document medication pearls and unit-specific guidance in notes",
      "Use RN Medication Quick Guide section as the bedside reference output"
    ]
  },
  {
    id: "rn-med-quick-guide",
    role: "rn",
    title: "RN Medication Quick Guide (Printable)",
    referenceOnly: true,
    items: []
  },
  {
    id: "rn-2",
    role: "rn",
    title: "RN Access, Lines, and Temporary Cardiac Support",
    items: [
      "Participates in synchronized cardioversion",
      "Temporary pacing: transcutaneous",
      "Temporary pacing: transvenous",
      "Temporary pacing: epicardial",
      "Arterial catheter maintenance, blood sampling, and discontinuation",
      "Central venous catheter maintenance, blood sampling, and discontinuation",
      "Demonstrates oxygen delivery mode competency per role (BiPAP and ventilator support)"
    ]
  },
  {
    id: "rn-pre-procedure",
    role: "rn",
    title: "RN Pre-Procedure Readiness & Cath Form Review (IMG_5189)",
    items: [
      "Verify header identifiers complete before room entry: Date, Procedure, MD/Staff, Height, Weight",
      "Confirm complete allergy screening and reactions are documented (e.g., PCN, iodine, contrast, sulfa, codeine)",
      "Confirm risk/history checklist completion: HTN, DM, CHF, MI, PVD, COPD, CVA/TIA, sleep apnea, smoking status, angina class",
      "Validate anti-anginal and revascularization history fields: prior PTCA/stent, CABG, CCB, BB, long-acting nitrate, Ranexa",
      "Review pre-procedure labs required on form: BUN/Cr, INR, Hgb/Hct, troponin and relevant coagulation markers per protocol",
      "Reconcile anticoagulant/antiplatelet status and timing: Coumadin, Eliquis, Pradaxa, Xarelto, Plavix, Brilinta, Effient, heparin/lovenox",
      "Verify diabetic medication plan: insulin and metformin hold/continuation per policy and renal function",
      "Complete contrast accountability section: contrast used, contrast waste, fluoro time, and mGy documentation",
      "Prepare and account for procedural supplies listed on form: needles, sutures, blades, raytex, bovie, and key instruments",
      "Confirm lesion/device planning fields are prepped for intra-procedure documentation: lesion, vessel, guide catheter, guidewire, balloon, stent",
      "Perform time-out readiness check: consent, code status, baseline vitals/rhythm, access plan, and emergency equipment availability",
      "Document all pre-procedure checklist elements before first puncture to reduce omissions and improve handoff quality"
    ]
  },
  {
    id: "rn-advanced-dobutamine",
    role: "rn",
    title: "RN Advanced Procedures: Dobutamine Stress Echocardiography",
    items: [
      "Understand pre-procedure preparation: NPO, beta-blocker hold (24-48 hr), consent, baseline ECG",
      "Understand dobutamine protocol stages: 5-10 mcg/kg/min initial, increase 10 mcg/kg/min every 3 min",
      "Recognize target endpoint: 85% age-predicted maximum heart rate or wall motion abnormality",
      "Know atropine augmentation: 0.25-0.3 mg IV increments to max 1.2-2.0 mg if target HR not achieved",
      "Recognize termination criteria: target HR achieved, new wall motion changes, severe arrhythmias, hypertension (SBP >220), symptomatic hypotension, angina, intolerable symptoms",
      "Know contraindications: acute MI, severe arrhythmia, malignant HTN, LVOT obstruction, severe AS",
      "Maintain emergency medications: beta-blocker (metoprolol), nitroglycerin, atropine, ACLS meds",
      "Monitor for complications: nausea, headache, tremor, anxiety, chest pain, arrhythmias",
      "Understand post-procedure monitoring: vital signs stable for 15-30 min before discharge"
    ]
  },
  {
    id: "rn-advanced-impella",
    role: "rn",
    title: "RN Advanced Procedures: Impella Mechanical Circulatory Support",
    items: [
      "Understand device types: 2.5 (2.5 L/min), CP (4 L/min), 5.0/5.5 (5.5 L/min), RP (RV support)",
      "Know hemodynamic targets: MAP ≥65 mmHg, CI >2.0, PCWP 18 mmHg, SVO2 >60%, lactate ≤3",
      "Understand position verification: Impella CP inlet 3.5 cm below aortic annulus via echo",
      "Recognize position problems: suction alarms, worsening hemodynamics, hemolysis signs, arrhythmias",
      "Calculate native cardiac output: Total CO - Impella flow from controller estimate",
      "Understand anticoagulation: UFH infusion targeting aPTT 50-70 sec; monitor daily for hemolysis",
      "Know weaning criteria: off vasopressors/inotropes, adequate native CO, end-organ function resolved, lactate ≤2",
      "Understand weaning protocol: reduce performance level incrementally (P-8→P-6→P-4→P-2) with 15-30 min monitoring",
      "Maintain limb immobilization: assess pulses, capillary refill, temperature every 1-2 hours for ischemia",
      "Coordinate 24-hour echo access and position verification protocol"
    ]
  },
  {
    id: "rn-advanced-iabp",
    role: "rn",
    title: "RN Advanced Procedures: Intra-Aortic Balloon Pump (IABP) Management",
    items: [
      "Understand IABP timing: 1:1 full support, 1:2 or 1:3 for weaning; inflate mid-diastole (dicrotic notch), deflate just before systole",
      "Understand device settings and troubleshooting timing on arterial waveform",
      "Know hemodynamic targets: MAP ≥65 mmHg, HR ≤100, adequate UOP (>0.5 mL/kg/hr), lactate ≤3, inotropic score 20",
      "Recognize anticoagulation controversy: institutional protocol varies (universal vs selective heparin); follow local protocol",
      "Monitor platelet count: baseline, 24 hours, daily (thrombocytopenia risk)",
      "Assess limb perfusion every 1-2 hours: pain, pallor, pulselessness, paresthesias, paralysis (5 P's)",
      "Maintain strict bed rest with affected leg straight; prevent flexion at groin",
      "Know weaning readiness criteria: achieve 5 of 8 targets (HR, MAP, SVO2, PaO2, lactate, PCWP, inotropic score, UOP)",
      "Understand weaning steps: 1:1 → 1:2 (2-4 hr) → 1:3 (2-4 hr) → consider removal",
      "Know contraindications: moderate-severe aortic regurgitation, aortic dissection, severe peripheral arterial disease"
    ]
  },
  {
    id: "rn-advanced-ekos",
    role: "rn",
    title: "RN Advanced Procedures: EKOS Catheter-Directed Thrombolysis",
    items: [
      "Understand indications: acute PE (massive/submassive), proximal PE in main/lobar pulmonary arteries, RV/LV ratio ≥0.9-1.0",
      "Know t-PA dosing: unilateral 1 mg/hr × 24 hr (single catheter), bilateral 1 mg/hr per catheter × 12 hr",
      "Maintain saline coolant: 35 mL/hr through each catheter during infusion",
      "Understand anticoagulation during infusion: continue UFH at intermediate intensity (aPTT 40-60 sec), NOT full therapeutic",
      "Monitor for bleeding: access site, GI, GU, intracranial during infusion",
      "Perform neurological assessment every 4 hours during infusion",
      "Know thrombolysis contraindications: active bleeding, recent stroke (3 mo), recent major surgery (14 days), intracranial pathology, severe uncontrolled HTN, bleeding diathesis",
      "Understand post-removal hemostasis: manual compression ≥5 min, wait 15 min after hemostasis, then resume full therapeutic anticoagulation",
      "Monitor hemoglobin/hematocrit serially; check fibrinogen if bleeding occurs",
      "Coordinate post-procedure imaging: echo and CT to assess RV/LV ratio improvement and Miller Index"
    ]
  },
  {
    id: "rn-advanced-rotablator",
    role: "rn",
    title: "RN Advanced Procedures: Rotational Atherectomy (Rotablator)",
    items: [
      "Understand RotaWire: 0.009-inch floppy or extra support; keep distal tip in field of view; maintain ≥5 mm from burr",
      "Know Rotablator speeds: 140,000-180,000 rpm; burr-to-vessel ratio 0.5-0.7",
      "Prepare RotaGlide solution or alternative cocktail: UFH 10,000 units + nitroglycerin 400 mcg + verapamil 10 mg in 1L saline",
      "Know RotaGlide contraindication: egg or olive oil allergy; verify allergy status before procedure",
      "Set up continuous infusion of lubricant through burr system",
      "Understand anticoagulation: UFH bolus to achieve ACT 250-350 sec (lower 200-250 if using GP IIb/IIIa inhibitor)",
      "Prepare intracoronary nitroglycerin 100-200 mcg: give before first run and repeat intermittently",
      "Understand temporary pacing consideration: right coronary or dominant left circumflex (prevent bradycardia)",
      "Assist with technique: pecking motion (15-20 sec runs), allow cooling between runs, maintain ≥5 mm wire-to-burr distance",
      "Monitor for complications: perforation, dissection, slow flow/no-reflow; have adenosine, verapamil, nicardipine ready"
    ]
  },
  {
    id: "rn-advanced-radial",
    role: "rn",
    title: "RN Advanced Procedures: Radial Artery Vasodilator Cocktail",
    items: [
      "Understand purpose: prevent radial spasm, reduce discomfort, reduce RAO, facilitate catheter manipulation",
      "Know optimal cocktail: verapamil 2.5-5 mg IA + nitroglycerin 100-200 mcg IA (combination superior to single agent)",
      "Understand alternative agents: diltiazem 2.5-5 mg IA or nicardipine 250-500 mcg IA alone; nitroglycerin alone less effective",
      "Know alternative route: subcutaneous nitroglycerin 0.1% 0.5 mL BEFORE radial puncture (more effective than IA in some studies)",
      "Administer cocktail slowly IA through sheath side port immediately after sheath insertion",
      "Recognize contraindications/cautions: use smaller doses in hypotension (SBP <100), inferior MI with RV involvement, reduced LVEF, severe AS, cardiogenic shock",
      "Monitor blood pressure before and after administration",
      "Recognize vasovagal reaction signs during administration",
      "Know mandatory anticoagulation: UFH 50 units/kg (max 5,000 units) or equivalent enoxaparin/bivalirudin to ALL patients to prevent RAO",
      "Assess radial pulse throughout procedure; monitor for access site complications"
    ]
  },
  {
    id: "rn-advanced-orbital",
    role: "rn",
    title: "RN Advanced Procedures: Orbital Atherectomy (Diamondback)",
    items: [
      "Understand ViperWire: 0.012-inch nitinol body, 0.014-inch tip; keep distal tip in field of view; maintain ≥5 mm from crown",
      "Know Diamondback 360 specifications: 1.25 mm diamond-coated crown, two speeds (80,000 rpm, 120,000 rpm)",
      "Verify guide catheter size: ≥6F required (7F if using guide extension)",
      "Know key difference from rotablator: NO continuous infusion lubricant required; use standard saline flush only",
      "Prepare intracoronary nitroglycerin 100-200 mcg: give before first run and intermittently to minimize slow flow/no-reflow",
      "Understand anticoagulation: UFH bolus to achieve ACT 250-350 sec (lower 200-250 if using GP IIb/IIIa inhibitor)",
      "Understand mandatory angioplasty: mandatory non-compliant balloon angioplasty AFTER atherectomy before stent",
      "Know mandatory post-stent dilatation: non-compliant balloon 1:1 vessel sizing, ≥18 atmospheres",
      "Listen for audible pitch change when device contacts calcium; use smooth 1 mm/sec advancement, never force",
      "Monitor for complications: dissection (2.3%), perforation (0.9%), slow flow; have adenosine, verapamil, nicardipine ready"
    ]
  },
  {
    id: "rn-advanced-act",
    role: "rn",
    title: "RN Advanced Procedures: Activated Clotting Time (ACT) Monitoring",
    items: [
      "Know ACT devices and differences: Hemochron reads ~50 sec HIGHER than HemoTec/i-STAT; know your lab's device",
      "Standard PCI target (HemoTec): 250-300 sec; with GP IIb/IIIa: 200-250 sec; (Hemochron: add 50 sec to each)",
      "Higher ACT targets (300-350 HemoTec) for: CTO, ACS, complex prolonged cases, no oral antiplatelet therapy",
      "Lower ACT acceptable (200-250 HemoTec) with: adequate oral antiplatelets + GP IIb/IIIa, high bleeding risk",
      "UFH dosing: initial bolus 70-100 units/kg IV; check ACT at 5 min; additional 2,000-5,000 units as needed for target",
      "Bivalirudin: 0.75 mg/kg bolus + 1.75 mg/kg/hr infusion; single ACT check; target >225 sec",
      "ACT monitoring frequency: 5 min after bolus, then every 30 min, additional checks after boluses, after agent changes",
      "Troubleshoot low ACT: verify heparin dose, check for resistance (rare), consider additional bolus, recheck in 5 min",
      "Troubleshoot high ACT >400 sec: consider holding heparin, increased bleeding risk, monitor access site closely",
      "Recognize ACT limitations: precision varies with temp, platelet count, hemodilution; use as clinical guide not absolute value"
    ]
  },
  {
    id: "rn-advanced-ivus",
    role: "rn",
    title: "RN Advanced Procedures: Intravascular Ultrasound (IVUS)",
    items: [
      "Understand IVUS physics: High-frequency ultrasound (20-50 MHz) transducer at catheter tip provides cross-sectional coronary images",
      "Know IVUS equipment: Imaging console, transducer catheter (0.018\" compatible guide), compatibility with existing guidelinesystems",
      "Pre-procedure responsibilities: Verify equipment functionality, prepare motorized pullback system (0.5-1.0 mm/sec), ensure saline flush solution available",
      "Patient positioning and sheath preparation: Adequate anticoagulation (ACT >300 sec), 7 Fr minimum sheath, guide catheter engagement for optimal imaging",
      "IVUS technique essentials: Advance guidewire first, track catheter over wire to lesion, motorized pullback from distal to proximal",
      "Image interpretation basics: Intima (inner layer), media (muscular layer), adventitia (outer layer); assess plaque distribution and lumen area",
      "Clinical uses of IVUS: Assess plaque severity when angiography unclear, guide complex PCI strategy, evaluate stent apposition post-deployment",
      "IVUS-guided stent optimization: Verify stent expansion (internal diameter ≥90% of nominal), assess apposition (no malapposition), cover all plaque",
      "Monitor for complications during IVUS: Transient slow flow, dissection (0.3-2%), perforation (rare); have reversal agents at bedside",
      "Document findings: Record pullback length, identified lesions, stent dimensions pre/post deployment, recommendations for intervention",
      "Nursing considerations: Prolonged procedure increases radiation and contrast exposure; monitor patient comfort, maintain anticoagulation, prepare for extended recovery"
    ]
  },
  {
    id: "rn-advanced-rhc",
    role: "rn",
    title: "RN Advanced Procedures: Right Heart Catheterization (RHC)",
    items: [
      "RHC indications: Assess pulmonary hypertension, evaluate cardiomyopathy severity, guide heart failure management, evaluate pericardial disease",
      "Equipment preparation: Swan-Ganz catheter (7-8 Fr), pressure transducers (drift check: 0 mmHg at mid-axillary line), monitor shows RA/RV/PA/PCW waveforms",
      "Catheter zeroing procedure: Open transducer to atmosphere, adjust graphic display to read 0 mmHg, repeat after patient repositioning, verify before measurements",
      "Catheter positioning sequence: RA waveform (0-8 mmHg), RV systolic rise (15-30 mmHg systolic, end-diastolic 0-8 mmHg), PA branch entry (dicrotic notch appears)",
      "PA wedge position and timing: Balloon inflation produces PAW tracing; measure at end-expiration for spontaneous breathing, measure at mid-inspiration if mechanically ventilated",
      "Normal hemodynamic values (mmHg): RA mean 0-8, RV systolic/end-diastolic 15-30/0-8, PA systolic/diastolic 15-30/4-12, PAW mean 4-12, LV end-diastolic 3-12",
      "Calculated parameters: Cardiac output (thermodilution or Fick method), cardiac index, systemic/pulmonary vascular resistance, stroke volume index",
      "Oxygen saturation run: Sequential blood samples from RA → RV → PA to detect left-to-right shunts (Qp:Qs ratio >1.5 = significant shunt)",
      "Fluoroscopic views: Posterior-anterior (PA) for RA access, left anterior oblique (LAO) for RV/PA visualization, catheter tip must be in PA 1-2 cm branch, not wedged",
      "Critical technical points: Never inflate balloon beyond 1.5 cc air (causes PA rupture), maintain anticoagulation, keep catheter tip sterile, monitor for arrhythmias",
      "Complications and management: VA rupture (hemoptysis/hypotension - emergency), arrhythmias (PVCs/SVT - reposition catheter), pulmonary infarction, thrombosis",
      "Nursing monitoring during RHC: Watch for PACs, PVCs, SVT; note patient symptoms; observe for hemoptysis; maintain restraint on right arm; document all pressures and waveforms"
    ]
  },
  {
    id: "rn-advanced-lhc",
    role: "rn",
    title: "RN Advanced Procedures: Left Heart Catheterization (LHC)",
    items: [
      "Understand two access approaches: Retrograde (femoral/radial artery across aortic valve) vs. Transseptal (femoral vein across interatrial septum)",
      "Retrograde approach: Most common for coronary angiography and pressure measurement; contraindicated in mechanical aortic valve or severe aortic stenosis",
      "Transseptal approach: Required for structural heart interventions (mitral procedures, LAA closure, AFib ablation); uses ICE or fluoroscopy to locate fossa ovalis",
      "Know normal LV pressures: LV systolic 90-140 mmHg, LVEDP ≤12 mmHg, mean aortic 70-105 mmHg; elevated LVEDP >12 mmHg indicates poor prognosis",
      "Critical transducer zeroing: Must calibrate at mid-axillary line (mid-thoracic level) BEFORE measurements; recheck after patient repositioning",
      "Pressure measurement timing: Record all pressures at END-expiration during normal breathing; respiratory variation can significantly affect PCWP and LVEDP",
      "LVEDP vs. Pre-A pressure: LV pre-A pressure (just before atrial contraction) correlates better with mean LA pressure than LVEDP; use for heart failure assessment",
      "Recognize abnormal pressure waveforms: Large V waves (mitral regurgitation), catheter whip artifact (reposition catheter), equalized diastolic pressures (tamponade/constriction)",
      "Transseptal catheterization risks: Cardiac perforation, pericardial tamponade, aortic puncture, thromboembolism; serious complication rate 1-2%",
      "Prepare appropriate catheters: Pigtail for LV, Judkins or Amplatz for coronaries; have ICE/TEE setup ready for transseptal cases",
      "Cardiac output measurement: Thermodilation via RA injection (cold saline) with PA measurement; average ≥3 measurements with <10% variation; unreliable with severe regurgitation",
      "Left ventriculography: Assess ejection fraction, regional wall motion, mitral regurgitation severity; defer if diagnostic echo available to minimize contrast exposure"
    ]
  },
  {
    id: "rn-advanced-ffr",
    role: "rn",
    title: "RN Advanced Procedures: Functional Flow Reserve (FFR/iFR/FFRangio)",
    items: [
      "Understand FFR physiology: Pressure-wire measurement of distal to aortic pressure ratio at maximal hyperemia; FFR ≤0.80 = ischemia warrants PCI, >0.80 = medical therapy",
      "FFR clinical evidence: Landmark DEFER, FAME, FAME 2 trials show FFR-guided PCI reduces death/MI/events; ACC/AHA Class IIa recommendation for intermediate stenoses",
      "FFR technique: Advance pressure wire 2-3 cm distal to stenosis, zero at catheter tip, induce maximal hyperemia, measure during steady-state (typically 2-3 min for IV adenosine)",
      "Hyperemia induction methods: IV adenosine 140 mcg/kg/min via infusion pump (gold standard) or intracoronary bolus 40-200 mcg for faster onset/offset",
      "Adenosine side effects: Flushing, chest discomfort, dyspnea, transient AV block (resolve within seconds); continue infusion despite discomfort if patient tolerates",
      "FFR interpretation: FFR <0.75 strongly indicates ischemia; 0.75-0.80 borderline (consider clinical context); >0.80 suggests defer PCI for medical therapy",
      "iFR (Instantaneous Wave-Free Ratio) alternative: Resting index measuring diastolic pressures without adenosine; iFR SWEDEHEART trial showed noninferior outcomes vs. FFR",
      "iFR pullback technique: Maps physiological severity along entire vessel; identifies multiple lesions and predicts post-PCI hemodynamic outcome",
      "FFRangio technology: Computer-based software calculates FFR from angiographic images alone without pressure wire or adenosine; 3D reconstruction applies resistance models",
      "FFRangio evidence: ALL-RISE trial (2026) demonstrated FFRangio-guided revascularization noninferior to pressure-wire FFR; improves procedural efficiency",
      "Nursing responsibilities: Prepare pressure wire system with proper calibration, assist with adenosine IV pump setup or IC bolus, monitor for side effects",
      "Documentation: Record FFR/iFR values, pressure tracings, hyperemia quality, adenosine response, clinical recommendation (defer vs. intervene)"
    ]
  },
  {
    id: "rt-1",
    role: "rt",
    title: "RT Imaging, Radiation & Room Safety",
    items: [
      "Imaging system setup and operation",
      "Hemodynamic monitoring system setup and support",
      "Contrast power injector operation (e.g., MedRad / Acist)",
      "Maintains radiation safety standards during cases",
      "Maintains laser safety and fire safety standards",
      "Procedural table setup and safe positioning",
      "Supports timed-event and procedural workflow documentation accuracy"
    ]
  },
  {
    id: "rt-2",
    role: "rt",
    title: "RT Equipment Competency Verification",
    items: [
      "AngioJet thrombectomy",
      "AngioVac thrombectomy",
      "Diamondback CSI orbital atherectomy system",
      "Doppler",
      "EKOS catheter-directed thrombolysis",
      "FFR and iFR",
      "IVUS",
      "Jetstream atherectomy",
      "Percutaneous LVAD (TandemHeart / Impella)",
      "Rotablader atherectomy",
      "Intra-aortic Balloon Pump (IABP)",
      "Targeted temperature management cooling device"
    ]
  }
];

const roleLabelMap = {
  rn: "RN",
  rt: "RT"
};

const sectionFigureMap = {
  "rn-pre-procedure": [
    {
      src: "CardPics/IMG_5189.HEIC",
      title: "Pre-Procedure Intake & Readiness Form (IMG_5189)",
      note: "Source: Internal unit form (IMG_5189.HEIC)."
    },
    {
      src: "CardPics/NEJMra011883_f1.jpg",
      title: "Figure: Coronary Artery Anatomy and ACS Phenotypes",
      note: "Source: NEJM review figure (filename reference: NEJMra011883_f1); full citation pending verification."
    },
    {
      src: "CardPics/jrv250028f1.jpg",
      title: "Figure: Superficial Venous Thrombosis Sites and Pathophysiology",
      note: "Source: Journal review figure (filename reference: jrv250028f1); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S0735109722048768-gr3.jpg",
      title: "Figure: Central Venous Access Landmark Anatomy",
      note: "Source: Elsevier figure (PII: S0735109722048768, Figure 3); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936879813008029-gr1.jpg",
      title: "Figure: Peripheral Arterial Anatomy Reference",
      note: "Source: Elsevier figure (PII: S1936879813008029, Figure 1); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S193687981830712X-gr1.jpg",
      title: "Figure: Supplemental Cath Procedure Orientation View",
      note: "Source: Elsevier figure (PII: S193687981830712X, Figure 1); full citation pending verification."
    }
  ],
  "rn-advanced-ffr": [
    {
      src: "CardPics/1-s2.0-S0735109716334301-gr4.jpg",
      title: "Figure 4. FFR Recording With Intravenous Adenosine",
      note: "Source: Standardization of Fractional Flow Reserve Measurements. J Am Coll Cardiol. 2016; Figure 4."
    },
    {
      src: "CardPics/1-s2.0-S1936879818310331-gr1.jpg",
      title: "Figure 1. iFR Pullback Performed Pre-PCI",
      note: "Source: iFR GRADIENT Registry primary results. JACC Cardiovasc Interv. 2018; Figure 1."
    },
    {
      src: "CardPics/jrv220002f2.jpg",
      title: "Figure: Coronary Artery Anatomy and ACS Mechanisms",
      note: "Source: Journal review figure (filename reference: jrv220002f2); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S0735109708010358-gr2.jpg",
      title: "Figure: Supplemental Pressure-Wire Tracing (FFR)",
      note: "Source: Elsevier figure (PII: S0735109708010358, Figure 2); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936879816320866-gr1.jpg",
      title: "Figure: Physiology-Guided Lesion Assessment",
      note: "Source: Elsevier figure (PII: S1936879816320866, Figure 1); full citation pending verification."
    }
  ],
  "rn-advanced-lhc": [
    {
      src: "CardPics/1-s2.0-S1936879816319082-gr12.jpg",
      title: "Figure 12. Central Illustration: Evolving Indications and Contemporary Techniques of Transseptal Catheterization",
      note: "Source: Transseptal Techniques for Emerging Structural Heart Interventions. JACC Cardiovasc Interv. 2016; Figure 12."
    },
    {
      src: "CardPics/1-s2.0-S1936879814009236-gr9.jpg",
      title: "Figure: Two-Chamber vs Three-Chamber Fluoroscopic Views",
      note: "Source: Elsevier figure (PII: S1936879814009236, Figure 9); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936879821021749-gr1.jpg",
      title: "Figure: Transseptal Projection Geometry (RAO/LAO, CRA/CAU)",
      note: "Source: Elsevier figure (PII: S1936879821021749, Figure 1); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S0735109722070267-gr3.jpg",
      title: "Figure: Transseptal Puncture Fluoroscopic Sequence",
      note: "Source: Elsevier figure (PII: S0735109722070267, Figure 3); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S0735109722075581-gr1.jpg",
      title: "Figure: Transseptal Crossing Example",
      note: "Source: Elsevier figure (PII: S0735109722075581, Figure 1); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936879814009236-gr1.jpg",
      title: "Figure: Standard Viewing Angles for Left-Sided Structural Interventions",
      note: "Source: Elsevier figure (PII: S1936879814009236, Figure 1); full citation pending verification."
    }
  ],
  "rn-advanced-rhc": [
    {
      src: "CardPics/NEJMvcm1212416_f3.jpg",
      title: "Figure: Right-Heart Pressure Waveforms and Normal Ranges",
      note: "Source: NEJM video/clinical medicine figure (filename reference: NEJMvcm1212416_f3); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S2213177923001968-gr2.jpg",
      title: "Figure: Pulmonary Artery Catheter Goals and Technical Aspects",
      note: "Source: Elsevier figure (PII: S2213177923001968, Figure 2); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936878X22003989-gr8.jpg",
      title: "Figure: Supplemental Right-Heart Hemodynamic Visual",
      note: "Source: Elsevier figure (PII: S1936878X22003989, Figure 8); full citation pending verification."
    }
  ],
  "rn-advanced-radial": [
    {
      src: "CardPics/1-s2.0-S1936879821003575-gr2.jpg",
      title: "Figure: Radial Access Anatomy and Surface Landmarks",
      note: "Source: Elsevier figure (PII: S1936879821003575, Figure 2); full citation pending verification."
    },
    {
      src: "CardPics/1-s2.0-S1936879818309245-gr1.jpg",
      title: "Figure: Palmar and Dorsal Arterial Arch Anatomy",
      note: "Source: Elsevier figure (PII: S1936879818309245, Figure 1); full citation pending verification."
    }
  ],
  "rn-advanced-ivus": [
    {
      src: "CardPics/1-s2.0-S1936879813018116-gr1.jpg",
      title: "Figure: Supplemental Intravascular Imaging Reference",
      note: "Source: Elsevier figure (PII: S1936879813018116, Figure 1); full citation pending verification."
    }
  ],
  "rn-advanced-orbital": [
    {
      src: "CardPics/1-s2.0-S1936879821007925-gr4.jpg",
      title: "Figure: Supplemental Orbital Atherectomy Technique Visual",
      note: "Source: Elsevier figure (PII: S1936879821007925, Figure 4); full citation pending verification."
    }
  ]
};

const signoffFieldMetadata = [
  { key: "learnerName", label: "Learner Name", type: "text", requiredForSignoff: true },
  { key: "learnerInitials", label: "Learner Initials", type: "text", requiredForSignoff: true },
  { key: "preceptorName", label: "Preceptor Name", type: "text", requiredForSignoff: true },
  { key: "preceptorInitials", label: "Preceptor Initials", type: "text", requiredForSignoff: true },
  { key: "validationDate", label: "Validation Date", type: "date", requiredForSignoff: true }
];

const trainingLinkOverrides = Array.isArray(globalThis.TRAINING_LINK_OVERRIDES)
  ? globalThis.TRAINING_LINK_OVERRIDES
  : [];

const medicationQuickGuideRows = [
  {
    medication: "Adenosine",
    mix: "Rapid IV push",
    start: "6 mg rapid IV push",
    titration: "If no response in 1–2 min, give 12 mg (one time only)",
    max: "12 mg total",
    notes: "SVT termination; brief asystole expected (warn patient); rapid flush essential. Use central line if available"
  },
  {
    medication: "Amiodarone",
    mix: "IV/IO bolus per ACLS context",
    start: "300 mg rapid bolus",
    titration: "Second dose 150 mg if needed",
    max: "2.2 g over 24 hr (context dependent)",
    notes: "Used in VF/pulseless VT and unstable VT scenarios"
  },
  {
    medication: "Atropine",
    mix: "IV",
    start: "1 mg IV",
    titration: "Repeat every 3–5 min",
    max: "3 mg total (symptomatic bradycardia)",
    notes: "Avoid doses below 0.5 mg for bradycardia"
  },
  {
    medication: "Nitroglycerin (Tridil)",
    mix: "Per unit card/pre-mix",
    start: "5–20 mcg/min",
    titration: "Increase 5–20 mcg/min every 3–5 min",
    max: "400 mcg/min (ICU guide)",
    notes: "Typical therapeutic range is 10–100 mcg/min based on clinical response. CONTRAINDICATION: Recent PDE-5 inhibitor use (sildenafil within 24 hr, tadalafil within 48 hr)"
  },
  {
    medication: "Dobutamine (Dobutrex)",
    mix: "500 mg / 250 mL D5W",
    start: "2.5–10 mcg/kg/min",
    titration: "Up/down by 2.5 mcg/kg/min every 15 min",
    max: "20 mcg/kg/min",
    notes: "Beta-1 inotrope; monitor for tachyarrhythmias and hypotension"
  },
  {
    medication: "Dopamine",
    mix: "400 mg / 250 mL",
    start: "2.5–10 mcg/kg/min",
    titration: "Increase 2.5–5 mcg/kg/min q5 min; decrease 1 mcg/kg/min q30 min",
    max: "20 mcg/kg/min",
    notes: "Verify local concentration card formatting"
  },
  {
    medication: "Epinephrine",
    mix: "Use code concentration per protocol",
    start: "1 mg IV every 3–5 min in arrest",
    titration: "Infusion 2–10 mcg/min in selected brady/shock contexts",
    max: "Per ACLS scenario",
    notes: "Verify concentration before administration"
  },
  {
    medication: "Norepinephrine (Levophed)",
    mix: "4 mg/250 mL (16 mcg/mL) or 8 mg/250 mL (32 mcg/mL)",
    start: "0.02–0.2 mcg/kg/min",
    titration: "Increase 0.02 mcg/kg/min q5 min; decrease q15 min",
    max: "3 mcg/kg/min",
    notes: "FIRST-LINE vasopressor; central line preferred; target MAP >65 mmHg. Monitor for arrhythmias and tissue necrosis if extravasation"
  },
  {
    medication: "Phenylephrine (Neo-Synephrine)",
    mix: "10 mg / 250 mL D5W",
    start: "0.5 mcg/kg/min",
    titration: "Increase 0.5 mcg/kg/min q5 min; decrease 0.1 mcg/kg/min q15 min",
    max: "5 mcg/kg/min",
    notes: "Pure alpha-1 vasopressor; monitor for reflex bradycardia and ischemia"
  },
  {
    medication: "Nicardipine (Cardene)",
    mix: "20 mg / 200 mL premix",
    start: "2.5–5 mg/hr",
    titration: "Increase 2.5 mg/hr every 5–15 min; decrease 1 mg/hr q10 min",
    max: "15 mg/hr",
    notes: "Dihydropyridine calcium channel blocker; avoid abrupt blood pressure drops"
  },
  {
    medication: "Nitroprusside (Nipride)",
    mix: "50 mg / 250 mL D5W (protect from light)",
    start: "0.3 mcg/kg/min",
    titration: "Increase 0.2 mcg/kg/min q3–5 min; decrease 0.1 mcg/kg/min q15 min",
    max: "10 mcg/kg/min",
    notes: "Confirm compatibility/policy details locally"
  },
  {
    medication: "Dexmedetomidine (Precedex)",
    mix: "Pre-mixed in NS (100 mL bag common)",
    start: "0.2–0.5 mcg/kg/hr",
    titration: "Increase/decrease 0.1 mcg/kg/hr",
    max: "1.4 mcg/kg/hr (ICU guide)",
    notes: "Common ICU maintenance range 0.2–0.7 mcg/kg/hr"
  },
  {
    medication: "Lidocaine",
    mix: "Single/Double strength per unit card",
    start: "1 mg/min",
    titration: "Increase 0.5 mg/min q10 min; decrease 0.25 mg/min q30 min",
    max: "4 mg/min",
    notes: "Monitor for neurologic toxicity and QRS widening at higher exposure"
  },
  {
    medication: "Magnesium sulfate",
    mix: "IV",
    start: "1–2 g IV",
    titration: "Per torsades/hypomagnesemia scenario",
    max: "Per protocol",
    notes: "Rapid bolus may worsen hypotension/bradycardia"
  },
  {
    medication: "Vasopressin",
    mix: "100 units / 100 mL NS",
    start: "0.04 units/min",
    titration: "Increase 0.01 units/min every 10–15 min",
    max: "0.07 units/min",
    notes: "Verify code-dose substitution wording per local protocol"
  },
  {
    medication: "Flumazenil (Romazicon)",
    mix: "0.1 mg/mL",
    start: "0.2 mg IV over 15 sec",
    titration: "Repeat 0.2 mg every 1 min to target response",
    max: "1 mg total (sedation reversal)",
    notes: "May precipitate seizures in benzodiazepine-dependent or mixed-overdose patients"
  },
  {
    medication: "Naloxone (Narcan)",
    mix: "Common vial 0.4 mg/mL",
    start: "0.1–0.2 mg IV for sedation reversal OR 0.4–2 mg for overdose",
    titration: "Repeat every 2–3 min to response",
    max: "Per scenario/protocol",
    notes: "Titrate to adequate ventilation; avoid abrupt full opioid reversal when possible"
  },
  {
    medication: "Protamine Sulfate",
    mix: "50 mg/5 mL vial",
    start: "1 mg per 100 units heparin (max 50 mg per dose)",
    titration: "Slow IV push over 10 minutes",
    max: "50 mg per dose",
    notes: "Reversal for heparin; risk of hypotension, bradycardia, anaphylaxis (fish allergy, prior vasectomy, NPH insulin use)"
  },
  {
    medication: "Midazolam (Versed)",
    mix: "IV",
    start: "0.5–2 mg IV increments",
    titration: "Repeat every 2–3 min to desired sedation",
    max: "5 mg total",
    notes: "Onset 1–3 min; reversal with flumazenil 0.2 mg IV"
  },
  {
    medication: "Fentanyl",
    mix: "50 mcg/mL vial",
    start: "25–100 mcg IV increments",
    titration: "Repeat every 5 min as needed",
    max: "Per protocol/context",
    notes: "Onset 1–2 min; reversal with naloxone 0.04–0.4 mg IV; monitor respiratory depression"
  },
  {
    medication: "Metoprolol",
    mix: "1 mg/mL IV",
    start: "2.5–5 mg IV",
    titration: "Repeat every 5 minutes as needed",
    max: "15 mg total",
    notes: "For tachycardia/hypertension; hold if HR <60, SBP <100, or heart failure signs"
  },
  {
    medication: "Milrinone (Primacor)",
    mix: "500 mcg/mL vial",
    start: "Loading: 50 mcg/kg over 10 min (optional); Infusion: 0.375–0.75 mcg/kg/min",
    titration: "Increase 0.125–0.375 mcg/kg/min q5–15 min",
    max: "1.13 mcg/kg/min",
    notes: "Phosphodiesterase-3 inhibitor; reduce 50% if CrCl 50 mL/min; risk of hypotension and arrhythmias"
  },
  {
    medication: "Oxygen",
    mix: "High-flow delivery system",
    start: "100% in resuscitation",
    titration: "Titrate to maintain SpO2 > 94%",
    max: "N/A",
    notes: "Monitor ventilation and oxygenation response"
  }
];

function toSearchUrl(term) {
  return `https://duckduckgo.com/?q=${encodeURIComponent(term)}`;
}

function getTrainingResourcesFromItem(itemText) {
  const resources = [];
  const matches = [...itemText.matchAll(/\(([^)]+)\)/g)];

  matches.forEach((match) => {
    const chunk = match[1];
    const references = chunk
      .split(";")
      .map((entry) => entry.trim())
      .filter((entry) => /Elsevier|CPG|Policy|AHA|American Heart Association/i.test(entry));

    references.forEach((reference) => {
      resources.push({
        label: reference,
        url: toSearchUrl(reference)
      });
    });
  });

  return resources;
}

function getManualTrainingResources(itemText) {
  const loweredItem = itemText.toLowerCase();
  const resources = [];

  trainingLinkOverrides.forEach((rule) => {
    const matchText = String(rule?.match || "").trim().toLowerCase();
    if (!matchText || !loweredItem.includes(matchText)) return;

    const links = Array.isArray(rule.links) ? rule.links : [];
    links.forEach((link) => {
      const label = String(link?.label || "").trim();
      const url = String(link?.url || "").trim();
      if (!label || !url) return;
      resources.push({ label, url });
    });
  });

  return resources;
}

function dedupeResources(resources) {
  const seen = new Set();
  return resources.filter((resource) => {
    const key = `${resource.label}::${resource.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const state = {
  checks: {},
  notes: {},
  collapsed: {},
  signoffs: {}
};

let printRestoreContext = null;
const elements = {
  container: document.getElementById("sectionsContainer"),
  emptyState: document.getElementById("emptyState"),
  roleFilter: document.getElementById("roleFilter"),
  searchInput: document.getElementById("searchInput"),
  expandAllBtn: document.getElementById("expandAllBtn"),
  collapseAllBtn: document.getElementById("collapseAllBtn"),
  printTrack: document.getElementById("printTrack"),
  printTrackBtn: document.getElementById("printTrackBtn"),
  printQuickGuideBtn: document.getElementById("printQuickGuideBtn"),
  printLaminatedBtn: document.getElementById("printLaminatedBtn"),
  resetBtn: document.getElementById("resetBtn"),
  printBtn: document.getElementById("printBtn"),
  completedCount: document.getElementById("completedCount"),
  totalCount: document.getElementById("totalCount"),
  progressBar: document.getElementById("progressBar"),
  progressPercent: document.getElementById("progressPercent")
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.checks) state.checks = parsed.checks;
    if (parsed?.notes) state.notes = parsed.notes;
    if (parsed?.collapsed) state.collapsed = parsed.collapsed;
    if (parsed?.signoffs) state.signoffs = parsed.signoffs;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function roleMatchesFilter(filterRole, sectionRole) {
  return filterRole === sectionRole;
}

function getVisibleSections() {
  const role = elements.roleFilter.value;
  const query = elements.searchInput.value.trim().toLowerCase();

  return sections.filter((section) => {
    if (section.role !== "rn" && section.role !== "rt") return false;

    const roleMatch = roleMatchesFilter(role, section.role);

    if (!roleMatch) return false;

    if (!query) return true;

    const signoff = ensureSignoff(section.id);
    const signoffText = `${signoff.learnerName} ${signoff.preceptorName} ${signoff.learnerInitials} ${signoff.preceptorInitials}`;
    const haystack = `${section.title} ${section.items.join(" ")} ${state.notes[section.id] || ""} ${signoffText}`.toLowerCase();
    return haystack.includes(query);
  });
}

function ensureSignoff(sectionId) {
  const current = state.signoffs[sectionId];
  if (current) return current;

  const defaults = {
    learnerName: "",
    learnerInitials: "",
    preceptorName: "",
    preceptorInitials: "",
    validationDate: "",
    signedOff: false
  };

  state.signoffs[sectionId] = defaults;
  return defaults;
}

function updateSignoff(sectionId, field, value) {
  const signoff = ensureSignoff(sectionId);
  signoff[field] = value;
  saveState();
}

function getMissingRequiredSignoffFields(sectionId) {
  const signoff = ensureSignoff(sectionId);

  return signoffFieldMetadata
    .filter((field) => field.requiredForSignoff)
    .filter((field) => {
      const value = String(signoff[field.key] ?? "").trim();
      return value.length === 0;
    });
}

function setSignoffFieldValidationState(sectionId, missingFields) {
  const missingKeys = new Set(missingFields.map((field) => field.key));

  signoffFieldMetadata.forEach((field) => {
    const input = document.getElementById(`${field.key}-${sectionId}`);
    if (!input) return;

    const isMissing = missingKeys.has(field.key);
    input.classList.toggle("invalid-field", isMissing);
    input.setAttribute("aria-invalid", isMissing ? "true" : "false");
  });
}

function setExpandedForPrint() {
  sections.forEach((section) => {
    state.collapsed[section.id] = false;
  });
}

function printForTrack(track) {
  printRestoreContext = {
    role: elements.roleFilter.value,
    search: elements.searchInput.value,
    collapsed: { ...state.collapsed }
  };

  elements.roleFilter.value = track;
  elements.searchInput.value = "";
  setExpandedForPrint();
  render();

  setTimeout(() => globalThis.print(), 50);
}

function printRnQuickGuide() {
  globalThis.document.body.classList.remove("print-laminated");

  printRestoreContext = {
    role: elements.roleFilter.value,
    search: elements.searchInput.value,
    collapsed: { ...state.collapsed }
  };

  elements.roleFilter.value = "rn";
  elements.searchInput.value = "RN Medication Quick Guide";
  setExpandedForPrint();
  render();

  setTimeout(() => globalThis.print(), 50);
}

function printRnLaminatedQuickGuide() {
  globalThis.document.body.classList.add("print-laminated");

  printRestoreContext = {
    role: elements.roleFilter.value,
    search: elements.searchInput.value,
    collapsed: { ...state.collapsed }
  };

  elements.roleFilter.value = "rn";
  elements.searchInput.value = "RN Medication Quick Guide";
  setExpandedForPrint();
  render();

  setTimeout(() => globalThis.print(), 50);
}

function createMedicationQuickGuide(sectionId) {
  if (sectionId !== "rn-med-quick-guide") return null;

  const sortedMedicationRows = [...medicationQuickGuideRows].sort((a, b) =>
    a.medication.localeCompare(b.medication)
  );

  const wrap = document.createElement("section");
  wrap.className = "med-quick-guide";

  const intro = document.createElement("p");
  intro.className = "muted med-quick-guide-intro";
  intro.textContent = "Quick bedside reference for orientation and workflow support. Follow active provider orders, local policy, and pharmacy guidance.";

  const tableWrap = document.createElement("div");
  tableWrap.className = "med-quick-guide-table-wrap";

  const table = document.createElement("table");
  table.className = "med-quick-guide-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Medication", "Standard Mix", "Starting Dose/Rate", "Titration", "Maximum", "Clinical Notes"].forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  sortedMedicationRows.forEach((row) => {
    const tr = document.createElement("tr");
    [row.medication, row.mix, row.start, row.titration, row.max, row.notes].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  tableWrap.appendChild(table);

  const cardWrap = document.createElement("div");
  cardWrap.className = "med-laminated-cards";
  sortedMedicationRows.forEach((row) => {
    const card = document.createElement("article");
    card.className = "med-laminated-card";

    const name = document.createElement("h5");
    name.className = "med-laminated-title";
    name.textContent = row.medication;
    card.appendChild(name);

    [
      ["Mix", row.mix],
      ["Start", row.start],
      ["Titrate", row.titration],
      ["Max", row.max],
      ["Notes", row.notes]
    ].forEach(([label, value]) => {
      const line = document.createElement("p");
      line.className = "med-laminated-line";

      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      line.append(strong, value);
      card.appendChild(line);
    });

    cardWrap.appendChild(card);
  });

  wrap.append(intro, tableWrap, cardWrap);

  return wrap;
}

function createSectionCard(section) {
  const card = document.createElement("article");
  card.className = "section-card";
  card.dataset.role = section.role;
  card.dataset.sectionId = section.id;

  const header = document.createElement("header");
  header.className = "section-header";

  const titleWrap = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = section.title;
  titleWrap.appendChild(title);

  const tag = document.createElement("span");
  tag.className = "section-tag";
  tag.textContent = roleLabelMap[section.role];

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "btn";

  const body = document.createElement("div");
  body.className = "section-body";
  const isReferenceOnly = Boolean(section.referenceOnly);
  const isCollapsed = Boolean(state.collapsed[section.id]);
  body.hidden = isCollapsed;
  toggleBtn.textContent = isCollapsed ? "Expand" : "Collapse";

  toggleBtn.addEventListener("click", () => {
    const nowCollapsed = !body.hidden;
    body.hidden = nowCollapsed;
    state.collapsed[section.id] = nowCollapsed;
    toggleBtn.textContent = nowCollapsed ? "Expand" : "Collapse";
    saveState();
  });

  const checklist = document.createElement("ul");
  checklist.className = "checklist";

  section.items.forEach((item, index) => {
    const itemKey = `${section.id}::${index}`;

    const li = document.createElement("li");
    li.className = "check-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(state.checks[itemKey]);

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = item;

    const resources = dedupeResources([
      ...getManualTrainingResources(item),
      ...getTrainingResourcesFromItem(item)
    ]);
    const resourcesWrap = document.createElement("div");
    resourcesWrap.className = "training-links";

    if (resources.length > 0) {
      const resourcesLabel = document.createElement("span");
      resourcesLabel.className = "training-links-label";
      resourcesLabel.textContent = "Training links:";
      resourcesWrap.appendChild(resourcesLabel);

      resources.forEach((resource, resourceIndex) => {
        const link = document.createElement("a");
        link.className = "training-link";
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = resource.label;
        resourcesWrap.appendChild(link);

        if (resourceIndex < resources.length - 1) {
          const separator = document.createElement("span");
          separator.className = "training-link-separator";
          separator.textContent = " • ";
          resourcesWrap.appendChild(separator);
        }
      });
    }

    if (checkbox.checked) li.classList.add("done");

    checkbox.addEventListener("change", () => {
      state.checks[itemKey] = checkbox.checked;
      li.classList.toggle("done", checkbox.checked);
      saveState();
      updateProgress();
    });

    const contentWrap = document.createElement("div");
    contentWrap.append(span, resourcesWrap);

    li.append(checkbox, contentWrap);
    checklist.appendChild(li);
  });

  const quickGuide = createMedicationQuickGuide(section.id);
  if (quickGuide) {
    body.appendChild(quickGuide);
  }

  const sectionFigures = Array.isArray(sectionFigureMap[section.id]) ? sectionFigureMap[section.id] : [];
  if (sectionFigures.length > 0) {
    const figureWrap = document.createElement("section");
    figureWrap.className = "attachment-wrap";

    const figureHeading = document.createElement("h4");
    figureHeading.className = "attachment-heading";
    figureHeading.textContent = "Procedure figures";

    const figureGrid = document.createElement("div");
    figureGrid.className = "attachment-grid";

    sectionFigures.forEach((figure) => {
      const figureCard = document.createElement("article");
      figureCard.className = "attachment-card";

      const img = document.createElement("img");
      img.className = "attachment-preview";
      img.src = figure.src;
      img.alt = figure.title;
      img.loading = "lazy";

      const title = document.createElement("h5");
      title.className = "attachment-title";
      title.textContent = figure.title;

      const file = document.createElement("p");
      file.className = "attachment-file muted";
      file.textContent = figure.src;

      const note = document.createElement("p");
      note.className = "attachment-note muted";
      note.textContent = figure.note;

      figureCard.append(img, title, file, note);
      figureGrid.appendChild(figureCard);
    });

    figureWrap.append(figureHeading, figureGrid);
    body.appendChild(figureWrap);
  }

  if (isReferenceOnly) {
    header.append(titleWrap, tag, toggleBtn);
    card.append(header, body);
    return card;
  }

  const notesLabel = document.createElement("label");
  notesLabel.className = "notes-label";
  notesLabel.setAttribute("for", `notes-${section.id}`);
  notesLabel.textContent = "Preceptor / Learner Notes";

  const notes = document.createElement("textarea");
  notes.id = `notes-${section.id}`;
  notes.placeholder = "Add notes, action items, and validation dates...";
  notes.value = state.notes[section.id] || "";
  notes.addEventListener("input", () => {
    state.notes[section.id] = notes.value;
    saveState();
  });

  const signoff = ensureSignoff(section.id);
  const signoffWrap = document.createElement("section");
  signoffWrap.className = "signoff-wrap";

  const signoffHeading = document.createElement("h4");
  signoffHeading.className = "signoff-heading";
  signoffHeading.textContent = "Validation Sign-Off";

  const signoffGrid = document.createElement("div");
  signoffGrid.className = "signoff-grid";

  let signoffComplete;
  const signoffFields = signoffFieldMetadata;

  signoffFields.forEach((field) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className = "signoff-field";

    const fieldLabel = document.createElement("label");
    fieldLabel.className = "signoff-label";
    fieldLabel.setAttribute("for", `${field.key}-${section.id}`);
    fieldLabel.textContent = field.label;

    const fieldInput = document.createElement("input");
    fieldInput.id = `${field.key}-${section.id}`;
    fieldInput.type = field.type;
    fieldInput.value = signoff[field.key];
    fieldInput.addEventListener("input", () => {
      updateSignoff(section.id, field.key, fieldInput.value);

      const missing = getMissingRequiredSignoffFields(section.id);
      setSignoffFieldValidationState(section.id, missing);

      if (signoffComplete?.checked && missing.length > 0) {
        signoffComplete.checked = false;
        updateSignoff(section.id, "signedOff", false);
      }
    });

    fieldWrap.append(fieldLabel, fieldInput);
    signoffGrid.appendChild(fieldWrap);
  });

  const signoffCompleteWrap = document.createElement("label");
  signoffCompleteWrap.className = "signoff-complete";
  signoffCompleteWrap.setAttribute("for", `signedOff-${section.id}`);

  signoffComplete = document.createElement("input");
  signoffComplete.id = `signedOff-${section.id}`;
  signoffComplete.type = "checkbox";
  signoffComplete.checked = Boolean(signoff.signedOff);
  signoffComplete.addEventListener("change", () => {
    if (!signoffComplete.checked) {
      updateSignoff(section.id, "signedOff", false);
      return;
    }

    const missing = getMissingRequiredSignoffFields(section.id);
    if (missing.length > 0) {
      setSignoffFieldValidationState(section.id, missing);
      signoffComplete.checked = false;
      const missingLabels = missing.map((field) => field.label).join(", ");
      globalThis.alert(`Complete required sign-off fields before signing off: ${missingLabels}.`);
      return;
    }

    setSignoffFieldValidationState(section.id, []);
    updateSignoff(section.id, "signedOff", true);
  });

  const signoffCompleteText = document.createElement("span");
  signoffCompleteText.textContent = "Section validated and signed off";

  signoffCompleteWrap.append(signoffComplete, signoffCompleteText);
  signoffWrap.append(signoffHeading, signoffGrid, signoffCompleteWrap);

  setSignoffFieldValidationState(section.id, getMissingRequiredSignoffFields(section.id));

  body.append(checklist, notesLabel, notes, signoffWrap);

  header.append(titleWrap, tag, toggleBtn);
  card.append(header, body);
  return card;
}

function render() {
  const visible = getVisibleSections();
  elements.container.innerHTML = "";

  if (visible.length === 0) {
    elements.emptyState.hidden = false;
  } else {
    elements.emptyState.hidden = true;
    visible.forEach((section) => {
      elements.container.appendChild(createSectionCard(section));
    });
  }

  updateProgress();
}

function updateProgress() {
  const visible = getVisibleSections();
  const totalItems = visible.reduce((total, section) => total + section.items.length, 0);

  let completeItems = 0;
  visible.forEach((section) => {
    section.items.forEach((_, index) => {
      if (state.checks[`${section.id}::${index}`]) {
        completeItems += 1;
      }
    });
  });

  const percent = totalItems ? Math.round((completeItems / totalItems) * 100) : 0;

  elements.completedCount.textContent = String(completeItems);
  elements.totalCount.textContent = String(totalItems);
  elements.progressBar.value = percent;
  elements.progressPercent.textContent = `${percent}%`;
}

function setAllCollapsed(collapsed) {
  sections.forEach((section) => {
    state.collapsed[section.id] = collapsed;
  });
  saveState();
  render();
}

function attachEvents() {
  elements.roleFilter.addEventListener("change", render);
  elements.searchInput.addEventListener("input", render);
  elements.expandAllBtn.addEventListener("click", () => setAllCollapsed(false));
  elements.collapseAllBtn.addEventListener("click", () => setAllCollapsed(true));
  elements.printTrackBtn.addEventListener("click", () => printForTrack(elements.printTrack.value));
  elements.printQuickGuideBtn.addEventListener("click", printRnQuickGuide);
  elements.printLaminatedBtn.addEventListener("click", printRnLaminatedQuickGuide);

  elements.resetBtn.addEventListener("click", () => {
    const confirmed = globalThis.confirm("This will remove saved checks and notes for this binder on this device. Continue?");
    if (!confirmed) return;

    state.checks = {};
    state.notes = {};
    state.collapsed = {};
    state.signoffs = {};
    saveState();
    render();
  });

  elements.printBtn.addEventListener("click", () => {
    printForTrack(elements.roleFilter.value);
  });

  globalThis.addEventListener("afterprint", () => {
    if (!printRestoreContext) return;

    elements.roleFilter.value = printRestoreContext.role;
    elements.searchInput.value = printRestoreContext.search;
    state.collapsed = printRestoreContext.collapsed;
    printRestoreContext = null;
    globalThis.document.body.classList.remove("print-laminated");
    render();
    saveState();
  });
}

function init() {
  loadState();
  attachEvents();
  render();
}

init();
