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
subtitle: Team P5-5 — Joseph Poon, Ryan Ke, Wei Xiang, Tan Yan Qi, Zayne Lee
---

---
layout: columns
title: Operational Constraints
columns:
  - title: "Staff & Student Demand"
    items:
      - "9 certified teachers: 5 Piano, 1 Drums, 2 Violin, 1 Trumpet"
      - "251 enrolled + 31 unassigned students (30-min individual slots)"
      - "2 shift managers (43h/week) replacing collision-prone shared Excel"
  - title: "Studio & Labour Rules"
    items:
      - "5 studios (86.0h/week each); Studio 5 holds the sole drum kit"
      - "Max 4.0h continuous teaching followed by a 1.0h rest break"
      - "Availability due 19th 23:59; monthly planning begins on the 20th"
---

---
layout: default
title: Functional Requirements — Allocation & Ranking
---

| ID | Specification |
| :--- | :--- |
| **FR-01** | Display each teacher's monthly work allocation and assigned studio location upon lesson confirmation. |
| **FR-02** | Sort and display the top 3 teachers with the lowest allocated weekly hours on the manager dashboard. |
| **FR-03** | Allow managers to manually allocate unassigned or pending-reallocation 30-minute lesson slots for a target week. |
| **FR-04** | Display up to 3 candidate teachers side-by-side showing current workload, preferences, and assigned studio for that date. |
| **FR-05** | Rank eligible candidate teachers by remaining weekly capacity below 40.0 hours and preferred teaching day match. |
| **FR-11** | Prevent any lesson allocation that causes a teacher to exceed 4.0 continuous teaching hours without a 1.0-hour rest break. |

---
layout: default
title: Functional Requirements — Teachers & Facilities
---

| ID | Specification |
| :--- | :--- |
| **FR-06** | Allow teachers to submit and edit recurring 30-minute availability slots up to 1 month ahead until 23:59 on the 19th, enforcing a 60.0-hour minimum. |
| **FR-07** | Allow teachers to specify preferred teaching days and a preferred studio ID within their submitted availability window. |
| **FR-08** | Provide teachers with a personal weekly schedule displaying confirmed lessons, assigned studio locations, and enrolled student details. |
| **FR-09** | Display a warning advising teachers to consult the manager prior to submitting a job rejection request, and flag rejections for manager review. |
| **FR-10** | Allow IT administrators to schedule studio maintenance periods and exclude studios under maintenance from lesson allocation. |
| **FR-13** | Allow IT administrators to configure studio instrument equipment for Studios 1 to 5 and restrict allocations to equipped studios. |

---
layout: default
title: Functional Requirements — Accounts, Compliance & Audit
---

| ID | Specification |
| :--- | :--- |
| **FR-12** | Allow IT administrators to provision user accounts and perform logical account deactivations for Teachers, Managers, and IT Administrators. |
| **FR-14** | Notify assigned teachers when lesson allocations are confirmed for a weekly schedule. |
| **FR-15** | Calculate booked versus available studio hours across the 86 weekly operating hours and generate studio utilisation reports. |
| **FR-16** | Evaluate teacher weekly hours across three tiers—`OK` (`< 40.0h`), `Warning` (`40.0–44.0h`), and `Overworked` (`> 44.0h`, Employment Act Part IV)—requiring manager confirmation in the warning tier. |
| **FR-17** | Append an immutable audit log record for every allocation, overtime confirmation, rejection, and configuration change, and allow inspection. |

---
layout: image
side: right
fit: contain
image: /architecture_diagram.png
title: Closed 3-Tier Layered Architecture
---

- **Closed Isolation:** Requests traverse Presentation, Business, and Data tiers sequentially without layer-skipping.
- **Unified Business Tier:** Centralizes multi-constraint validation, statutory caps, and candidate ranking outside UI views.
- **Right-Sized Topology:** Avoids distributed microservices network overhead for a 9-teacher, 5-studio school.

---
layout: diagram
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
Walk through the 6 internal components, required sockets and provided lollipops (IScheduleService, IConflictValidator, ITieBreakerStrategy, IFacultyService, IFacilityService, IAuditLogService), and solid UML 2.5 delegate connector to boundary port pExtNotify.
-->

---
layout: two-cols
title: GoF Strategy Pattern
---

<Figure src="/pattern_before_excerpt.png" caption="Before: conditional sorting coupled inside AllocationController" />

::right::

<Figure src="/pattern_after_excerpt.png" caption="After: Context delegates sorting to ITieBreakerStrategy (OCP)" />

---
layout: default
---

<Figure src="/wireframe_01_manager_workload.png" alt="Manager Staff Workload Dashboard" />

<!--
Manager Staff Workload (/manager):
- FR-01: Monthly allocation hours and assigned studio IDs per teacher.
- FR-02: Top 3 lowest weekly hours (Elena Lim 16.5h, Marcus Lim 21.0h, Hannah Koh 24.5h).
- FR-14: Confirm & Notify Teachers dispatches observer alerts.
- FR-16 & NFR-USE-02: <40.0h Green OK (David Koh 37.5h), 40.0–44.0h Amber Warning (James Lee 40.5h), >44.0h Red Overworked (Chloe Teo 44.5h).
-->

---
layout: diagram
---

<Figure src="/wireframe_02_studio_utilisation.png" alt="Studio Utilisation Report" />

<!--
Studio Utilisation (/manager/utilisation):
- FR-15: Booked, maintenance, and net available hours across Studios 1 to 5 on the 86.0h/studio weekly basis with CSV export and time-band occupancy matrix.
-->

---
layout: default
---

<Figure src="/wireframe_03_allocate_deficit.png" alt="Lesson Allocation — Workload Deficit Strategy" />

<!--
Lesson Allocation Matrix (/manager/allocate):
- FR-03 & NFR-PER-02: Allocates 30-min Piano slot L-409 (Wed 15:00–15:30), validated in 14 ms.
- FR-04 & FR-11: Side-by-side comparison of 3 eligible teachers with continuous block hours, preferences, and daily studio.
- FR-10 & FR-13: Studio 4 excluded by Wed 14:00–16:00 maintenance (R5); unqualified/unavailable staff filtered upfront.
-->

---
layout: diagram
---

<Figure src="/wireframe_04_allocate_preference.png" alt="Lesson Allocation — Preference Match Strategy" />

<!--
Strategy Toggle (FR-05):
- Toggling Preference Match promotes James Lee (matches Wednesday + S-02) from #3 to #1 Recommended.
-->

---
layout: default
---

<Figure src="/wireframe_05_overtime_modal.png" alt="Mandatory Overtime Confirmation Dialog" />

<!--
Statutory Overtime Gate (FR-16 & NFR-COM-02):
- Moving James Lee from 40.5h to 41.0h (Warning tier) requires explicit manager justification before confirming; >44.0h is hard-blocked.
-->

---
layout: diagram
---

<Figure src="/wireframe_06_rejection_review.png" alt="Manager Review of Rejected Lesson" />

<!--
Manager Rejection Review (FR-03, FR-09):
- Displays Sarah Jenkins's rejection note on L-352, allowing the Manager to retain T-01 after discussion or reassign to an eligible candidate.
-->

---
layout: default
---

<Figure src="/wireframe_07_teacher_schedule.png" alt="Teacher Personal Weekly Timetable" />

<!--
Teacher Weekly Schedule (/teacher):
- FR-01 & FR-08: Monthly Allocation (112.0 h), student names/grades, and Studio S-01 across Mon–Sun.
- FR-11: Hatched 1.0h mandatory rest break (13:00–14:00) immediately following Monday's 4.0h continuous block (09:00–13:00).
-->

---
layout: diagram
---

<Figure src="/wireframe_08_teacher_rejection_modal.png" alt="Teacher Job Rejection Consultation Warning" />

<!--
Job Rejection Consultation Warning (FR-09):
- Displays student details and warns the teacher to consult the manager prior to submitting a rejection request.
-->

---
layout: default
---

<Figure src="/wireframe_09_teacher_availability.png" alt="Teacher Monthly Availability & Preferences" />

<!--
Monthly Availability & Preferences (/teacher/availability):
- FR-06: Recurring 30-min grid open until 23:59 on the 19th, enforcing the 60.0h monthly minimum.
- FR-07: Preferred teaching days and Preferred Studio selector.
-->

---
layout: two-cols
title: Account Lifecycle & Studio Configuration
---

<Figure src="/wireframe_10_admin_accounts.png" caption="Provisioning & logical deactivation (FR-12, NFR-REL-02)" />

::right::

<Figure src="/wireframe_12_admin_studios.png" caption="Studio instruments & maintenance windows (FR-10, FR-13)" />

---
layout: diagram
---

<Figure src="/wireframe_13_audit_console.png" alt="Immutable 24-Month Compliance Audit Log" />

<!--
Immutable 24-Month Audit Log (/manager/audit):
- FR-17 & NFR-COM-01/02: Append-only ledger retained for 24 months recording allocations, overtime approvals (AL-2216), rejections, availability saves, studio updates, and account changes.
-->

---
layout: default
title: Black-Box Testing — allocateLessonSlot()
---

| Cause / Effect | R1 (1–24) | R2 (25–36) | R3 (37–42) | R4 (43–44) | R5 (45–46) | R6 (47) | R7 (48) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1: Teacher Qualified** (`Y, N`) | `N` | `Y` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C2: Teacher Available** (`Y, N`) | `-` | `N` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C3: Block ≤ 4.0h** (`Y, N`) | `-` | `-` | `N` | `Y` | `Y` | `Y` | `Y` |
| **C4: Weekly Tier** (`<40, 40–44, >44h`) | `-` | `-` | `-` | `> 44h` | `<40, 40–44h` | `40–44h` | `< 40h` |
| **C5: Studio Equipped & Free** (`Y, N`) | `-` | `-` | `-` | `-` | `N` | `Y` | `Y` |
| **Outcome** | **Reject** | **Reject** | **Reject** | **Reject** | **Reject** | **Warning** | **Confirm** |

9 Boundary Value Analysis tests (`TC-BB-01` to `TC-BB-07`) target the `39.5h`, `40.0h`, `44.0h`, and `44.5h` workload boundaries.

---
layout: two-cols
title: White-Box Testing — findEligibleCandidates()
---

```java
List<Teacher> findEligibleCandidates(inst, slot, wk) {
  List<Teacher> eligible = new ArrayList<>(); // N1
  int i = 0;
  while (i < pool.size()) {                   // N2
    Teacher c = pool.get(i);
    if (c.hasCert(inst) && c.isFree(wk, slot)) { // N3
      if (c.blockHrs(slot) + 0.5f <= 4.0f) {  // N4
        switch (workloadTier(c.hours() + 0.5f)) { // N5
          case LT_40H:      c.set(OK); eligible.add(c); break; // N6
          case BTWN_40_44H: c.set(WARN); eligible.add(c); break; // N7
          case GT_44H:      c.set(OVERWORKED); break; // N8
        }
      }
    }
    i = i + 1;                                // N9
  }
  return eligible;                            // N10
}
```

::right::

<Figure src="/whitebox_cfg.png" alt="Control Flow Graph" />

---
layout: image
side: right
fit: contain
image: /whitebox_cfg.png
title: Cyclomatic Complexity & Basis Paths
---

$$M = E - N + 2P = 14 - 10 + 2(1) = 6$$

`14` edges, `10` nodes, `1` connected graph $\implies 6$ linearly independent basis paths (100% statement & branch coverage):

- **Path 1 (`< 40.0h`):** `1 → 2 → 3 → 4 → 5 → 6 → 9 → 2 → 10`
- **Path 2 (`40.0–44.0h`):** `1 → 2 → 3 → 4 → 5 → 7 → 9 → 2 → 10`
- **Path 3 (`> 44.0h`):** `1 → 2 → 3 → 4 → 5 → 8 → 9 → 2 → 10`
- **Path 4 (`> 4.0h` Block):** `1 → 2 → 3 → 4 → 9 → 2 → 10`
- **Path 5 (Ineligible/Busy):** `1 → 2 → 3 → 9 → 2 → 10`
- **Path 6 (Empty Pool):** `1 → 2 → 10`

---
layout: end
title: Thank You
subtitle: Questions & Discussion
---
