# Stakeholder Elicitation Session Minutes: Teaching Staff Operations

**Document Identifier:** MIN-02-TCH  
**Target Stakeholder:** Teaching Faculty Representative (Elena Lim)  
**Lead Interviewer:** Ryan (Requirements & Usability Lead, Team P5-5)  
**Session Focus:** Availability Submission, Preference Configuration, Schedule Tracking, Job Rejections, and Mobile Usability  

---

## Part 1: Spoken Dialogue Transcript

**Date:** 17 September 2026  
**Time:** 2:00 PM – 3:00 PM SGT  
**Location:** Music School Staff Lounge / In-Person & Teams  
**Participants:**
- **Ryan (Interviewer):** Requirements & Usability Lead, Group P5-5
- **Elena Lim (Interviewee):** Senior Instructor (Piano & Violin), Music School

*(Recording begins. Ambient background sound of distant piano scales being practiced in Studio 1.)*

**Ryan:** Hi Elena, thanks so much for taking time out between your lessons to chat with me. As you probably heard from Marcus, our software engineering team from SIT is building the new workload allocation and scheduling web app. We really want to make sure the teacher experience is front and center, rather than an afterthought.

**Elena:** Hi Ryan, no problem at all! I’m really glad you guys are speaking directly with teachers. Usually, administrative systems are built for the front office, and we just have to suffer through clunky menus on our phones while rushing between students.

**Ryan:** That’s exactly what we want to avoid. Let’s start with how you plan and submit your working availability for the month. Could you walk me through your routine?

**Elena:** Sure. Currently, we use a shared Google Sheet. Towards the middle of the month, I look at my own personal diary and calendar for the upcoming month. The school asks us to submit availability up to five weeks ahead, so I usually log into the spreadsheet and enter the days and time windows I can teach. I always aim to get it in a few days before the 19th cut-off date, just in case my personal schedule shifts or something unexpected pops up.

**Ryan:** And how do you currently communicate your specific preferences—like lesson timings, student skill levels, or preferred days?

**Elena:** Honestly? Very informally. I usually type a quick WhatsApp message to Marcus, or I leave a tiny text comment inside a cell on the spreadsheet. The problem is, Marcus is always in a huge rush when he builds the roster around the 20th. Informal text comments get overlooked all the time. I might say, "Please keep my Friday mornings free for masterclasses," and then Friday morning I see two beginner piano lessons booked. There’s just no structured way to capture our preferences.

**Ryan:** That sounds really frustrating. When you think about weekly job preferences, what specific options would you actually want to choose from in the system?

**Elena:** Three main things: first, preferred days of the week—like preferring Tuesdays and Thursdays over Wednesdays. Second, lesson clustering—I strongly prefer back-to-back lessons rather than having weird 30-minute or 1-hour unpaid gaps scattered throughout my afternoon. If I have five students, I want them in a solid block so I'm not stuck sitting around the staff lounge waiting. And third, sometimes a preferred studio, especially if I’m teaching advanced violin and want the slightly larger acoustic space in Studio 3.

**Ryan:** Speaking of back-to-back lessons, how does that fit with the school’s mandatory break rule?

**Elena:** Ah, right! Back-to-back is great, but the 4-hour limit is non-negotiable for me. After four continuous hours of individual 30-minute lessons—that’s eight students in a row—your ears and brain are completely fried. You cannot teach effectively. We *must* have that minimum one-hour break before another teaching block. I really want the system to protect us from being scheduled five or six hours straight without that break.

**Ryan:** Definitely. That’s a hard operational rule we’re enforcing in the system engine. Now, once the schedule is finalized, how do you track your confirmed schedule and monthly hours?

**Elena:** Right now, it’s a bit messy. Marcus sends out the finalized roster or tells us it's updated on the spreadsheet. But the spreadsheet is constantly being tweaked when other teachers swap or cancel, and the formula totals aren’t always up to date. So I actually maintain my own personal running tally in my phone's Apple Notes! Every week, I write down how many hours I taught, add it up, and compare it against the hours I asked for at the start of the month.

**Ryan:** What specific information would you need to see on your teacher landing page to stop having to maintain that manual note?

**Elena:** I want to see my confirmed lesson timetable for the active week, with student names, instruments, and assigned studio numbers clearly visible. And right next to that, a running monthly progress bar: total hours taught so far this month, total hours confirmed for upcoming weeks, and how that compares to the target hours I originally requested. That way, I know immediately if I’m on track to hit my target earnings or if I’m falling behind.

**Ryan:** That’s super clear. What happens if your availability changes unexpectedly after the 19th cutoff date?

**Elena:** If something genuinely unavoidable happens—like a family medical emergency or an examination date being announced—I message Marcus directly and explain. I try my best not to do that, though, because I know the moment the 20th passes, he’s already neck-deep in building the timetable. Reshuffling after the 19th causes headaches for everyone. If the system allows us to submit a late availability change, it should probably flag it clearly as a late request so the manager knows to review it as an exception.

**Ryan:** Let’s talk about job rejections. If Marcus assigns you a lesson slot that you simply cannot do, how is that handled right now?

**Elena:** Currently, I message him directly. We talk it through—it's rarely a flat "no", it's more like, "Hey, Marcus, I have a dentist appointment on Thursday at 3:00 PM, can we move that student to Friday or get someone else to cover?" But the brief says the new app will let teachers reject jobs directly.

**Ryan:** Yes, the project brief states that staff can reject jobs assigned to them, but they will receive a warning to discuss the job with their manager before proceeding. What are your thoughts on that?

**Elena:** I think that’s actually a very healthy balance. I would prefer to submit the rejection through the app rather than having to chase Marcus down on WhatsApp, because it creates an official paper trail. But having a prompt that pops up saying, *"Please note: You are advised to discuss this rejection with your manager before submitting. Reason for rejection required,"* makes sure nobody abuses the button. It ensures that the teacher provides a legitimate reason—like a personal scheduling clash or a student skill mismatch—and gives the manager time to reassign the slot without leaving the student stranded.

**Ryan:** When you say "student skill mismatch," does that happen often?

**Elena:** It’s rare, but it happens. For instance, if a Grade 8 Diploma student is assigned to an instructor who specializes in early childhood beginner piano, the teacher might feel the student would be much better served by another colleague. If we could see the student’s grade level and past lesson count before or during assignment, that would prevent mismatched expectations.

**Ryan:** That’s a very valuable insight. Now, let’s talk about usability and technology. What device do you primarily use during a typical teaching day?

**Elena:** My phone! 100% my mobile phone. When I arrive at school, when I’m checking which studio I’m in between students, or when I’m on the MRT heading home, I’m always using my smartphone. The only time I pull out my laptop is if I’m sitting down at my desk at home to input a whole month of availability dates. So if the web app is clunky on mobile—if I have to pinch and zoom, or if buttons are tiny and unclickable—teachers are going to hate it.

**Ryan:** What screen size are we talking about? Standard iPhone or Android screens?

**Elena:** Yeah, regular iPhone screen. It should be clean, large touch targets, readable studio tags, and no tiny horizontal scrollbars. Also, it needs to load fast. If I'm walking into the school lobby and want to check my next studio, I can't be waiting ten seconds for a heavy page to load.

**Ryan:** How often would you realistically log into the system each week?

**Elena:** Probably three or four times a week. Definitely on Friday or over the weekend when the new weekly roster is published, and then maybe once or twice during the week to verify lesson times or check my monthly accumulated hours.

**Ryan:** What about notifications? If Marcus assigns you a new lesson or approves a reschedule, how would you like to know?

**Elena:** An in-app push notification or banner would be ideal, with an automated email as a backup. That way, even if I haven't logged in that day, I won't miss a newly assigned student.

**Ryan:** If the system went down or had temporary connectivity issues, how would that impact your work?

**Elena:** If the school Wi-Fi glitches for a few minutes, it shouldn't wipe out what I'm typing. If I’m in the middle of selecting my availability dates for the month and my connection drops, I’d be really annoyed if I had to re-click twenty different time slots from scratch.

**Ryan:** We can implement client-side session caching so your unsubmitted draft availability stays saved in the browser even during temporary network drops.

**Elena:** Oh, that would be wonderful! That’s so thoughtful.

**Ryan:** Overall, Elena, what would make this system a true success for the teaching staff?

**Elena:** If it’s simple, respects our time, and doesn't feel like a chore. If logging my availability and checking my schedule is faster than typing into a spreadsheet, every teacher in the school will gladly embrace it.

**Ryan:** Fantastic. Thank you so much for your openness, Elena. This helps us ensure the teacher interface is truly practical and user-friendly.

**Elena:** You're very welcome, Ryan! All the best with the design!

*(Recording ends.)*

---

## Part 2: Formal Structured Meeting Minutes

### 1. Administrative Overview
- **Session ID:** MIN-02-TCH
- **Date & Time:** Wednesday, 17 September 2026 | 2:00 PM – 3:00 PM SGT (Week 2)
- **Venue:** Music School Staff Lounge / Hybrid Microsoft Teams
- **Chairperson / Lead Interviewer:** Ryan (Requirements & Usability Lead, Group P5-5)
- **Primary Stakeholder / Interviewee:** Elena Lim (Senior Instructor – Piano & Violin)
- **Minute Taker:** Ryan

### 2. Meeting Objectives
1. Understand the teacher lifecycle for submitting monthly teaching availability and weekly job preferences.
2. Elicit requirements for schedule visibility, monthly hour tracking, and compensation target monitoring.
3. Establish operational rules and UI dialog flows for the teacher job rejection mechanism.
4. Define non-functional usability, responsiveness, and performance criteria for mobile usage.

### 3. Key Discussion Points & Operational Findings

#### 3.1 Availability Submission Horizon & Cut-Off Discipline
- Teachers plan their personal and professional commitments **up to 5 weeks in advance**.
- Current availability submission relies on a shared spreadsheet with a strict administrative deadline of **23:59 on the 19th calendar day of each month**.
- Late submissions (post-19th) occur primarily due to genuine personal contingencies (examinations, medical appointments). When submitted late, teachers require a mechanism to flag changes as an exception for manager review without breaking the existing roster.

#### 3.2 Weekly Job Preference Parameters
- Informal messaging currently causes teacher preferences to be lost during peak rostering crunch.
- Teachers require structured preference toggles in the application:
  - **Preferred Days:** Ability to nominate preferred working days vs. rest days.
  - **Lesson Grouping / Clustering:** Strong preference for **back-to-back lessons** over fragmented, unpaid 30-minute or 60-minute gaps.
  - **Preferred Studio:** Option to indicate studio preferences based on acoustic space or instrument nuances.

#### 3.3 Protection of Wellbeing & Mandatory Break Enforcement
- Teaching individual 30-minute lessons demands intense pedagogical focus and auditory concentration.
- Elena strongly endorsed the strict enforcement of the **4.0-hour continuous teaching ceiling**, mandating a minimum **1.0-hour consecutive rest break** before any subsequent teaching block can commence.

#### 3.4 Teacher Schedule & Monthly Workload Visualization
- Teachers currently maintain shadow tallies in personal note apps due to delayed or inaccurate spreadsheet updates.
- The Teacher Portal must provide:
  - Confirmed weekly timetable displaying student name, instrument, lesson time, and assigned studio number.
  - A persistent monthly workload progress indicator displaying:
    - Accumulated hours taught to date.
    - Confirmed upcoming scheduled hours.
    - Variance/delta relative to the teacher's requested monthly workload target.

#### 3.5 Job Rejection Protocol & Manager Warning Dialogue
- Teachers endorse the capability to initiate job rejections directly within the platform, provided it includes an auditable communication bridge.
- **Workflow Mandate:**
  1. Teacher initiates rejection on an assigned lesson slot.
  2. System triggers a mandatory warning modal: *"Staff are advised to consult with management prior to rejecting confirmed assignments."*
  3. Teacher must select a structured Reason Code (e.g., `Personal/Medical Emergency`, `Schedule Clashing`, `Pedagogical Level Mismatch`) and provide explanatory notes.
  4. System transitions lesson status to `Pending Re-allocation` and alerts the on-duty manager. The slot is not deleted.

#### 3.6 Mobile Usability & Technical Resilience
- Primary device during working hours is the smartphone (iOS/Android mobile viewport).
- Desktop usage is restricted to detailed monthly availability submissions from home.
- Form controls must feature large touch targets ($\ge 44 \times 44\,\text{pt}$), zero horizontal scrolling, and rapid sub-second rendering.
- Client-side draft persistence is requested to safeguard multi-cell availability selections against transient Wi-Fi drops.

---

### 4. Derived Requirements & Traceability Matrix

| Requirement ID | Type | Requirement Description | Operational Metric / Verification Standard | Mapped Use Case | Priority |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-06** | Functional | The system shall allow teaching staff to submit and edit their availability grid up to 5 weeks (one month) in advance, enforcing an automated monthly cut-off at 23:59 on the 19th calendar day. | Submissions timestamped $\le 19\text{th } 23:59$ lock directly into roster planning; subsequent edits route to manager exception queue. | UC-08 | High |
| **FR-07** | Functional | The system shall enable teachers to submit structured weekly job preferences, including preferred teaching days, lesson clustering (back-to-back vs spaced), and studio preferences. | Weekly preference parameters captured and displayed within manager allocation matrix. | UC-09 | High |
| **FR-08** | Functional | The system shall provide teachers with a dedicated dashboard displaying their confirmed weekly timetable, assigned studio locations, running monthly hours delivered, and requested target delta. | View updates in real-time upon manager roster publication; displays variance against requested hours. | UC-10 | High |
| **FR-09** | Functional | The system shall allow teachers to initiate a job rejection on an assigned lesson, requiring mandatory warning acknowledgement and selection of a categorized reason code. | System shifts lesson state to `Pending Re-allocation`, retains historical record, and alerts manager. | UC-11 | High |
| **NFR-USE-01** | Usability | The teacher portal, availability submission grid, and schedule views shall render responsively across mobile viewport widths ($375\,\text{px} - 430\,\text{px}$) with $\ge 44 \times 44\,\text{pt}$ touch targets. | Zero horizontal scrollbars, verified across standard mobile Safari and Chrome emulators. | UC-08, UC-10 | High |
| **NFR-REL-01** | Reliability | The availability submission module shall locally cache uncommitted form entries in client session storage, preserving draft data during network disconnections lasting up to 5 minutes. | Disconnecting network mid-entry preserves selected availability slots upon reconnect. | UC-08 | Medium |
| **NFR-PER-01** | Performance | The teacher weekly schedule view and monthly workload summary shall load completely within $\le 1.0\,\text{s}$ under typical wireless network conditions. | Measured from initial HTTP request to full DOM interactive render under $4\text{G}/5\text{G}$ latency. | UC-10 | High |

---

### 5. Action Items & Next Steps
1. **Ryan:** Formulate UI wireframe sketches for the mobile Teacher Landing Page and Availability Grid.
2. **Wei Xiang:** Ensure the rejection reason enumeration (`Medical/Emergency`, `Schedule Clash`, `Skill Mismatch`, `Other`) is integrated into the domain schema.
3. **Yan Qi:** Map teacher availability data structures to ensure compatibility with the manager allocation comparative matrix.
