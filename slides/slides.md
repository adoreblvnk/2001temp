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
kicker: INF2001 Milestone 2
subtitle: "Team P5-5: Joseph Poon, Ryan Ke, Wei Xiang, Tan Yan Qi, Zayne Lee | 20 November 2026"
---

---
layout: columns
kicker: Context & M1 Updates
title: Operational Constraints & M1 Refinements
columns:
  - title: "School & Statutory Constraints"
    items:
      - "9 teachers (5 Piano, 1 Drums, 2 Violin, 1 Trumpet) and 282 students"
      - "5 studios (86.0h/week each); Studio 5 holds the sole drum kit"
      - "4.0h max continuous teaching followed by a 1.0h rest break"
      - "60.0h monthly availability due 19th 23:59; planning starts 20th"
  - title: "Key Requirement Changes from M1"
    items:
      - "Removed scope creep: retired peer swaps and post-cutoff flagging"
      - "Folded substitute workflows into single-slot allocation (FR-03)"
      - "Split 3-tier statutory rules (FR-16) from colour badges (NFR-USE-02)"
      - "Added Audit Log inspection (FR-17, UC-11) and 60.0h floor (FR-06)"
---

---
layout: default
kicker: Key Requirements
title: Core Functional & Non-Functional Requirements
---

| Domain | IDs | Key System Requirement |
| :--- | :--- | :--- |
| **Allocation & Limits** | `FR-03–05, 11` | Rank up to 3 eligible teachers by remaining capacity (`<40h`) or preferred day, blocking `>4.0h` continuous blocks without a `1.0h` rest. |
| **Statutory Tiers** | `FR-16, NFR-USE-02` | Classify weekly load as `OK` (`<40.0h`), `Warning` (`40.0-44.0h`, justification required), and `Overworked` (`>44.0h` hard-blocked). |
| **Teacher Planning** | `FR-01, 06–09` | Enforce `>=60.0h` monthly availability before 19th 23:59, capture day/studio preferences, show schedule + studio, warn before rejection. |
| **Facilities & Admin** | `FR-10, 12–15` | Restrict lessons to equipped/non-maintenance studios, soft-deactivate accounts, notify on confirmation, report 86h studio utilisation. |
| **Audit, Speed & RBAC** | `FR-17, NFR-PER-02, SEC-01` | Validate slots in `<=300ms`, isolate role routes (`403`), support `375px-1920px` viewports, and retain immutable `24-month` logs. |

---
layout: image
side: right
fit: contain
image: /architecture_diagram.png
kicker: Architecture
title: Closed 3-Tier Layered Architecture
---

- **Closed Isolation:** Requests traverse Presentation, Business, and Data tiers sequentially without layer-skipping.
- **Unified Business Tier:** Centralizes multi-constraint validation, statutory caps, and candidate ranking outside UI views.
- **Right-Sized Topology:** Avoids microservices overhead for 9 teachers and 5 studios while enforcing stricter tier boundaries than bare MVC.

---
layout: diagram
kicker: Component Architecture
title: UML 2.5 Component Diagram
note: Six internal Spring components communicate via provided and required interfaces, delegating external alerts through boundary port pExtNotify.
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
Walk through the 6 internal components, required sockets and provided lollipops (IScheduleService, IConflictValidator, ITieBreakerStrategy, IFacultyService, IFacilityService, IAuditLogService), and solid UML 2.5 delegate connector to boundary port pExtNotify.
-->

---
layout: default
kicker: "Design Pattern 1: Strategy"
title: "Refactored Candidate Ranking: ITieBreakerStrategy"
---

<Figure src="/pattern_after_excerpt.png" alt="Class Excerpt After Strategy Pattern Implementation" caption="Before: hardcoded rankingMode inside AllocationController violated OCP. After: runtime strategy swap; Factory Method and Singleton rejected for boilerplate and global state." />

---
layout: diagram
kicker: "Design Pattern 2: Observer"
title: Decoupled Schedule Confirmation Alerts (FR-14)
note: AllocationController broadcasts ScheduleEvent to EmailNotificationObserver, DashboardAlertObserver, and AuditNotificationObserver via IScheduleObserver.
---

<Figure src="/observer_pattern_after.png" alt="Class Excerpt After Observer Pattern Implementation" />

---
layout: default
kicker: "UC-01, UC-05 | FR-01, FR-02, FR-14, FR-16, NFR-USE-02"
title: Manager Staff Workload Dashboard
---

<Figure src="/wireframe_01_manager_workload.png" alt="Manager Staff Workload Dashboard" />

<!--
Manager Staff Workload (/manager):
- FR-01: Monthly allocation hours and assigned studio IDs per teacher.
- FR-02: Top 3 lowest weekly hours (Elena Lim 16.5h, Marcus Lim 21.0h, Hannah Koh 24.5h).
- FR-14: Confirm & Notify Teachers dispatches observer alerts.
- FR-16 & NFR-USE-02: <40.0h Green OK (David Koh 37.5h), 40.0-44.0h Amber Warning (James Lee 40.5h), >44.0h Red Overworked (Chloe Teo 44.5h).
-->

---
layout: diagram
kicker: "UC-16 | FR-15"
title: Studio Utilisation & Occupancy Matrix
---

<Figure src="/wireframe_02_studio_utilisation.png" alt="Studio Utilisation Report" />

---
layout: default
kicker: "UC-02 | FR-03–05, FR-10, FR-11, FR-13, NFR-PER-02"
title: "Lesson Allocation & Strategy Toggle (Preference Match)"
---

<Figure src="/wireframe_04_allocate_preference.png" alt="Lesson Allocation Matrix with Preference Match Strategy" caption="14ms validation; Studio 4 blocked for maintenance (FR-10); toggling Strategy promotes James Lee (Wed + S-02) from #3 to #1." />

---
layout: two-cols
kicker: "UC-02, UC-03, UC-17 | FR-03, FR-09, FR-16, NFR-COM-02"
title: Overtime Gate & Rejected Lesson Review
---

<Figure src="/wireframe_05_overtime_modal.png" caption="Mandatory justification for 40.0-44.0h Warning tier (FR-16)" />

::right::

<Figure src="/wireframe_06_rejection_review.png" caption="Manager retains T-01 or reassigns rejected slot L-352 (FR-03, FR-09)" />

---
layout: two-cols
kicker: "UC-09, UC-10 | FR-01, FR-08, FR-09, FR-11"
title: Teacher Weekly Timetable & Rejection Warning
---

<Figure src="/wireframe_07_teacher_schedule.png" caption="112.0h monthly total, studio IDs, and hatched 1.0h rest after 4.0h block" />

::right::

<Figure src="/wireframe_08_teacher_rejection_modal.png" caption="Student details and mandatory consultation warning prior to rejection" />

---
layout: default
kicker: "UC-07, UC-08 | FR-06, FR-07"
title: Monthly Availability (60.0h Floor) & Preferences
---

<Figure src="/wireframe_09_teacher_availability.png" alt="Teacher Monthly Availability & Preferences" />

---
layout: two-cols
kicker: "UC-12–15 | FR-10, FR-12, FR-13, NFR-REL-02"
title: IT Admin Accounts & Studio Configuration
---

<Figure src="/wireframe_10_admin_accounts.png" caption="Provisioning & logical deactivation (FR-12, NFR-REL-02)" />

::right::

<Figure src="/wireframe_12_admin_studios.png" caption="Studio instruments & maintenance windows (FR-10, FR-13)" />

---
layout: diagram
kicker: "UC-11, UC-17 | FR-17, NFR-COM-01, NFR-COM-02"
title: Immutable 24-Month Compliance Audit Log
---

<Figure src="/wireframe_13_audit_console.png" alt="Immutable 24-Month Compliance Audit Log" />

---
layout: two-cols
kicker: "Security & Responsiveness | NFR-SEC-01, NFR-USE-01"
title: Role Access Enforcement & 375px Mobile Viewport
---

<Figure src="/wireframe_14_rbac_403.png" caption="RBAC 403 isolation (NFR-SEC-01)" />

::right::

<Figure src="/wireframe_15_mobile_375.png" caption="375px mobile viewport, zero scroll (NFR-USE-01)" />

---
layout: default
kicker: Decision Table & BVA
title: "Black-Box Testing: allocateLessonSlot()"
---

| Cause / Effect | R1 (1-24) | R2 (25-36) | R3 (37-42) | R4 (43-44) | R5 (45-46) | R6 (47) | R7 (48) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1: Teacher Qualified** | `N` | `Y` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C2: Teacher Available** | `-` | `N` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C3: Continuous Block <= 4.0h** | `-` | `-` | `N` | `Y` | `Y` | `Y` | `Y` |
| **C4: Weekly Tier** | `-` | `-` | `-` | `> 44h` | `<40h`<br>`40-44h` | `40-44h` | `< 40h` |
| **C5: Studio Equipped & Free** | `-` | `-` | `-` | `-` | `N` | `Y` | `Y` |
| **Outcome** | **Reject** | **Reject** | **Reject** | **Reject** | **Reject** | **Warning** | **Confirm** |

**9 test cases** (`TC-BB-01` to `TC-BB-07`, including `05A/05B` and `06A/06B`) reduce the 48 combinations and verify the `39.5h` (`TC-BB-07` Confirm), `40.0h` (`TC-BB-06A` Warning), `44.0h` (`TC-BB-06B` Warning), and `44.5h` (`TC-BB-04` Reject) statutory boundaries.

---
layout: two-cols
kicker: Control Flow Testing
title: "White-Box Testing: findEligibleCandidates()"
---

```java
List<Teacher> findEligibleCandidates(
    InstrumentType inst, TimeSlot slot, String wk) {
  List<Teacher> eligible = new ArrayList<>();         // N1
  List<Teacher> facultyPool = facultyService.getActive();
  int i = 0;
  while (i < facultyPool.size()) {                    // N2
    Teacher candidate = facultyPool.get(i);
    if (isQualified && isAvailable) {                 // N3
      if (continuousHours + 0.5 <= 4.0) {             // N4
        switch (workloadTier(weeklyHours + 0.5)) {    // N5
          case LT_40H:      status = OK;
            eligible.add(candidate); break;           // N6
          case BTWN_40_44H: status = WARNING;
            eligible.add(candidate); break;           // N7
          case GT_44H:      status = OVERWORKED;
            break;                                    // N8
        }
      }
    }
    i = i + 1;                                        // N9
  }
  return eligible;                                    // N10
}
```

::right::

<Figure src="/whitebox_cfg.png" alt="Control Flow Graph for ConflictValidator.findEligibleCandidates()" />

---
layout: image
side: right
fit: contain
image: /whitebox_cfg.png
kicker: Basis Path Coverage
title: Cyclomatic Complexity & Basis Paths
---

$$M = E - N + 2P = 14 - 10 + 2(1) = 6$$

`14` edges, `10` nodes, `1` component $\implies 6$ independent paths covered by **8 test cases** (`TC-WB-01` to `06`, incl. `02A/B` and `05A/B`):

- **Path 1 (`< 40.0h`):** `1 → 2 → 3 → 4 → 5 → 6 → 9 → 2 → 10`
- **Path 2 (`40.0-44.0h`):** `1 → 2 → 3 → 4 → 5 → 7 → 9 → 2 → 10`
- **Path 3 (`> 44.0h`):** `1 → 2 → 3 → 4 → 5 → 8 → 9 → 2 → 10`
- **Path 4 (`> 4.0h` Block):** `1 → 2 → 3 → 4 → 9 → 2 → 10`
- **Path 5 (Ineligible/Busy):** `1 → 2 → 3 → 9 → 2 → 10`
- **Path 6 (Empty Pool):** `1 → 2 → 10`

---
layout: end
title: Thank You
subtitle: Questions & Discussion
---

---
layout: default
kicker: Q&A Appendix
title: "Functional Requirements: Allocation & Ranking"
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
kicker: Q&A Appendix
title: "Functional Requirements: Teachers & Facilities"
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
kicker: Q&A Appendix
title: "Functional Requirements: Accounts, Compliance & Audit"
---

| ID | Specification |
| :--- | :--- |
| **FR-12** | Allow IT administrators to provision user accounts and perform logical account deactivations for Teachers, Managers, and IT Administrators. |
| **FR-14** | Notify assigned teachers when lesson allocations are confirmed for a weekly schedule. |
| **FR-15** | Calculate booked versus available studio hours across the 86 weekly operating hours and generate studio utilisation reports. |
| **FR-16** | Evaluate teacher weekly hours across three tiers: `OK` (`< 40.0h`), `Warning` (`40.0-44.0h`), and `Overworked` (`> 44.0h`, Employment Act Part IV), requiring manager confirmation in the warning tier. |
| **FR-17** | Append an immutable audit log record for every allocation, overtime confirmation, rejection, and configuration change, and allow inspection. |

---
layout: default
kicker: Q&A Appendix
title: Final Class Diagram
---

<Figure src="/final_class_diagram.png" alt="Final Class Diagram" caption="Service interfaces, controllers, GoF Strategy and Observer realizations, and domain entities aligned with component boundaries" />

---
layout: image
side: right
fit: contain
image: /pattern_before_excerpt.png
kicker: Q&A Appendix
title: "Strategy Pattern: Before Refactoring"
---

- Hardcoding `rankingMode` conditionals inside `AllocationController` coupled sorting directly to `Teacher`.
- Every new ranking rule forced edits and recompilation of core orchestration logic (violating OCP).

---
layout: default
kicker: Q&A Appendix
title: "Allocation Matrix: Workload Deficit Baseline"
---

<Figure src="/wireframe_03_allocate_deficit.png" alt="Lesson Allocation: Workload Deficit Strategy" />
