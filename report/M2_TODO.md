# Milestone 2 Execution Plan & Detailed Work Breakdown

## Target Deliverables
1. **`report/INF2001-M2-P5-5.md`**: Master Markdown report complying with the official template.
2. **`report/INF2001-M2-P5-5.pdf`**: Publication-ready PDF compiled via `md-to-pdf`.
3. **`report/INF2001-M2-P5-5-Presentation.pptx`**: Professional slide deck focusing on wireframes, user journeys, and design-to-requirement traceability.
4. **Diagram Assets (`report/assets/m2/`)**:
   - Updated Final Class Diagram (incorporating `<<interface>>` classes)
   - UML 2.5 Component Diagram (with provided & required interfaces)
   - Software Architecture Diagram (Layered / MVC pattern)
   - Design Pattern 1 & 2 Structure Templates
   - Design Pattern "Before" & "After" Class Diagram excerpts
   - White-Box Testing Control Flow Graph (CFG)
5. **Testing Derivations**:
   - Black Box Decision Table (Causes, Effects, Combinations, Reduction, Final Test Cases)
   - White Box Basis Path Testing (Method Pseudocode $\ge 10$ LOC / $\ge 2$ decision points, Cyclomatic Complexity, Independent Basis Paths)
6. **Wireframe System**:
   - Screen structure, interaction descriptions, and traceability mappings for all finalized use cases.

---

## Multi-Pass Flow Breakdown

### Phase 1: Planning & Setup (Current)
- [x] Establish Git tracking (`m2-revisions` branch pushed to GitHub).
- [x] Fix M1 foundational requirements, diagrams, and traceability.
- [ ] Finalize `M2_TODO.md` and obtain approval.

### Phase 2: First Iteration Drafting (Subagents: Drafting Team)
- [ ] **Subagent A (Design & Architecture Specialist)**:
  - Identify system architecture (Layered MVC with Dependency Inversion).
  - Design UML 2.5 Component Diagram grouping classes by business capability (Scheduling, Faculty, Facility, Auditing).
  - Formulate and evaluate two design patterns:
    - **Pattern 1 (Selected):** Strategy Pattern for candidate teacher ranking/tie-breaking algorithms.
    - **Pattern 2 (Alternative):** Observer Pattern for event notification dispatch.
  - Author PlantUML source files for Component Diagram, Architecture Diagram, Standard Pattern Template, and "Before" vs "After" class excerpts.
  - Compile all diagrams to PNG.
- [ ] **Subagent B (Testing & Verification Specialist)**:
  - **Black Box Testing (Section 4.1):** Select prominent method (`ConflictValidator.validateAllocationRules` or `AllocationController.allocateLessonSlot`), construct full decision table (causes/effects), perform Boolean algebraic reduction, and derive test cases.
  - **White Box Testing (Section 4.2):** Select complex method $\ge 10$ LOC with $\ge 2$ decision points (`ConflictValidator.findEligibleCandidates` or `calculateWeeklyWorkload`), write clean pseudocode, draw CFG, compute Cyclomatic Complexity ($V(G) = E - N + 2P$), and derive basis paths.
- [ ] **Subagent C (Report Assembler)**:
  - Assemble Section 1 (Contributions, Final Requirements highlighting M1 updates, Final Class Diagram with interfaces).
  - Integrate Component Diagram (Section 2) and Detailed Design (Section 3).
  - Integrate Testing (Section 4).
  - Structure Section 5 (Wireframes) with interaction models and use case alignments.

### Phase 3: Review Pass 1 (Subagent: Academic Auditor / Prof POV)
- [ ] Evaluate draft against official M2 grading rubric:
  - Are requirements strictly from the system's perspective and atomic?
  - Do `<<interface>>` classes appear in both Class Diagram and Component Diagram?
  - Are interfaces clearly designated as *provided* (`lollipop`) and *required* (`socket`)?
  - Are design patterns justified against real architectural trade-offs, not just trivial wrappers?
  - Are "Before" and "After" class diagrams structurally valid and consistent?
  - Does the Decision Table show full, reduced, and test case tables?
  - Is the CFG mathematically verified ($V(G) = E - N + 2 = P + 1 = \text{Regions}$)?
  - Are wireframe descriptions explicit about user interactions and data validations?

### Phase 4: Fix Pass 1
- [ ] Address all discrepancies, missing methods, or notation issues raised in Review Pass 1.
- [ ] Recompile diagram PNGs and regenerate PDF.

### Phase 5: Review Pass 2 (Subagent: External Verification Auditor)
- [ ] Rigorous cross-consistency check across all artifacts:
  - Ensure every class in the Component Diagram exists in the Class Diagram.
  - Ensure every method tested in Section 4 matches the exact method signature in the Class Diagram.
  - Ensure presentation deck matches report terminology and wireframe flows.

### Phase 6: Fix Pass 2 & Final Artifact Generation
- [ ] Apply final polish to report markdown and compile final PDF.
- [ ] Generate `INF2001-M2-P5-5-Presentation.pptx` using `uv` and `python-pptx`.
- [ ] Commit all deliverables to Git and push to GitHub.
