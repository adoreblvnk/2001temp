import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    PRIMARY = RGBColor(30, 58, 138)    # Deep Navy #1E3A8A
    SECONDARY = RGBColor(37, 99, 235)  # Royal Blue #2563EB
    DARK_TEXT = RGBColor(15, 23, 42)   # Slate 900 #0F172A
    MUTED_TEXT = RGBColor(71, 85, 105) # Slate 600 #475569
    CARD_BG = RGBColor(248, 250, 252)  # Slate 50 #F8FAFC
    CARD_BORDER = RGBColor(226, 232, 240) # Slate 200 #E2E8F0
    WHITE = RGBColor(255, 255, 255)
    ACCENT_GREEN = RGBColor(22, 101, 52)
    ACCENT_AMBER = RGBColor(180, 83, 9)

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text="INF2001 MILESTONE 2: DETAILED DESIGN & WIREFRAME"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = SECONDARY

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = PRIMARY

    def add_card(slide, left, top, width, height, title, body_bullets, title_color=PRIMARY, border_color=CARD_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_BG
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)

        tx = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
        tf = tx.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = title_color
        p_t.space_after = Pt(8)

        for b in body_bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.size = Pt(11)
            p_b.font.color.rgb = DARK_TEXT
            p_b.space_after = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = PRIMARY
    bg1.line.fill.background()

    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(3.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p_mod = tf1.paragraphs[0]
    p_mod.text = "INF2001: INTRODUCTION TO SOFTWARE ENGINEERING"
    p_mod.font.size = Pt(14)
    p_mod.font.bold = True
    p_mod.font.color.rgb = RGBColor(191, 219, 254)
    p_mod.space_after = Pt(12)

    p_proj = tf1.add_paragraph()
    p_proj.text = "Music School Workload Allocation &\nResource Scheduling System"
    p_proj.font.size = Pt(32)
    p_proj.font.bold = True
    p_proj.font.color.rgb = WHITE
    p_proj.space_after = Pt(14)

    p_sub = tf1.add_paragraph()
    p_sub.text = "Milestone 2: Detailed Design, Test Plan & Interactive Wireframe System"
    p_sub.font.size = Pt(16)
    p_sub.font.color.rgb = RGBColor(224, 231, 255)
    p_sub.space_after = Pt(28)

    p_team = tf1.add_paragraph()
    p_team.text = "Prepared by Team P5-5: Joseph Poon | Ryan Ke | Wei Xiang | Tan Yan Qi | Zayne Lee\nSubmission Date: 20 November 2026 | Singapore Institute of Technology"
    p_team.font.size = Pt(12)
    p_team.font.color.rgb = RGBColor(191, 219, 254)

    # -------------------------------------------------------------
    # SLIDE 2: M1-TO-M2 EVOLUTION & CORE IMPROVEMENTS
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Executive Progression: Reconciling M1 Feedback into M2 Architecture")
    add_card(s2, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "1. Requirements Overhaul",
             ["Split compound requirements into 21 atomic, verifiable statements (FR-01 to FR-21).",
              "Purged vague terminology: formally defined 'workload deficit' and 'fatigue clustering'.",
              "Relocated visual UI cues (amber/red badges) into NFR-USE-02.",
              "Enforced strict systems perspective ('The system shall...')."])
    add_card(s2, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "2. Scope & Model Tightening",
             ["Excised unrequested Peer Lesson Swap into Won't-have (Table 2.2).",
              "Replaced Peer Swap with dedicated Audit Trail Inspection (UC-11 & SSD-11).",
              "Added missing attributes on Teacher: runningWeeklyHours and runningMonthlyHours.",
              "Reframed UC-02 from weekly batch job to granular per-slot allocation."])
    add_card(s2, Inches(8.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "3. M2 Architectural Focus",
             ["UML 2.5 Component Diagram with explicit provided (lollipop) & required (socket) interfaces.",
              "3-Tier Layered Architecture with strict Dependency Inversion.",
              "GoF Strategy Pattern for dynamic candidate teacher ranking / tie-breaking.",
              "Rigorous Black-Box (Decision Table) & White-Box (CFG & Basis Paths) testing."])

    # -------------------------------------------------------------
    # SLIDE 3: 3-TIER LAYERED ARCHITECTURE
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "System Architecture: 3-Tier Layered Architecture with Dependency Inversion")
    add_card(s3, Inches(0.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "Tier 1: Presentation (Boundary)",
             ["ManagerDashboardUI: Real-time capacity meters and outlier alerts.",
              "AllocationUI: Side-by-side 3-teacher comparison matrix.",
              "TeacherUI: Mobile-responsive grid and timetable viewer.",
              "AuditLogUI: Chronological compliance audit console.",
              "Constraint: Decoupled from entity persistence; consumes pure service interfaces."])
    add_card(s3, Inches(4.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "Tier 2: Business Logic (Control)",
             ["AllocationController: Coordinates slot assignment and audit commits.",
              "ConflictValidator: High-performance validation engine (<300ms feedback).",
              "ITieBreakerStrategy: Pluggable candidate ranking algorithm.",
              "Workload & Availability Controllers: Manage scheduling rules and cutoff enforcement.",
              "Strict Dependency Inversion: Exposes abstract interfaces realized by controllers."])
    add_card(s3, Inches(8.8), Inches(1.6), Inches(3.6), Inches(5.2),
             "Tier 3: Domain Entity & Integration",
             ["Core Entities: Teacher, Lesson, Studio, Schedule, AuditLog.",
              "State Invariants: Studio 5 drum isolation, 4h fatigue limit, statutory 44.0h cap.",
              "DatabaseGateway: Transaction logging, atomic persistence, cryptographic snapshots.",
              "NotificationGateway: Asynchronous SMS/SMTP roster release dispatch."])

    # -------------------------------------------------------------
    # SLIDE 4: UML 2.5 COMPONENT DIAGRAM & INTERFACE CONTRACTS
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "UML 2.5 Component Architecture: Subsystem Decomposition & Contracts")
    add_card(s4, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Provided Interfaces (Lollipops)",
             ["IScheduleService: Exposes lesson slot allocation, emergency substitute reassignment, and weekly roster publishing.",
              "IConflictValidator: Validates instrument qualifications, availability, 4h fatigue ceilings, and studio asset compatibility.",
              "IFacultyService: Governs availability grids, preference submissions, and real-time workload monitoring.",
              "IFacilityService: Manages studio metadata, room maintenance blackouts, and capacity utilization analytics.",
              "IAuditLogService: Appends immutable transaction records and provides multi-parameter audit querying."])
    add_card(s4, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Required Interfaces & Architectural Litmus Test",
             ["Presentation requires IScheduleService, IFacultyService, IFacilityService, and IAuditLogService.",
              "SchedulingComponent requires IConflictValidator, ITieBreakerStrategy, and INotificationGateway.",
              "ValidationComponent requires IFacultyService and IFacilityService to inspect current states.",
              "Modularity Litmus Test: Components are fully decoupled; RankingStrategyComponent or NotificationComponent can be swapped out without modifying scheduling orchestration.",
              "High Cohesion: Each component encapsulates controllers and entities around distinct business capabilities."])

    # -------------------------------------------------------------
    # SLIDE 5: DESIGN PATTERN - STRATEGY PATTERN FOR TIE-BREAKING
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Detailed Design: GoF Strategy Pattern for Candidate Teacher Ranking")
    add_card(s5, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Before Refactoring (Monolithic / Violates OCP)",
             ["AllocationController contained hardcoded conditional sorting: if (mode == 'WORKLOAD_DEFICIT') ... else if (mode == 'PREFERENCES').",
              "Violates Open-Closed Principle (OCP): Introducing new ranking heuristics (e.g. Seniority or Student Continuity) required editing core controller code.",
              "Violates Single Responsibility Principle (SRP): Scheduling coordinator was bloated with mathematical ranking formulas.",
              "Tightly coupled implementation prevented isolated algorithmic unit testing."])
    add_card(s5, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "After Refactoring (Strategy Pattern Applied)",
             ["Context: AllocationController depends solely on the ITieBreakerStrategy abstraction.",
              "Concrete Strategy 1: WorkloadDeficitStrategy implements FR-06 by ordering candidates by remaining hours to statutory 40.0h cap (Deficit = 40.0 - workload).",
              "Concrete Strategy 2: PreferenceMatchStrategy orders candidates matching preferred working days and 4h lesson clustering.",
              "Runtime Flexibility: Managers can dynamically switch ranking heuristics directly from the AllocationUI cockpit.",
              "Extensibility: New organizational policies can be introduced with zero regression risk to existing scheduling code."])

    # -------------------------------------------------------------
    # SLIDE 6: BLACK-BOX TESTING - DECISION TABLE DERIVATION
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Verification Plan: Black-Box Decision Table for Rule Validation")
    add_card(s6, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Target: ConflictValidator.validateAllocationRules()",
             ["Evaluates 7 boolean causes against 3 operational effects.",
              "C1: Teacher qualified for instrument | C2: Teacher available in grid.",
              "C3: Within 4.0h continuous teaching ceiling (1.0h rest preserved).",
              "C4: Within 44.0h statutory weekly cap | C5: Studio instrument compatible.",
              "C6: Studio unoccupied | C7: Studio not under maintenance blackout.",
              "Effects: E1 (Approved), E2 (Rejected with Error), E3 (Overtime Soft-Warning).",
              "Boolean Reduction: Reduced 128 theoretical states to 9 canonical rules by factoring out single-prerequisite failure states."])
    add_card(s6, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Derived Test Suite (TC-BB-01 to TC-BB-09)",
             ["TC-BB-01 (Nominal): All conditions met (Workload <= 40.0h) -> Approved.",
              "TC-BB-02 (Overtime Advisory): Hours between 40.5h and 44.0h -> Approved with Overtime Sign-off prompt.",
              "TC-BB-03 (Unqualified): Violin instructor for Drums -> Blocked.",
              "TC-BB-04 (Unavailable): Unsubmitted grid slot -> Blocked.",
              "TC-BB-05 (Fatigue): Exceeds 4.0h block limit -> Blocked with Rest Alert.",
              "TC-BB-06 (Statutory Cap): Exceeds 44.0h ceiling -> Blocked under Employment Act.",
              "TC-BB-07 (Asset): Drums in Studio 1 -> Blocked (Studio 5 required).",
              "TC-BB-08/09 (Collision & Blackout): Occupied studio or tuning window -> Blocked."])

    # -------------------------------------------------------------
    # SLIDE 7: WHITE-BOX TESTING - CFG & CYCLOMATIC COMPLEXITY
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "Verification Plan: White-Box Basis Path Testing (Complexity = 6)")
    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Method: findEligibleCandidates() & CFG Metrics",
             ["19-line algorithmic method filtering faculty pool across qualifications, availability, fatigue, and statutory limits.",
              "Control Flow Graph: 9 Nodes, 13 Directed Edges, 5 Predicate Nodes.",
              "Formula 1: V(G) = E - N + 2P = 13 - 9 + 2(1) = 6.",
              "Formula 2: V(G) = Predicate Nodes + 1 = 5 + 1 = 6.",
              "Formula 3: V(G) = Enclosed Planar Regions + 1 = 5 + 1 = 6.",
              "All three mathematical derivations verify exactly 6 independent basis paths."])
    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "6 Independent Basis Paths & Test Execution",
             ["Path 1: Empty faculty pool (immediate loop termination).",
              "Path 2: Candidate fails instrument certification check.",
              "Path 3: Candidate certified, but unavailable during slot.",
              "Path 4: Candidate certified and available, but breaches 4h fatigue limit.",
              "Path 5: Candidate passes fatigue, but breaches 44.0h statutory ceiling.",
              "Path 6: Nominal path (passes all checks; appended to eligible list).",
              "Complete test suite (TC-WB-01 to TC-WB-06) exercises 100% statement and branch coverage."])

    # -------------------------------------------------------------
    # SLIDE 8: WIREFRAME 1 - WORKLOAD DASHBOARD & OUTLIERS (UC-01)
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Wireframe System 1: Workload Intelligence Cockpit (UC-01)")
    add_card(s8, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Operational Purpose & Supported Requirements",
             ["Supports FR-01, FR-02, FR-03, and NFR-USE-02.",
              "Provides school managers with an executive operational dashboard summarizing weekly faculty capacity prior to timetable construction.",
              "Visual Tiering: Implements WCAG 2.2 AA compliant indicators: Green (<35.0h), Amber (35.0h-40.0h), and Red (>40.0h).",
              "Proactive Outlier Detection: Automatically identifies and surfaces the top 3 under-allocated instructors to facilitate equitable scheduling."])
    add_card(s8, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Key User Interactions & Data Flow",
             ["Capacity Progress Meters: Visual real-time bars displaying running weekly hours against statutory caps.",
              "Priority Balancing Panel: One-click navigation to assign lessons to the highest workload-deficit instructors.",
              "Statutory Cap Lock Badges: Automatically disables allocation buttons for instructors reaching 44.0h, mitigating organizational liability under the Singapore Employment Act.",
              "Synchronous Cache Fallback: Seamless offline caching ensures continuous monitoring during transient campus Wi-Fi dropouts."])

    # -------------------------------------------------------------
    # SLIDE 9: WIREFRAME 2 - SIDE-BY-SIDE ALLOCATION MATRIX (UC-02)
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "Wireframe System 2: Side-by-Side Slot Allocation Matrix (UC-02)")
    add_card(s9, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Operational Purpose & Supported Requirements",
             ["Supports FR-04, FR-05, FR-06, FR-17, and FR-20.",
              "Assists managers during granular 30-minute lesson placement with real-time multi-constraint validation.",
              "Side-by-Side Comparison: Presents up to 3 qualified candidates side-by-side with running hours, fatigue status, and studio location.",
              "Strategy Integration: Applies WorkloadDeficitStrategy to dynamically recommend the optimal instructor."])
    add_card(s9, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Key User Interactions & Constraint Enforcement",
             ["Acoustic Studio Isolation: Restricts Drums lesson placements exclusively to Studio 5; incompatible studios are disabled.",
              "Continuous Block Protection: Warns if placing a lesson causes an instructor to exceed 4 continuous teaching hours.",
              "Advisory Overtime Modal: Triggers soft-warning confirmation requiring recorded justification if hours enter 40.5h-44.0h.",
              "Sub-300ms Validation: Instant clash detection ensures zero double-booking of rooms or instructors."])

    # -------------------------------------------------------------
    # SLIDE 10: WIREFRAME 3 - TEACHER AVAILABILITY & TIMETABLE (UC-07-10)
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Wireframe System 3: Teacher Availability & Timetable Portal (UC-07-10)")
    add_card(s10, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Operational Purpose & Supported Requirements",
             ["Supports FR-07, FR-08, FR-09, FR-10, FR-11, and NFR-SEC-01.",
              "Provides instructors with an intuitive web/mobile portal to manage monthly availability, preferences, and view schedules.",
              "Minimum Availability Rule: Enforces submission of at least 60.0 hours per week to guarantee manager allocation flexibility.",
              "Cutoff Countdown Clock: Visual timer counting down to 19th 23:59 cutoff; late submissions are flagged for manager adjudication."])
    add_card(s10, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Key User Interactions & Statutory Privacy",
             ["PDPA Masked Student PII: Displays student first names and lesson levels while strictly masking contact details (PDPA Section 24).",
              "Preference Capture: Allows instructors to declare preferred working days and request 4-hour consecutive lesson clustering.",
              "2-Stage Rejection Modal: Features a mandatory consultation warning modal and standardized reason codes for rejected assignments.",
              "Draft Auto-Caching: Caches unsubmitted availability in browser session storage, preventing data loss during network dropouts."])

    # -------------------------------------------------------------
    # SLIDE 11: WIREFRAME 4 - AUDIT CONSOLE & MOM COMPLIANCE (UC-11, 17)
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Wireframe System 4: Audit Console & Statutory Governance (UC-11, 17)")
    add_card(s11, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Operational Purpose & Supported Requirements",
             ["Supports FR-20, FR-21, NFR-COM-01, and NFR-COM-02.",
              "Furnishes academy leadership and regulatory auditors with an unalterable, chronological ledger of all scheduling operations.",
              "Statutory Labor Monitoring: Tracks faculty hours against the 44.0-hour statutory cap under Singapore Employment Act Part IV.",
              "MOM Record Retention: Retains cryptographic audit logs for at least 24 calendar months."])
    add_card(s11, Inches(6.8), Inches(1.6), Inches(5.6), Inches(5.2),
             "Key User Interactions & Export Facilities",
             ["Multi-Parameter Filter Console: Query audit events by Date Range, Staff ID, Action Code, or Target Entity ID.",
              "Cryptographic Integrity Badges: Displays SHA-256 hash status confirming tamper-evident record preservation.",
              "Overtime Audit Trail: Details managerial justification records for any allocations approved above 40.0 hours.",
              "Compliance Certificate Export: One-click export of verified CSV and PDF bundles for Ministry of Manpower filing."])

    # -------------------------------------------------------------
    # SLIDE 12: CONCLUSION & TRACEABILITY SUMMARY
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Architecture & Requirements Traceability Matrix Summary")
    add_card(s12, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.2),
             "End-to-End Engineering Traceability (FR <-> UC <-> Class <-> Test <-> Wireframe)",
             ["FR-01 to FR-03 (Workload & Outliers) -> UC-01 -> ManagerDashboardUI, WorkloadController -> Tested in TC-WB-05 -> Wireframe Cockpit (§5.1)",
              "FR-04 to FR-06 (Slot Allocation & Ranking) -> UC-02 -> AllocationUI, ConflictValidator, ITieBreakerStrategy -> Tested in TC-BB-01, TC-BB-02 -> Wireframe Matrix (§5.2)",
              "FR-07 to FR-10 (Availability & Timetables) -> UC-07 to UC-09 -> TeacherUI, AvailabilityController, ScheduleController -> Tested in TC-BB-04 -> Wireframe Portal (§5.3)",
              "FR-11 to FR-13 (Rejections & Exceptions) -> UC-03, UC-04, UC-10 -> RejectionController, AllocationController -> Tested in TC-BB-08 -> Wireframe Rejection (§5.3)",
              "FR-14 to FR-17 (Studios & Drums) -> UC-14, UC-15 -> StudioController, ConflictValidator -> Tested in TC-BB-07, TC-BB-09 -> Wireframe Studio Selector (§5.2)",
              "FR-20 to FR-21 (Labor Compliance & Audit) -> UC-11, UC-17 -> AuditLogUI, AuditLogController, ComplianceController -> Tested in TC-BB-06 -> Wireframe Audit (§5.4)",
              "Summary: 100% of functional requirements and quality attributes are realized across components, validated through formal test suites, and rendered in interactive wireframes."])

    prs.save(output_path)
    print(f"Successfully generated PowerPoint presentation at {output_path}")

if __name__ == "__main__":
    out = "/home/blvnk/Documents/school/INF2001/project/report/INF2001-M2-P5-5-Presentation.pptx"
    create_deck(out)
