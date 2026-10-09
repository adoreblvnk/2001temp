Interview qns:

  

Manager:

- Can you describe your current process for tracking & balancing teaching hrs across staff?
    
- What factors & teacher info do you consider when deciding which teacher to assign to a new student / lesson slot
    
- How does the mthly schedule planning timeline work & how do you handle availability details submitted after the planning cutoff
    

  

Teacher:

- How do you currently inform the school of your available teaching hrs & schedule changes for upcoming weeks
    
- In what ways do you communicate your preferences regarding lesson timings, student levels, or instruments to the management
    
- What info do you need to track your confirmed teaching schedule & mthly hrs?
    

  

IT admin:

- How are new staff & manager accounts onboarded, & what type of access permissions should be used
    
- How are physical studio spaces, instrument setups, & facilities be documented & maintained in the system
    

  

Student:

- What is the procedure you want to have to adjust or reschedule your regular 30 min individual lesson
    

  

School management:

- How do you assess whether studio spaces & opening hrs are being used efficiently to maintain operational profitability
    

  

External stakeholders:

- Regulatory compliance: what labor guidelines (eg max working hrs & mandatory rest breaks) must the school monitor & demonstrate compliance with
    

  

General reqs

  

FR:

- The system should have a manager dashboard for top 3 staff with the lowest allocated hours & flag any staff member allocated >40 hrs in a week
    
- The system shall prevent assignments that exceed 4 continuous hrs without a min 1 hr break
    
- The system shall allow teaching staff to submit / modify their available teaching slots for the upcoming mth up to 1 mth in advance, locking submissions after 23:59 on the 19th of the current mth
    

  

NFR

- The dashboard should calculate & render teaching hrs, studio occupancy statuses & workload distribution charts for all staff within 1 sec under a concurrent load of 25 users
    

  

Use cases:

  

* Use Case Name: View Staff Workload & Landing Dashboard

* Priority: High

* Primary Actor: Manager

* Supporting Actor: Central Database

* Brief Description: Manager accesses the manager dashboard for an overview of all staff workloads, identifying under-utilized teachers & teachers exceeding max weekly thresholds

* Preconditions:

    1. Manager is authenticated into the web platform with valid manager credentials.

* Postconditions:

    * Main Success: Dashboard displays all active staff with workload gauges, top 3 lowest workload staff highlighted, and staff over 40 hours flagged in red.

    * Alternative Failure: Error message is presented if database aggregation fails.

  

Main Success Scenario

1. Manager logs into the system landing page.

2. System queries active teacher records, current week job assignments, and total monthly accumulated hours.

3. System sorts teachers by total assigned hours in ascending order and identifies the top 3 teachers with the lowest workload.

4. System identifies all teachers whose total weekly assigned hours exceed 40.0 hours.

5. System renders the visual dashboard featuring:

    * Summary cards of the top 3 least-loaded teachers.

    * Prominent alert banners highlighting teachers exceeding 40 hours.

    * Filterable list of all staff with instrument specializations and current week hours.

6. Manager clicks on an individual teacher to inspect their detailed weekly timetable.

  

Alternative Scenarios

* 2a. System database unavailable or latency timeout:

    * 2a1. System displays cached summary data with a timestamp indicator: "Data as of [timestamp]. Retrying live connection..."

    * 2a2. System attempts automated reconnect in background.

* 3a. Fewer than 3 teachers registered in system:

    * 3a1. System displays all available teachers in the lowest workload section without error.

Non-Functional Requirements

* Landing dashboard query and visual rendering must complete within 1.0 second.

  

* Use Case Name: Allocate Weekly Teaching Job

* Priority: High

* Primary Actor: Manager

* Supporting Actor: Central Database

* Brief Description: Manager selects an unassigned student lesson and assigns it to a qualified, available teacher and studio for a specific 30-minute time slot with break and studio constraints.

* Preconditions:

    1. Manager is authenticated.

    2. Unassigned student lesson request exists.

    3. School schedule for the target week is open for allocation.

* Postconditions:

    * Main Success: Teaching job is assigned, teacher schedule and studio timetable are updated, and remaining unassigned student count is decremented.

    * Alternative Failure: Assignment is rejected if continuous teaching limit is exceeded or studio is occupied.

  

Main Success Scenario

1. Manager navigates to the "Weekly Job Allocation" interface.

2. Manager selects target week, instrument category (Piano, Drums, Violin, Trumpet), and an unassigned student.

3. System displays available 30-minute time slots and eligible teachers qualified for the instrument.

4. Manager selects a time slot, target studio, and a candidate teacher.

5. System validates scheduling business rules:

    * Teacher is marked available for that slot.

    * Teacher will not exceed 4 continuous teaching hours without a 1-hour break.

    * Studio is vacant during the 30-minute window.

    * If lesson is Drums, selected studio is verified as Studio 5 (Drum Studio).

6. System confirms rule validation and updates assignment record with status "Assigned".

7. System updates teacher's weekly accumulated hours and studio timetable.

8. System displays confirmation message: "Lesson successfully allocated."

  

Alternative Scenarios

* 5a. Teacher assignment violates 4-hour continuous teaching rule:

    * 5a1. System blocks assignment and displays alert: "Allocation rejected: Teacher has completed 4 continuous hours. A 1-hour break is required before additional assignments."

    * 5a2. Manager selects an alternative teacher or modifies slot timing.

* 5b. Drum lesson assigned to non-drum studio (Studios 1-4):

    * 5b1. System displays constraint violation: "Drum lessons can only be conducted in Studio 5 (Drum Kit Studio)."

    * 5b2. Manager changes studio selection to Studio 5.

* 5c. Studio double-booking conflict detected:

    * 5c1. System alerts manager that selected studio is already occupied by another teacher.

    * 5c2. Manager selects an alternate vacant studio.

Non-Functional Requirements

* Constraint validation algorithm must execute and return validation status within 300 ms.

  

* Use Case Name: Filter & Compare Staff Availability

* Priority: Medium

* Primary Actor: Manager

* Supporting Actor: Central Database

* Brief Description: Manager selects up to 3 candidate teachers to compare their availability, assigned workload, location, and preferences side-by-side to make optimal job allocations.

* Preconditions:

    1. Manager is on the Job Allocation page.

* Postconditions:

    * Main Success: System displays side-by-side comparative matrix of up to 3 selected teachers.

    * Alternative Failure: System prevents selecting more than 3 teachers simultaneously.

  

Main Success Scenario

1. Manager accesses the teacher candidate list on the Job Allocation page.

2. Manager checks checkboxes for up to 3 candidate teachers.

3. Manager clicks "Compare Selected Staff".

4. System fetches and renders a side-by-side matrix detailing:

    * Weekly allocated hours vs. monthly cap.

    * Submitted availability grid for the active week.

    * Stated job preferences (preferred lesson times and instruments).

    * Teacher's assigned studio/location for adjacent time slots.

5. Manager evaluates candidate metrics and directly clicks "Assign Job to Teacher" on the preferred candidate column.

6. System routes selected teacher into UC-P1-02 (Allocate Weekly Teaching Job).

  

Alternative Scenarios

* 2a. Manager attempts to select more than 3 teachers:

    * 2a1. System disables remaining checkboxes and displays tooltip: "Maximum 3 staff members can be compared simultaneously."

* 4a. Candidate teacher has not submitted availability for selected week:

    * 4a1. System displays "No Availability Submitted" badge in that candidate's column with warning indicator.

Non-Functional Requirements

* Comparison matrix must render within 500 ms of selection.

  
  

* Use Case Name: Submit Monthly Availability Window

* Priority: High

* Primary Actor: Teacher / Staff Member

* Supporting Actor: Central Database

* Brief Description: Teacher inputs their available teaching days and 30-minute time blocks for the upcoming month up to 1 month in advance prior to the 19th monthly cutoff.

* Preconditions:

    1. Teacher is authenticated with teacher role.

    2. Current date is on or before the 19th of the active month (prior to monthly planning on 20th).

* Postconditions:

    * Main Success: Teacher availability records are stored in the database for the upcoming month, and confirmation timestamp is recorded.

    * Alternative Failure: Submission is blocked after cutoff date and redirected to late request workflow.

  

Main Success Scenario

1. Teacher navigates to "My Availability" in teacher portal.

2. System loads calendar view for the upcoming month (up to 1 month ahead).

3. Teacher selects available time blocks (within school opening hours: Mon-Fri 9am-9pm, Sat-Sun 8am-9pm).

4. Teacher marks recurring weekly available slots or sets individual blackout dates.

5. Teacher clicks "Submit Availability".

6. System checks current date is on or before the 19th cutoff.

7. System commits availability data to database and marks status as "Submitted".

8. System displays confirmation banner: "Monthly availability saved successfully."

  

Alternative Scenarios

* 6a. Current date is after the 19th of the month:

    * 6a1. System locks direct calendar editing and displays notice: "Monthly planning cutoff (19th) has passed. Changes must be submitted via Late Availability Request for Manager approval."

    * 6a2. System provides link to Late Request Submission form.

* 3a. Teacher selects time slots outside operating hours (e.g., Weekday 8:00 AM):

    * 3a1. System grays out non-operating hours on the interactive grid preventing selection.

Non-Functional Requirements

* Calendar state commits must persist within 300 ms.

  

* Use Case Name: Submit Weekly Job Preferences

* Priority: Medium

* Primary Actor: Teacher / Staff Member

* Supporting Actor: Central Database

* Brief Description: Teacher indicates specific scheduling preferences for an upcoming week, including target total hours, preferred time blocks within their submitted availability.

* Preconditions:

    1. Teacher is authenticated.

    2. Teacher has already submitted base availability for that month (UC-P1-04).

* Postconditions:

    * Main Success: Preferences are saved and made visible on the manager allocation screen.

    * Alternative Failure: System alerts teacher if preferences contradict submitted availability.

  

Main Success Scenario

1. Teacher navigates to "Weekly Preferences" tab.

2. Teacher selects target week.

3. Teacher indicates scheduling preferences:

    * Preferred time blocks

    * Desired weekly hours target (e.g., 20 hours / week).

    * Preferred continuous teaching block length (e.g., preference for back-to-back 2-hour blocks vs. distributed slots).4. Teacher clicks "Save Preferences".

5. System validates that indicated preferred times fall within submitted availability windows.

6. System persists preferences in teacher profile for that week.

7. System displays success message: "Preferences updated."

  

Alternative Scenarios

* 5a. Preferred time slot contradicts submitted availability:

    * 5a1. System highlights conflicting slot: "You have marked this time slot as unavailable in your monthly calendar."

    * 5a2. Teacher adjusts preference or updates availability window.

Non-Functional Requirements

* Preference update response time must be under 200 ms.

  

* Use Case Name: Create Staff & Manager User Accounts

* Priority: High

* Primary Actor: IT Administrator

* Supporting Actor: Central Database, Central Authentication Service

* Brief Description: IT Administrator provisions new user accounts for teachers and managers, assigning appropriate Role-Based Access Control (RBAC) permissions and initial credentials.

* Preconditions:

    1. IT Administrator is authenticated with administrative root privileges.

* Postconditions:

    * Main Success: User record is created with assigned role (Teacher vs. Manager), instrument qualifications attached, and account activation link dispatched.

    * Alternative Failure: Account creation aborted if institutional email already exists.

  

Main Success Scenario

1. IT Administrator opens "User Management" console.

2. IT Administrator clicks "Create New User".

3. IT Administrator enters user particulars (Full Name, Institutional Email, Contact Number, Role: Teacher or Manager).

4. If role is Teacher, IT Administrator selects qualified instruments (Piano, Drums, Violin, Trumpet).

5. If role is Manager, IT Administrator configures weekly contracted shift hours (43 hours/week).

6. IT Administrator clicks "Provision Account".

7. System validates unique email constraint and generates secure activation token.

8. System saves user record to database and logs creation audit event.

9. System displays success confirmation and presents one-time temporary activation credentials.

  

Alternative Scenarios

* 7a. Duplicate email address detected:

    * 7a1. System rejects submission: "An account with this email address already exists."

    * 7a2. IT Administrator updates email or navigates to existing profile to edit.

* 4a. Teacher created with zero instrument qualifications selected:

    * 4a1. System prompts: "At least one instrument qualification must be selected for teaching staff."

    * 4a2. IT Administrator selects appropriate instrument(s).

Non-Functional Requirements

* Password storage must enforce Argon2id or bcrypt hashing with minimum cost factor 12.

  

* Use Case Name: Configure Studio & Instrument Metadata

* Priority: Medium

* Primary Actor: IT Administrator

* Supporting Actor: Central Database

* Brief Description: IT Administrator configures physical studio profiles (Studios 1 to 5), assigns fixed instrument equipment (Piano in Studios 1-5, Drum Kit in Studio 5 only), and operational constraints.

* Preconditions:

    1. IT Administrator is authenticated.

* Postconditions:

    * Main Success: Studio metadata and equipment profiles are updated in system configuration table.

    * Alternative Failure: System prevents removing mandatory equipment profiles assigned to active classes.

  

Main Success Scenario

1. IT Administrator navigates to "System Settings -> Studio Configuration".

2. System displays current 5 studios and assigned instrument profiles.

3. IT Administrator selects a studio (e.g., Studio 5) to review or modify properties (Studio Name, Capacity: 1 Teacher + 1 Student, Equipped Instruments: Piano + Drum Kit).

4. IT Administrator verifies operational hours mapping (Mon-Fri 9:00-21:00, Sat-Sun 8:00-21:00).

5. IT Administrator clicks "Save Studio Configuration".

6. System validates that drum kit remains assigned exclusively to Studio 5.

7. System commits configuration and logs administrative update.

8. System displays confirmation message: "Studio metadata updated successfully."

  

Alternative Scenarios

* 6a. Attempt to assign drum kit to Studio 1-4 without infrastructure flag:

    * 6a1. System alerts admin: "School profile specifies only Studio 5 has acoustic drum soundproofing."

    * 6a2. Admin confirms override or cancels change.

Non-Functional Requirements

* Configuration changes must propagate to scheduling constraint engine in real time without system restart.

  

- Use Case Name: Process Student Lesson Reschedule Request
    
- Priority: Medium
    
- Primary Actor: Manager (handling offline student request)
    
- Supporting Actor: Central Database
    
- Brief Description: Manager processes a student's offline request (received via front desk or phone) to reschedule an upcoming 30-minute individual lesson to a new available time slot.
    
- Preconditions:
    

- Manager is authenticated.
    
- Student has an active confirmed lesson booking.
    

- Postconditions:
    

- Main Success: Original lesson slot is vacated and the lesson is rescheduled to the new valid time slot.
    
- Alternative Failure: Original booking remains unchanged if no valid alternative slot is chosen.
    

#### Main Success Scenario

1. Manager searches for the student record by name or contact number.
    
2. System displays the student's active lesson details (teacher, instrument, studio, time).
    
3. Manager selects "Reschedule Lesson" and chooses the requested new date and time.
    
4. System validates that the assigned teacher and studio are available for the new slot.
    
5. Manager confirms the schedule change.
    
6. System updates the lesson booking and clears the old time slot.
    
7. System displays confirmation message: "Lesson successfully rescheduled."
    

#### Alternative Scenarios

- 4a. Target teacher or studio unavailable at new requested time:
    

- 4a1. System alerts manager of slot conflict and shows next available openings.
    
- 4a2. Manager selects an alternative available slot or keeps current booking.
    

#### Non-Functional Requirements

- Reschedule validation and database update must complete within 300 ms.
    

  

* Use Case Name: Generate Monthly Studio Utilization Report

* Priority: High

* Primary Actor: School Management

* Supporting Actor: Central Database, Reporting Engine

* Brief Description: School Management generates comprehensive analytical reports tracking studio occupancy percentages against opening hours, teacher utilization rates, and unassigned student demand.

* Preconditions:

    1. School Management user is authenticated with executive reporting role.

* Postconditions:

    * Main Success: Aggregated report is rendered with studio utilization charts, revenue estimates, and exported to PDF/CSV.

    * Alternative Failure: System indicates insufficient data if selected date range has no logged schedules.

  

Main Success Scenario

1. School Management user navigates to "Executive Analytics -> Studio Utilization".

2. User selects reporting timeframe (e.g., Target Month / Trimester).

3. System aggregates total available operating hours across all 5 studios:

    * Weekdays: 12 hours/day (9am-9pm) x 5 studios = 60 studio hours/day.

    * Weekends: 13 hours/day (8am-9pm) x 5 studios = 65 studio hours/day.

4. System calculates total booked lesson hours, vacant studio hours, and utilization percentage per studio.

5. System breaks down demand by instrument (Piano: 168 enrolled + 17 unassigned; Drums: 26 + 5; Violin: 38 + 7; Trumpet: 19 + 2).

6. System renders visual charts displaying peak utilization hours and capacity bottlenecks.

7. User clicks "Export Executive Summary (PDF)".

8. System compiles and downloads standardized report document.

  

Alternative Scenarios

* 3a. Selected date range includes public holidays:

    * 3a1. System automatically excludes closed public holiday hours from total available capacity denominator.

    * 3a2. System notes public holiday closures in report footer.

Non-Functional Requirements

* Multi-month aggregated utilization report must generate within 2.0 seconds.

  

* Use Case Name: Audit Teacher Working Hours for Regulatory Compliance

* Priority: High

* Primary Actor: External Stakeholders (MOM Auditor / Compliance Officer)

* Supporting Actor: Central Database, Audit Subsystem

* Brief Description: External compliance auditor or internal compliance officer inspects time logs and lesson allocations to verify adherence to Ministry of Manpower (MOM) working hour caps and mandatory rest intervals.

* Preconditions:

    1. Compliance officer is authenticated with read-only audit privileges.

* Postconditions:

    * Main Success: Audit report is generated confirming zero instances of unmandated continuous work (>4 hours) and verification of 43-hour manager shifts.

    * Alternative Failure: System flags compliance breaches with detailed timestamps.

  

Main Success Scenario [??? assumption]

1. Auditor opens "Regulatory Compliance Audit Portal".

2. Auditor specifies audit timeframe and employee filter (All Teachers vs. Shift Managers).

3. System extracts all executed and scheduled lesson blocks.

4. System executes verification algorithms:

    * Flags any continuous teaching stretch exceeding 4.0 hours without >= 60-minute gap.

    * Verifies all teachers allocated >40 hours possess logged overtime consent.

    * Verifies shift managers do not exceed 43 hours/week schedule.

5. System renders compliance audit summary table.

6. Auditor inspects individual anomaly records (if any) with full schedule timeline.

7. Auditor clicks "Export Digitally Signed Audit Certificate".

8. System generates tamper-evident audit export with SHA-256 integrity hash.

  

Alternative Scenarios

* 4a. System detects break violation in historical logs:

    * 4a1. System marks record with red "NON-COMPLIANCE" tag detailing teacher ID, date, continuous duration, and assigning manager ID.

    * 4a2. System includes incident explanation in compliance report.

Non-Functional Requirements

* Audit trail logs must be immutable (write-once, read-many) and verifiable via cryptographic checksums.

  

??? denotes that this AI-generated content may be excessive or irrelevant