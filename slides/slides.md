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
title: Non-Plagiarism Declaration
---

We hereby declare that we fully understand and agree to the SIT assessment policy:

- We authored all submitted solutions independently without copying from external sources.
- We kept all team project materials private and inaccessible to other parties.
- We acknowledge that any policy misalignment results in zero marks.

**Declared by Group P5-5:** Joseph Poon (2501079) · Ryan Ke (2501911) · Wei Xiang (2500686) · Tan Yan Qi (2500030) · Zayne Lee (2503844) · 20 Nov 2026

<!--
[0:00 - 0:05] Flash the mandatory SIT Non-Plagiarism Declaration briefly and advance immediately to Problem Context.
-->

---
layout: columns
kicker: Scope & Milestone 1 Remediation
title: Problem Context & Core Guardrails
columns:
  - title: "Operational Bottleneck"
    items:
      - "9 certified teachers across Piano, Drums, Violin, and Trumpet"
      - "5 studios open 86 hours/week; only Studio 5 holds a drum kit"
      - "282 weekly 30-minute individual lessons managed on shared Excel"
  - title: "Refined System Scope"
    items:
      - "Three workload tiers: under 40h OK, 40–44h Warning, over 44h Statutory Cap"
      - "Minimum 60h monthly availability by the 19th; max 4h teaching block + 1h break"
      - "24-month immutable audit log; retired unrequested peer lesson swaps"
---

---
layout: diagram
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
[0:50 - 1:40] Explain directly from the diagram: closed 3-tier Layered Architecture (Presentation -> unified Business & Application Layer -> Data & Infrastructure Layer) with strict UML 2.5 lollipop/socket interfaces and solid delegate port pExtNotify to the external notification gateway.
-->

---
layout: default
---

<Figure src="/pattern_after_excerpt.png" alt="Strategy Pattern Class Excerpt" />

<!--
[1:40 - 2:20] Explain GoF Strategy Pattern directly from the diagram: AllocationController (Context) delegates candidate ordering to ITieBreakerStrategy, allowing managers to switch between WorkloadDeficitStrategy (lowest hours first) and PreferenceMatchStrategy (matching preferred day and studio) at runtime without altering core scheduling code.
-->

---
layout: diagram
---

<Figure src="/wireframe_01_manager_workload.png" alt="Manager Staff Workload Dashboard" />

<!--
[2:20 - 3:40] Prototype Flow 1A (Manager Landing Page):
- Shows all 9 active teachers, unassigned slots, pending rejections, and studio utilisation at a glance.
- Top-3 Lowest Allocated Weekly Hours queue surfaces Elena Lim (16.5h), Marcus Lim (21.0h), and Hannah Koh (24.5h) upfront for fair balancing.
- 3-tier statutory status: under 40h OK (including David Koh at 37.5h), 40–44h Warning, and over 44h Overworked, plus Confirm & Notify Teachers.
-->

---
layout: default
---

<Figure src="/wireframe_03_allocate_deficit.png" alt="Lesson Allocation — Lowest Hours Ranking" />

<!--
[3:40 - 5:00] Prototype Flow 1B (Allocating a 30-Minute Lesson Slot):
- Verify-before-allocate: unqualified and unavailable teachers are filtered out upfront (bottom collapsible list) in 14 ms.
- Compares up to 3 eligible teachers side-by-side showing weekly hours, continuous teaching block (out of 4.0h max), stated preferences, and studio location on that date.
- Studio 4 is automatically greyed out and disabled during its Wednesday 14:00–16:00 piano tuning maintenance window.
-->

---
layout: diagram
---

<Figure src="/wireframe_05_overtime_modal.png" alt="Preference Ranking & Overtime Confirmation Dialog" />

<!--
[5:00 - 6:00] Prototype Flow 1C (Strategy Toggle & Statutory Overtime Prompt):
- Toggling the Ranking Strategy from Workload Deficit to Preference Match promotes James Lee to #1 because he prefers Wednesday and Studio 2.
- Because assigning this 30-minute lesson moves James Lee from 40.5h to 41.0h (inside the 40.0–44.0h Warning tier), the system requires explicit manager justification before confirming, while strictly blocking anything above the 44.0h Employment Act ceiling.
-->

---
layout: default
---

<Figure src="/wireframe_07_teacher_schedule.png" alt="Teacher Weekly Schedule Grid" />

<!--
[6:00 - 7:00] Prototype Flow 2A (Teacher Personal Weekly Timetable):
- Role-restricted teacher view showing overall monthly allocation (112.0 h) and confirmed 30-minute lessons across Monday to Sunday.
- Every lesson block displays the student's name, grade, and assigned studio (S-01).
- Monday's 4.0-hour morning block (09:00–13:00) is automatically followed by a hatched 1.0-hour mandatory rest break (13:00–14:00).
-->

---
layout: diagram
---

<Figure src="/wireframe_08_teacher_rejection_modal.png" alt="Job Rejection Consultation Warning Dialog" />

<!--
[7:00 - 7:45] Prototype Flow 2B (Job Rejection Warning & Availability Rules):
- Clicking any assigned lesson displays student details and warns the teacher to discuss the assignment with their manager before submitting a rejection request.
- Rejected lessons stay assigned as Pending Review until the manager either retains the teacher or reallocates the slot—teachers never reschedule lessons directly.
-->

---
layout: default
---

<Figure src="/wireframe_13_audit_console.png" alt="Immutable 24-Month Compliance Audit Log" />

<!--
[7:45 - 8:40] Prototype Flow 3 (IT Admin Lifecycle & 24-Month Immutable Audit Log):
- Directly addresses our Milestone 1 feedback: every allocation, overtime justification (AL-2216), rejection, 60h availability declaration (AL-2214), studio equipment/maintenance update (AL-2211/2212), and logical account deactivation (AL-2209 Ruth Gomez) is recorded in an append-only 24-month compliance ledger.
-->

---
layout: columns
kicker: Quality Assurance
title: Testing Verification & Q&A
columns:
  - title: "Black-Box: Lesson Allocation"
    items:
      - "Evaluates 5 constraints across 48 total input combinations (2×2×2×3×2)"
      - "Collapsed systematically via indifferent states into 7 decision rules"
      - "9 boundary test cases verifying exact 39.5h, 40.0h, 44.0h, and 44.5h edges"
  - title: "White-Box: Candidate Filtering"
    items:
      - "24-line method mapped across a 10-node Control Flow Graph"
      - "Cyclomatic complexity M = E − N + 2P = 14 − 10 + 2(1) = 6"
      - "6 independent basis paths achieving 100% statement and branch coverage"
---
