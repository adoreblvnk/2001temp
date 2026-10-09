# Stakeholder Elicitation Session Minutes: Management Operations

**Document Identifier:** MIN-01-MGR  
**Target Stakeholder:** School Manager (Marcus Tan)  
**Lead Interviewer:** Joseph (Lead Architect & Integration Lead, Team P5-5)  
**Session Focus:** Workload Tracking, Job Allocation Workflows, Conflict Resolution, and Exception Handling  

---

## Part 1: Spoken Dialogue Transcript

**Date:** 15 September 2026  
**Time:** 10:00 AM – 11:15 AM SGT  
**Location:** Music School Administrative Office / Hybrid Teams Call  
**Participants:**
- **Joseph (Interviewer):** Lead Architect & Integration Lead, Group P5-5
- **Marcus Tan (Interviewee):** Operations Co-Manager, Music School

*(Recording begins. Sound of rustling papers and a laptop booting up.)*

**Joseph:** Morning Marcus, thanks a lot for taking the time to sit down with me today. As you know, our team is working on the new workload allocation and scheduling system for the school. We’ve reviewed the initial brief, but today I really want to dig into the ground reality of your day-to-day operations—the real pain points, the unwritten rules, and how you actually juggle teachers, rooms, and students.

**Marcus:** Morning Joseph. Yeah, more than happy to help. Believe me, if you guys can build something that gets me out of spreadsheet hell, I’ll personally buy your entire team coffee for a month.

**Joseph:** *(Laughs)* We will definitely hold you to that! Let’s start right there with that spreadsheet hell. Can you walk me through your current process for tracking and balancing teaching hours across the staff?

**Marcus:** Sure. Right now, it’s literally one giant shared Excel spreadsheet. Each teacher has their own row, and my co-manager and I manually enter and add up the hours as we assign lessons across the week. The problem is, there’s no automated alerting or logic in there. If someone is inching close to 40 hours, there’s no yellow highlight or warning pop-up. We literally have to eyeball the totals, do mental arithmetic, and double-check each other before Friday afternoon.

**Joseph:** And with nine teachers and five studios, how much time does that manual cross-checking actually take you?

**Marcus:** Oh, it’s brutal. That’s easily the biggest pain point in our entire workflow. Cross-checking teacher availability against studio availability against specific student time requests all at once... doing that by hand for every single 30-minute slot is where most of my week disappears. Building a single week’s schedule takes me a full day, sometimes a day and a half. And the frustrating part is that most of it isn't high-level decision-making; it's just mind-numbing verification to make sure we haven’t double-booked Studio 3 or scheduled a teacher when they have a doctor's appointment.

**Joseph:** Wow, 12 to 15 hours every week just doing manual collision detection. And double-bookings still happen?

**Marcus:** They still happen! Usually, it’s discovered when two teachers literally show up at the door of Studio 2 at 4:00 PM on a Tuesday with their students. Then we have to scramble in real time to see if Studio 4 is empty, or if someone can swap. It’s embarrassing, and it frustrates the parents.

**Joseph:** Let’s break down the timeline. How does your monthly schedule planning cycle work from start to finish?

**Marcus:** Okay, so our official cycle begins around the 20th of the month. All staff availabilities are supposed to be submitted into the sheet by the 19th. Once the 20th hits, I sit down to plan the upcoming month week by week. I go teacher by teacher first, noting down who is free and when. Then I take our recurring students—the ones who have had their regular Tuesday 5:00 PM slot for months—and lock them in first. After the recurring slots are settled, I tackle new enrolments and unassigned students. Those are the trickiest because you’re trying to fit square pegs into whatever odd gaps are left across the five studios.

**Joseph:** That makes total sense. Now, what happens if a teacher misses that 19th cutoff and sends their availability on the 21st or 22nd?

**Marcus:** Ah, the classic late submission. The brief says "case-by-case," and in reality, that means: how much of a headache is it going to cause me? If the teacher sends in a minor tweak or they rarely miss deadlines, I’ll try to accommodate it. But if accepting their late request means ripping apart slots I’ve already confirmed with other teachers or parents, I have to push back. I’ll tell them, "Look, the preliminary roster is set. You’ll have to take what’s currently available, or take fewer hours this month."

**Joseph:** Understood. When you log into the new system, what do you need to see immediately on that landing page to make your life easier?

**Marcus:** A clean landing dashboard that visualizes workload without me doing math! I need to see at a single glance: current hours assigned this week, total hours accumulated for the month, what instruments they teach, and their stated preferences for the week. And visual hierarchy is huge for me. I don’t want to read a wall of numbers first thing.

**Joseph:** How would you like that visualized? Charts, tables, colour indicators?

**Marcus:** Colour-coded indicators, 100%. Give me green for teachers comfortably under capacity, amber when someone is approaching that 40-hour threshold—say, 35 to 39 hours—and bright red when they hit or exceed 40 hours. Tables are fine for drilling down into the specific slots underneath, but that top-level status must be immediate colour recognition. Also, highlight the three teachers with the lowest hours right up front so I immediately know who needs lessons allocated to them.

**Joseph:** Speaking of that 40-hour threshold—if a teacher hits 40 hours in a week and you try to assign them another 30-minute lesson, should the system strictly block you from assigning it, or should it just warn you?

**Marcus:** Warn me, please! Definitely do not hard-block me. There are real-world operational crises where going over 40 hours is unavoidable. For example, if Elena is at 40 hours, but our other violin teacher comes down with acute flu on Thursday and we have four students coming in, Elena might agree to cover two hours of lessons. If the system locks me out, I can’t handle the emergency. Give me a clear warning modal that forces me to acknowledge: "Teacher is over 40 hours. Do you wish to override?" Keep it deliberate, but keep the manager in control.

**Joseph:** That’s a critical distinction—soft warning with manager override rather than a hard constraint block. What about continuous teaching hours? The brief mentions a 4-hour limit.

**Marcus:** Now *that* one should be strictly enforced or at least have a very heavy constraint check. Teachers cannot teach more than four continuous hours without a minimum one-hour break. Teaching individual 30-minute instrument lessons requires intense focus. After four hours straight, their ears are fried and teaching quality plummets. Plus, from a labour wellbeing perspective, they need that break.

**Joseph:** Right. And what about physical studios? How do you ensure the five rooms are used efficiently?

**Marcus:** Well, our ideal business goal from school management is to keep all five studios occupied during opening hours—Monday to Friday 9 AM to 9 PM, weekends 8 AM to 9 PM. In practice, I try to fill gaps sequentially rather than scattering lessons sparsely. If Studio 1 has a free 30-minute hole between 3:00 PM and 4:00 PM, I will actively try to place a student there before opening up Studio 4. And remember the physical constraint: every studio has an acoustic piano, but only Studio 5 has the drum kit.

**Joseph:** Right, Studio 5 is the dedicated drum room. Can piano, violin, or trumpet lessons be held in Studio 5 if drums aren't using it?

**Marcus:** Yes, absolutely. Studio 5 has a piano too. So if no drum lessons are scheduled, we can run violin, trumpet, or piano in there. But a drum lesson *must* be in Studio 5. If Studio 5 is booked, you cannot book another drum lesson anywhere else, period.

**Joseph:** Got it. Now let’s talk about allocation criteria. When you have a new student and two teachers are both qualified and available for that slot, how do you decide who gets the job?

**Marcus:** Instrument qualification is step zero—non-negotiable. We never, under any circumstance, allow a teacher to teach an instrument they aren't certified for. Assuming both are qualified: first, I look at their current workload. Whoever is furthest below their requested monthly hours gets priority. It is very hard to recruit and retain good music teachers in Singapore, so if we don't give them sufficient hours, they’ll leave for another school. Second, I look at stated preferences—did one teacher specifically request Tuesday afternoons? Third is student continuity. If the student previously had lessons with Teacher A, Teacher A gets right of first refusal before Teacher B.

**Joseph:** And if a teacher already has 38 hours, and a 2-hour block opens up?

**Marcus:** I’d assign it, bringing them to 40. We want to maximize their earning potential and retention up to that threshold.

**Joseph:** On the allocation screen itself, the initial brief suggested being able to compare up to three staff members side-by-side. How would that work in your ideal interface?

**Marcus:** That would be fantastic. If I’m looking at an unassigned student on Wednesday at 4:00 PM, I want to be able to pick up to three candidate teachers and see their columns side by side: their total hours so far, whether they’re available at that time, their stated preferences, and where they are physically teaching just before and after that slot. If Teacher A is already in Studio 1 at 3:30 PM, giving them the 4:00 PM slot in Studio 1 is seamless—no room hopping.

**Joseph:** That’s a great operational detail: minimizing studio transitions for teachers. Now, let’s discuss job rejections. What happens when a teacher is assigned a lesson and says they cannot do it?

**Marcus:** Under the current setup, they just WhatsApp or call me. It’s messy. In the new app, I understand the brief says teachers can reject jobs, but they must be warned to discuss it with management first. Here is how it must work from my perspective: a teacher can’t just click "reject" and the lesson vanishes into thin air. If they request a rejection, the system must warn them, prompt them to pick a legitimate reason—like a medical appointment or university exam—and add comments. Once they submit, the lesson status should flip to something like `Pending Re-allocation` on my dashboard. I get notified, I speak with the teacher, and then I either reassign that student to a replacement teacher or reschedule the student.

**Joseph:** What about two managers working simultaneously? You mentioned you have a co-manager.

**Marcus:** Yes! We each work a 43-hour weekly shift, and our hours overlap during peak afternoons. In Excel, we sometimes overwrite each other or try to book the same room at the same time. The new system needs real-time validation so if my co-manager assigns Studio 2 at 4:00 PM on Friday, that slot is instantly locked or marked unavailable on my screen, preventing concurrency conflicts.

**Joseph:** Exactly. A unified database with optimistic locking and instant conflict checks will eliminate that completely. What about reporting to school management?

**Marcus:** At the end of every month, I have to submit an operations report to our School Director, David Koh. He wants to see overall studio utilization percentages across the opening hours, total teaching hours delivered by instrument, a breakdown of teachers nearing or exceeding the 40-hour mark, and how many unassigned students remain on our waitlist. Right now, pulling that data takes me another four or five hours of manual calculations. If the system could generate that monthly report with one click, it would be a game-changer.

**Joseph:** If we had to boil down your top three must-have capabilities for Milestone 1, what would they be?

**Marcus:** Number one: the workload landing dashboard with colour-coded capacity gauges and the top 3 underloaded teachers. Number two: the weekly job allocation matrix with side-by-side comparison of up to three staff members. Number three: automated real-time conflict detection that flags room clashes, teacher unavailability, and 4-hour continuous blocks before I publish the roster.

**Joseph:** Brilliant. That gives us a crystal-clear operational foundation. Marcus, thank you so much for the deep dive and practical insights.

**Marcus:** Thanks Joseph. Really looking forward to seeing the prototype!

*(Recording ends.)*

---

## Part 2: Formal Structured Meeting Minutes

### 1. Administrative Overview
- **Session ID:** MIN-01-MGR
- **Date & Time:** Tuesday, 15 September 2026 | 10:00 AM – 11:15 AM SGT (Week 2)
- **Venue:** Music School Administrative Office / Microsoft Teams
- **Chairperson / Lead Interviewer:** Joseph (Lead Architect & Integration Lead, Group P5-5)
- **Primary Stakeholder / Interviewee:** Marcus Tan (School Operations Co-Manager)
- **Minute Taker:** Joseph

### 2. Meeting Objectives
1. Elicit operational workflows, pain points, and decision heuristics governing weekly job allocations.
2. Establish business rules surrounding teacher workload caps, overtime thresholds, and mandatory rest periods.
3. Define UI/UX functional requirements for the Manager Landing Page and Job Allocation Matrix.
4. Formalize exception-handling protocols for late availability submissions and teacher job rejection workflows.

### 3. Key Discussion Points & Operational Findings

#### 3.1 Legacy Workflow Inefficiencies & Rostering Overhead
- The current scheduling workflow relies on a shared, unversioned Microsoft Excel workbook with manual mental tallies.
- Weekly roster construction consumes between **8.0 to 12.0 hours (1.0 to 1.5 full working days)** per scheduling cycle.
- Manual verification frequently fails, resulting in accidental studio double-bookings (discovered during lesson changeovers) and undetected teacher over-allocation.

#### 3.2 Visual Workload Dashboard Requirements
- The landing dashboard must provide immediate, glanceable situational awareness without requiring calculation.
- **Visual Hierarchy:** A three-tier colour-coded workload status indicator is mandated:
  - **Green (Normal):** $< 35.0$ allocated weekly hours.
  - **Amber (Approaching Limit):** $35.0 \le \text{hours} < 40.0$.
  - **Red (Over-Capacity Warning):** $\ge 40.0$ allocated weekly hours.
- **Top 3 Under-Allocated Teachers:** System must dynamically sort and render the three qualified teachers with the lowest monthly workload to guide equitable distribution.

#### 3.3 Decision-Support Job Allocation Matrix
- Rostering is conducted **one calendar week at a time**, beginning on the 20th of the preceding month.
- Scheduling sequence follows a strict priority cascade:
  1. Recurring enrolled students locked into existing time slots.
  2. New enrolments and unassigned waitlisted students matched to available gaps.
- **Candidate Comparison:** The interface must allow the manager to select and inspect up to three candidate instructors side-by-side, comparing:
  - Weekly allocated hours vs. monthly target.
  - Active week availability grid.
  - Stated weekly job preferences (timing and day preferences).
  - Studio physical location for adjacent lesson slots (minimizing room switching).

#### 3.4 Business Rules, Constraints & Overrides
- **Instrument Qualifications:** Hard constraint. Under no circumstances may an instructor be assigned to an instrument they are not formally qualified to teach.
- **Continuous Teaching Limit:** Teachers must not exceed **4.0 continuous hours** of instruction without a minimum **1.0-hour consecutive break**.
- **40-Hour Weekly Threshold:** System shall display a prominent warning modal requiring explicit manager confirmation/override, rather than an impassable hard block, accommodating emergency substitute coverage.
- **Facility / Studio Rules:**
  - Exactly 5 studios available.
  - Studios 1 to 4: Contain acoustic pianos; accommodate Piano, Violin, and Trumpet lessons.
  - Studio 5: Contains acoustic piano and drum kit; uniquely accommodates Drum lessons (and other instruments when drums are idle).

#### 3.5 Exception Handling & Workflow Governance
- **Late Availability Submissions:** Submissions after 23:59 on the 19th calendar day are flagged as `Late Submission` and routed to the manager's review queue. Discretionary approval is granted only if modifications do not disrupt existing allocations.
- **Teacher Job Rejections:** Rejections cannot unilaterally delete lessons. Teachers must acknowledge an on-screen warning modal advising managerial discussion, select a structured reason code, and submit. The lesson transitions to `Pending Re-allocation` on the manager's action queue.
- **Manager Concurrency:** System must enforce real-time multi-user concurrency control to prevent conflicting assignments by the two on-duty managers.

---

### 4. Derived Requirements & Traceability Matrix

| Requirement ID | Type | Requirement Description | Operational Metric / Verification Standard | Mapped Use Case | Priority |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-01** | Functional | The system shall display a manager landing dashboard presenting real-time weekly and monthly allocated hours per teacher, visually highlighting staff exceeding 40 weekly hours and identifying the three teachers with lowest workload. | Workload metrics computed and rendered across all 9 teachers with colour-coded capacity thresholds. | UC-01 | High |
| **FR-02** | Functional | The system shall provide an interactive weekly job allocation matrix allowing managers to assign 30-minute lesson slots to teachers and studios one week at a time with real-time conflict checking. | Conflict validation against room occupancy, teacher availability, and instrument qualifications. | UC-02 | High |
| **FR-03** | Functional | The system shall allow managers to select and compare the profiles, availability grids, weekly preferences, and workloads of up to three candidate teachers side-by-side during job allocation. | UI restricts comparison to $\le 3$ teachers; renders side-by-side matrix within 500 ms. | UC-04 | High |
| **FR-04** | Functional | The system shall display an over-capacity warning alert when an allocation causes a teacher to reach or exceed 40 hours in a week, requiring explicit manager confirmation to proceed. | Non-blocking modal; logs manager override action and justification into audit history. | UC-02 | High |
| **FR-05** | Functional | The system shall validate and prevent any schedule allocation that assigns a teacher to more than 4.0 continuous teaching hours without a minimum 1.0-hour break. | Decision engine calculates continuous blocks and enforces 60-minute break interval guard. | UC-02 | High |
| **FR-10** | Functional | The system shall maintain an outstanding re-allocation queue for lessons flagged as rejected or unassigned, enabling managers to assign qualified substitute instructors. | Lessons marked `Pending Re-allocation` remain visible until confirmed with substitute or rescheduled. | UC-03 | High |
| **FR-18** | Functional | The system shall generate a monthly operations report compiling studio utilization percentages, total teaching hours delivered by instrument, and pending waitlist counts. | On-demand report generation exportable for school director review. | UC-17 | Medium |
| **NFR-PER-01** | Performance | The manager landing dashboard shall calculate and render all teacher workload gauges and studio occupancy states within $\le 1.0\,\text{s}$ under 20 concurrent user sessions. | Automated load testing with 20 simulated active browser sessions. | UC-01 | High |
| **NFR-PER-02** | Performance | The schedule conflict validation engine shall evaluate teacher availability, room clashes, and continuous teaching limits within $\le 300\,\text{ms}$ upon placing a lesson slot. | Sub-second client-server round-trip latency during drag-and-drop or slot selection. | UC-02 | High |
| **NFR-CON-01** | Concurrency | The system shall employ optimistic concurrency locking to prevent conflicting simultaneous schedule edits by multiple active managers. | Conflicting updates trigger an alert: "Slot modified by another manager. Roster refreshed." | UC-02 | High |

---

### 5. Action Items & Next Steps
1. **Joseph:** Update architectural class diagrams to include `WorkloadCalculator`, `AllocationMatrix`, and `ConflictValidator` domain services.
2. **Yan Qi:** Detail activity diagram decision nodes for the 4-hour continuous teaching check and the 40-hour warning modal override.
3. **Wei Xiang:** Formalize the state transition diagram for lesson entities (`Unassigned` $\rightarrow$ `Assigned` $\rightarrow$ `Pending Re-allocation` $\rightarrow$ `Confirmed`).
