# wInterview qns

  

## Manager: 3 qn

- When two teachers are both qualified for an instrument and both free for the same slot, what makes you pick one over the other?
    
- Availability that arrives after the 19th is handled "case by case". What are you weighing when you decide to accept it or not?
    
- When a teacher rejects a job after the schedule is published, what has to happen next?
    

  

## Teacher: 2 qn

- How do you tell the school when you're free or when something changes?
    
- Before you commit your availability for next month, what do you need to know or see?
    

## IT Admin: 2 qn

- What should each role be able to see about each other? Can a teacher view their colleagues’ schedule or availability?
    
- What happens when a teacher leaves mid-month, or becomes qualified for a second instrument? Who updates the system and what happens to the lessons already assigned to them?
    

## School management: 1 qn

- How do you tell whether the schedule went well at the end of the month? And when keeping the studios full clashes with giving teachers the hours they asked for, which side do you compromise?
    

  
  
  
  
  
  
  

# General reqs

## Functional Requirements 

FR01:

The system shall allow a teacher to reject an assigned lesson, requiring them to select a reason and acknowledge an on-screen warning to discuss the matter with their manager before the rejection is submitted. On submission, the system shall set the lesson status to Unassigned, remove it from the teacher's timetable, release the studio slot, and add the lesson to the manager's outstanding re-allocation list. 

  

FR02:

When allocating a lesson for a student who has an existing teacher assignment from a previous month, the system shall identify that teacher as the Continuing Teacher on the allocation screen and display a warning if the manager assigns the student to a different teacher.

  

FR03:

The system shall restrict access by role. 

  

A Manager may view all staff availability, workload and preferences. A Teacher may view only their own schedule, workload and preferences, and shall not be able to view any other teacher's individual hours or availability. An IT Administrator may manage user accounts and studio configuration but shall not view or modify lesson allocations.

  

## Non-Functional Requirements 

NFR01:

Every allocation, rejection and availability change shall be recorded with actor identity, timestamp and before/after values, and audit records shall be retained for at least 12 months and be non-editable through the application interface. 

  
  
  
  
  
  
  
  
  

# Use cases:

### UC-01: Re-allocate Rejected Lesson

  

|   |   |
|---|---|
|Priority|High|
|Primary Actor|Manager|
|Supporting Actor|Central Database|
|Brief Description|Manager reviews a lesson released by a teacher's rejection and assigns it to an alternative qualified teacher, taking the student's previous teacher into account where possible.|
|Preconditions|- Manager is authenticated with valid manager credentials.<br>    <br>- At least one lesson has status Unassigned as a result of a teacher rejection.|
|Postconditions|- Main Success: Lesson is assigned to a new teacher, the studio slot is booked, and the item is cleared from the outstanding re-allocation list.<br>    <br>- Alternative Failure: Lesson remains Unassigned and stays on the re-allocation list if no valid teacher is available.|

  

Main Success Scenario

  

1. Manager opens the "Outstanding Re-allocations" panel from the dashboard.
    
2. The system lists all rejected lessons with student name, instrument, original time slot, rejecting teacher, and rejection reason.
    
3. The manager selects a lesson to re-allocate.
    
4. The system displays teachers qualified for the instrument who are available for that slot, and marks the student's Continuing Teacher from the previous month where one exists.
    
5. The manager selects a replacement teacher.
    
6. The system validates that the teacher is available, will not breach the 4-hour continuous teaching limit, and that a suitable studio is vacant.
    
7. The system updates the lesson to Assigned, books the studio, and recalculates the teacher's weekly hours.
    
8. System removes the lesson from the outstanding re-allocation list and confirms: "Lesson re-allocated successfully."
    

  

Alternative Scenarios

- No qualified teacher is available for the original slot:
    

- System displays: "No qualified teacher is available at this time. Try an alternative slot or contact the student."
    
- Manager searches alternative slots or leaves the lesson unassigned for later follow-up.
    

- Manager assigns a teacher other than the student's Continuing Teacher:
    

- The system displays a warning: "This student has been taught by [Teacher] since [month]. Continue with a different teacher?"
    
- The manager confirms the change or selects the continuing teacher instead.
    

- Selected teacher would exceed the 4-hour continuous teaching limit:
    

- The system blocks the assignment and states the break requirement.
    
- The manager selects a different teacher or slot.
    

  
  

Non-Functional Requirements

The list of eligible replacement teachers must be returned within 500 ms.

### UC-02: Review Late Availability Request

-   
    

|   |   |
|---|---|
|Priority|Medium|
|Primary Actor|Manager|
|Supporting Actor|Central Database|
|Brief Description|The manager reviews availability changes submitted after the monthly cutoff and decides case by case whether to accept them into the planning cycle.|
|Preconditions|- The manager is authenticated.<br>    <br>- At least one Late Availability Request is pending review.|
|Postconditions|- Main Success: Request is approved and the teacher's availability is updated, or rejected with a recorded reason; the teacher is notified of the outcome either way.<br>    <br>- Alternative Failure: Request cannot be approved if the change conflicts with lessons already assigned to that teacher.|

Main Success Scenario

1. Manager opens the "Late Availability Requests" queue.
    
2. The system lists pending requests with the teacher name, affected dates, requested change, reason given, and submission timestamp.
    
3. Manager selects a request to review.
    
4. The system displays the teacher's current availability alongside the requested change, and highlights any lessons already assigned in the affected slots.
    
5. The manager approves or rejects the request, entering a comment where appropriate.
    
6. On approval, the system updates the teacher's availability for the affected month and records the decision with the deciding manager's identity and timestamp.
    
7. The system notifies the teacher of the outcome and removes the request from the queue.
    

Alternative Scenarios

- Requested change removes availability from slots that already have lessons assigned:
    

- The system lists the affected lessons and warns that approving will release them for re-allocation.
    
- The manager approves and the affected lessons are set to Unassigned, or reject the request.
    

- Manager rejects the request:
    

- The system requires a reason before submission, records it, and retains the teacher's original availability unchanged.
    

Non-Functional Requirements

All approve/reject decisions must be written to the audit log with actor identity, timestamp, and before/after availability values.

### UC-03: Publish Weekly Roster to Staff

-   
    

|   |   |
|---|---|
|Priority|High|
|Primary Actor|Manager|
|Supporting Actor|Central Database|
|Brief Description|Manager finalises a week's allocations and publishes the roster, making it visible to teachers and eligible for rejection requests.|
|Preconditions|- The manager is authenticated.<br>    <br>- The target week contains at least one allocated lesson and is in Draft status.|
|Postconditions|- Main Success: Week is set to Published, teachers can view their assignments, and the rejection window opens.<br>    <br>- Alternative Failure: Week remains in Draft if unresolved constraint violations exist.|

Main Success Scenario

1. The manager opens the weekly roster for the target week.
    
2. Manager selects "Review and Publish".
    
3. The system runs a pre-publication check across the week for: unassigned lessons, teachers exceeding 40 allocated hours, continuous-teaching breaches, and double-booked studios.
    
4. The system displays a summary of the check results.
    
5. Manager reviews the summary and confirms publication.
    
6. The system sets the week status to Published, records the publishing manager and timestamp, and makes assignments visible to each teacher.
    
7. System confirms: "Week of [date] published to staff."
    

Alternative Scenarios

- One or more teachers exceed 40 allocated hours:
    

- The system highlights the affected teachers as an advisory warning, not a block, in line with school policy.
    
- Manager acknowledges the warning and proceeds, or returns to adjust allocations.
    

- Continuous-teaching breach or studio double-booking detected:
    

- System blocks publication and lists each violating lesson with a link to correct it.
    
- The manager resolves the conflicts and re-runs the check.
    

- Week has already been published and is being republished after edits:
    

- The system records a new version and notifies only the teachers whose assignments changed.
    

Non-Functional Requirements

The pre-publication constraint checks across a full week and all five studios must complete within 2.0 seconds.

### UC-04: Reject Assigned Lesson

-   
    

|   |   |
|---|---|
|Priority|High|
|Primary Actor|Teacher|
|Supporting Actor|Central Database|
|Brief Description|The teacher declines a lesson assigned to them, after being warned to discuss the matter with their manager first, releasing the lesson for re-allocation.|
|Preconditions|- The teacher is authenticated.<br>    <br>- The lesson is assigned to that teacher, belongs to a published week, and has not yet taken place.|
|Postconditions|- Main Success: Lesson status becomes Unassigned, the slot and studio are released, the teacher's hours are recalculated, and the lesson appears on the manager's re-allocation list.<br>    <br>- Alternative Failure: Assignment remains unchanged if the teacher cancels at the warning step.|

Main Success Scenario

1. The teacher opens their weekly schedule and selects an assigned lesson.
    
2. The teacher selects "Reject this assignment".
    
3. The system displays a warning advising the teacher to discuss the assignment with their manager before proceeding, and requires explicit acknowledgement.
    
4. Teacher acknowledges the warning and selects a rejection reason from a predefined list, with an optional comment.
    
5. The teacher confirms the rejection.
    
6. System sets the lesson to Unassigned, removes it from the teacher's timetable, and releases the studio booking.
    
7. The system recalculates the teacher's weekly and monthly totals and adds the lesson to the manager's outstanding re-allocation list.
    
8. System confirms: "Assignment rejected. Your manager has been notified."
    

Alternative Scenarios

- Teacher cancels at the warning dialogue:
    

- The system closes the dialogue and leaves the assignment unchanged.
    

- Teacher submits without selecting a reason:
    

- The system prevents submission and prompts: "Please select a reason for rejecting this assignment."
    

- Lesson is scheduled within the next 24 hours:
    

- The system disables self-service rejection and displays: "Assignments within 24 hours must be raised with your manager directly."
    

Non-Functional Requirements

Every rejection must be recorded in the audit log with teacher identity, lesson reference, reason, and timestamp, retained for at least 12 months.

### UC-05: View Weekly Schedule and Monthly Workload

-   
    

|   |   |
|---|---|
|Priority|High|
|Primary Actor|Teacher|
|Supporting Actor|Central Database|
|Brief Description|Teachers view their confirmed assignments for a selected week alongside their accumulated workload for the month on their landing page.|
|Preconditions|- The teacher is authenticated.|
|Postconditions|- Main Success: Teacher's weekly timetable and monthly workload totals are displayed; no data belonging to other teachers is shown.<br>    <br>- Alternative Failure: An informative empty state is shown where the week has not yet been published.|

Main Success Scenario

1. The teacher logs in and arrives at the teacher landing page.
    
2. The system retrieves the teacher's assignments for the current week and their accumulated hours for the current month.
    
3. The system renders a weekly timetable showing, for each lesson: day, 30-minute time slot, student name, instrument, and studio.
    
4. The system displays monthly workload totals, including hours taught to date, hours remaining as scheduled, and a comparison against the teacher's stated preferred weekly hours.
    
5. The teacher navigates between weeks within the published horizon.
    
6. The teacher selects a lesson to view its detail, from where a rejection may be initiated (UC-04).
    

Alternative Scenarios

- Selected week has not been published by the manager:
    

- System displays: "The roster for this week has not been published yet."
    

- Teacher has no assignments in the selected week:
    

- The system displays an empty timetable with a prompt to review their submitted availability.
    

Non-Functional Requirements

The landing page must render the weekly timetable and monthly totals within 1.0 second, and must expose no data relating to any other member of staff.

### UC-06: Deactivate Staff Account

-   
    

|   |   |
|---|---|
|Priority|Medium|
|Primary Actor|IT Administrator|
|Supporting Actor|Central Database, Central Authentication Service|
|Brief Description|IT Administrator deactivates a departing member of staff, revoking access while preserving historical records and flagging their future lessons for re-allocation.|
|Preconditions|- IT Administrator is authenticated with administrative privileges.<br>    <br>- The target account exists and is currently active.|
|Postconditions|- Main Success: Account is Inactive, access is revoked, the teacher is excluded from future allocation, and their future lessons are flagged Requires Re-allocation.<br>    <br>- Alternative Failure: Account remains active if the administrator cancels at the impact confirmation step.|

Main Success Scenario

1. The IT Administrator opens the "User Management" console and searches for the staff member.
    
2. The IT Administrator selects the account and chooses "Deactivate Account".
    
3. The system displays an impact summary: number of future assigned lessons, affected students, and the last working date field.
    
4. The IT Administrator enters the effective date and confirms deactivation.
    
5. The system sets the account to Inactive and revokes active sessions and login access.
    
6. The system excludes the teacher from all future allocation candidate lists.
    
7. System flags the teacher's lessons on or after the effective date as Requires Re-allocation on the manager dashboard.
    
8. System retains all historical records for reporting and audit, and confirms: "Account deactivated. [n] future lessons flagged for re-allocation."
    

Alternative Scenarios

- Account is the only teacher qualified for an instrument:
    

- The system displays a prominent warning that no other qualified teacher exists for that instrument, and lists the affected students.
    
- IT Administrator proceeds or cancels pending discussion with management.
    

- IT Administrator cancels at the impact summary:
    

- The system closes without change and the account remains active.
    

- Target account is the last remaining active manager:
    

- System refuses deactivation: "At least one active manager account must be retained."
    

Non-Functional Requirements

Deactivation must revoke all active sessions within 60 seconds, and the account record must be retained rather than deleted to preserve referential integrity of historical allocations.

### UC-07: Manage Role Permissions

-   
    

|   |   |
|---|---|
|Priority|Medium|
|Primary Actor|IT Administrator|
|Supporting Actor|Central Database|
|Brief Description|IT Administrator reviews and adjusts the permissions attached to each system role, controlling what workload and availability data each role may access.|
|Preconditions|- IT Administrator is authenticated with administrative privileges.|
|Postconditions|- Main Success: Updated role definitions are saved and enforced on subsequent user requests.<br>    <br>- Alternative Failure: Changes are rejected where they would remove a permission essential to a role's core function.|

Main Success Scenario

1. IT Administrator navigates to "System Settings → Roles and Permissions".
    
2. The system displays the defined roles (Manager, Teacher, IT Administrator, School Management) with their current permissions.
    
3. The IT Administrator selects a role to review.
    
4. The system displays the permission set for that role, grouped by area: own schedule, all staff schedules, allocation, availability approval, reporting, and user administration.
    
5. IT Administrator adjusts permissions and saves the change.
    
6. The system validates that the resulting configuration does not remove any permission marked as essential to the role.
    
7. The system saves the role definition, logs the change with administrator identity and timestamp, and confirms: "Role permissions updated."
    

Alternative Scenarios

- Change would grant the Teacher role visibility of other teachers' individual hours:
    

- System warns that this conflicts with the school's staff data-privacy position and requires explicit confirmation before saving.
    

- Change would remove an essential permission, such as allocation rights from the Manager role:
    

- The system rejects the change: "This permission is required for the Manager role and cannot be removed."
    

- A user of the affected role is currently signed in:
    

- The system applies the revised permissions on that user's next request rather than terminating their session.
    

Non-Functional Requirements

Revised permissions must take effect on all subsequent requests within 30 seconds of being saved, without requiring a system restart.

### UC-08: Review Monthly Workload Distribution and Teacher Retention

-   
    

|   |   |
|---|---|
|Priority|Medium|
|Primary Actor|School Management|
|Supporting Actor|Central Database, Reporting Engine|
|Brief Description|School Management reviews how fairly workload was distributed across teaching staff for a completed month and how closely allocations matched the hours teachers requested, to support the school's teacher-retention aim.|
|Preconditions|- School Management user is authenticated with reporting privileges.<br>    <br>- At least one completed month of allocation data exists.|
|Postconditions|- Main Success: A workload distribution and preference-fulfilment summary is displayed for the selected month and may be exported.<br>    <br>- Alternative Failure: System reports insufficient data where the selected month contains no allocations.|

Main Success Scenario

1. School Management user navigates to "Reports → Workload Distribution".
    
2. The user selects a completed month.
    
3. System aggregates, per teacher: total hours allocated, hours requested as a preference, fulfilment percentage, and number of rejected assignments.
    
4. The system calculates the spread of allocated hours across teaching staff and identifies teachers whose fulfilment fell furthest below their requested hours.
    
5. System renders the distribution alongside a summary of rejection reasons for the month.
    
6. The user selects "Export Summary" to download the report.
    

Alternative Scenarios

- Selected month has no recorded allocations:
    

- System displays: "No allocation data available for the selected month."
    

- One or more teachers received no allocations in the month:
    

- The system lists them separately as a retention risk rather than reporting a zero fulfilment percentage.
    

Non-Functional Requirements

The monthly aggregation must complete within 2.0 seconds, and the report must present only aggregated and per-teacher workload figures, excluding student personal details.