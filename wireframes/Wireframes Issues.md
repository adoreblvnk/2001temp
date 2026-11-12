# Issues with wireframes
**Method of testing:** Each FR is mapped to a UC, we go through that mapped UC's MSS, AS, pre/post conditions to see if there a wireframe for each step.

**Legends:**
- MSS = Main Success Scenario
- AS = Alternative Scenario

> Only outstanding issues are listed below. Steps that are met, and steps removed from scope in M2 (draft schedule transition screens, rejection warning modal, batch reassignment, operating-hours configuration), are omitted.

---

## FR → UC mapping (derived from M1 RTM Table 2.4 + M2 §5)

| FR | Short description | UC(s) |
| :--- | :--- | :--- |
| FR-01 | Monthly allocation + assigned studio display | UC-01 (manager), UC-09 (teacher) |
| FR-02 | Top 3 lowest + 3-tier workload | UC-01 |
| FR-03 | Manual allocation of 30-min slots | UC-02 |
| FR-04 | Up to 3 candidates side-by-side | UC-02 |
| FR-05 | Candidate ranking | UC-02 |
| FR-06 | Availability until 19th 23:59, 60h min | UC-07 |
| FR-07 | Preferred days/studio, block limits | UC-08 |
| FR-08 | Personal weekly schedule + students | UC-09 |
| FR-09 | Rejection request flagged for discussion | UC-10, UC-03 |
| FR-10 | Post-19th change flagged for review | UC-04 |
| FR-11 | Studio maintenance + exclusion | UC-15 |
| FR-12 | Substitute reassignment | UC-06 |
| FR-13 | Account provision / logical deactivate | UC-12, UC-13 |
| FR-14 | Studio equipment config + restriction | UC-14 |
| FR-15 | Notify teachers on confirmation | UC-05 |
| FR-16 | Studio utilisation report (86h week) | UC-16 |
| FR-17 | 3-tier evaluation + manager confirmation | UC-17 (also UC-02 step 6) |
| FR-18 | Immutable audit log + inspection | UC-17 |

---
## FR 1: mapped to UC01
### MSS
- Manager can't select target calender week (mss 1) <- not exactly part of the requirements, but it's in the UC. [small issue]

### Post/Pre conditions
- Alternative Failure post-condition (cached metrics + synchronization warning) has no screen

---
## FR 3: mapped to UC02
### MSS
- MSS 1 (select target week and student lesson slot): no week selector on any screen; allocation.html opens on a fixed lesson (L-409) with no slot-picker step [small issue]
- MSS 5 (re-validate before saving): no explicit re-validation state on screen [small issue]

### AS
- 5a (concurrent allocation conflict -> "Allocation Conflict: Selection no longer available.", return to step 3 with refreshed candidates): no screen for this error state [issue]

### Post/Pre conditions
- Alternative Failure post ("displays specific constraint violation feedback"): partially met — Rule R2/R6/R7 feedback cards shown, but no blocked-rejection state for R1 (unqualified teacher)

### misc issues
- allocation.html data inconsistency: James Lee projected at "31.0 h → 31.5 h" but the meter says "Warning" and the gate header says "warning tier (40.0–44.0 h)" — 31.5 h is below 40.0 h, so the demo contradicts the 3-tier rule the gate is supposed to enforce.

---
## FR 4: mapped to UC02
### AS
- 5a (candidate refresh after concurrent conflict): no refreshed-candidates state — same gap as FR-3.

---
## FR 5: mapped to UC02
### misc issues
- Preference Match strategy has no rendered output state — the segmented control exists, but only the Workload Deficit ranking is ever shown; no wireframe demonstrates the re-ranked order under Preference Match.

---
## FR 6: mapped to UC07
### MSS
- MSS 5 (click "Submit Availability"): **no submit button exists anywhere on teacher.html** [issue]
- MSS 6 (timestamp captured, status `Auto-Approved`): no `Auto-Approved` confirmation state shown [issue]
- MSS 7 (submission logged in compliance audit trail): no availability-submission row in audit.html [issue]

### AS
- 5a (submission after 19th 23:59 -> `Late - Pending Manager Review`, grid locked, diff routed to Manager Exception Queue UC-04): teacher-side flag exists ("1 flagged change", red-outline flagged cell), but no `Late - Pending Manager Review` status label, no locked-grid state, and no manager queue screen at all (see FR-10) [issue]

### misc issues
- Availability grid covers only 09:00–17:30 Mon–Sun with Sunday "closed", but published operating hours are Mon–Fri 09:00–21:00 and Sat–Sun 08:00–21:00 — teachers cannot declare evening or weekend slots on this wireframe. [inconsistency]

---
## FR 7: mapped to UC08
### MSS
- MSS 5 (submit preferences): no submit control [small issue]
- MSS 6 (system verifies preferences align with submitted availability): no verification feedback state shown (e.g. preference outside declared availability) [issue]
- MSS 7 (displays confirmation, logs preference update): no confirmation state and no audit row for preference updates [issue]

### Post/Pre conditions
- Pre (availability submitted): no linkage/state shown between the availability declaration and the preferences panel [small issue]

---
## FR 9: mapped to UC10 and UC03

**UC-10 (teacher side):**
### MSS
- MSS 1–2 (select confirmed slot, click "Request Job Rejection"): partially met — struck-through L-352 block exists, but no explicit "Request Job Rejection" button shown [small issue]
- MSS 5 (reason code): reason codes differ from the UC's standard set (`Scheduling Conflict` / `Pedagogical Mismatch` / `Personal / Medical`) — wireframe uses MED-01 / FAM-02 / COC-03 / OTH-09 [inconsistency]
- MSS 8 (routes urgent ticket to Manager Exception Queue): text claims routing, but no manager-side queue screen exists (see UC-03 below) [issue]

**UC-03 (manager side):**
### MSS
- MSS 1–2 (open Exception Queue; display pending rejections with teacher/student/slot/reason + pre-computed candidate list per ticket): **no exception queue screen anywhere** [issue — major]
- MSS 3–5 (review ticket, contact teacher, select substitute, advisory override): rebind mechanics exist on allocation.html, but never in rejection-ticket context [partial]
- MSS 6 (notices to student and substitute): no screen [small issue]

### AS
- 3a (consultation -> retain original teacher, restore Confirmed, log): no screen [issue]
- 2a (zero substitutes -> "No eligible substitutes", release studio, Unassigned, priority rescheduling, cancellation notice): no screen [issue]

### Post/Pre conditions
- Alternative failure post (lesson remains Pending Re-allocation; alert persists on dashboard): no dashboard alert [issue]

---
## FR 10: mapped to UC04
### MSS
- MSS 1–2 (open Late Availability Review queue; display diff vs preliminary roster): **no manager-side screen at all** — teacher flag exists, queue/diff missing [issue — major]
- MSS 3–4 (evaluate disruption, approve with logged justification): no approve/reject controls [issue]
- MSS 5–6 (status -> `Approved Late`, notify teacher, audit log): no status label, no notification state, no audit row for late-availability adjudication [issue]

### AS
- 4a (reject with explanatory notes; keep locked availability, status `Rejected`, notify teacher, log): no screen [issue]

### Post/Pre conditions
- Pre (`Late - Pending Manager Review` status): the status label is never displayed on any screen

### misc issues
- Report §5.3 maps FR-10 under UC-07/08/09/10 but omits UC-04 entirely; UC-04 appears in no §5 use-case list.
- cockpit.html "Review flagged slots" button sits on the Overworked row (FR-17), not on late availability — easy to mistake for UC-04 coverage.

---
## FR 11: mapped to UC15
### MSS
- MSS 3 (scan window for existing confirmed lessons): no "lessons affected" warning state [issue]
- MSS 5 (shift conflicting lessons to `Pending Re-allocation`, notify Manager): no screen [issue]

### AS
- 1a (Emergency Blackout button: immediate lock, cancel active sessions, alert managers): no screen [issue]

---
## FR 12: mapped to UC06
### AS
- 2a (no substitute -> "No eligible substitutes", Cancel with Credit, release studio, log): no screen [issue]

### misc issues
- M2 FR-12 was narrowed to **single-slot** substitute reassignment, but UC-06 in M1 still describes **batch** reallocation — the UC was not updated to the M2 baseline. [report issue]

---
## FR 13: mapped to UC12 and UC13

**UC-12 (provision):**
### MSS
- MSS 1–4 (console, enter Full Name / Staff ID / School Email / Contact, select role, select instruments): partially met — form has Full name, Role, Instrument, Home studio but **missing Staff ID, School Email, Contact fields** (MSS 2) [issue]
- MSS 5 (verify uniqueness of Staff ID and email): no verification/error state — fields absent [issue]

### AS
- 5a (duplicate Staff ID/Email -> "Duplicate account detected."): no screen [issue]

**UC-13 (manage status):**
### MSS
- MSS 1 (search for target account): no search field [small issue]
- MSS 2–4 (select Deactivate, **confirmation warning detailing active future lesson allocations**, confirm): isolated deactivate button exists, but no confirmation modal with future-lesson detail [issue]
- MSS 6 (unassign user's future lessons -> `Pending Re-allocation` on manager queue): no screen [issue]

### misc issues
- The Deactivated row uses the green `badge-ok` (OK) styling — green "OK" colour on a deactivated account misuses the 3-tier colour language (text label is present, so NFR-USE-02 still passes, but semantics are confusing). [small issue]

---
## FR 14: mapped to UC14
### MSS
- MSS 3 (configure editable attributes): static ✓ table + Save button only — no editable controls (toggles/inputs) rendered for the instrument equipment configuration [small issue]

---
## FR 16: mapped to UC16
### MSS
- MSS 1–2 (open Analytics & Reporting view, select target month): utilisation plate exists but no month selector [small issue]
- MSS 3 (aggregate booked vs capacity — UC says **monthly** 344 h/studio, 1,720 h academy): wireframe shows the **weekly 86 h** basis per M2 FR-16 — the UC was not updated to the M2 baseline [report issue]
- MSS 4 (render utilisation charts **and peak window heatmaps**): bar meters only; no peak-hour heatmap/distribution [issue]
- MSS 5 (export report PDF/CSV): **no export control** on the cockpit — only audit.html has an export button [issue]

### misc issues
- cockpit.html "Utilisation report" button links to `design-system.html` — dead end / wrong destination for the report view. [small bug]

---
## FR 17: mapped to UC17
### MSS
- MSS 1 (navigate to panel and select target calendar week): no week selector (same gap as FR-1) [small issue]
- MSS 5 (verify no teacher exceeds 12 daily hours; submit weekly compliance verification snapshot; append sign-off record): **no compliance sign-off control or snapshot screen**; no daily-hours view [issue]

### AS
- 3a (missing justification for advisory overtime -> prompt manager to append justification before compliance sign-off): no screen [issue]

### misc issues
- UC-17 MSS 2 expects verification that "zero instructors exceed the 44.0 h ceiling", but seed data has Chloe Teo at 45.5 h — the flag is correct behaviour, yet no wireframe state shows how a compliance sign-off proceeds when a breach exists. [data/state gap]

---
## FR 18: mapped to UC17
### misc issues
- FR-18 requires a record for **every** allocation, overtime confirmation, rejection update and configuration change — all four types present. However UC-07 MSS 7 and UC-08 MSS 7 also promise audit entries for availability submissions and preference updates; no such ledger rows exist. [small gap]

---
## NFR issues (report §5 claims "NFR-USE-01 to NFR-COM-02")

| NFR | Issue |
| :--- | :--- |
| NFR-USE-01 (375–1920px, no h-scroll) | shared.css breakpoints (1180/1080/900/640px) exist, but all screenshots are desktop-width; no 375px mobile state shown — **needs a mobile-viewport screenshot to evidence "no horizontal scrolling"** |
| NFR-PER-01 (1.5s render @ 20 users) | **not listed in any §5 subsection and no wireframe representation** — §5 intro claims full NFR coverage but PER-01 appears nowhere |
| NFR-REL-01 (99.5% uptime 19th–24th) | **not listed in any §5 subsection and no wireframe representation** — same gap as PER-01 |
| NFR-SEC-01 (role-based access) | mapped to §5.3 (teacher portal), but the evidence is actually on index.html (role select) + admin.html caption; teacher portal itself shows no gating state and there is no access-denied screen |

Checked and met (no action): NFR-USE-02, NFR-PER-02, NFR-REL-02, NFR-COM-01, NFR-COM-02.

---
## Cross-cutting / report-level issues

1. **Stale UC reference:** Report §5.4 cites "`UC-11` (Inspect System Audit Log)", but UC-11 in M1 is *Request Peer Lesson Swap*, which was removed from scope in M2. Audit inspection is UC-17. Either UC-11 was renumbered (in which case UC-12–UC-17 references are also wrong) or it is a typo. [issue]
2. **UC-04 and UC-05 appear in no §5 use-case list**, even though FR-10 → UC-04 and FR-15 → UC-05 (§3.2.3 even cites "UC-05 / FR-15" correctly). [mapping issue]
3. **§5 subsection FR/UC lists don't line up:** §5.1 lists FR-15 but not UC-05; §5.2 lists UC-03 but not FR-09; §5.3 lists FR-10 but not UC-04. [mapping issue]
4. **M2 dropped the FR→UC RTM** (M1 Table 2.4) and never restated it, so the only FR→UC source is the M1 table with stale FR numbering — FR-11 to FR-18 were all renumbered between M1 and M2. [traceability issue]
5. **UCs not updated to the M2 baseline:** UC-06 still describes batch reassignment (M2 FR-12 is single-slot); UC-16 still uses the monthly 344 h/studio basis (M2 FR-16 is the 86-hour weekly basis); UC-10 MSS 7 still transitions to `Pending Re-allocation` while M2 FR-09 keeps the slot assigned pending discussion. [consistency issue]
6. **No week selector anywhere** — UC-01 MSS 1, UC-02 MSS 1 and UC-17 MSS 1 all require selecting a target calendar week; every screen hard-codes Week 46/47. [recurring small issue]

---
## No issues found

- **FR-02** (UC-01) — all MSS/AS/pre-post steps met
- **FR-08** (UC-09) — all MSS steps met (Draft advisory AS removed from M2 scope)
- **FR-15** (UC-05) — wireframe meets the M2 FR (publish action + notification + audit row); draft-transition states removed from M2 scope — only the §5 mapping gap remains, covered in cross-cutting issue 3
