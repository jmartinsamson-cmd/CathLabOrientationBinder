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
    titration: "Second dose 12 mg in 1–2 min if needed",
    max: "Per ACLS algorithm context",
    notes: "For regular narrow-complex SVT; rapid flush after dose"
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
    notes: "Card also shows low 5–50 and high 50–100 mcg/min"
  },
  {
    medication: "Dobutamine (Dobutrex)",
    mix: "500 mg / 250 mL D5W",
    start: "2.5–10 mcg/kg/min",
    titration: "Up/down by 2.5 mcg/kg/min every 15 min",
    max: "20 mcg/kg/min",
    notes: "Photo + ICU guide aligned"
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
    notes: "Use unit concentration table for mcg/min ↔ mL/hr"
  },
  {
    medication: "Phenylephrine (Neo-Synephrine)",
    mix: "10 mg / 250 mL D5W",
    start: "0.5 mcg/kg/min",
    titration: "Increase 0.5 mcg/kg/min q5 min; decrease 0.1 mcg/kg/min q15 min",
    max: "5 mcg/kg/min",
    notes: "Photo includes fixed-dose rapid/maintenance ranges"
  },
  {
    medication: "Nicardipine (Cardene)",
    mix: "20 mg / 200 mL premix",
    start: "2.5–5 mg/hr",
    titration: "Increase 2.5 mg/hr every 5–15 min; decrease 1 mg/hr q10 min",
    max: "15 mg/hr",
    notes: "Photo start value shows 5 mg/hr"
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
    notes: "Photo bolus 50–100 mg"
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
    notes: "Web reconciled with OCR"
  },
  {
    medication: "Naloxone (Narcan)",
    mix: "Common vial 0.4 mg/mL",
    start: "0.1–0.2 mg IV for sedation reversal OR 0.4–2 mg for overdose",
    titration: "Repeat every 2–3 min to response",
    max: "Per scenario/protocol",
    notes: "Web reconciled with OCR"
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
  ["Medication", "Mix", "Start", "Titration", "Max", "Notes"].forEach((label) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  medicationQuickGuideRows.forEach((row) => {
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
  medicationQuickGuideRows.forEach((row) => {
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
