# Stakeholder Elicitation Session Minutes: School Governance & Regulatory Compliance

**Document Identifier:** MIN-05-MGT-EXT  
**Target Stakeholder:** School Management & External Regulatory Representative (David Koh)  
**Lead Interviewer:** Wei Xiang (Business Logic & Exception Flow Lead, Team P5-5)  
**Session Focus:** Operational Profitability, Studio Utilization Metrics, Singapore Employment Act Compliance, Teacher Retention, and Asset Servicing  

---

## Part 1: Spoken Dialogue Transcript

**Date:** 28 September 2026  
**Time:** 10:30 AM – 11:45 AM SGT  
**Location:** Executive Conference Room / Hybrid Microsoft Teams  
**Participants:**
- **Wei Xiang (Interviewer):** Business Logic & Exception Flow Lead, Group P5-5
- **David Koh (Interviewee):** School Director & Board Representative, Music School

*(Recording begins. Professional ambiance; occasional chimes from calendar notifications.)*

**Wei Xiang:** Good morning, Mr. Koh. Thank you very much for setting aside time to meet with us today. Our software engineering team from SIT has met with Marcus from operations, Elena representing the teachers, Alex from IT, and Chloe representing our student body. Today, we want to look at the macro picture with you: executive governance, business profitability, statutory labour compliance, and teacher retention.

**David Koh:** Good morning, Wei Xiang. It’s a pleasure. I’ve heard great things about your team’s thoroughness so far. As the School Director, I wear two hats: one is ensuring the financial sustainability and operational health of the school, and the other is maintaining absolute compliance with Singapore regulatory bodies and Ministry of Manpower (MOM) standards. I’m eager to share our executive perspective.

**Wei Xiang:** That dual perspective is exactly what we need. Let’s begin with business operations. How do you assess whether our five physical studios and daily opening hours are being used efficiently to maintain profitability?

**David Koh:** Look, our economic model is straightforward: we run individual 30-minute private lessons across five dedicated acoustic studios. Our opening hours are extensive—Monday through Friday from 9:00 AM to 9:00 PM, and Saturdays and Sundays from 8:00 AM to 9:00 PM, closed only on official Singapore public holidays. That yields a finite inventory of 30-minute studio slots per week. Every single slot that sits empty during operating hours—especially during prime after-school and weekend hours—is unrecoverable lost revenue.

**Wei Xiang:** Right, perishable inventory.

**David Koh:** Exactly. Perishable capacity. What I look at is our fill rate: how many lesson slots were actually delivered versus total available capacity. I want to see where studios are sitting idle, whether Studio 5—our only drum studio—is acting as a revenue bottleneck, and crucially, whether we are turning away students because of room shortages or because of teacher availability gaps.

**Wei Xiang:** That brings up the reports you need. What specific metrics and management reports do you require to track profitability and studio utilization?

**David Koh:** I need a consolidated Monthly Management Operations Report. It should break down studio utilization percentage by day of the week, by time of day, by studio number, and by instrument. I want to see scheduled slots versus delivered slots, teacher workload comparisons—specifically requested hours versus allocated hours—and cancellation and reschedule counts. Most importantly, I want a clear summary of lost capacity: how many lessons were lost because no room was free, versus lessons lost because no teacher was available.

**Wei Xiang:** That’s a very vital distinction for business planning. Now, suppose there is an operational conflict: Marcus can either achieve 100% room occupancy by assigning a teacher to an awkward shift against their stated preferences, or respect the teacher's preference and leave a studio slot vacant. Where do you stand on that trade-off?

**David Koh:** That is a fundamental question, Wei Xiang, and my answer is unambiguous: we will *never* fill rooms at any cost. Let me explain why. In Singapore’s music education sector, recruiting and retaining highly qualified, certified music instructors—especially for instruments like violin, trumpet, and drums—is exceptionally difficult. If a manager overworks a teacher, ignores their stated availability, or forces them into unsustainable rosters, that teacher will resign. Losing a teacher causes catastrophic downstream attrition; when a teacher leaves, half their students often follow them out the door.

**Wei Xiang:** So sustainability takes precedence over superficial fullness?

**David Koh:** 100%. Our operational priority hierarchy must be strictly baked into your software:
Number one: legal and statutory wellbeing constraints. Those are non-negotiable.
Number two: student-teacher pedagogical continuity.
Number three: room utilization and teacher preferences in balanced harmony.
I would far rather have a sustainable 80% studio utilization with happy, long-term instructors than a 95% utilization that causes teacher burnout and mass resignations within three months.

**Wei Xiang:** That is an essential architectural principle for our allocation engine. How do you currently track whether teachers are satisfied with their hours?

**David Koh:** Today, it’s mostly informal chats and Marcus trying to remember what teachers asked for. But people slip through the cracks. The system must make that comparison explicit for every instructor: requested monthly hours versus allocated hours. If Elena requested 30 hours a week and we’ve only given her 18 hours for two consecutive months, the system must throw a retention alert on the executive dashboard: *"Persistent Under-Allocation: Teacher is 40% below requested target."* That gives management a chance to engage them before they start looking for jobs elsewhere.

**Wei Xiang:** What should a single "Operations Health Dashboard" display when you log in as Director?

**David Koh:** An executive cockpit. In thirty seconds, I should see:
1. Overall studio utilization rate this month.
2. Total booked lessons delivered.
3. Number of unassigned students sitting on the waitlist.
4. Teacher workload distribution—who is in the green, who is in the amber, and who is flagged over 40 hours.
5. Outstanding pending job rejections or unresolved clashes.
6. A month-over-month trendline showing whether utilization and teacher retention are improving or declining.

**Wei Xiang:** Now, let’s pivot to your external stakeholder hat: regulatory compliance and statutory labour guidelines. What Singapore labour laws must the school monitor and demonstrate compliance with?

**David Koh:** The primary legal framework is the **Employment Act of Singapore**, specifically **Part IV**, which covers core terms and conditions of employment including hours of work, rest days, and overtime limits. Under MOM guidelines, covered employees are generally restricted to a maximum of 44 normal hours per week, 12 hours of total work per day, and no more than 72 overtime hours per calendar month, alongside at least one mandatory rest day per week.

**Wei Xiang:** And how does that interface with the school’s internal continuous teaching rule?

**David Koh:** While statutory law sets broad safety limits, our school enforces a much stricter internal operational standard to protect instructional quality and vocal/aural wellbeing: **no teacher may teach for more than 4.0 continuous hours without a minimum 1.0-hour break**. Teaching an individual instrument lesson requires relentless active listening and cognitive stamina; after four hours, fatigue degrades teaching quality and increases vocal strain. Your software must monitor both: our strict internal 4-hour rule as a hard scheduling constraint, and the 40-hour weekly threshold as an auditable compliance boundary.

**Wei Xiang:** What are the tangible consequences if our system fails to enforce or audit these labour rules?

**David Koh:** The consequences are severe. Legally, non-compliance can trigger Ministry of Manpower inspections, statutory directives, financial penalties, and potential suspension of our educational licenses. Operationally, it leads to salary and overtime disputes, instructor exhaustion, spike in turnover, and reputational damage. That is why prevention is paramount: your system must prevent or heavily flag problematic allocations *before* a roster is published, and it must maintain an immutable, non-editable audit trail for every assignment, manager override, and exception for at least 12 months.

**Wei Xiang:** That leads directly to our non-functional audit requirements: immutable append-only logs for all allocation modifications and overrides. What about physical asset maintenance—how do you coordinate instrument servicing?

**David Koh:** Instruments, particularly our acoustic upright pianos, grand pianos, and drum kits, require periodic servicing—tuning, regulation, re-stringing, and acoustic isolation maintenance. We need a formalized workflow where management or external technicians can record an instrument issue, designate the affected studio or kit, and set a `Maintenance Blackout Window`. During that window, the allocation engine must automatically lock out that studio or instrument so no student is inadvertently assigned to a room where a piano tuner is working. Once servicing is logged and signed off, the asset is returned to active service.

**Wei Xiang:** And what do you see as the school's unique competitive advantage in the market?

**David Koh:** Our strength is specialized, focused individual instruction. We don’t run chaotic 30-student group classes; we provide dedicated, high-calibre 30-minute private lessons in acoustically treated rooms. Our challenge has never been student demand—as you see from our waitlists, demand is robust. Our challenge is purely resource orchestration: harmonizing qualified teachers, specialized physical studios, and diverse student schedules into a balanced, frictionless operational machine.

**Wei Xiang:** Mr. Koh, this has been an extraordinary session. You’ve articulated the exact strategic, financial, and legal framework we need to anchor Milestone 1.

**David Koh:** Excellent, Wei Xiang. I have great confidence in your team. Build an engine that protects our teachers, respects our regulations, and optimizes our spaces, and this school will thrive.

*(Recording ends.)*

---

## Part 2: Formal Structured Meeting Minutes

### 1. Administrative Overview
- **Session ID:** MIN-05-MGT-EXT
- **Date & Time:** Monday, 28 September 2026 | 10:30 AM – 11:45 AM SGT (Week 4)
- **Venue:** Executive Conference Room / Hybrid Microsoft Teams
- **Chairperson / Lead Interviewer:** Wei Xiang (Business Logic & Exception Flow Lead, Group P5-5)
- **Primary Stakeholder / Interviewee:** David Koh (School Director & Board Representative)
- **Minute Taker:** Wei Xiang

### 2. Meeting Objectives
1. Formalize strategic executive metrics for operational profitability and perishable studio capacity utilization.
2. Establish business priority heuristics balancing studio occupancy against instructor retention.
3. Define statutory compliance boundaries under Part IV of the Singapore Employment Act and MOM directives.
4. Elicit facility maintenance workflows, asset servicing blackout windows, and executive audit logging standards.

### 3. Key Discussion Points & Operational Findings

#### 3.1 Studio Capacity Economics & Lost Capacity Analytics
- The school operates 5 acoustic studios across expansive weekly operating hours (Mon-Fri 09:00–21:00, Sat-Sun 08:00–21:00; 86 operating hours per studio weekly).
- Every unbooked 30-minute slot represents perishable lost revenue.
- The system must capture and categorize **Lost Teaching Capacity** into two root-cause buckets:
  1. *Room Deficit:* Unassigned demand due to facility saturation (particularly Studio 5 drum kit constraints).
  2. *Instructor Deficit:* Demand unfulfilled due to lack of qualified instructor availability during requested windows.

#### 3.2 Strategic Priority Hierarchy (Retention vs. Occupancy)
- Executive policy explicitly rejects filling studios at the expense of staff wellbeing.
- **Decision Priority Hierarchy:**
  1. **Legal & Statutory Compliance:** Strict enforcement of maximum continuous teaching hours and rest periods.
  2. **Student Pedagogical Continuity:** Retaining existing student-teacher pairings.
  3. **Teacher Retention & Workload Equity:** Prioritizing instructors furthest below their requested earning targets.
  4. **Studio Occupancy Maximization:** Sequential gap filling across physical spaces.

#### 3.3 Statutory Labour Compliance & Singapore MOM Guidelines
- **Singapore Employment Act (Part IV):** System must uphold statutory baselines governing hours of work, rest days, and overtime.
- **Internal Safety Rule:** Mandatory enforcement of the **$\le 4.0$-hour continuous teaching limit** followed by a **$\ge 1.0$-hour consecutive break**.
- **Audit Logging Requirement:** The system must record an immutable, non-editable audit trail of all allocations, roster publications, overtime hours, and manager overrides, preserved for a minimum of **12 months** for regulatory inspection.

#### 3.4 Instrument Maintenance & Asset Servicing Protocol
- Pianos and drum equipment require regular certified technician tuning and acoustic servicing.
- IT Administrators and Managers must have the capability to schedule a `Maintenance Window` that temporarily marks a studio or instrument resource as `Inactive`, automatically suppressing the facility from the weekly allocation matrix during that timeframe.
- Upon completion of servicing, maintenance notes and return-to-service timestamps must be logged into the asset history.

#### 3.5 Executive Operations-Health Cockpit
- Director requires a high-level aggregate dashboard displaying:
  - Studio occupancy rate (%) by room, day, and time band.
  - Active waitlist backlog categorized by instrument.
  - Teacher workload distribution and retention alerts (flagging teachers persistently $< 50\%$ of requested hours).
  - Historical month-over-month trendline analysis.

---

### 4. Derived Requirements & Traceability Matrix

| Requirement ID | Type | Requirement Description | Operational Metric / Verification Standard | Mapped Use Case | Priority |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-16** | Functional | The system shall provide an emergency absence and lesson substitution workflow, enabling managers to assign qualified substitute instructors or initiate student reschedules during instructor illness. | Displays qualified instructors with open availability for the affected slot; logs substitute assignment. | UC-07 | High |
| **FR-17** | Functional | The system shall enable instructors to request peer lesson swaps subject to manager authorization, instrument qualification verification, and schedule clash checks. | System validates qualification of both instructors and checks for conflict before routing to manager approval. | UC-12 | Medium |
| **FR-18** | Functional | The system shall generate comprehensive monthly operations reports detailing studio utilization percentages, booked vs available lesson slots, lost capacity analysis, and teacher workload versus requested targets. | Aggregates 30-minute slot utilization across 5 studios and 86 weekly hours; exportable for board review. | UC-17 | High |
| **FR-19** | Functional | The system shall enforce and log compliance with labour guidelines and institutional rules, flagging teachers assigned $> 40$ weekly hours and prohibiting assignments exceeding 4 continuous hours without a 1-hour break. | Decision engine blocks continuous violations; logs managerial 40-hour overrides into regulatory audit trail. | UC-02, UC-18 | High |
| **NFR-AUD-01** | Security | The system shall record all allocation modifications, cancellations, teacher rejections, and manager constraint overrides in an immutable audit table retained for $\ge 12$ months. | Append-only database table; accessible only via authorized regulatory audit report (`UC-18`). | UC-18 | High |
| **NFR-PER-01** | Performance | The executive monthly operations report and utilization dashboard shall compile and render all aggregate metrics within $\le 1.5\,\text{s}$ across a full calendar month of lesson data. | Performance benchmark verified over 3,000 historical lesson records. | UC-17 | High |

---

### 5. Action Items & Next Steps
1. **Wei Xiang:** Model activity diagrams for the statutory compliance check and emergency lesson substitution workflows.
2. **Joseph:** Finalize domain classes for `MonthlyOperationsReport`, `AuditLog`, and `MaintenanceWindow`.
3. **Ryan:** Document the exact mathematical formula for Studio Utilization Percentage in the SRS document.
