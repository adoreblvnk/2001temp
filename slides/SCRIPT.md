# INF2001 Milestone 2 Presentation Script (10 Minutes + 5 Minutes Q&A)

**Target Hardware & Timing:** 15-inch MacBook M3 (`Slides 1–20` in ~9m 35s at ~135 wpm, leaving 25s buffer; `Slides 21–27` for Q&A backup).

---

## Main Presentation (`Slides 1–20`)

### Slide 1: Cover (`0:00 – 0:15`, 15s)
> Good morning everyone. We are Team P5-5, and today we are presenting Milestone 2 for our Music School Workload Allocation and Resource Scheduling System, Harmony Academy. We will cover our updated requirements, system architecture and design patterns, prototype wireframes, and testing verification.

### Slide 2: Operational Constraints & M1 Refinements (`0:15 – 0:40`, 25s)
> Harmony Academy runs with 9 teachers across 5 studios delivering 30-minute individual lessons. Labour rules cap continuous teaching at 4.0 hours followed by a 1.0-hour rest break, and teachers must declare at least 60.0 hours of monthly availability before 23:59 on the 19th.
>
> Following Milestone 1 feedback, we removed scope creep outside the client specification and added immutable audit log inspection.

### Slide 3: Key Functional Requirements (`0:40 – 1:15`, 35s)
> Here are 6 core functional requirements driving our design and testing. Under `FR-03`, managers manually allocate unassigned or pending-reallocation slots, and `FR-05` ranks eligible candidates by remaining capacity below 40.0 hours and preferred teaching days. Under `FR-06`, teachers submit recurring monthly availability up to 1 month ahead with a 60.0-hour minimum. `FR-11` prevents any allocation exceeding 4.0 continuous teaching hours without a 1.0-hour rest break, `FR-16` evaluates weekly hours across 3 tiers with warning confirmation, and `FR-17` records every change in an immutable audit log.

### Slide 4: Closed 3-Tier Layered Architecture (`1:15 – 1:50`, 35s)
> Moving to architecture, we implemented a closed 3-tier layered architecture in Java 21 and Spring Boot. Requests enter at the Presentation layer, pass downward into the Business and Application layer where constraint validation, candidate ranking, and audit logging execute, and persist through the Data and Infrastructure layer to PostgreSQL and external notification gateways. Because layer-skipping is prohibited, client views cannot bypass statutory overtime checks or studio constraints.

### Slide 5: UML 2.5 Component Diagram (`1:50 – 2:30`, 40s)
> Translating these layers into components, `WebClientUI` consumes four provided service interfaces: `IScheduleService`, `IFacilityService`, `IFacultyService`, and `IAuditLogService`. During lesson allocation, `SchedulingService` calls `IConflictValidator` for hard constraint checks and `ITieBreakerStrategy` for candidate ranking, writes state changes via `IPersistenceGateway` to `PersistenceService`, and routes external teacher notifications out through boundary delegate port `pExtNotify` to `ExternalNotificationGateway`.

### Slide 6: Design Pattern 1 — Observer (`2:30 – 3:00`, 30s)
> Our first GoF design pattern is Observer, which decouples schedule confirmation alerts under `FR-14`. When a manager confirms the weekly schedule, `AllocationController` acts as the Subject and broadcasts a `ScheduleEvent` through `IScheduleObserver`, allowing `EmailNotificationObserver`, `DashboardAlertObserver`, and `AuditNotificationObserver` to react independently without coupling scheduling logic to delivery protocols.

### Slide 7: Design Pattern 2 — Strategy (`3:00 – 3:35`, 35s)
> Our second GoF pattern is Strategy for candidate ranking. Before refactoring, conditional sorting inside `AllocationController` coupled sorting directly to `Teacher` and violated the Open/Closed Principle. By delegating sorting to `ITieBreakerStrategy`, `AllocationController` swaps `WorkloadDeficitStrategy` and `PreferenceMatchStrategy` at runtime, and allows new heuristics such as studio continuity or overtime-cost minimisation without modifying controller code.

### Slide 8: Manager View — Staff Workload Dashboard (`3:35 – 4:15`, 40s)
> Entering the prototype walkthrough, the Staff Workload Dashboard anchors our manager landing screen. Under `FR-01`, the ledger displays each teacher's monthly work allocation and assigned studio. Under `FR-02`, the top 3 cards highlight the teachers with the lowest allocated weekly hours: Elena Lim at 16.5h, Marcus Lim at 21.0h, and Hannah Koh at 24.5h. Under `FR-16` and `NFR-USE-02`, weekly hours display across 3 tiers with green `OK`, amber `Warning`, and red `Overworked` badges. Clicking `Confirm & Notify Teachers` triggers `FR-14` via our Observer pattern.

### Slide 9: Manager View — Studio Utilisation Report (`4:15 – 4:40`, 25s)
> Under the Studios tab for `FR-15`—elicited from Academy Director David Koh (`MIN-05-MGT-EXT`) and Manager Marcus Tan (`MIN-01-MGR`)—`IFacilityService.getStudioUtilisation()` computes elapsed `CONFIRMED` lesson hours against net available operating hours on demand at query time. Over completed `Week 46`, Studio 4 deducts 2.0 scheduled `MaintenanceWindow` hours for 84.0 net available hours with one-click PDF export.

### Slide 10: Manager Workflow — Lesson Allocation & Strategy Toggle (`4:40 – 5:25`, 45s)
> Next is the Lesson Allocation workflow following steps 1, 2, and 3.
> 1. In `1. Lesson Slot`, the manager selects unassigned slot `L-409` (`FR-03`) for Jeremy Tan's Piano request on Wednesday 15:00.
> 2. In `2. Select Candidate (Top 3)`, the system filters all 9 teachers in 14 milliseconds (`FR-04`), and toggling `Preference Match` (`FR-05`) promotes James Lee to `#1 Recommended` because he prefers Wednesday and Studio `S-02`.
> 3. In `3. Select Studio`, `Studio 2 (S-02)` is selected to match his preference while `Studio 4` is disabled for maintenance (`FR-10`, `FR-13`), before clicking `Review Overtime & Confirm`.

### Slide 11: Statutory Guardrail — Overtime Confirmation Gate (`5:25 – 5:50`, 25s)
> Because assigning `L-409` moves James Lee from 40.5 to 41.0 weekly hours inside the 40.0 to 44.0 hour warning tier (`FR-16`), the system blocks immediate confirmation and opens this Overtime Confirmation dialog requiring written manager justification before committing the lesson.

### Slide 12: Teacher View — Weekly Timetable & Rejection Warning (`5:50 – 6:30`, 40s)
> Switching to the Teacher view, Sarah Jenkins sees her personal weekly schedule (`FR-08`) displaying enrolled student names and grades, assigned studio `S-01`, and her 112.0-hour monthly allocation (`FR-01`). On Monday, 4.0 continuous hours from 09:00 to 13:00 are followed by a hatched 1.0-hour mandatory rest block (`FR-11`). Clicking any confirmed lesson opens the modal on the right, displaying student details and the warning advising her to consult the manager before submitting a rejection request (`FR-09`).

### Slide 13: Teacher View — Monthly Availability & Preferences (`6:30 – 7:05`, 35s)
> Under Availability, teachers declare open 30-minute availability windows across all 31 calendar days of December 2026 (`FR-06`) before the 19th 23:59 cutoff. Green cells indicate available windows with day-to-day variance totaling 168.0 hours above the 60.0-hour monthly minimum, while red cells indicate blocked dates such as Sundays and public holidays. In the separate section below (`FR-07`), the teacher specifies preferred teaching days and preferred studio `S-01` within that declared pool.

### Slide 14: IT Admin View — Account Lifecycle & Studio Configuration (`7:05 – 7:35`, 30s)
> For IT Administrators, the Accounts view handles account provisioning (`FR-12`) and logical deactivation (`NFR-REL-02`) without physical deletion, preserving historical audit integrity. The Studios view configures equipped instruments across Studios 1 to 5, keeping Drums restricted to Studio 5 (`FR-13`), and schedules studio maintenance exclusion windows (`FR-10`).

### Slide 15: Compliance & Governance — Immutable Audit Log (`7:35 – 7:55`, 20s)
> Every lesson allocation, overtime confirmation such as `AL-2216`, rejection update, availability declaration, and studio update is appended to this immutable audit trail (`FR-17`), retained for at least 24 calendar months (`NFR-COM-01`) with actor/action filtering and PDF export.

### Slide 16: Non-Functional Requirements (`7:55 – 8:15`, 20s)
> Finally, these two views verify our security and usability non-functional requirements: on the left, `NFR-SEC-01` enforces role-based access control restricting teachers to their own schedules and configuration panels to IT administrators via `403` guards, and on the right, `NFR-USE-01` renders interfaces across 375px mobile and 1920px desktop viewports without horizontal scrolling.

### Slide 17: Black-Box Testing — `allocateLessonSlot()` (`8:15 – 8:50`, 35s)
> Moving to verification, we applied Decision Table Testing and Boundary Value Analysis to `allocateLessonSlot()`, which returns a structured `AllocationResult`. Across 5 conditions (teacher qualification, availability, 4.0-hour continuous block, weekly workload tier, and studio validity), 48 combinations reduce into 7 rules from `R1` to `R7`. From these, 10 test cases, `TC-BB-01` to `TC-BB-07` including `05A/B/C` and `06A/B`, cover all 7 rules across the `39.5h` to `44.5h` boundaries.

### Slide 18: White-Box Testing (`8:50 – 9:10`, 20s)
> For white-box testing, we selected `ConflictValidator.findEligibleCandidates()`, which iterates over the active faculty pool and evaluates qualification, availability, continuous teaching hours, and a 3-way switch across the `OK`, `WARNING`, and `OVERWORKED` tiers, mapped directly to nodes `N1` through `N10` in the Control Flow Graph.

### Slide 19: Cyclomatic Complexity & Basis Paths (`9:10 – 9:30`, 20s)
> With 14 edges, 10 nodes, and 1 connected component, McCabe's cyclomatic complexity is `14 - 10 + 2(1) = 6`, yielding 6 linearly independent basis paths exercised by 8 test cases for 100% statement and branch coverage.

### Slide 20: Thank You (`9:30 – 9:35`, 5s)
> Thank you. We welcome your questions.

---

## Q&A Traceability Cheat Sheet (`FR` → `Design` → `Wireframe` → `Test`)

When asked to trace any requirement during Q&A, cover all 4 hops:
- **`FR-03` / `FR-04` / `FR-05` (Allocate & Rank):** `IScheduleService.allocateLessonSlot()` (`AllocationResult`) + `ITieBreakerStrategy` (`WorkloadDeficitStrategy` / `PreferenceMatchStrategy`) → `Lesson Allocation` (`Slide 10`, `Appendix Slide 27`) → `TC-BB-01`–`07`.
- **`FR-06` / `FR-07` (Monthly Availability & Preferences):** `IFacultyService.submitAvailability()` + `Availability` entity (60.0h floor = hard capacity filter; preferences = soft tie-breaker) → `December 2026 Monthly Availability` (`Slide 13`) → `AL-2214` (`Slide 15`).
- **`FR-09` (Job Rejection Consultation):** `IScheduleService.requestJobRejection()` / `resolveJobRejection()` → `Teacher Rejection Warning` (`Slide 12`) + `Manager Review` (`Appendix Slide 28`) → `AL-2215` (`Slide 15`).
- **`FR-10` / `FR-13` (Studio Maintenance & Equipment):** `IFacilityService.flagMaintenanceWindow()` + `MaintenanceWindow` entity → `IT Admin Studios` (`Slide 14`) disables `Studio 4` (`Slide 10`) → `TC-BB-05A` (maintenance), `TC-BB-05B` (missing drum kit), `TC-BB-05C` (occupied room).
- **`FR-11` (4.0h Block + 1.0h Rest):** `IConflictValidator.checkContinuousTeachingLimit()` → Hatched 1.0h rest (`Slide 12`) & Block meter (`Slide 10`) → `TC-BB-03`, `TC-WB-04`.
- **`FR-14` (Confirmation Notification):** `AllocationController` Subject → `IScheduleObserver` (`Slide 6`) → `Confirm & Notify Teachers` (`Slide 8`).
- **`FR-15` (Studio Utilisation Report):** Elicited from `MIN-05-MGT-EXT` & `MIN-01-MGR` → `IFacilityService.getStudioUtilisation(wk, basis, asOf)` returning `StudioUtilisationReport` over elapsed `CONFIRMED` lessons (`endDateTime <= asOf`) → `Studio Utilisation` (`Slide 9`).
- **`FR-16` (3-Tier Overtime):** `IConflictValidator` + `WorkloadTier` enum → `Staff Workload` badges (`Slide 8`) + `Overtime Confirmation Gate` (`Slide 11`) → `TC-BB-04`, `TC-BB-06A/B`, `TC-WB-01`–`03`.
- **`FR-17` (Audit Log):** `IAuditLogService.recordAuditEntry()` + `AuditLog` entity → `Immutable Compliance Audit Log` (`Slide 15`, `AL-2211`–`2216`).

### Likely Q&A Questions & 15-Second Answers
- **Why do teachers submit both availability (`FR-06`) and preferences (`FR-07`)?**
  > Availability (`FR-06`) is the hard constraint enforced by the 60.0-hour monthly minimum so managers always have enough open slots to schedule around clashes. Preferences (`FR-07`) are a soft tie-breaker inside that wider pool that feeds `PreferenceMatchStrategy` without blocking non-preferred slots when demand requires them.
- **Why do we need the Strategy pattern (what new strategies could be added)?**
  > Beyond `WorkloadDeficitStrategy` (equity) and `PreferenceMatchStrategy` (teacher retention), we can swap in a Studio-Continuity strategy (minimising room changes per day) or an Overtime-Avoidance strategy without modifying `AllocationController`.
- **Backup Appendix (`Slides 21–28`):** Full `FR-01`–`FR-17` tables (`21–23`), `Final Class Diagram: Services & Patterns` (`24`), `Final Class Diagram: Entities, DTOs & Enums` (`25`), `Strategy Before` (`26`), `Workload Deficit Baseline` (`27`), `Rejected Lesson Review` (`28`).
