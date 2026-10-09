# Interview Questions

As a…I want to…so that…

  

Manager (>3)

1. How do you currently track and manage teacher workloads each month? What tools or methods are used?

2. What information do you need at a glance when allocating jobs to teachers for the weekly schedule?

3. How do you handle cases where teachers miss the 19th deadline for submitting availability?

4. What is your preferred way to visualize staff workload, like charts, tables, or colour-coded indicators?

5. How do you decide which teacher to assign when multiple teachers are available for the same slot?

  
  

Teacher (>2)

1. How far in advance do you typically know your availability, and would 4 weeks be sufficient?

2. What factors influence your decision to reject an assigned job, and how would you prefer to communicate this?

3. How do you currently check your weekly schedule and monthly workload?

  
  

IT Admin (>2)

1. What authentication and access control system does the school currently use, or should we build one from scratch?

2. What is the process for onboarding a new staff member, who initiates it, and what data is collected?

  
  

School Management (>1)

1. What key metrics or reports would you want to see from this system to assess school operations?

2. How do you currently ensure studio utilisation is maximised during opening hours?

  
  

# General Requirements

3 FR + 1 NFR

  

Functional Requirements

FR01: The system shall enforce availability submission deadlines (19th of each month for next month's planning)

FR02: The system shall allow IT administrators to add new staff and managers to the system

FR03: The system shall allow staff to add and edit their availabilities up to 4 weeks ahead

  
  

Non-Functional Requirements

NFR01: The system shall ensure that only authenticated users can access the system, with role-based access control (Manager, Teacher, IT Admin, School Management)

# Use Case Descriptions:

Manager (>3)

  

|   |   |
|---|---|
|Use Case ID|UC-M1|
|Use case Name|View Staff Workload Overview|
|Description|The manager views the landing page showing all staff workloads, the top 3 lowest workload staff, and staff exceeding 40 hours highlighted|
|Priority|High|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in. Staff data and job assignments exist in the system|
|Post-conditions|Manager has a clear visual overview of current staff workload distribution|
|Alternative Scenarios|No staff data available. System displays an empty state message|
|Non-Functional Requirements (if any)|page loads within 3 seconds, responsive design|

  
  
  

|   |   |
|---|---|
|Use Case ID|UC-M2|
|Use case Name|Allocate Jobs to Staff|
|Description|The manager allocates teaching jobs to staff for one week, viewing up to 3 staff members' availability, workload, preferences, and location|
|Priority|High|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in; staff availabilities have been submitted; scheduling period is within the planning window|
|Post-conditions|Jobs are assigned to selected staff, workload is updated accordingly|
|Alternative Scenarios|No staff available for a slot. System alerts manager; staff availability not yet submitted. System shows missing submissions|
|Non-Functional Requirements (if any)|data integrity for assignments|

  
  
  

|   |   |
|---|---|
|Use Case ID|UC-M3|
|Use case Name|Review Staff Availability|
|Description|The manager reviews individual teacher availability, including location, preferences, and any submitted unavailability requests|
|Priority|Medium|
|Primary Actor|Manager|
|Pre-conditions|Manager is logged in; availability records exist for the planning period|
|Post-conditions|Manager has reviewed availability and can make informed allocation decisions|
|Alternative Scenarios|Staff member has no availability records. System displays a prompt to follow up|
|Non-Functional Requirements (if any)|responsive design|

  
  

Teacher (>2)

  

|   |   |
|---|---|
|Use Case ID|UC-T1|
|Use case Name|View Weekly Schedule and Monthly Workload|
|Description|The teacher views their weekly job assignments and overall monthly workload on their landing page|
|Priority|High|
|Primary Actor|Teacher|
|Pre-conditions|Teacher is logged in; job assignments exist for the current period|
|Post-conditions|Teacher is informed of their scheduled classes and total workload hours|
|Alternative Scenarios|No assignments yet. System displays empty schedule with a message|
|Non-Functional Requirements (if any)|fast page load|

  
  
  

|   |   |
|---|---|
|Use Case ID|UC-T2|
|Use case Name|Submit and Edit Availability|
|Description|The teacher adds or edits their availability for up to 4 weeks ahead, including dates and time slots they are available or unavailable|
|Priority|High|
|Primary Actor|Teacher|
|Pre-conditions|Teacher is logged in; the date is before the 19th deadline for the relevant planning month|
|Post-conditions|Availability records are saved and visible to managers for scheduling|
|Alternative Scenarios|Deadline passed. System prevents editing and displays a message to contact manager|
|Non-Functional Requirements (if any)|data integrity for availability records|

  
  
  

|   |   |
|---|---|
|Use Case ID|UC-T3|
|Use case Name|Reject Assigned Job|
|Description|The teacher rejects an assigned job after receiving a warning to discuss with their manager first|
|Priority|Medium|
|Primary Actor|Teacher|
|Pre-conditions|Teacher is logged in; a job has been assigned to them|
|Post-conditions|The job rejection is recorded; the manager is notified; the slot becomes available for reassignment|
|Alternative Scenarios|Teacher cancels rejection after seeing the warning. No change made|
|Non-Functional Requirements (if any)|data integrity|

  

IT Admin (>2)

  

|   |   |
|---|---|
|Use Case ID|UC-I1|
|Use case Name|Add New Staff Member|
|Description|The IT administrator adds a new teacher or manager to the system by entering their personal details and assigning a role|
|Priority|High|
|Primary Actor|IT Administrator|
|Pre-conditions|IT Admin is logged in with administrative privileges|
|Post-conditions|New staff record is created; the staff member can log in with assigned credentials|
|Alternative Scenarios|Duplicate staff ID detected. System prevents creation and shows error|
|Non-Functional Requirements (if any)|role-based access control|

  
  

|   |   |
|---|---|
|Use Case ID|UC-I2|
|Use case Name|Manage Staff Accounts|
|Description|The IT administrator edits or deactivates existing staff accounts (e.g., when a teacher leaves the school)|
|Priority|Medium|
|Primary Actor|IT Administrator|
|Pre-conditions|IT Admin is logged in with administrative privileges; staff records exist|
|Post-conditions|Staff account is updated or deactivated; the staff member can no longer log in if deactivated|
|Alternative Scenarios|Attempting to deactivate own account — system prevents self-deactivation|
|Non-Functional Requirements (if any)|access control, data integrity|

  
  

School Management (>1)

  

|                                      |                                                                                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Use Case ID                          | UC-S1                                                                                                                            |
| Use case Name                        | View Studio Utilisation Report                                                                                                   |
| Description                          | School management views a report showing studio usage across all opening hours, identifying underutilised slots and peak periods |
| Priority                             | Medium                                                                                                                           |
| Primary Actor                        | School Management                                                                                                                |
| Pre-conditions                       | School Management is logged in; scheduling data exists for the reporting period                                                  |
| Post-conditions                      | Management has visibility into studio utilisation to inform operational decisions                                                |
| Alternative Scenarios                | No scheduling data available. System shows a placeholder message                                                                 |
| Non-Functional Requirements (if any) | responsive loading, usable on tablet for management reviews                                                                      |