# Stakeholder Elicitation Session Minutes: IT Infrastructure & Administration

**Document Identifier:** MIN-03-IT  
**Target Stakeholder:** IT Administrator (Alex Wong)  
**Lead Interviewer:** Yan Qi (Resource & Scheduling Lead, Team P5-5)  
**Session Focus:** System Onboarding/Offboarding, Role-Based Access Control, Studio Asset Management, Singapore PDPA Compliance, and Cloud Reliability  

---

## Part 1: Spoken Dialogue Transcript

**Date:** 22 September 2026  
**Time:** 11:00 AM – 12:00 PM SGT  
**Location:** IT Department Office / Virtual Teams Session  
**Participants:**
- **Yan Qi (Interviewer):** Resource & Scheduling Lead, Group P5-5
- **Alex Wong (Interviewee):** Lead IT Administrator, Music School

*(Recording begins. Sound of key clicks and subtle hum of network switches in the background.)*

**Yan Qi:** Hi Alex, thanks for making time to meet with me today. As the IT lead for the school, your perspective is super crucial for us, especially around security, user provisioning, physical resource modeling, and system reliability.

**Alex:** Hey Yan Qi, glad to help. Honestly, I’m really looking forward to this system. Right now, our IT setup for scheduling is basically an encrypted Excel file sitting in a shared cloud folder with a master password. It’s clunky, there’s zero granular access control, and if that file gets corrupted or someone accidentally deletes a sheet, it’s a total disaster for us to recover.

**Yan Qi:** That’s terrifying from an IT perspective! Let’s start with user account management. Could you walk me through the lifecycle of a new employee—how are they onboarded into the system?

**Alex:** Sure. Currently, the operational manager informs IT whenever a new staff member is hired. We collect their baseline particulars: full name, contact number, official school email address, assigned Staff ID, employment start date, and their system role—either Teacher or Manager. For teachers, we also have to record their verified instrument qualifications—whether they teach Piano, Violin, Drums, or Trumpet. Once we create their profile and provision their credentials, they should be able to log in, view their portal, and submit their availability and preferences.

**Yan Qi:** And what happens on the flip side—when a teacher or manager resigns or leaves the school?

**Alex:** When someone leaves, the manager notifies us. Crucially, we *never* hard-delete an employee’s record from the database. If you delete a teacher record, you risk breaking foreign keys, corrupting historical student lesson logs, and wiping out financial audit trails. So our strict policy is soft-deletion: we deactivate the account. Once disabled, they cannot authenticate, their name is excluded from all future rostering matrices, but their past assignment history remains fully intact for historical auditing.

**Yan Qi:** What if a teacher leaves abruptly mid-month, or conversely, what if a teacher earns a new certification—say, a piano teacher becomes certified to teach violin?

**Alex:** If someone departs mid-month, IT deactivates their login on their final working day, and the manager is responsible for opening the roster and reassigning their remaining pending lessons to other qualified instructors. If a teacher acquires a new qualification, the manager submits the verification to IT, and we update the teacher’s profile in the system to append the new instrument code. Once updated, the allocation engine immediately allows managers to assign them violin students.

**Yan Qi:** That brings us to access control and data visibility. What should each user role be permitted to see?

**Alex:** We must enforce strict Role-Based Access Control, or RBAC. Here is the operational breakdown:
First, **Managers**: they require full operational visibility. They need to see all teachers' availability grids, assigned workloads, stated preferences, instrument qualifications, and contact details. They assign lessons, resolve clashes, and handle student waitlists.
Second, **Teachers**: they should operate under the principle of least privilege. A teacher should *only* see their own confirmed weekly timetable, assigned studios, running monthly hours, and submit their own availability. A teacher must *never* be able to view their colleagues' personal schedules, private availability, or compensation-linked hour totals. That information is commercially sensitive and private.
Third, **IT Administrators**: we manage user accounts, assign roles, configure physical studios, and monitor system health. But IT admins should not be altering live student-teacher lesson rosters.

**Yan Qi:** What about data protection laws? Singapore’s PDPA is quite stringent regarding personal data.

**Alex:** Exactly. Because the system will store staff contact numbers, employment IDs, and student particulars, it must strictly comply with the Personal Data Protection Act (PDPA). All sensitive personal data must be encrypted at rest using AES-256. Access must be logged, and personal contact details like phone numbers should be masked on shared screens. We also provide teachers with official school email domains (`@musicschool.edu.sg`) so personal email addresses aren't exposed to parents.

**Yan Qi:** Let’s transition to physical assets and facilities. How should the studios and musical instruments be modeled in the software?

**Alex:** Currently, we have exactly five physical studios, numbered Studio 1 through Studio 5. The system must treat studios as first-class configurable entities. Each studio record should maintain an inventory of available instruments and equipment. Here’s the physical reality: every studio has an acoustic upright or grand piano. But only Studio 5 has our acoustic drum kit. That means drum lessons are physically locked to Studio 5. You cannot conduct drums in Studios 1 to 4 because there is no drum kit and the acoustic dampening in those rooms isn't rated for high decibels.

**Yan Qi:** But can piano or violin lessons be held in Studio 5 if the drum kit is free?

**Alex:** Yes, absolutely. Studio 5 has a piano too. So as long as no drum lesson is running, Studio 5 is fair game for piano, violin, or trumpet. But if Studio 5 is booked, drum lessons cannot be allocated anywhere else.

**Yan Qi:** What happens when a studio needs maintenance—like piano tuning, acoustic panel repairs, or air-conditioning servicing?

**Alex:** Great question. IT admins or facilities managers must have the ability to flag a studio as `Inactive` or `Under Maintenance` for a specific date and time window. While marked inactive, the allocation engine must automatically treat that studio as unavailable, preventing managers from placing lessons there. Once servicing is finished, we can reactivate the studio with a single click without having to rebuild room metadata from scratch.

**Yan Qi:** Can you describe the school’s underlying technical infrastructure? Are you hosting servers on-premise, or is everything cloud-based?

**Alex:** We don't maintain any physical server racks on-premise. Everything is hosted in the cloud. Our operational environment runs on standard cloud infrastructure. Staff are issued Lenovo ThinkPad laptops running Windows 11, and teachers also access tools via mobile devices over the school’s Wi-Fi network.

**Yan Qi:** How reliable is the school’s internet connection?

**Alex:** Generally very reliable, but we do experience transient ISP hiccups or temporary Wi-Fi dropouts once in a blue moon. That’s why we really want the frontend web application to handle brief offline periods gracefully. If a manager is halfway through allocating a busy Friday schedule, or a teacher is selecting availability blocks, the app should cache those draft inputs locally in the browser so that a two-minute Wi-Fi blip doesn’t wipe out twenty minutes of tedious work.

**Yan Qi:** We can definitely implement client-side local session caching to ensure zero data loss during network blips. What about system load? How many concurrent users are we designing for during peak usage?

**Alex:** Our school has nine active teaching staff, two operational shift managers, and one or two administrative/IT users. Even if every single staff member logs in simultaneously on the 19th of the month to beat the availability deadline while both managers are building rosters, we’re talking about fewer than 20 concurrent active users. So you don’t need an over-engineered distributed microservice architecture. A solid, clean monolithic web architecture with fast database indexing will easily handle that load.

**Yan Qi:** Understood. What are your expectations regarding data backups and system recovery?

**Alex:** Automated daily database snapshots are mandatory. If a catastrophic software failure or accidental bulk overwrite occurs, our Recovery Point Objective (RPO) should be no more than 24 hours, and our Recovery Time Objective (RTO) should be under 2 hours. Furthermore, all state changes—allocations, cancellations, role reassignments, and manager overrides—must generate an immutable audit log entry capturing the user ID, timestamp, and action. That audit log must be retained for at least 12 months for compliance.

**Yan Qi:** And what about existing databases? Is there an existing student or employee database we should interface with?

**Alex:** Yes, we have a basic student management system that tracks student enrolments, instruments, and contact details. In Phase 1, we can export student records via standard CSV/JSON and import them into the workload system. Down the road, an automated REST integration would be great, but a clean batch import mechanism is perfectly viable for this release.

**Yan Qi:** This has been incredibly thorough and structured, Alex. You’ve given us exact parameters for security, access control, facility management, and reliability.

**Alex:** Anytime, Yan Qi. Build it clean, make it secure, and my IT life will be ten times easier!

*(Recording ends.)*

---

## Part 2: Formal Structured Meeting Minutes

### 1. Administrative Overview
- **Session ID:** MIN-03-IT
- **Date & Time:** Tuesday, 22 September 2026 | 11:00 AM – 12:00 PM SGT (Week 3)
- **Venue:** IT Administration Office / Microsoft Teams
- **Chairperson / Lead Interviewer:** Yan Qi (Resource & Scheduling Lead, Group P5-5)
- **Primary Stakeholder / Interviewee:** Alex Wong (Lead IT Administrator)
- **Minute Taker:** Yan Qi

### 2. Meeting Objectives
1. Define user onboarding, qualification tagging, and account deactivation workflows.
2. Establish strict Role-Based Access Control (RBAC) boundaries across Manager, Teacher, and IT Administrator roles.
3. Model physical facilities, studio equipment dependencies, and maintenance blackout intervals.
4. Elicit data governance, Singapore PDPA compliance, and cloud backup/recovery specifications.

### 3. Key Discussion Points & Operational Findings

#### 3.1 User Account Administration & Qualification Management
- IT Administrators hold exclusive authority to provision new system accounts upon notification by management.
- Required baseline metadata per account: `StaffID`, `FullName`, `EmailAddress` (`@musicschool.edu.sg`), `ContactNumber`, `Role`, `HireDate`.
- **Instructor Specialization:** Teachers must have one or more verified instrument qualification tags (`Piano`, `Violin`, `Drums`, `Trumpet`). The scheduling engine must enforce qualification matching as an unyielding constraint.
- **Soft-Delete Architecture:** Staff accounts are **never permanently deleted**. Terminated or departing staff are flagged as `Inactive`. This prevents relational integrity violations in historical scheduling records and retains auditable lesson logs.

#### 3.2 Role-Based Access Control (RBAC) & Principle of Least Privilege
- **Manager Role:** Full operational access. Can view all teacher availability matrices, workload totals, preferences, qualifications, and student rosters; allocates jobs and overrides soft constraints.
- **Teacher Role:** Restricted personal access. Can view only their own confirmed weekly assignments, studio assignments, and personal monthly hours; submits personal availability and preferences. **Strictly prohibited** from viewing peer schedules or workload totals.
- **IT Administrator Role:** System governance access. Provisions user accounts, configures instrument qualifications, manages physical studio resources, and inspects system error logs. **Prohibited** from modifying live lesson allocations.

#### 3.3 Studio Resource Modeling & Equipment Exclusivity
- System manages five physical studio spaces (`Studio 1` through `Studio 5`).
- **Equipment Inventory Matrix:**
  - Studios 1 to 4: Equipped with acoustic pianos. Suitable for Piano, Violin, and Trumpet lessons.
  - Studio 5: Equipped with acoustic piano and acoustic drum kit with specialized sound isolation.
- **Operational Constraint:** Drum lessons are exclusively restricted to Studio 5. Non-drum lessons may occupy Studio 5 only when no drum lesson is rostered.
- **Maintenance Windows:** IT administrators must possess administrative capability to designate a studio as `Inactive` for a defined datetime interval (e.g., piano tuning, renovations), rendering the studio non-selectable in the allocation matrix.

#### 3.4 Data Protection & Singapore PDPA Compliance
- System stores personally identifiable information (PII) including staff phone numbers, NRIC/Staff identifiers, and student names.
- All stored PII must be encrypted at rest using industry-standard **AES-256 encryption**.
- Direct personal phone numbers must be masked in general dashboard views to maintain compliance with the Personal Data Protection Act (PDPA).

#### 3.5 Infrastructure, Concurrency, and Resilience
- Fully cloud-hosted environment accessed via modern web browsers on ThinkPad laptops (Windows 11) and mobile devices.
- **Peak Concurrency Ceiling:** $< 20$ concurrent active users (9 instructors, 2 shift managers, 1 IT admin).
- **Network Resilience:** Client-side caching of uncommitted inputs must be provided to tolerate transient wireless dropouts ($\le 5$ minutes) without data loss.
- **Backup & Recovery:** Automated daily cloud database snapshots; Recovery Point Objective (RPO) $\le 24$ hours, Recovery Time Objective (RTO) $\le 2$ hours.
- **Audit Logging:** System must record an immutable audit log for all allocation creation, modification, rejection, and override events, retained for a minimum of 12 months.

---

### 4. Derived Requirements & Traceability Matrix

| Requirement ID | Type | Requirement Description | Operational Metric / Verification Standard | Mapped Use Case | Priority |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **FR-11** | Functional | The system shall allow IT administrators to create, update, and soft-delete user accounts with assigned roles (Manager, Teacher, IT Admin) and verified instrument qualifications. | Deactivated accounts retain all relational lesson links but are barred from authentication and rostering. | UC-13 | High |
| **FR-12** | Functional | The system shall allow IT administrators to configure physical studio resources, assign instrument capabilities, and set temporary maintenance blackout windows. | Studios marked `Inactive` are automatically hidden/blocked from the manager allocation matrix during the blackout window. | UC-14, UC-16 | High |
| **NFR-SEC-01** | Security | The system shall enforce strict Role-Based Access Control (RBAC) ensuring teachers cannot view peer schedules/hours, and IT admins cannot alter lesson allocations. | Automated integration tests verify that unauthorized endpoints return HTTP 403 Forbidden. | Global | High |
| **NFR-SEC-02** | Security | All personally identifiable information (PII) including staff contact numbers and student particulars shall be encrypted at rest using AES-256 and masked on shared displays in compliance with Singapore PDPA. | Database inspection verifies cipher text storage; frontend masks contact strings. | Global | High |
| **NFR-REL-02** | Reliability | The system shall perform automated daily database snapshots and enforce soft-deletion for all transactional and user entities to support an RPO $\le 24\,\text{h}$ and RTO $\le 2\,\text{h}$. | Disaster recovery simulation confirms data restoration from snapshot within 120 minutes. | Global | Medium |
| **NFR-AUD-01** | Security | The system shall maintain an immutable audit trail capturing actor ID, timestamp, before/after state, and IP address for all schedule modifications and manager overrides, retained for $\ge 12$ months. | Append-only database audit table with no UI deletion capabilities. | UC-18 | High |

---

### 5. Action Items & Next Steps
1. **Yan Qi:** Detail class definitions for `Studio`, `InstrumentFacility`, and `MaintenanceWindow` in the domain model.
2. **Joseph:** Incorporate RBAC authorization filters and audit logging interception into the system architectural design.
3. **Ryan:** Verify that PII masking rules are documented in the SRS security section.
