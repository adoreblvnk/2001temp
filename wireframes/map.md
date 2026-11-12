================================================================================
HARMONY ACADEMY - WORKLOAD ALLOCATION & RESOURCE SCHEDULING SYSTEM
FR -> PAGE -> SECTION TRACEABILITY MAP
Static wireframe webapp (Projects/Project/wireframes/)
Source of truth: Projects/Project/report/INF2001-M2-P5-5.md, sections 1.2 and 5.x
Wireframe direction: Monochrome Edition (2026-11-13 rework)
================================================================================

PAGES (9)
  index.html           Role-select entry (Manager / Teacher / IT Administrator)
  cockpit.html         Manager - Workload Cockpit            (report §5.1)
  allocation.html      Manager - Allocation Matrix           (report §5.2)
  exceptions.html      Manager - Exception Queue             (new: late-availability
                       adjudication + job-rejection disposition workflows)
  utilisation.html     Manager - Studio Utilisation dashboard (new: FR-16 analytics)
  teacher.html         Teacher Portal                        (report §5.3)
  admin.html           IT Administrator - Admin Console      (report §5.4)
  audit.html           Manager/Auditor - Audit Log Console   (report §5.4)
  design-system.html   Design System / token sheet

Every page carries the same 8-tab rail (Workload Cockpit, Allocation Matrix,
Exception Queue, Studio Utilisation, Teacher Portal, Admin Console, Audit Log,
Design System), a role chip, and the availability cutoff clock (7 d 11 h to
19 Nov 23:59, December roster).

All FR-01..FR-18 are covered at least once. A per-page matrix is at the end.
FR/NFR references intentionally appear ONLY in this map, never in the wireframe UI.

SHARED STATE THREAD (consistent across pages)
  Grace Tan (M-01) manager on shift · Alex Wong (IT-01) IT administrator ·
  Sarah Jenkins (T-01, Piano, S-01) signed-in teacher ·
  Sarah's late change: Wednesday 12 November 14:00-15:00, submitted 21 Oct 09:12
  (cutoff 19 Oct 23:59, two days late) -> ticket LR-118 -> adjudicated
  "Approved Late" 13 Nov 10:15 -> ledger AL-2216.
  Sarah's rejection request: L-352 Wed 11 Nov 15:00-15:30, reason
  "Personal · Medical" -> ticket EX-207 -> retained after discussion -> AL-2209/2210.
  James Lee (T-08) 40.5 h Warning -> 41.0 h projected on the L-409 allocation
  (overtime justification gate). Chloe Teo (T-05, Trumpet, S-05) 45.5 h
  Overworked -> blocks the Week 46 compliance sign-off.

--------------------------------------------------------------------------------
FR-01 (Must)  Display each teacher's monthly work allocation and assigned studio
              location upon lesson confirmation
--------------------------------------------------------------------------------
cockpit.html
  - State strip            "Faculty / Teacher-hours booked / Studio utilisation"
  - "Workload ledger · three-tier statutory classification"
      -> Weekly / Monthly hour columns + Home studio (S-01..S-05) per teacher
  - "The week at the staves · Monday 16 Nov"
      -> every lesson block sits on its studio staff (S-01..S-05)
teacher.html
  - "Confirmed weekly timetable · Week 46" -> assigned studio caption;
    lesson blocks with times/counts; today outline marker
  - "Lesson register · Thursday 12 Nov" -> STUDIO column (S-01) per student
allocation.html
  - Candidate cards -> "Location this date" row per candidate
  - Action bar "Selected: L-409 -> Elena Lim (T-07) + Studio 2"

--------------------------------------------------------------------------------
FR-02 (Must)  Sort/display top 3 teachers with lowest allocated hours; classify
              weekly workload across 3 tiers (OK <40.0h / Warning 40.0-44.0h /
              Overworked >44.0h)
--------------------------------------------------------------------------------
cockpit.html
  - "Priority balancing queue · lowest allocated hours"
      -> top 3 ranked 1/2/3 with deficit hours + "Assign slot" actions
  - "Workload ledger · three-tier statutory classification"
      -> full 9-teacher ledger: OK / Warning / Overworked badges with
         colour + text + hatch meters (readable with colour off)
design-system.html
  - "Three-tier status language" -> thresholds, badges, hatch encoding

--------------------------------------------------------------------------------
FR-03 (Must)  Managers manually allocate unassigned 30-minute lesson slots to
              eligible teachers for a target week
--------------------------------------------------------------------------------
allocation.html  (single consolidated workflow, steps 1-3 on one page)
  - Step 1: target-week selector + unassigned-slot table (L-512/L-409/L-417/
    L-522/L-518 with "Select slot" actions; L-409 marked Selected)
  - Target-lesson banner (black) with eligibility check "18 ms < 300 ms SLA"
  - Step 2: candidate comparison -> "Select instructor" / "Select with overtime
    justification" per candidate; Rule R1/R2/R6/R7 outcome lines
  - Step 3: studio selection -> selectable studio plates (S-02 selected)
  - "Confirm allocation & commit audit log" primary action (gate + action bar)
  - Re-validation doneline + static allocation-conflict error card (AS 5a)
cockpit.html
  - "The week at the staves" -> unassigned context, "Assign slot ->" actions

--------------------------------------------------------------------------------
FR-04 (Must)  Display up to 3 candidate teachers side-by-side during allocation
              with current workload, teaching preferences and assigned studio
              location for the specified date
--------------------------------------------------------------------------------
allocation.html
  - "Step 2 · Candidate comparison, ranked by remaining capacity below 40.0 h"
      -> three candidate cards side by side (Elena Lim recommended / James Lee
         Warning / David Koh unavailable) each with workload meter, remaining
         capacity, continuous block, preference match (day/studio), location
         this date, student load; below them the Rule R1 blocked strip
         (Priya Nair, not certified for Piano)

--------------------------------------------------------------------------------
FR-05 (Should)  Rank eligible candidates by remaining weekly capacity below the
                40.0-hour threshold and preferred teaching day match
--------------------------------------------------------------------------------
allocation.html
  - Candidate cards numbered 1..3; rank 1 carries the "Recommended" badge
  - "Workload Deficit / Preference Match" segmented control in the masthead
  - "Re-ranked output · Preference Match strategy" plate: the same candidates
    re-ordered (James Lee rises to rank 1 on 2-of-2 match, Elena drops to 3)
cockpit.html
  - "Priority balancing queue" -> ranked 1..3 by remaining capacity

--------------------------------------------------------------------------------
FR-06 (Must)  Teachers submit/edit recurring 30-minute availability slots up to
              1 month ahead until 23:59 on the 19th, enforcing 60.0h minimum
--------------------------------------------------------------------------------
teacher.html
  - "Monthly availability declaration · December 2026"
      -> extended 30-minute grid 08:00-20:30 (Mon..Sun), hatched cells outside
         published hours, dark fill = preferred days, flagged cells outlined
      -> "214.0 h declared / 60.0 h minimum" + "Valid · above minimum" badge
      -> "Submit availability" button + auto-approval doneline:
         "Availability submitted 12 Nov 16:41 · Auto-Approved · recorded in the
         compliance audit ledger"
  - Rail foot "Availability cutoff  7 d 11 h  19 Nov 23:59" on every page
audit.html
  - "Availability submitted" ledger row (AL-2214, 214.0 h, auto-approved)

--------------------------------------------------------------------------------
FR-07 (Must)  Teachers specify preferred days, preferred studio ID and
              consecutive block limits (max 4.0h continuous, min 1.0h rest)
--------------------------------------------------------------------------------
teacher.html
  - Preferences row: day chips (Mon/Tue/Thu/Sat on), "Preferred studio:
    Studio 1", block/rest checkboxes, "Save preferences" button + verified
    doneline ("verified against your declared availability · ledger")
  - Grid legend "dark fill = preferred teaching days"
  - "Confirmed weekly timetable" -> "Block & rest state" footer:
    "Thursday block II: 2.5 h continuous of the 4.0 h limit · Rest before
    block II: 2.0 h · minimum 1.0 h satisfied" + "Within limits" badge
audit.html
  - "Preferences updated" ledger row (AL-2215)

--------------------------------------------------------------------------------
FR-08 (Must)  Teachers get a personal weekly schedule with confirmed lessons,
              assigned studio locations and enrolled student details
--------------------------------------------------------------------------------
teacher.html
  - "Confirmed weekly timetable · Week 46" (Mon 9 - Sat 14 blocks with times,
    counts, rest marker, today outline, struck rejection slot)
  - "Lesson register · Thursday 12 Nov" (Time / Student / Grade / Studio /
    Block per enrolled student)

--------------------------------------------------------------------------------
FR-09 (Must)  Teachers reject an assigned slot via a rejection request flagged
              for manager discussion prior to re-allocation
--------------------------------------------------------------------------------
teacher.html
  - "Rejection request · slot L-352" plate: reason-code select
    (Scheduling conflict / Pedagogical mismatch / Personal · Medical / Other),
    note-to-manager, "Withdraw request" / "Send to manager for discussion";
    status line "rejection requested 11 Nov 09:12 · ticket EX-207 open · slot held"
  - "Request job rejection" anchor button on the timetable block state row
  - Struck-through "L-352" block ("struck slot = rejection requested")
exceptions.html
  - EX-207 ticket: kv detail, substitute candidates with Reassign buttons,
    "Retain original teacher" action, recorded outcome "Retained" (AS 3a)
audit.html
  - "Rejection requested" (AL-2210) and "Rejection resolved" (AL-2209) rows

--------------------------------------------------------------------------------
FR-10 (Should)  Flag availability changes submitted after the 19th cutoff for
                manager review
--------------------------------------------------------------------------------
teacher.html
  - Prominent late-change banner (big emphasized heading "Late change ·
    Wednesday 12 November, 14:00-15:00", submission vs cutoff timestamps,
    "Late · Pending Manager Review" chip, "November grid locked" chip,
    outlined flagged cells in the grid, "View manager decision" link)
  - Two affected 30-minute cells carry red outline in the November grid
exceptions.html  (manager-side reflection + acknowledgement)
  - LR-118 ticket: big date/time heading, diff table (preliminary roster vs
    submitted change vs roster impact), disruption assessment, mandatory
    justification field, Approve/Reject actions, recorded outcome
    "Approved Late" (Approve path) + alternative Reject-path state
cockpit.html
  - Alert line "2 tickets awaiting disposition" -> link to Exception Queue
audit.html
  - "Late availability adjudicated" ledger row (AL-2216)

--------------------------------------------------------------------------------
FR-11 (Should)  IT administrators schedule studio maintenance periods and
                exclude studios under maintenance from lesson allocation
--------------------------------------------------------------------------------
admin.html
  - "Studio maintenance windows" (S-04/S-05/S-02 rows, Scheduled/Completed
    chips) + new-window form (studio/date/start/end/reason) with
    "2 confirmed lessons fall inside this window" warning + "Review affected
    lessons" / "Schedule maintenance anyway" + "Emergency blackout ·
    immediate lock" destructive action with explanatory line
allocation.html
  - Step 3 studio list -> S-04 hatched "Maintenance 14:00-16:00 · excluded"
utilisation.html
  - Directory "Maintenance Wed 14:00-16:00" status on S-04;
    capacity note "336.0 h (−8.0 h maintenance)"
cockpit.html
  - "The week at the staves" -> Maintenance hatch band on Studio 4

--------------------------------------------------------------------------------
FR-12 (Should)  Managers reassign scheduled lessons of an absent teacher to
                qualified, available substitutes
--------------------------------------------------------------------------------
allocation.html
  - "Substitute reassignment · absent teacher" ticket (dedicated visible
    section): affected lesson L-409, studio held, substitute chosen
    (James Lee, projected 41.0 h Warning, justification recorded),
    3 pre-computed substitute rows with "Assign instead" buttons,
    "Confirm substitute & notify both parties" primary action,
    "Discuss with the absent teacher" / "Retain original booking" alternatives
  - "When no substitute exists" plate: L-518 drums fallout checklist
    (studio released / lesson unassigned / priority rescheduling /
    cancellation notice awaiting send)
exceptions.html
  - EX-207 substitute candidates with Reassign buttons; same no-substitute
    fallout plate

--------------------------------------------------------------------------------
FR-13 (Must)  IT administrators provision accounts and logically deactivate
              accounts for Teachers, Managers, IT Administrators
--------------------------------------------------------------------------------
admin.html
  - "User accounts" table: account search ("chen" -> 1 match), Staff ID,
    school email, Active/Deactivated badges, grayscale + struck-through
    deactivated row (Ruth Gomez T-10) with "Reactivate"
  - "Deactivate confirmation" static modal: "11 confirmed future lessons will
    become Pending Re-allocation" detail list + Cancel/Deactivate actions
  - "Provision a new account": full name, Staff ID, school email, contact
    number, role, instrument, home studio + "Duplicate account detected"
    error card (Staff ID T-05 already belongs to Chloe Teo) with the
    Staff ID field in the invalid state
audit.html
  - "Account deactivated · T-10 Ruth Gomez" ledger row (AL-2201)

--------------------------------------------------------------------------------
FR-14 (Must)  IT administrators configure studio instrument equipment for
              Studios 1-5; allocation restricted to equipped studios
--------------------------------------------------------------------------------
admin.html
  - "Studio equipment · Studios 1 to 5": editable piano/drum-kit switches,
    piano type selects, notes inputs, "Save equipment configuration"
allocation.html
  - Step 3 studio selection frame: every studio shows its equipped
    instruments as chips (Grand/Upright piano ✓, Drum kit ✗/✓),
    S-05 = "Sole drum-equipped studio", S-04 maintenance-excluded,
    S-02 "Selected · free 15:00-15:30"
utilisation.html
  - "Studio & equipment directory" matrix: equipped instruments + operational
    status + monthly booked/utilisation per studio
admin.html + utilisation.html cross-consistency: S-05 sole drum studio.

--------------------------------------------------------------------------------
FR-15 (Must)  Notify assigned teachers when lesson allocations are confirmed
              for a weekly schedule
--------------------------------------------------------------------------------
cockpit.html
  - "Publish roster & notify" primary action (bell icon)
  - Allocation actions in the priority queue feed the weekly roster
allocation.html
  - Action bar "notification queued for 18 Nov 08:00"
  - Substitute ticket "Confirm substitute & notify both parties"
audit.html
  - "Roster published · Week 46 · 46 lessons confirmed; 9 teachers notified"
    ledger row (AL-2208)

--------------------------------------------------------------------------------
FR-16 (Should)  Calculate booked vs available studio hours across the 86 weekly
                operating hours; generate studio utilisation reports
--------------------------------------------------------------------------------
utilisation.html  (dedicated dashboard)
  - Month selector (October/November/December 2026) + Export PDF / Export CSV
  - KPI strip: 1,076.0 / 1,712.0 h · 62.9% · peak window Wed 14:00-18:00 ·
    busiest S-02 · lightest S-04
  - "Booked vs available · per studio" meters (4 weeks x 86.0 h = 344.0 h
    per studio; S-04 336.0 h after −8.0 h maintenance)
  - "Peak-hour heatmap" (day x two-hour band grid, teal = academy-wide peak)
    with legend and reading note
  - "Operating basis" kv plate (4 x 430.0 h = 1,720.0 h less maintenance)
cockpit.html
  - Weekly meters "X h / 86.0 h · Y%" per studio + state-strip 62.6% of
    430.0 h + link to the monthly dashboard

--------------------------------------------------------------------------------
FR-17 (Must)  3-tier weekly hours evaluation with manager confirmation required
              for allocations entering the Warning tier (Employment Act Part IV)
--------------------------------------------------------------------------------
cockpit.html
  - Workload ledger: Warning badges (Priya Nair 41.5 h, Michael Chen 44.0 h
    at cap, James Lee 40.5 h) with "Confirm overtime" actions; Overworked
    badge (Chloe Teo 45.5 h) with "Review compliance" -> audit.html
allocation.html
  - "Overtime justification gate · warning tier (40.0-44.0 h)": mandatory
    justification textarea prefilled for James Lee 41.0 h + confirm action;
    Rule R6 warning line on his candidate card
audit.html
  - "Overtime authorised · T-03 Priya Nair" ledger row (AL-2213)
  - "Weekly compliance sign-off · Employment Act Part IV": week selector,
    verification checklist (1 breach · Chloe Teo 45.5 h; 1 missing
    justification · T-03), "Sign-off blocked" alert, disabled
    "Sign off Week 46", "Append justification" prompt rows,
    Week 46 verification snapshot

--------------------------------------------------------------------------------
FR-18 (Must)  Append immutable audit log records for every allocation, overtime
              confirmation, rejection update and configuration change; managers
              can inspect the trail
--------------------------------------------------------------------------------
audit.html  (dedicated screen)
  - Ledger filters (date range / actor / action type + Apply filter)
  - "Immutable audit trail · scheduling & configuration mutations"
      -> 10 of 1,286 records, AL-2201..AL-2216, truncated hash column,
         append-only notice, retention Nov 2024 - Nov 2026 (24 months)
  - "Export compliance certificate (PDF)" action
Cross-references recorded in ledger rows span every other screen:
  allocation committed (AL-2212), overtime authorised (AL-2213), rejection
  requested/resolved (AL-2209/2210), availability submitted (AL-2214),
  preferences updated (AL-2215), late adjudication (AL-2216), configuration
  change (AL-2211), account deactivated (AL-2201), roster published (AL-2208)

--------------------------------------------------------------------------------
NFR TRACEABILITY (same wireframe states)
--------------------------------------------------------------------------------
NFR-USE-01  Responsive 375-1920px, no horizontal page scroll
  -> verified at 375px and 1920px with zero document overflow on all 9 pages
     (SW = VW in both passes); breakpoints at 1180/1080/900/640px in shared.css
NFR-USE-02  Status never by colour alone (WCAG 2.2 1.4.1)
  -> every tier/state pairs colour + text label + hatch density; documented in
     design-system.html "Three-tier status language" and "Icon set"
NFR-SEC-01  Role-gated screens
  -> index.html role-select cards; rail shows the role chip; admin.html
     caption "configuration restricted to IT Administrators"
NFR-REL-02  Deactivation-only, no physical deletes
  -> admin.html user accounts (status flags, Reactivate action) + deactivation
     modal "no lessons are deleted"
NFR-COM-01  24-month retention / NFR-COM-02  append-only ledger
  -> audit.html retention window + append-only notice
NFR-PER-02  Eligibility evaluated in < 300 ms
  -> allocation.html banner "Eligibility check: 18 ms < 300 ms SLA"

--------------------------------------------------------------------------------
COVERAGE MATRIX  (F = fully rendered section, x = referenced/cross-linked)
--------------------------------------------------------------------------------
FR    index cockpit alloc except util teacher admin audit design
--    ----- ------- ----- ------ ----- ------- ----- ----- ------
FR-01         F       F                    F
FR-02         F                                          F
FR-03         F       F
FR-04                   F
FR-05         x       F
FR-06                                        F             F
FR-07                                        F             F
FR-08                                        F
FR-09                                        F       F
FR-10         F                    F             F             F
FR-11         F       F             F             F
FR-12                 F       F
FR-13                                        x       F     F
FR-14                 F                           F     (util F)
FR-15         F       F                                      F
FR-16         x               (util dedicated: F across its 5 sections)
FR-17         F       F                                      F
FR-18         x       x       x       x             x      F
                                     (= secondary coverage; blank = not shown)

Every page also carries the shared shell: teal-accent tab rail (8 sections),
role chip, availability cutoff clock (7 d 11 h to 19 Nov 23:59), and the
consistent exception/alert/success line language.
All teacher/student/roster figures are demonstration data for the wireframe
only; no synthetic-data banner is shown in the UI (removed 2026-11-13).
================================================================================
