/*
  Add exact training URLs here when available.

  Matching behavior:
  - Each rule uses `match` text (case-insensitive) against the checklist item text.
  - If it matches, all `links` are shown under that item.

  Example:
  {
    match: "Arterial sheath removal",
    links: [
      { label: "Elsevier: Arterial and Venous Sheath Removal", url: "https://your-org-link" }
    ]
  }
*/

globalThis.TRAINING_LINK_OVERRIDES = [
  {
    match: "Arterial sheath removal",
    links: [
      { label: "Add exact link", url: "" }
    ]
  },
  {
    match: "Cardiac Monitor Setup and Lead Placement",
    links: [
      { label: "Add exact link", url: "" }
    ]
  },
  {
    match: "Administers moderate (procedural) sedation",
    links: [
      { label: "Add exact link", url: "" }
    ]
  }
];
