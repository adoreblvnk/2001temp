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
layout: columns
kicker: Client Brief & Operational Problem
title: Music School Scheduling Constraints
columns:
  - title: "Faculty & Student Demand"
    items:
      - "9 certified teachers: 5 Piano, 1 Drums, 2 Violin, 1 Trumpet"
      - "251 enrolled students + 31 unassigned waitlisted students (282 weekly 30-min individual lessons)"
      - "2 shift managers (43h/week each) manually editing one shared Excel sheet, causing studio double-bookings and unmonitored overtime"
  - title: "Facility & Labour Rules"
    items:
      - "5 physical studios: all 5 hold a piano; only Studio 5 holds a drum kit"
      - "86.0 operating hours/studio/week: Mon–Fri 09:00–21:00, Sat–Sun 08:00–21:00"
      - "Max 4.0 continuous teaching hours followed by a mandatory 1.0-hour rest break"
      - "Monthly planning begins on the 20th; staff submit availability by 23:59 on the 19th"
---

---
layout: default
kicker: Final Requirements & M1 Updates (1 / 4)
title: Manager Dashboard & Allocation (FR-01 to FR-05)
---

| ID | Functional Requirement Specification | M1 → M2 Update |
| :--- | :--- | :--- |
| **FR-01** | Display each teacher's monthly work allocation and assigned studio location upon lesson confirmation. | Replaced running tally with monthly hours & studio |
| **FR-02** | Sort and display the top 3 teachers with the lowest allocated weekly hours on the manager dashboard. | Split atomic top-3 ranking from `FR-16` |
| **FR-03** | Allow managers to manually allocate unassigned or pending-reallocation 30-minute lesson slots for a target week. | Generalized single-slot allocation |
| **FR-04** | Display up to 3 candidate teachers side-by-side showing current workload, preferences, and assigned studio for that date. | — |
| **FR-05** | Rank eligible candidates by remaining weekly capacity below 40.0 hours and preferred teaching day match. | Defined deterministic ranking metrics |

---
layout: default
kicker: Final Requirements & M1 Updates (2 / 4)
title: Teacher Portal & Rejection Rules (FR-06 to FR-09)
---

| ID | Functional Requirement Specification | M1 → M2 Update |
| :--- | :--- | :--- |
| **FR-06** | Allow teachers to submit and edit recurring 30-minute availability slots up to 1 month ahead until 23:59 on the 19th, enforcing a 60.0-hour minimum. | Added 60.0h monthly floor; retired post-19th system flagging |
| **FR-07** | Allow teachers to specify preferred teaching days and a preferred studio ID within their submitted availability window. | Scoped to preferences; moved 4.0h limit to `FR-11` |
| **FR-08** | Provide teachers with a personal weekly schedule displaying confirmed lessons, assigned studio locations, and enrolled student details. | Replaced contact masking with student name & grade |
| **FR-09** | Display a warning advising teachers to consult the manager prior to submitting a job rejection request, and flag rejections for manager review. | — |

---
layout: default
kicker: Final Requirements & M1 Updates (3 / 4)
title: Facility, Rest Guardrails & Accounts (FR-10 to FR-13)
---

| ID | Functional Requirement Specification | M1 → M2 Update |
| :--- | :--- | :--- |
| **FR-10** | Allow IT administrators to schedule studio maintenance periods and exclude studios under maintenance from lesson allocation. | Removed M1 peer lesson swap (scope creep) |
| **FR-11** | Prevent any lesson allocation that causes a teacher to exceed 4.0 continuous teaching hours without a minimum 1.0-hour rest break. | Dedicated guardrail; folded substitute workflow into `FR-03` |
| **FR-12** | Allow IT administrators to provision user accounts and perform logical account deactivations for Teachers, Managers, and IT Administrators. | — |
| **FR-13** | Allow IT administrators to configure studio instrument equipment for Studios 1 to 5 and restrict allocations to equipped studios. | Generalized `equippedInstruments` matching |

---
layout: default
kicker: Final Requirements & M1 Updates (4 / 4)
title: Notifications, Utilisation, Overtime & Audit (FR-14 to FR-17)
---

| ID | Functional Requirement Specification | M1 → M2 Update |
| :--- | :--- | :--- |
| **FR-14** | Notify assigned teachers when lesson allocations are confirmed for a weekly schedule. | Removed intermediate draft state screens |
| **FR-15** | Calculate booked versus available studio hours across the 86 weekly operating hours and generate studio utilisation reports. | — |
| **FR-16** | Evaluate teacher weekly hours across three tiers—`OK` (`< 40.0h`), `Warning` (`40.0–44.0h`), and `Overworked` (`> 44.0h`, Employment Act Part IV)—requiring manager confirmation in the warning tier. | Unified 3-tier statutory workload model |
| **FR-17** | Append an immutable audit log record for every allocation, overtime confirmation, rejection, and configuration change, and allow inspection. | Added dedicated audit trail inspection (`UC-11`) |

---
layout: image
side: right
fit: contain
image: /architecture_diagram.png
kicker: Software Architecture
title: Closed 3-Tier Layered Architecture
---

- **1. Presentation Layer:** Web boundary views (`ManagerDashboardUI`, `AllocationUI`, `TeacherUI`, `AdminUI`, `AuditLogUI`) handling display and input only.
- **2. Business & Application Layer:** Unified service tier (`SchedulingService`, `ConflictValidationService`, `TieBreakerStrategy`, `FacultyService`, `FacilityService`, `AuditLoggingService`) enforcing scheduling and statutory rules.
- **3. Data & Infrastructure Layer:** PostgreSQL persistence and external SMTP/SMS gateway; closed layering prohibits UI-to-database shortcuts.

---
layout: diagram
---

<Figure src="/component_diagram.png" alt="UML 2.5 Component Diagram" />

<!--
Walk through the 6 internal components, required sockets and provided lollipops (IScheduleService, IConflictValidator, ITieBreakerStrategy, IFacultyService, IFacilityService, IAuditLogService), and solid UML 2.5 delegate connector to boundary port pExtNotify.
-->

---
layout: two-cols
kicker: Detailed Design — Gang of Four Behavioral Pattern
title: Strategy Pattern for Candidate Ranking (FR-05)
---

**Before (`AllocationController` Monolith)**
- Hardcodes `rankingMode` conditional branches directly inside `AllocationController`
- Adding new academy ranking rules modifies validated scheduling code (violates OCP)

<Figure src="/pattern_before_excerpt.png" alt="Before Strategy Pattern" />

::right::

**After (`ITieBreakerStrategy` Composition)**
- `AllocationController` (**Context**) delegates `rankCandidates()` to `ITieBreakerStrategy`
- Swaps `WorkloadDeficitStrategy` and `PreferenceMatchStrategy` at runtime

<Figure src="/pattern_after_excerpt.png" alt="After Strategy Pattern" />

---
layout: default
---

<Figure src="/wireframe_01_manager_workload.png" alt="Manager Staff Workload Dashboard (FR-01, FR-02, FR-14, FR-16, NFR-USE-02)" />

<!--
Prototype Trace — Manager Staff Workload (/manager):
- FR-01: Monthly allocation hours and assigned studio IDs (S-01 to S-05) per teacher.
- FR-02: Lowest Allocated Weekly Hours (Top 3) ranks Elena Lim (16.5h), Marcus Lim (21.0h), and Hannah Koh (24.5h).
- FR-14: Confirm & Notify Teachers dispatches observer alerts across all 9 teachers.
- FR-16 & NFR-USE-02: <40.0h Green OK (e.g. David Koh 37.5h), 40.0–44.0h Amber Warning (James Lee 40.5h, Priya Nair 43.5h), >44.0h Red Overworked (Chloe Teo 44.5h).
-->

---
layout: diagram
---

<Figure src="/wireframe_02_studio_utilisation.png" alt="Studio Utilisation Report (FR-15)" />

<!--
Prototype Trace — Studio Utilisation (/manager/utilisation):
- FR-15: Aggregates booked, maintenance, and net available hours across Studios 1 to 5 on the 86.0h/studio weekly basis (428.0h net available after 2.0h Studio 4 maintenance) with Weekly/Monthly toggle, CSV export, and time-band occupancy matrix.
-->

---
layout: default
---

<Figure src="/wireframe_03_allocate_deficit.png" alt="Lesson Allocation — Workload Deficit Strategy (FR-03, FR-04, FR-05, FR-10, FR-11, FR-13)" />

<!--
Prototype Trace — Lesson Allocation Matrix (/manager/allocate):
- FR-03 & NFR-PER-02: Allocates unassigned 30-min Piano slot L-409 (Wed 15:00–15:30), validated in 14 ms (<300 ms SLA).
- FR-04: Displays 3 eligible candidates side-by-side (Elena Lim, Marcus Lim, James Lee) with weekly hours, continuous block progress (FR-11), preferences, and studio on Wed.
- Upfront Pre-Verification: Ineligible Staff strip at bottom filters out R1 (unqualified) and R2 (unavailable) teachers beforehand.
- FR-10 & FR-13: Studio 4 is disabled due to Wed 14:00–16:00 maintenance (R5); Studio 5 shows Piano, Drums, Violin, Trumpet equipment.
-->

---
layout: diagram
---

<Figure src="/wireframe_04_allocate_preference.png" alt="Lesson Allocation — Preference Match Strategy Re-Ranking (FR-05)" />

<!--
Prototype Trace — Strategy Pattern Toggle (FR-05):
- Clicking Preference Match dynamically swaps ITieBreakerStrategy, promoting James Lee (matches both Wednesday and Studio S-02) from #3 to #1 Recommended and changing the primary action button to Review Overtime & Confirm.
-->

---
layout: default
---

<Figure src="/wireframe_05_overtime_modal.png" alt="Mandatory Overtime Confirmation Dialog (FR-16, NFR-COM-02)" />

<!--
Prototype Trace — Statutory Overtime Gate (FR-16 & NFR-COM-02):
- Assigning L-409 moves James Lee from 40.5h to 41.0h (inside the 40.0–44.0h Warning tier, Rule R6), prompting mandatory manager justification before committing, whereas >44.0h is hard-blocked under Employment Act Part IV.
-->

---
layout: diagram
---

<Figure src="/wireframe_06_rejection_review.png" alt="Manager Review of Rejected Lesson (FR-03, FR-09)" />

<!--
Prototype Trace — Manager Rejection Review (UC-03, FR-03, FR-09):
- Selecting rejected slot L-352 shows Sarah Jenkins's reason and note, letting the Manager either Retain T-01 after discussion or reassign L-352 to an eligible Piano candidate through the exact same single-slot matrix.
-->

---
layout: default
---

<Figure src="/wireframe_07_teacher_schedule.png" alt="Teacher Personal Weekly Timetable (FR-01, FR-08, FR-11)" />

<!--
Prototype Trace — Teacher Weekly Schedule (/teacher):
- FR-01 & FR-08: Displays Monthly Allocation (112.0 h), student names, grades, and assigned Studio S-01 on a Monday–Sunday calendar grid.
- FR-11: Monday's 4.0-hour continuous morning block (09:00–13:00, 8 lessons) is automatically followed by a hatched 1.0-hour mandatory rest break (13:00–14:00).
-->

---
layout: diagram
---

<Figure src="/wireframe_08_teacher_rejection_modal.png" alt="Teacher Job Rejection Consultation Warning (FR-08, FR-09)" />

<!--
Prototype Trace — Job Rejection Warning Dialog (FR-09):
- Clicking a confirmed lesson opens student details alongside the mandatory Consultation Warning advising the teacher to discuss the assignment with the manager before submitting a rejection request.
-->

---
layout: default
---

<Figure src="/wireframe_09_teacher_availability.png" alt="Teacher Monthly Availability & Preferences (FR-06, FR-07)" />

<!--
Prototype Trace — Monthly Availability & Preferences (/teacher/availability):
- FR-06: Recurring 30-minute availability grid open until 23:59 on the 19th, enforcing the 60.0h monthly minimum floor via Zod validation (192.0 / 60.0 h min).
- FR-07: Preferred teaching day chips (Mon, Tue, Thu, Sat) and Preferred Studio selector (S-01).
-->

---
layout: two-cols
kicker: IT Administration & Role Isolation (FR-10, FR-12, FR-13, NFR-REL-02, NFR-SEC-01)
title: Account Lifecycle & Studio Equipment Configuration
---

<Figure src="/wireframe_10_admin_accounts.png" caption="FR-12 & NFR-REL-02: Provisioning & logical soft-deactivation (T-10 Ruth Gomez)" />

::right::

<Figure src="/wireframe_12_admin_studios.png" caption="FR-10 & FR-13: Studio equippedInstruments toggles (S-05 Drums) & maintenance" />

---
layout: diagram
---

<Figure src="/wireframe_13_audit_console.png" alt="Immutable 24-Month Compliance Audit Log (FR-17, NFR-COM-01, NFR-COM-02)" />

<!--
Prototype Trace — Immutable 24-Month Audit Log (/manager/audit):
- FR-17 & NFR-COM-01/02: Append-only ledger retained for 24 months capturing allocations, overtime approvals (AL-2216), rejections (AL-2215), availability saves (AL-2214), maintenance/equipment changes (AL-2211/2212), and account deactivations (AL-2209).
-->

---
layout: default
kicker: Black-Box Testing — AllocationController.allocateLessonSlot()
title: Decision Table (48 Combinations → 7 Rules)
---

5 causes ($2 \times 2 \times 2 \times 3 \times 2 = 48$ combinations) collapse via indifferent (`-`) states to 7 rules; 9 BVA tests probe `39.5h`, `40.0h`, `44.0h`, `44.5h`:

| Cause / Outcome | R1 (1–24) | R2 (25–36) | R3 (37–42) | R4 (43–44) | R5 (45–46) | R6 (47) | R7 (48) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **C1: Qualified** | `N` | `Y` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C2: Available** | `-` | `N` | `Y` | `Y` | `Y` | `Y` | `Y` |
| **C3: Block ≤ 4.0h** | `-` | `-` | `N` | `Y` | `Y` | `Y` | `Y` |
| **C4: Weekly Tier** | `-` | `-` | `-` | `> 44h` | `<40h, 40–44h` | `40–44h` | `< 40h` |
| **C5: Studio Valid** | `-` | `-` | `-` | `-` | `N` | `Y` | `Y` |
| **Effect** | **Reject** | **Reject** | **Reject** | **Reject** | **Reject** | **Warning** | **Confirm** |

---
layout: two-cols
kicker: White-Box Testing — ConflictValidator.findEligibleCandidates() (1 / 2)
title: Method Pseudocode & Control Flow Graph
---

Filters active teachers by certification (`N3`), slot availability (`N3`), `4.0h` block limit (`N4`), and 3-way statutory tier (`N5`):

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

<Figure src="/whitebox_cfg.png" alt="Control Flow Graph (Nodes 1 to 10)" />

---
layout: image
side: right
fit: contain
image: /whitebox_cfg.png
kicker: White-Box Testing — ConflictValidator.findEligibleCandidates() (2 / 2)
title: Cyclomatic Complexity & 6 Basis Paths
---

**Cyclomatic Complexity ($P = 1$ connected graph):**
$$M = E - N + 2P = 14 - 10 + 2(1) = 6$$

**6 Linearly Independent Basis Paths (100% Statement & Branch):**
- **Path 1 (`< 40.0h` OK):** `1 → 2 → 3 → 4 → 5 → 6 → 9 → 2 → 10`
- **Path 2 (`40.0–44.0h` Warn):** `1 → 2 → 3 → 4 → 5 → 7 → 9 → 2 → 10`
- **Path 3 (`> 44.0h` Cap):** `1 → 2 → 3 → 4 → 5 → 8 → 9 → 2 → 10`
- **Path 4 (`> 4.0h` Block):** `1 → 2 → 3 → 4 → 9 → 2 → 10`
- **Path 5 (Ineligible/Busy):** `1 → 2 → 3 → 9 → 2 → 10`
- **Path 6 (Empty Pool):** `1 → 2 → 10`

---
layout: end
title: Thank You — Q&A
subtitle: 17 Atomic Requirements · Closed 3-Tier Architecture · Strategy & Observer · Full BVA & Basis Path Coverage
contact: Team P5-5 · Joseph Poon · Ryan Ke · Wei Xiang · Tan Yan Qi · Zayne Lee
---
