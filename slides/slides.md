---
theme: slidev-theme-tahta
title: Music School Workload Allocation & Resource Scheduling
themeConfig:
  variant: minimal
  accent: '#1f2328'
transition: slide-left
mdc: true
routerMode: hash
layout: cover
kicker: INF2001 Milestone 2 · Team P5-5
subtitle: Joseph Poon · Ryan Ke · Wei Xiang · Tan Yan Qi · Zayne Lee
---

---
layout: default
kicker: Academic Integrity
title: Non-Plagiarism Declaration
---

We hereby declare that we fully understand and agree to the SIT assessment policy:

- We authored all submitted solutions independently without copying from external sources.
- We kept all team project materials private and inaccessible to other parties.
- We acknowledge that any policy misalignment results in zero marks.

<Tags :items="['Group P5-5', 'Joseph Poon (2501079)', 'Ryan Ke (2501911)', 'Wei Xiang (2500686)', 'Tan Yan Qi (2500030)', 'Zayne Lee (2503844)', '20 Nov 2026']" />

<!--
[0:00 - 0:05] Flash the mandatory SIT Non-Plagiarism Declaration briefly and advance immediately to Problem Context.
-->

---
layout: stats
kicker: 01 · Problem Context
title: Replacing spreadsheet collisions
ghost: "P5"
stats:
  - { value: 9, label: "certified teachers (5 Piano, 1 Drums, 2 Violin, 1 Trumpet)", icon: "lucide:users" }
  - { value: 5, label: "studios (86.0 h/wk each · Studio 5 sole drum room)", icon: "lucide:building-2" }
  - { value: 282, label: "individual 30-min student lessons (251 enrolled + 31 new)", icon: "lucide:calendar-clock" }
---

---
layout: feature
kicker: 01 · Scope & M1 Remediation
title: Core M2 guardrails
columns: 2
features:
  - { icon: "lucide:scale", title: "3-Tier Statutory Hours (FR-02, FR-16)", desc: "Top-3 lowest-workload queue + <40h OK, 40–44h Warning, >44h MOM Cap" }
  - { icon: "lucide:shield-check", title: "Pre-Verified Matrix (FR-03–05)", desc: "Up to 3 eligible teachers side-by-side (<300ms) with Strategy ranking" }
  - { icon: "lucide:clock", title: "60h Floor & 4h Block (FR-06, FR-11)", desc: "60.0h monthly availability by 19th 23:59 + max 4.0h block / 1.0h rest" }
  - { icon: "lucide:file-lock-2", title: "Manager Governance & Audit (FR-09, FR-17)", desc: "Rejection warning dialog + 24-month audit trail; M1 peer-swap retired" }
---

---
layout: diagram
kicker: 02 · Subsystem Architecture
title: UML 2.5 Component Architecture
note: Unified Business & Application tier with lollipop/socket interfaces and solid <strong>&lt;&lt;delegate&gt;&gt;</strong> port <strong>pExtNotify</strong>.
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
[0:50 - 1:45] Highlight our unified Business & Application Layer: WebClientUI invokes IScheduleService, IFacultyService, IFacilityService, and IAuditLogService with zero layer-skipping, while SchedulingService delegates to IConflictValidator and ITieBreakerStrategy.
-->

---
layout: vs
kicker: 02 · Detailed Design
title: GoF Strategy Pattern
label: OCP
left:
  title: "Before: Hardcoded Controller"
  items:
    - "AllocationController embeds branching sort logic directly"
    - "New academy ranking rules modify core scheduling code"
    - "Violates Single Responsibility & Open/Closed Principles"
right:
  title: "After: ITieBreakerStrategy"
  items:
    - "AllocationController (Context) delegates rankCandidates()"
    - "Swaps WorkloadDeficit & PreferenceMatch at runtime"
    - "New policies add one class while core scheduling stays untouched"
---

---
layout: section
index: "03"
kicker: Prototype Walkthrough
title: Requirement Traceability
subtitle: Manager Allocation · Teacher Schedule & Availability · IT Admin & Audit Trail
---

---
layout: showcase
side: right
fit: contain
image: /wireframe_01_manager_workload.png
kicker: Flow 1A · Manager Cockpit (UC-01, UC-05)
title: 3-Tier Workload & Balancing Queue
subtitle: Ranks top-3 lowest-allocated staff (FR-02), shows assigned studios (FR-01), flags statutory tiers (FR-16), and notifies teachers (FR-14).
---

<!--
[2:35 - 3:35] Point out the 9 active teachers matching the brief, Elena/Marcus/Hannah in the Top-3 lowest-hours queue (FR-02), David Koh at 37.5h correctly badged OK (<40h), James/Priya in Warning (40-44h), Chloe at 44.5h Overworked (>44h), and Confirm & Notify Teachers (FR-14).
-->

---
layout: image
side: right
fit: contain
image: /wireframe_03_allocate_deficit.png
kicker: Flow 1B · Allocation Matrix (UC-02)
title: Pre-Verified Candidate Matrix
---

- **Upfront Check (`14 ms`):** Pre-filters unqualified (`R1`) and unavailable (`R2`) staff (`NFR-PER-02`).
- **3-Candidate Matrix (`FR-04`):** Compares weekly hours, `4.0h` blocks (`FR-11`), preferences & studios.
- **Facility Guard (`FR-10, FR-13`):** Excludes `Studio 4` during scheduled maintenance (`R5`).

<!--
[3:35 - 4:35] Emphasize Prof Eric's verify-before-allocate principle: before clicking confirm on Piano slot L-409, the manager sees 3 eligible candidates side-by-side while unqualified/unavailable staff and maintenance-locked Studio 4 are already filtered out.
-->

---
layout: showcase
side: right
fit: contain
image: /wireframe_04_allocate_preference.png
kicker: Flow 1C · Strategy Toggle (FR-05)
title: Runtime Strategy Re-Ranking
subtitle: Switching to Preference Match promotes James Lee (Wed · S-02 match) to #1 Recommended and activates the Rule R6 overtime gate.
---

<!--
[4:35 - 5:15] Show ITieBreakerStrategy live on screen: toggling from Workload Deficit to Preference Match immediately re-orders James Lee from #3 to #1 Recommended because he prefers Wednesday and Studio 2.
-->

---
layout: image
side: right
fit: contain
image: /wireframe_05_overtime_modal.png
kicker: Flow 1D · Statutory Guardrail (FR-16)
title: Overtime Justification Gate
---

- **Warning Band (`40.0–44.0 h`):** Moves James Lee from `40.5 h` to `41.0 h` (`Rule R6`).
- **Manager Sign-Off (`FR-16`):** Logs mandatory justification under the `44.0 h` MOM ceiling (`NFR-COM-02`).

<!--
[5:15 - 5:50] Selecting James Lee opens the mandatory overtime confirmation dialog: emergencies can proceed between 40.0h and 44.0h with logged justification, whereas >44.0h is hard-blocked under MOM Employment Act Part IV.
-->

---
layout: showcase
side: right
fit: contain
image: /wireframe_07_teacher_schedule.png
kicker: Flow 2A · Teacher Schedule (UC-09)
title: Personal Weekly Timetable
subtitle: Monthly hours (112.0 h), student grades (FR-08), studio IDs (FR-01), and 1.0h rest breaks (FR-11).
---

<!--
[5:50 - 6:40] Show the school-intranet style weekly timetable: every slot shows student grade and Studio S-01 (FR-01, FR-08), and Monday's 4.0h morning block (09:00-13:00) is automatically followed by a hatched 1.0h rest break (FR-11).
-->

---
layout: image
side: right
fit: contain
image: /wireframe_08_teacher_rejection_modal.png
kicker: Flow 2B · Job Rejection & Availability (UC-07–10)
title: Consultation Warning & 60h Floor
---

- **Rejection Guard (`FR-09`):** Displays consultation warning; slot stays assigned pending Manager review.
- **60h Floor (`FR-06, FR-07`):** Enforces `>= 60.0 h` monthly availability before 19th `23:59` cutoff.

<!--
[6:40 - 7:35] Clicking any confirmed lesson displays the mandatory warning to consult the manager before submitting a rejection request, keeping all rescheduling authority strictly with Management.
-->

---
layout: showcase
side: right
fit: contain
image: /wireframe_13_audit_console.png
kicker: Flow 3 · Governance & Audit Trail (UC-11–17)
title: 24-Month Immutable Audit Ledger
subtitle: Logs allocations, overtime approvals (AL-2216), rejections, availability, account flags, and studio edits.
---

<!--
[7:35 - 8:30] Close the walkthrough on our dedicated Audit Log Console (resolving our M1 consultation feedback): entry AL-2216 records the exact overtime confirmation we just authorized, retained append-only for 24 months under MOM guidelines.
-->

---
layout: columns
kicker: 04 · Verification Suite
title: Black-Box & White-Box Coverage
columns:
  - title: "Black-Box: allocateLessonSlot()"
    items:
      - "5 causes (C1–C5), with C4 across 3 tiers (<40h, 40–44h, >44h)"
      - "48 combinations (2×2×2×3×2) collapsed to 7 rules (R1–R7)"
      - "9 BVA test cases probing 39.5h, 40.0h, 44.0h & 44.5h edges"
  - title: "White-Box: findEligibleCandidates()"
    items:
      - "24-line method mapped across 10 Control Flow Graph nodes"
      - "Cyclomatic complexity M = E − N + 2P = 14 − 10 + 2(1) = 6"
      - "6 independent basis paths for 100% statement & branch coverage"
---

---
layout: end
title: Thank You — Q&A
subtitle: 17 Atomic FRs · 9 Verifiable NFRs · 6 UML 2.5 Interfaces · 15 Traceable Views
contact: Team P5-5 · Music School Scheduling System
---

---
layout: diagram
aside: Appendix
kicker: Appendix A1 · Object-Oriented Design
title: Final Class Diagram
note: 1:1 realization of all 6 component interfaces, boundary views, controllers, strategies, observers, and entities.
---

<Figure src="/final_class_diagram.png" alt="Final Class Diagram" />

---
layout: image
side: right
fit: contain
image: /architecture_diagram.png
aside: Appendix
kicker: Appendix A2 · Architectural Pattern
title: 3-Tier Layered Architecture
---

- **1. Presentation:** Boundary UI views (`AllocationUI`, `TeacherUI`, `AdminUI`, `AuditLogUI`).
- **2. Business:** Unified service tier enforcing statutory limits, 4h blocks & `ITieBreakerStrategy`.
- **3. Data & Infra:** PostgreSQL (`IPersistenceGateway`) + external SMTP/SMS gateway port.

---
layout: diagram
aside: Appendix
kicker: Appendix A3 · Secondary GoF Pattern
title: Observer Pattern Realization
note: Inbound IScheduleService.notifyAssignedTeachers() triggers Subject broadcast across Email, Dashboard, and Audit observers.
---

<Figure src="/observer_pattern_after.png" alt="Observer Pattern Class Excerpt" />

---
layout: showcase
side: right
fit: contain
image: /whitebox_cfg.png
aside: Appendix
kicker: Appendix A4 · White-Box Control Flow
title: Control Flow Graph (M = 6)
subtitle: Node 5 branches across <40.0h (Node 6 OK), 40.0–44.0h (Node 7 Warning), and >44.0h (Node 8 Overworked).
---

---
layout: default
aside: Appendix
kicker: Appendix A5 · Black-Box Reduction
title: Reduced Decision Table (48 → 7 Rules)
---

<Grid
  head
  highlight="col:6"
  :data="[
    ['Cause / Effect', 'R1 (1–24)', 'R2 (25–36)', 'R3 (37–42)', 'R4 (43–44)', 'R5 (45–46)', 'R6 (47)', 'R7 (48)'],
    ['C1: Qualified', 'N', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ['C2: Available', '-', 'N', 'Y', 'Y', 'Y', 'Y', 'Y'],
    ['C3: Block ≤ 4.0h', '-', '-', 'N', 'Y', 'Y', 'Y', 'Y'],
    ['C4: Weekly Tier', '-', '-', '-', '> 44h', '< 40h, 40–44h', '40–44h', '< 40h'],
    ['C5: Studio Valid', '-', '-', '-', '-', 'N', 'Y', 'Y'],
    ['Outcome', 'E3: Unqualified', 'E4: Unavailable', 'E5: >4h Block', 'E6: >44h Cap', 'E7: Studio Clash', 'E2: Warning Gate', 'E1: Confirm OK']
  ]"
/>

---
layout: showcase
side: right
fit: contain
image: /wireframe_09_teacher_availability.png
aside: Appendix
kicker: Appendix A6 · Teacher Availability & Studio Utilization
title: 60.0h Availability Grid (FR-06, FR-07)
subtitle: Recurring 30-minute availability matrix enforcing the 60.0h floor before 19 Nov 23:59 alongside preferred days and studio.
---

---
layout: image
side: right
fit: contain
image: /wireframe_12_admin_studios.png
aside: Appendix
kicker: Appendix A7 · IT Admin & Rejected Slot Disposition
title: Studio Config, Accounts & RBAC
---

- **Studio Equipment (`FR-13`):** Live `equippedInstruments` toggles (`S-05` sole drum studio).
- **Maintenance (`FR-10`):** Blackout windows automatically exclude studios from allocation.
- **Logical Deactivation (`FR-12, NFR-REL-02`):** Soft-flags `T-10 Ruth Gomez` while retaining historical audit links.
