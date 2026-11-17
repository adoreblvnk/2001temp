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
subtitle: "Team P5-5: Joseph Poon, Ryan Ke, Wei Xiang, Tan Yan Qi, Zayne Lee"
---

---
layout: columns
kicker: Context & M1 Updates
title: Operational Constraints & M1 Refinements
columns:
  - title: "Context"
    items:
      - "9 teachers, 5 studios, 30-minute individual lessons"
      - "4.0h max continuous teaching followed by 1.0h rest"
      - "60.0h monthly availability due 19th 23:59"
  - title: "Key Requirement Changes from M1"
    items:
      - "Removed scope creep outside client specification"
      - "Added immutable audit log inspection"
---

---
layout: default
kicker: Requirements
title: Key Functional Requirements
---

| ID | Functional Requirement Specification |
| :--- | :--- |
| **FR-03** | Allow managers to <mark>manually allocate</mark> unassigned or pending-reallocation 30-minute lesson slots to eligible teachers for a target week. |
| **FR-05** | <mark>Rank eligible candidate teachers</mark> by remaining weekly capacity below <mark>40.0 hours</mark> and preferred teaching day match. |
| **FR-06** | Allow teachers to submit and edit recurring 30-minute availability slots up to 1 month ahead until 23:59 on the 19th, enforcing a <mark>60.0-hour minimum</mark>. |
| **FR-11** | <mark>Prevent</mark> any lesson allocation that causes a teacher to exceed <mark>4.0 continuous teaching hours</mark> without a minimum <mark>1.0-hour rest break</mark>. |
| **FR-16** | Evaluate teacher weekly working hours across <mark>3 tiers</mark> and require manager confirmation in the warning tier. |
| **FR-17** | Append an <mark>immutable audit log</mark> record for every lesson allocation, overtime confirmation, rejection update, and configuration change, and allow inspection. |

---
layout: default
kicker: Architecture
title: Closed 3-Tier Layered Architecture
---

<Figure src="/architecture_diagram.png" alt="Closed 3-Tier Layered Architecture" />

---
layout: diagram
kicker: Component Architecture
title: UML 2.5 Component Diagram
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
Walk through WebClientUI consuming IScheduleService, IConflictValidator, ITieBreakerStrategy, IFacultyService, IFacilityService, IAuditLogService, PersistenceService, and delegate port pExtNotify.
-->

---
layout: diagram
kicker: "Design Pattern 1: Observer"
title: Decoupled Schedule Confirmation Alerts
---

<Figure src="/observer_pattern_after.png" alt="Class Excerpt After Observer Pattern Implementation" />

<!--
FR-14: AllocationController acts as Subject, broadcasting ScheduleEvent via IScheduleObserver to EmailNotificationObserver, DashboardAlertObserver, and AuditNotificationObserver.
-->

---
layout: default
kicker: "Design Pattern 2: Strategy"
title: "Refactored Candidate Ranking: ITieBreakerStrategy"
---

**Before:** Conditional sorting inside `AllocationController` coupled directly to `Teacher`.

**After:** `AllocationController` delegates sorting to `ITieBreakerStrategy` at runtime.

<Figure src="/pattern_after_excerpt.png" alt="Class Excerpt After Strategy Pattern Implementation" />

---
layout: image
side: right
fit: contain
image: /wireframe_01_manager_workload.png
kicker: Manager View
title: Staff Workload Dashboard
---

- **`FR-01`:** Display each teacher's monthly work allocation and assigned studio location upon lesson confirmation.
- **`FR-02`:** Sort and display the top 3 teachers with the lowest allocated weekly hours on the manager dashboard.
- **`FR-16`:** Evaluate teacher weekly working hours across 3 tiers and require manager confirmation in the warning tier.
- **`NFR-USE-02`:** Display teacher weekly workload status using 3 visual tiers with text badges: Green `OK`, Amber `Warning`, and Red `Overworked`.
- **`FR-14`:** Notify assigned teachers when lesson allocations are confirmed for a weekly schedule.

---
layout: showcase
side: right
fit: contain
image: /wireframe_02_studio_utilisation.png
kicker: Manager View
title: Studio Utilisation Report
---

- **`FR-15`:** Calculate booked versus available studio hours across the 86 weekly operating hours and generate studio utilisation reports for school administration.

---
layout: image
side: right
fit: contain
image: /wireframe_04_allocate_preference.png
kicker: Manager Workflow
title: Lesson Allocation & Strategy Toggle
---

1. **`FR-03`:** Manually allocate unassigned or pending-reallocation lesson slots to eligible teachers for a target week.
2. **`FR-04`:** Display up to 3 candidate teachers side-by-side showing current workload, preferences, and daily studio.
3. **`FR-05`:** Rank eligible candidates by remaining capacity below 40.0 hours and preferred teaching day match.
4. **`FR-10`:** Exclude studios under scheduled maintenance from lesson allocation.
5. **`FR-13`:** Restrict lesson allocations to studios equipped with the required instrument.

---
layout: showcase
side: right
fit: contain
image: /wireframe_05_overtime_modal.png
kicker: Statutory Guardrail
title: Overtime Confirmation Gate
---

- **`FR-16`:** Require manager confirmation for allocations in the `40.0–44.0` hour warning tier.

---
layout: two-cols
kicker: Teacher View
title: Weekly Timetable & Rejection Warning
---

<Figure src="/wireframe_07_teacher_schedule.png" alt="Teacher Weekly Timetable" />

- **`FR-01`:** Display each teacher's monthly work allocation and assigned studio location upon lesson confirmation.
- **`FR-08`:** Provide teachers with a personal weekly schedule displaying confirmed lessons, assigned studio locations, and enrolled student details.
- **`FR-11`:** Prevent any lesson allocation that causes a teacher to exceed 4.0 continuous teaching hours without a minimum 1.0-hour rest break.

::right::

<Figure src="/wireframe_08_teacher_rejection_modal.png" alt="Teacher Job Rejection Consultation Warning" />

- **`FR-09`:** Display a warning advising teachers to consult the manager prior to submitting a job rejection request, and flag rejections for manager review.

---
layout: image
side: right
fit: contain
image: /wireframe_09_teacher_availability.png
kicker: Teacher View
title: Monthly Availability & Preferences
---

- **`FR-06`:** Allow teachers to submit and edit recurring 30-minute availability slots up to 1 month ahead until 23:59 on the 19th, enforcing a 60.0-hour minimum.
- **`FR-07`:** Allow teachers to specify preferred teaching days and a preferred studio ID within their submitted availability window.

---
layout: two-cols
kicker: IT Admin View
title: Account Lifecycle & Studio Configuration
---

<Figure src="/wireframe_10_admin_accounts.png" alt="User Account Provisioning and Deactivation" />

- **`FR-12`:** Allow IT administrators to provision user accounts and perform logical account deactivations for Teachers, Managers, and IT Administrators.
- **`NFR-REL-02`:** Execute account and lesson removals exclusively via logical status flags without physical record deletion.

::right::

<Figure src="/wireframe_12_admin_studios.png" alt="Studio Instrument Configuration and Maintenance" />

- **`FR-10`:** Allow IT administrators to schedule studio maintenance periods and exclude studios under maintenance from lesson allocation.
- **`FR-13`:** Allow IT administrators to configure studio instrument equipment for Studios 1 to 5 and restrict lesson allocations to equipped studios.

---
layout: image
side: right
fit: contain
image: /wireframe_13_audit_console.png
kicker: Compliance & Governance
title: Immutable Compliance Audit Log
---

- **`FR-17`:** Append an immutable audit log record for every lesson allocation, overtime confirmation, rejection update, and configuration change, and allow managers to inspect the audit trail.
- **`NFR-COM-01`:** Retain immutable audit log records for at least 24 calendar months.

---
layout: two-cols
kicker: Security & Usability
title: Non-Functional Requirements
---

<Figure src="/wireframe_14_rbac_403.png" alt="Role Access Restriction" />

- **`NFR-SEC-01`:** The system shall enforce role-based access control restricting teachers to their own schedules and restricting system configuration panels to IT administrators.

::right::

<Figure src="/wireframe_15_mobile_375.png" alt="Mobile Viewport" />

- **`NFR-USE-01`:** The system shall render all web interfaces across desktop and mobile viewports from 375px to 1920px without horizontal scrolling.

---
layout: default
kicker: Decision Table & BVA
title: "Black-Box Testing: allocateLessonSlot()"
---

| Cause / Effect | R1: 1-24 | R2: 25-36 | R3: 37-42 | R4: 43-44 | R5: 45-46 | R6: 47 | R7: 48 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Teacher Qualified** | `N` | `Y` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **Teacher Available** | `-` | `N` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **Continuous Block <= 4.0h** | `-` | `-` | `N` | `Y` | `Y` | `Y` | `Y` |
| **Weekly Tier** | `-` | `-` | `-` | `> 44h` | `<40h`<br>`40-44h` | `40-44h` | `< 40h` |
| **Studio Equipped & Free** | `-` | `-` | `-` | `-` | `N` | `Y` | `Y` |
| **Outcome** | **Reject** | **Reject** | **Reject** | **Reject** | **Reject** | **Warning** | **Confirm** |

9 Boundary Value Analysis test cases, `TC-BB-01` to `TC-BB-07` including `05A/B` and `06A/B`, cover all 7 reduced rules across the `39.5h` to `44.5h` workload thresholds.

---
layout: two-cols
kicker: Testing
title: White-Box Testing
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

<Figure src="/whitebox_cfg.png" alt="Control Flow Graph" />

---
layout: image
side: right
fit: contain
image: /whitebox_cfg.png
kicker: Basis Path Coverage
title: Cyclomatic Complexity & Basis Paths
---

$$M = E - N + 2P = 14 - 10 + 2(1) = 6$$

6 basis paths · 8 test cases · 100% statement and branch coverage

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
| **FR-16** | Evaluate teacher weekly hours across 3 tiers: `OK` `< 40.0h`, `Warning` `40.0–44.0h`, and `Overworked` `> 44.0h`, requiring manager confirmation in the warning tier. |
| **FR-17** | Append an immutable audit log record for every lesson allocation, overtime confirmation, rejection, and configuration change, and allow inspection. |

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
- Every new ranking rule forced edits and recompilation of core orchestration logic.

---
layout: default
kicker: Q&A Appendix
title: "Allocation Matrix: Workload Deficit Baseline"
---

<Figure src="/wireframe_03_allocate_deficit.png" alt="Lesson Allocation: Workload Deficit Strategy" />

---
layout: default
kicker: Q&A Appendix
title: "Manager Review of Rejected Lesson (FR-03, FR-09)"
---

<Figure src="/wireframe_06_rejection_review.png" alt="Manager Review of Rejected Lesson" />
