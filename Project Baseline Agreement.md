# INF2001 Music School Project Baseline Agreement

## 1. Project Problem

The music school needs a better way to plan employee workloads and teaching schedules. Managers must consider:

- Teacher availability
    
- Student availability
    
- Studio availability
    
- Instrument requirements
    
- Staff workload and preferences
    
- School opening hours
    
- Teacher working-hour restrictions
    

The proposed solution is a web-based workload and job-allocation system.

## 2. Main System Goal

The system should allow managers to allocate weekly teaching jobs while helping them quickly see:

- Which teachers are available
    
- How many hours each teacher has been assigned
    
- Which teachers have the lowest workload
    
- Which teachers have more than 40 hours allocated
    
- Staff preferences and locations
    
- Whether rooms and teachers are available
    

Teachers should be able to manage their availability, view assignments, and communicate problems with assigned work.

## 3. Stakeholders and Actors

|   |   |
|---|---|
|Stakeholder / Actor|Main interests|
|Manager|View staff workload, plan schedules, allocate jobs, handle enquiries and student changes|
|Teacher / Staff member|View assignments, submit availability, set preferences, reject unsuitable jobs|
|IT administrator|Add and manage staff and manager accounts|
|Student|Their availability affects lesson scheduling|
|School management|Wants efficient studio usage and staff retention|
|External stakeholders|May impose legal, privacy, or operational constraints|

For the main use-case diagram, the primary actors should be:

- Manager
    
- Teacher/Staff
    
- IT Administrator
    

Students and school management may be secondary or supporting stakeholders unless stakeholder discussions show that they directly use the system.

## 4. Core Functional Requirements

The system must allow:

1. Managers to see staff workload on the landing page.
    
2. Managers to allocate jobs one week at a time.
    
3. Managers to view up to three staff members' availability and relevant information while assigning jobs.
    
4. Managers to see staff availability, assigned workload, job preference, location, and weekly availability.
    
5. Managers to see the three staff members with the lowest workload.
    
6. Managers to see all staff with more than 40 assigned hours highlighted.
    
7. Staff to view weekly job assignments.
    
8. Staff to view their total monthly workload.
    
9. Staff to add and edit availability up to five weeks ahead.
    
10. Staff to submit job preferences for a week.
    
11. Staff to reject assigned jobs after receiving a warning to discuss the matter with the manager.
    
12. IT administrators to add new staff and managers.
    

## 5. Important Business Rules (constraints)

These are constraints

These rules must be reflected in the requirements, use cases, activity diagrams, and later design:

- The school has five studios.
    
- Only one teacher may use a studio at a time.
    
- All studios have a piano.
    
- Only one studio has a drum kit.
    
- Piano, violin, and trumpet lessons can use any studio.
    
- Drum lessons must use the studio with the drum kit.
    
- Each lesson is an individual 30-minute session.
    
- Opening hours are:
    

- Monday-Friday: 9:00 a.m.-9:00 p.m.
    
- Saturday-Sunday: 8:00 a.m.-9:00 p.m.
    

- The school is closed on public holidays.
    
- A teacher may teach for a maximum of four continuous hours.
    
- A teacher must receive at least a one-hour break before another four-hour block.
    
- Monthly workload planning begins on the 20th.
    
- Staff availability should normally be submitted by the 19th.
    
- Late availability requests are handled case by case.
    
- Managers work 43 hours per week.
    
- The school aims to use all studios during opening hours where possible.
    
- The school wants to retain teachers by giving them as many suitable jobs as possible.
    

## 6. Data from the Project Brief

|   |   |   |   |
|---|---|---|---|
|Instrument|Teachers|Enrolled students|New unassigned students|
|Piano|5|168|17|
|Drums|1|26|5|
|Violin|2|38|7|
|Trumpet|1|19|2|

This data helps justify why workload balancing and resource allocation are important.

## 7. Scope Clarification

### In Scope

- Staff availability management
    
- Weekly job allocation
    
- Workload visualisation
    
- Monthly workload summary
    
- Job preferences
    
- Job rejection workflow
    
- Staff and manager account administration
    
- Studio and scheduling constraints
    
- Manager and staff dashboards
    

### Not Clearly Required Yet

Do not automatically add these unless stakeholder engagement confirms them:

- Student login accounts
    
- Student self-service booking
    
- Online payment
    
- Attendance tracking
    
- Payroll processing
    
- Automated optimisation algorithms
    
- Mobile application
    
- Real-time notifications
    
- Full timetable generation without manager approval
    

These can be recorded as future enhancements or out-of-scope items.

## 8. Requirement Conflict to Resolve

There is one wording difference:

- The project description says availability can be provided up to one month earlier.
    
- Initial Requirement 8 says staff can add or edit availability up to five weeks ahead.
    

For this project, use five weeks ahead because it is the more specific requirement. Document this as an agreed clarification after stakeholder engagement so the report does not contain contradictory statements.

## 9. Milestone 1 Deliverables

The first milestone must contain:

- Introduction and team contributions
    
- Plagiarism declaration
    
- AI usage declaration, if applicable
    
- Requirement elicitation process
    
- Software Requirements Specification
    
- Formal use cases
    
- Use-case diagram
    
- Activity diagrams
    
- Key classes and relationships
    
- Sequence diagrams
    
- Work Breakdown Structure
    
- Project timeline
    
- Presentation slides
    

The diagrams and written requirements must all describe the same system. For example, if the requirements say staff can reject assignments, that behaviour should appear in a formal use case and activity diagram.

  

—

  

### 6. How should the "five weeks ahead" rule be reconciled with the description saying "one month earlier"?

ans: 5 weeks is wrong, 1 mth is correct

### 16. Are concise meeting minutes sufficient, or are full interview transcripts required?

ans: don't need full transcripts

### 17. How many formal use cases and diagrams are expected?

ans: ~18 use cases are expected (not more than 20)

### 18. Must sequence diagrams be created for every formal use case?

ans: yes