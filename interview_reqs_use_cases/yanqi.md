Interview qns

Manager

Can you walk me through your current process when planning teacher schedules?

When a teacher says that they cannot do an assigned lesson how is that currently handled?

When you assign lessons to studios, how do you decide which staff members to choose or compare and what information do you think is most critical for making the assignment?

If a teacher is already assigned 40 hours in a week, should the system strictly block you from assigning them another lesson or should it only display a warning highlight?

  

Teacher

Could you describe how you normally plan and submit your working availability?

What happens if your availability changes unexpectedly after the 19th cut-off date?

When you choose a job preference for the week, what kind of preferences do you usually choose from? e.g. preferred days, back-to-back lessons

  

Student

Can you describe how you find out about the weekly 30-minute lesson timings?

  

IT Administrator

Can you describe your current process for onboarding new employees?

When a teacher or manager leaves the music school, what do you do with their information? E.g. information as in classes taught by teachers

  

School Management

What summary metrics or performance reports does school management need to see from the system to track profitability and room utilisation?

  

External Stakeholders

how do you currently coordinate with the school to service the instruments?

  
  
  

General requirements

FR1

The system shall display a landing page dashboard for managers showing each teacher's current weekly and monthly allocated hours

  

FR2

The system shall allow teachers to submit and edit their availability up to one month in advance via a mobile-friendly interface. Submissions made after the 19th of each month shall be flagged for case-by-case manager review.

  

FR3

The system shall generate a monthly schedule assigning 30-minute lessons to studios and teachers

  

NFR1

The system shall respond within 2 seconds

  

Use cases

  

UC-01: View Workload Dashboard

  

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-MGR-01|
|Use Case Name|View Workload Dashboard|
|Description|Manager views a colour-coded overview of all teachers' workload, availability, and scheduling conflicts on the landing page.|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in. Teachers have submitted availability and/or have assigned jobs.|
|Main Success Scenario|1. Manager opens the landing page. <br><br>2. System displays a list of all teachers <br><br>3. System highlights the top 3 teachers with the lowest current workload.<br><br>4. System flags any teachers at or over 40 hours with a warning indicator.<br><br>5. Manager selects a teacher to view their weekly hours, monthly total, instrument qualifications, and stated preferences.|
|Alternative Scenarios|5a. Manager filters by instrument or by availability status to narrow the view.|
|Post-conditions|The manager has a clear, up-to-date picture of staff workload and can make informed scheduling decisions.|
|Priority|High|
|Non-Functional Requirements|Dashboard must load and display workload data within 2 seconds.|

  

  

UC-02: Teacher Job Allocation

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-MGR-02|
|Use Case Name|Allocate Jobs to Teachers|
|Description|Manager assigns teachers to lesson slots for a given week while respecting studio, qualification, and workload constraints.|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in. Teacher availabilities for the period are submitted. Student enrolment data exists.|
|Main Success Scenario|1. Manager selects a week to allocate. <br><br>2. System displays available studios, teachers, and students needing assignment. <br><br>3. Manager selects a lesson slot (day, time, instrument, student).<br><br>4. System shows up to 3 qualified and available teachers for that slot, sorted by workload (lowest first) and preference match<br><br>5. Manager selects a teacher and confirms the assignment.<br><br>6. System updates the teacher's workload and studio schedule, and flags any emerging conflicts|
|Alternative Scenarios|5a. If the selected teacher is at 40+ hours, system displays a warning but allows the manager to proceed with explicit confirmation. <br><br>5b. If no qualified teacher is available, system suggests placing the student on a waitlist. <br><br>5c. If the slot conflicts with an existing booking, system alerts the manager and suggests an alternative studio or time.|
|Post-conditions|The lesson is assigned. Teacher's workload is updated. Any conflicts are flagged or resolved.|
|Priority|High|
|Non-Functional Requirements|nil|

UC-03: Late Availability Submission Handling

  

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-MGR-03|
|Use Case Name|Late Availability Submission Handling|
|Description|Manager reviews and decides on a teacher's availability submission received after the 19th deadline.|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in. The monthly planning cycle has already begun|
|Main Success Scenario|1. System detects a late availability submission and flags it for the manager. <br><br>2. System displays the teacher's new availability alongside their currently proposed/confirmed schedule. <br><br>3. System shows which existing slots would be displaced or affected by accepting the late submission. <br><br>4. Manager reviews the impact and decides to accept or reject. <br><br>5a. If accepted: system updates the schedule, flags any displaced slots for re-allocation, and notifies affected parties. <br><br>5b. If rejected: system keeps the existing schedule, and the teacher is informed.|
|Alternative Scenarios|4a. If the teacher has rarely missed deadlines in the past and the change is small, manager is more likely to accept (system could show the teacher's submission history to assist).|
|Post-conditions|The availability is either integrated into the schedule or the existing plan is preserved. The manager has made a deliberate, informed decision.|
|Priority|Medium|
|Non-Functional Requirements|Impact of the late submission on existing slots must be displayed clearly before the manager decides.|

UC-04: Submit Weekly Availability

  

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-TCH-01|
|Use Case Name|Submit Weekly Availability|
|Description|Teacher submits and edits their availability preferences for the upcoming month via a calendar interface.|
|Primary Actor|Teacher|
|Pre-conditions|Teacher is logged in. The availability window is open (up to one month before the planning period).|
|Main Success Scenario|1. Teacher opens the availability submission page. <br><br>2. System displays a calendar view for the upcoming month with available time slots. <br><br>3. Teacher marks available days and times, and optionally adds preferences<br><br>4. System validates the submission against the 19th deadline.<br><br>5. Teacher confirms and submits. <br><br>6. System saves the availability and confirms receipt.|
|Alternative Scenarios|4a. If submission is made before the 19th: system accepts normally. 4b. If submission is made on or after the 19th: system flags it as late and notifies the teacher that it will require manager approval.|
|Post-conditions|Teacher's availability is recorded in the system and available for manager planning.|
|Priority|High|
|Non-Functional Requirements|Auto-save must preserve partially completed submissions in case of connection loss.<br><br>Teachers may only view and edit their own availability; no access to other teachers' data.|

UC-05: View Weekly Schedule and Monthly Workload

  

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-TCH-02|
|Use Case Name|View Weekly Schedule and Monthly Workload|
|Description|Teacher views confirmed lesson slots for the current week and tracks total allocated hours for the month.|
|Primary Actor|Teacher|
|Pre-conditions|Teacher is logged in. The weekly schedule has been published by the manager.|
|Main Success Scenario|1. Teacher opens their landing page. <br><br>2. System displays the confirmed lesson slots for the current week (day, time, studio, student/instrument). <br><br>3. System displays the running total of allocated hours for the month so far. <br><br>4. System compares the allocated hours against the teacher's originally requested hours. <br><br>5. Teacher can navigate to previous or upcoming weeks to check future assignments.|
|Alternative Scenarios|5a. If the schedule has not yet been published, system displays a message indicating the schedule is pending.|
|Post-conditions|Teacher has a clear view of their weekly commitments and monthly workload status.|
|Priority|High|
|Non-Functional Requirements|Schedule must reflect the latest published version without requiring a manual refresh. <br><br>Monthly hour total must be displayed prominently without needing to calculate or navigate away.|

  

UC-06: Onboard New Staff Member

  

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-IT-01|
|Use Case Name|Onboard New Staff Member|
|Description|IT Administrator creates a new staff account with the correct role, qualifications, and permissions.|
|Primary Actor|IT Administrator|
|Pre-conditions|IT Admin is logged in. The manager has informed IT of the new staff member.|
|Main Success Scenario|1. IT Admin navigates to the staff management page. <br><br>2. IT Admin selects "Add New Staff." <br><br>3. System displays a form requiring: name, staff ID, contact information, role, start date, and qualified instruments (for teachers). <br><br>4. IT Admin fills in the details and submits. <br><br>5. System creates the account and assigns the appropriate role and permissions. <br><br>6. System confirms the new staff member has been added.|
|Alternative Scenarios|4a. If a required field is missing or invalid, system displays an error and prompts for correction. <br><br>4b. If the staff ID already exists, system rejects the submission and notifies the IT Admin.|
|Post-conditions|New staff member's account exists in the system. They can log in and submit their availability (teachers) or access management features (managers).|
|Priority|Medium|
|Non-Functional Requirements|Only IT Administrators may create or modify staff accounts. Role-based access control must enforce permissions per role<br><br>Staff ID must be unique; duplicate entries must be rejected. <br><br>Staff personal data must be handled in accordance with Singapore's PDPA.|

  

UC-07: Manage Studio Resources

|   |   |
|---|---|
|Field|Detail|
|Use Case ID|UC-IT-02|
|Use Case Name|Manage Studio Resources|
|Description|IT Administrator maintains the list of studios, their equipment, and availability status.|
|Primary Actor|IT Administrator|
|Pre-conditions|IT Admin is logged in.|
|Main Success Scenario|1. IT Admin navigates to the studio management page. <br><br>2. System displays a list of all current studios with their equipment details and active/inactive status. <br><br>3. IT Admin selects an action: add, edit, or deactivate a studio. <br><br>4a. Add: IT Admin enters studio name, equipment (e.g. piano, drum kit), and capacity. System creates the studio. <br><br>4b. Edit: IT Admin updates equipment or details. System saves changes. <br><br>4c. Deactivate: IT Admin marks the studio as unavailable for a specified period (e.g. renovation). System removes it from available options during that period. <br><br>5. System confirms the change.|
|Alternative Scenarios|4c. After the deactivation period ends, IT Admin can reactivate the studio without recreating it.|
|Post-conditions|Studio list is up to date. Managers can only assign lessons to active studios that meet equipment requirements.|
|Priority|Medium|
|Non-Functional Requirements|Changes to studio availability must propagate immediately to the scheduling system. <br><br>Deactivated studios must not appear as options during job allocation for the specified period.|

  

UC-08: Generate Monthly Operations Report

  

|                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Field                       | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Use Case ID                 | UC-SM-01                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Use Case Name               | Generate Monthly Operations Report                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Description                 | School Management reviews monthly studio utilisation, teacher workload, and scheduling performance through a generated report.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Primary Actor               | School Management                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Pre-conditions              | School Management is logged in. At least one month of schedule data exists.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Main Success Scenario       | 1. School Management navigates to the reports page and selects a month.<br><br>2. System generates a report showing: <br><br>(a) studio utilisation by day, time, and instrument; <br><br>(b) scheduled vs. available lesson slots; <br><br>(c) teacher workload — requested vs. allocated hours per teacher;<br><br>(d) number of cancellations, reschedules, and unassigned students; <br><br>(e) top 3 busiest and lowest-utilised time periods. <br><br>3. System highlights any lessons lost due to unavailable teachers or rooms. <br><br>4. School Management reviews the report. |
| Alternative Scenarios       | 3a. School Management can compare the current month against previous months to identify trends.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Post-conditions             | School Management has a clear picture of operational performance and can make data-driven decisions about staffing, studio use, and scheduling policies.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Priority                    | Low                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Non-Functional Requirements | Report figures must match the underlying schedule data exactly<br><br>Report generation must complete within 10 seconds for any given month.<br><br>Historical schedule data must be retained for at least 12 months to enable trend comparison.                                                                                                                                                                                                                                                                                                                                         |