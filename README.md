# Cath Lab Orientation Binder (Interactive + Printable)

This repository contains a **web-first orientation binder** for onboarding:

- **Registered Nurses (RN)**
- **Radiology Techs (RT)**

It uses your source reference document:

- `Cath Lab & EP Lab - Addendum to Procedural Core OAE Final 9.27.2023.pdf`

## What this includes

- Interactive online binder with:
  - Role filtering (Shared, RN, RT)
  - Searchable sections
  - Checklist progress tracking
  - Auto-generated training resource links for Elsevier/CPG/Policy/AHA references
  - Per-section notes
  - Per-section validation sign-off (learner/preceptor names, initials, date, sign-off status)
  - Auto-save in browser (`localStorage`)
- Printable output options:
  - **Print Current View** (uses active track/search context)
  - **Print Selected Packet** (RN-only, RT-only, Shared-only, or full binder)
  - **Print RN Quick Guide** (compact medication reference table for use during workflow)
  - **Print Laminated RN Card** (2-column condensed medication card layout)

### Sign-off guardrails

To mark a section as **validated and signed off**, the following fields must be completed:

- Learner Name
- Learner Initials
- Preceptor Name
- Preceptor Initials
- Validation Date

If any are missing, the binder blocks sign-off and highlights missing fields.

### Training links note

The current PDF copy appears to be flattened (no embedded hyperlink annotations were detected), so training links are generated as searchable links from reference text in each competency item.

If you share a version of the PDF with active embedded URLs, those exact links can be mapped into the binder directly.

### Add exact training links later

When you have the final URLs, edit `training-links.js`.

- Add or update a rule with `match` text that appears in a checklist item.
- Add one or more exact links under `links`.
- Leave no blank URLs (empty URLs are ignored).

Example rule format:

- `match`: `"Arterial sheath removal"`
- `links`: label + URL objects

These manual links are shown first and merged with auto-generated reference links.

## Quick start

1. Open `index.html` in your browser.
2. Choose a track (RN, RT, or Shared).
3. Check off completed competencies and add notes.
4. Complete section sign-off fields as competencies are validated.
5. Use **Print Current View** or **Print Selected Packet** when you need a paper version.
6. Use **Print RN Quick Guide** to print the medication quick-reference sheet.
7. Use **Print Laminated RN Card** for a condensed pocket/clipboard print format.

### ACLS medication additions

The RN Medication Quick Guide includes ACLS medication items from:

- [Commonly Used Medications in ACLS](https://www.aclsmedicaltraining.com/commonly-used-medications-in-acls)

Added/confirmed ACLS-focused items include: Adenosine, Amiodarone, Atropine, Epinephrine, Magnesium sulfate, Oxygen, Vasopressin, plus existing vasoactive and antiarrhythmic entries.

## Recommended publishing (GitHub Pages)

You can host this as an online binder directly from this repository:

1. Push this folder to GitHub.
2. In repository settings, open **Pages**.
3. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main` (root)
4. Save and wait for deployment.
5. Share the generated URL with orienting staff and preceptors.

## Run in Docker

You can run the binder as a lightweight container using Nginx.

1. Build the image from the project root:

`docker build -t cathlab-orientation-binder .`

1. Run the container:

`docker run --rm -p 8080:8080 cathlab-orientation-binder`

1. Open the app:

`http://localhost:8080`

### Docker notes

- The app is served as static files from Nginx.
- `nginx.conf` enables clean fallback routing to `index.html` and cache headers for static assets.
- `.dockerignore` excludes local development and generated files to keep image context smaller.

### Docker troubleshooting (Windows)

- If `docker` is not recognized, install Docker Desktop and restart your terminal.
- If Docker returns an engine/pipe error, open Docker Desktop and wait until it shows **Running**, then retry the build.

## Files

- `index.html` — app shell and layout
- `styles.css` — online interactive styling
- `print.css` — print-specific stylesheet
- `app.js` — binder content + interactive logic
- `training-links.js` — manual override file for exact training URLs
- `Dockerfile` — container definition for static Nginx hosting
- `nginx.conf` — custom Nginx site config
- `.dockerignore` — excludes unnecessary files from Docker build context

## Notes for customization

- Edit section titles and checklist items in `app.js` (`sections` array).
- Add local policy references or links where needed.
- If you need different tracks (e.g., EP-specific), add additional section objects with a new `role` value and update `roleFilter` options in `index.html`.
