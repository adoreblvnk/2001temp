================================================================================
HARMONY ACADEMY - WORKLOAD ALLOCATION & RESOURCE SCHEDULING SYSTEM
FR -> PAGE -> SECTION TRACEABILITY MAP
Static wireframe webapp (Projects/Project/wireframes/)
Source of truth: Projects/Project/report/INF2001-M2-P5-5.md, sections 1.2 and 5.x
Wireframe direction: Monochrome Edition (2026-11-12)
================================================================================

PAGES
  index.html           Role-select entry (Manager / Teacher / IT Administrator)
  cockpit.html         Manager - Workload Cockpit            (report §5.1)
  allocation.html      Manager - Allocation Matrix           (report §5.2)
  teacher.html         Teacher Portal                        (report §5.3)
  admin.html           IT Administrator - Admin Console      (report §5.4)
  audit.html           Manager/Auditor - Audit Log Console   (report §5.4)
  design-system.html   Design System / token sheet           (report §5.4)

All FR-01..FR-18 are covered at least once. A per-page matrix is at the end.


--------------------------------------------------------------------------------
FR-01 (Must)  Display each teacher's monthly work allocation and assigned studio
              location upon lesson confirmation
--------------------------------------------------------------------------------
cockpit.html
  - Masthead state strip        "FACULTY / TEACHER-HOURS BOOKED / STUDIO UTILISATION"
  - "Workload ledger - three-tier statutory classification"
      -> WEEKLY / MONTHLY hour columns and HOME STUDIO per teacher
  - "The week at the staves - Monday 16 Nov"
      -> every lesson note-block shows its studio row (S-01..S-05)
teacher.html
  - "Confirmed weekly timetable - Week 46"
      -> "Assigned studio shown on every lesson (FR-01)" caption; slot blocks
         show S-01 next to each lesson
  - "Lesson register - Thursday 12 Nov"
      -> STUDIO column per enrolled student
allocation.html
  - "Candidate comparison"
      -> "Location this date" row (assigned studio / off-site per candidate)
  - "Selected: L-409 -> Elena Lim (T-07) + Studio 2" confirmation strip


--------------------------------------------------------------------------------
FR-02 (Must)  Sort/display top 3 teachers with lowest allocated hours; classify
              weekly workload across 3 tiers (OK <40.0h / Warning 40.0-44.0h /
              Overworked >44.0h)
--------------------------------------------------------------------------------
cockpit.html
  - "Priority balancing queue - lowest allocated hours" (top 3: Elena Lim,
    Brandon Wong, Wei Lin Ong, ranked 1/2/3 with deficit hours)
  - "Workload ledger - three-tier statutory classification"
      -> full 9-teacher ledger with tier badges: OK / WARNING / OVERWORKED,
         green/amber/red hatch meters paired with text (NFR-USE-02)
design-system.html
  - "Three-tier status language"
      -> tier thresholds, badges and hatch meter encoding documented


--------------------------------------------------------------------------------
FR-03 (Must)  Managers manually allocate unassigned 30-minute lesson slots to
              eligible teachers for a target week
--------------------------------------------------------------------------------
cockpit.html
  - "The week at the staves"
      -> unassigned dashed blocks; conflict "CLASH" cross-hatch (90 degrees);
         maintenance hatch band on Studio 4
  - "Assign slot ->" actions in the priority queue
allocation.html  (the dedicated allocation workflow screen)
  - Lesson header "Lesson L-409 - Wed 18 Nov, 15:00-15:30 - Jeremy Tan - Piano"
  - "Candidate comparison" -> "Select instructor" / "Select with overtime
    justification" per candidate
  - "Studio selection" -> selectable studio plates
  - "Confirm allocation & commit audit log" primary action


--------------------------------------------------------------------------------
FR-04 (Must)  Display up to 3 candidate teachers side-by-side during allocation
              with current workload, teaching preferences and assigned studio
              location for the specified date
--------------------------------------------------------------------------------
allocation.html
  - "Candidate comparison - ranked by remaining capacity below 40.0 h"
      -> three candidate cards side-by-side (Elena Lim / James Lee / David Koh)
         each showing workload meter, remaining capacity, continuous block,
         preference match (day/studio), location this date, student load


--------------------------------------------------------------------------------
FR-05 (Should)  Rank eligible candidates by remaining weekly capacity below the
                40.0-hour threshold and preferred teaching day match
--------------------------------------------------------------------------------
cockpit.html
  - "Priority balancing queue" -> ranked 1..3 by remaining capacity (FR-05 aux)
allocation.html
  - "Candidate comparison" -> cards numbered 1..3, rank 1 carries the
    "RECOMMENDED" badge; ranking driven by the selected tie-breaker
  - "Workload Deficit / Preference Match" segmented control in the masthead
    (active tie-breaking strategy, ITieBreakerStrategy)


--------------------------------------------------------------------------------
FR-06 (Must)  Teachers submit/edit recurring 30-minute availability slots up to
              1 month ahead until 23:59 on the 19th, enforcing 60.0h minimum
--------------------------------------------------------------------------------
teacher.html
  - "Monthly availability declaration - December 2026"
      -> 30-minute slot grid (MON..SUN x 09:00-17:30), hatched closed days
      -> "158.0 h declared / 60.0 h minimum (FR-06)" with VALID - ABOVE MINIMUM
         badge
      -> "Recurring 30-minute slots - editable until 19 Nov 23:59"
  - Rail foot "Availability cutoff  7 d 11 h  19 Nov 23:59" (present on every
    page as the shared cutoff clock)


--------------------------------------------------------------------------------
FR-07 (Must)  Teachers specify preferred days, preferred studio ID and
              consecutive block limits (max 4.0h continuous, min 1.0h rest)
--------------------------------------------------------------------------------
teacher.html
  - "Monthly availability declaration"
      -> PREFERENCES row: day chips (Mon/Tue/Thu/Sat on), "Preferred studio:
         Studio 1", block/rest checkboxes
      -> legend "dark fill = preferred teaching days (FR-07)"
  - "Confirmed weekly timetable" -> "BLOCK & REST STATE (FR-07)" footer:
    "Thursday block II: 2.5 h continuous of the 4.0 h limit - Rest before
    block II: 2.0 h - minimum 1.0 h satisfied" + WITHIN LIMITS badge


--------------------------------------------------------------------------------
FR-08 (Must)  Teachers get a personal weekly schedule with confirmed lessons,
              assigned studio locations and enrolled student details
--------------------------------------------------------------------------------
teacher.html
  - "Confirmed weekly timetable - Week 46" (Mon 9 - Sat 14 lesson blocks with
    times, counts, studio, today outline marker)
  - "Lesson register - Thursday 12 Nov" (TIME / STUDENT / GRADE / STUDIO /
    BLOCK per enrolled student)


--------------------------------------------------------------------------------
FR-09 (Must)  Teachers reject an assigned slot via a rejection request flagged
              for manager discussion prior to re-allocation
--------------------------------------------------------------------------------
teacher.html
  - "Rejection request - slot L-352" (reason code MED-01, note-to-manager,
    "Withdraw request" / "Send to manager for discussion" - 2-stage flow)
  - Timetable struck-through "L-352" block ("struck slot = rejection requested")
audit.html
  - Ledger rows: "Rejection requested - L-352" and "Rejection resolved - L-352"


--------------------------------------------------------------------------------
FR-10 (Should)  Flag availability changes submitted after the 19th cutoff for
                manager review
--------------------------------------------------------------------------------
teacher.html
  - "1 flagged change (FR-10)" notice: November declaration edited 21 Oct after
    the 19th cutoff, routed to the manager; "Flagged after cutoff" chip and
    red-outline flagged cell in the availability grid
cockpit.html
  - Workload ledger action "Review flagged slots" on the Overworked row


--------------------------------------------------------------------------------
FR-11 (Should)  IT administrators schedule studio maintenance periods and
                exclude studios under maintenance from lesson allocation
--------------------------------------------------------------------------------
admin.html
  - "Studio maintenance windows" (S-04/S-05/S-02 rows with scheduled/completed
    chips) + "Schedule maintenance" form (studio/date/start/end/reason) +
    "Cancel selected window"
allocation.html
  - "Studio selection" -> S-04 plate hatched with "Maintenance 14:00-16:00 -
    excluded" chip; caption "maintenance excluded (FR-11)"
cockpit.html
  - "The week at the staves" -> MAINTENANCE hatch band on Studio 4


--------------------------------------------------------------------------------
FR-12 (Should)  Managers reassign scheduled lessons of an absent teacher to
                qualified, available substitutes
--------------------------------------------------------------------------------
allocation.html
  - Same slot-placement workflow substitutes for: lesson L-409 header states
    "Jeremy Tan - Piano, Grade 4"; justification gate text "Coverage for Elena
    Lim's approved leave (UC-06)" - i.e. an absent-teacher coverage allocation
  - "Candidate comparison" -> eligibility rules R2 (unavailable, excluded)
    and R6/R7 enforcement per candidate
audit.html
  - "Allocation committed - L-409 ... Elena Lim (T-07) - Rule R7" ledger row


--------------------------------------------------------------------------------
FR-13 (Must)  IT administrators provision accounts and logically deactivate
              accounts for Teachers, Managers, IT Administrators
--------------------------------------------------------------------------------
admin.html
  - "User accounts" table (roles, ACTIVE/DEACTIVATED badges, Manage/Reactivate
    actions, "removals are status flags only, no physical deletion
    (NFR-REL-02)", grayscale deactivated row)
  - "Provision a new account" form (full name, role, instrument, home studio)
  - Isolated destructive action: "Deactivate selected account 1"
audit.html
  - "Account deactivated - T-10 Ruth Gomez" ledger row


--------------------------------------------------------------------------------
FR-14 (Must)  IT administrators configure studio instrument equipment for
              Studios 1-5; allocation restricted to equipped studios
--------------------------------------------------------------------------------
admin.html
  - "Studio equipment - Studios 1 to 5" (PIANO / DRUM KIT columns per studio,
    "Save equipment configuration"; S-05 = only drum-equipped studio)
allocation.html
  - "Studio selection" -> per-studio "Piano v / Drums x" eligibility chips,
    "Not drum-equipped" chip; caption "Instrument matched to studio equipment
    (FR-14)"
design-system.html
  - Synthetic-data notice


--------------------------------------------------------------------------------
FR-15 (Must)  Notify assigned teachers when lesson allocations are confirmed
              for a weekly schedule
--------------------------------------------------------------------------------
cockpit.html
  - Masthead "Publish roster & notify ->" primary action; state-strip caption
    "publish notifies all assigned teachers (FR-15)"
  - Apparatus footnote 1: publication notifies every assigned teacher and is
    recorded to the audit ledger (FR-15, FR-18)
allocation.html
  - "Selected: ... Status: Confirmed - Rule R7 - notification queued for
    18 Nov 08:00" strip
audit.html
  - "Roster published - Week 46 ... 46 lessons confirmed; 9 teachers notified
    (FR-15)" ledger row


--------------------------------------------------------------------------------
FR-16 (Should)  Calculate booked vs available studio hours across the 86 weekly
                operating hours; generate studio utilisation reports
--------------------------------------------------------------------------------
cockpit.html
  - "Studio utilisation - booked against the 86-hour operating week"
      -> S-01..S-05 hatch meters with "X h / 86.0 h - Y%" captions
      -> state strip "STUDIO UTILISATION 62.6% of 430.0 h"
  - "Utilisation report" masthead action


--------------------------------------------------------------------------------
FR-17 (Must)  3-tier weekly hours evaluation with manager confirmation required
              for allocations entering the Warning tier (Employment Act Part IV)
--------------------------------------------------------------------------------
cockpit.html
  - "Workload ledger" -> WARNING badges on Priya Nair (41.5h) and Michael Chen
    (44.0h at cap); "Confirm overtime 2" action; OVERWORKED badge on Chloe Teo
    (45.5h) with "Review flagged slots"
allocation.html
  - "Overtime justification gate - warning tier (40.0-44.0 h)" plate:
    mandatory justification textarea + "Confirm allocation & commit audit log";
    Rule R6 warning text on James Lee's card
audit.html
  - "Overtime authorised - T-03 Priya Nair" ledger row


--------------------------------------------------------------------------------
FR-18 (Must)  Append immutable audit log records for every allocation, overtime
              confirmation, rejection update and configuration change; managers
              can inspect the trail
--------------------------------------------------------------------------------
audit.html  (dedicated screen)
  - "Ledger filters" (date range / actor / action type + Apply filter)
  - "Immutable audit trail - scheduling & configuration mutations"
      -> timestamped ledger with actor & role, action, target, details &
         justification, AL-22xx refs, truncated hash column
      -> "Append-only ledger" notice: entries cannot be edited or deleted;
         corrections appended; 7 of 1,284 records; retention Nov 2024 - Nov 2026
         (24 months, NFR-COM-01)
  - "Export compliance certificate (PDF)" action
Cross-references on other screens (superscript apparatus refs -> audit):
  cockpit.html (publish, confirm overtime), allocation.html (justification
  gate), admin.html (provision/deactivate), teacher.html (rejection request)


--------------------------------------------------------------------------------
NFR TRACEABILITY (same wireframe states)
--------------------------------------------------------------------------------
NFR-USE-01  Responsive 375-1920px, no horizontal page scroll
  -> verified at 375px and 1920px with zero document overflow on all 7 pages;
     breakpoints at 1180/1080/900/640px in shared.css
NFR-USE-02  Status never by colour alone (WCAG 2.2 1.4.1)
  -> every tier/state pairs colour + text label + hatch density; documented in
     design-system.html "Three-tier status language"
NFR-SEC-01  Role-gated screens
  -> index.html role-select cards; rail shows role-specific screen set;
     admin.html caption "configuration restricted to IT Administrators"
NFR-REL-02  Deactivation-only, no physical deletes
  -> admin.html user accounts (status flags, Reactivate action)
NFR-COM-01  24-month retention / NFR-COM-02  append-only ledger
  -> audit.html retention window + append-only notice
NFR-PER-02  Eligibility evaluated in < 300 ms
  -> allocation.html "Eligibility check: 18 ms < 300 ms SLA"


--------------------------------------------------------------------------------
COVERAGE MATRIX  (F = fully rendered section, x = referenced/cross-linked)
--------------------------------------------------------------------------------
FR    index  cockpit  allocation  teacher  admin  audit  design-system
--    -----  -------  ----------  -------  -----  -----  -------------
FR-01          F          F          F
FR-02          F                                       x          F
FR-03          F          F
FR-04                     F
FR-05          x          F
FR-06                                F
FR-07                                F
FR-08                                F
FR-09                                F                 F
FR-10          F                      F
FR-11          F          F                           =          (admin F)
FR-12                     F                             F
FR-13                                          F      F
FR-14                     F            =        F
FR-15          F          F                             F
FR-16          F
FR-17          F          F                             F
FR-18          x          x            x        x      F
                                      (= secondary coverage; blank = not shown)

Every page also carries the shared shell: teal-accent tab rail (section nav),
role chip, availability cutoff clock (7 d 11 h to 19 Nov 23:59), and apparatus
footnotes cross-referencing the audit ledger.
All teacher/student/roster figures are synthetic demonstration data, labelled on
design-system.html.
================================================================================
