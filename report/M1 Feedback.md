# M1 Feedback (Consultation, 28 Oct)

## 1. Functional Requirements (Table 2.1)

General

- Many FRs pack more than one requirement into a single statement. Split each into separate, atomic statements.
- Grading is per requirement: if half of a requirement fails, the whole requirement counts as failed. Compound FRs drag down the success rate.
	- this is for UAT
- Go through every FR and remove vague wording. If the team has to discuss what a term means, it isn't clear enough.

Specific FRs

- FR-01 (running weekly/monthly allocated hours): no attributes or methods in the classes clearly store or track running hours. Show which attribute/method handles this (`Teacher` only has `weeklyHoursTarget` and `calculateWeeklyWorkload()`).
- FR-02:
  - "Dynamically surface" is vague. Say what the system actually does.
  - "Display amber/red indicators" (colours) is non-functional, not functional. Move it to the NFRs (it overlaps NFR-USE-02).
- FR-05:
  - "Workload deficit" is unclear. Define it (e.g., remaining hours before the 40h/44h threshold).
  - "Preferred teaching conditions" is vague. State exactly what it means (instrument? time? studio?).
	  - remove teaching conditions?
- FR-07 (preferences vs availability):
  - Explain how preferences and availability work together. Human nature: teachers will only declare availability for slots they prefer, so preferences may be redundant.
  - Consider whether the system needs a rule like "to be scheduled for 40h you must provide e.g. 80h of availability". Otherwise teachers will declare minimal availability.
	  - enforce min requirement hrs avail so managers can chose timeslots
  - "Back-to-back clustering" 
	  - wording is unclear, it was meant to address this brief req "All teachers can only teach up to 4 hours at one time. They must have at least an hour break before then can proceed with another 4 hours block."
  - remove "acoustic preference" 
  - The brief was left deliberately vague so we would analyse and define these terms. 

## 2. Scope Creep: Peer Lesson Swap (FR-11 / UC-11)

- The original client requirement allows rejection but says nothing about teacher-to-teacher swaps. Swapping is an extra feature we added.
- Lecturer's question: what does swap capture that the rejection workflow (FR-09 / UC-10 / UC-03) doesn't already?
  - Rejection: the manager is responsible for finding a replacement.
  - Swap: the teacher finds their own replacement. Why should that be the teacher's responsibility rather than the manager's?
- Our argument (teacher freedom, no manager bottleneck) was not accepted because it isn't in the client's requirements.
- Principle: don't build more than the client asked for and paid for.
  - Extras are only justified if they safeguard the client's interest (safety/protection), like a car that comes with brakes even if you don't ask. A spoiler you didn't ask for is a different matter.
  - Good ideas that aren't requested belong in a future phase / change request for the next contract, not the current scope.
- Action: remove FR-11 / UC-11 / SSD-11 (or move to Won't-have / future enhancement) unless we can justify it as safeguarding.

## 3. Audit Log (FR-19)

- The lecturer could not find the audit log in the use cases or classes. *(An `AuditLog` entity exists, but there is no use case dedicated to it, and FR-19 is only mapped to UC-17.)* Make sure every FR traces to a use case, class, attributes and methods.
	- make a use case for it

## 4. Non-Functional Requirements (Table 2.3)

- It's obvious that different people wrote the FRs and the NFRs. The style is inconsistent.
- All requirements should be written the same way ("The system shall…").
- Otherwise the NFR content is fine.

## 5. Use Case Diagram

- Overall fine, but external systems are missing from the diagram.
- UC-02 and UC-06 both `<<extend>>` to `Authorize Overtime` under the same optional condition. Two use cases triggering the same extension is a sign they can be generalised.
	- generalize and combine
- UC-02 is framed per week ("Allocate Weekly Teaching Job"), so the use case only "completes" when the whole week is allocated. Reframe it around a single allocation (one time slot / lesson).
- Once generalised to "allocate a lesson", UC-06 (emergency substitute), and likely UC-03 (re-allocate rejected lesson), become subsets of it, since they're all reallocation. Look for the lowest common denominator.
- Principle: do the least needed to achieve the goal.

## 6. Use Case Descriptions

- Repeated from the general feedback: some use cases start with "The system…" (e.g., UC-01 step 1). Main success scenarios should start with the actor's action.
- Other than that, the descriptions are fine.

## 7. Activity Diagrams

- Only the notation was checked; the logic is assumed to match the use case descriptions.
- Notation is OK.

## 8. Class Diagram & Sequence Diagrams

- Bottom line: if a requirement or use case says the system does something, the classes must have the attribute/method to do it. Several are missing (e.g., running hours tracking).
- Same for the sequence diagrams: every message must map to a real class and method.
- Keep requirements, classes and sequence diagrams consistent.
	- thid is js a check, we may have alr fulfilked these reqs

## 9. Gantt Chart / Project Management

- Fine. Fairly detailed.
	- include m2 in gantt

## 10. Action Items for M2

- [ ] Split compound FRs into atomic requirements; remove vague terms (FR-02, FR-05, FR-07, others).
- [ ] Move UI/colour items from FRs to NFRs.
- [ ] Define "deficit", "teaching conditions", "back-to-back clustering", and how preferences relate to availability.
- [ ] Remove or justify peer swap (FR-11 / UC-11 / SSD-11) and any other scope creep.
- [ ] Rewrite NFRs in the same style as the FRs.
- [ ] Add external systems to the use case diagram.
- [ ] Generalise allocation use cases (UC-02 per lesson; fold UC-06 / UC-03 into it) and remove the duplicate `Authorize Overtime` extends.
- [ ] Ensure no use case main flow starts with "System…".
- [ ] Add missing attributes/methods to classes (e.g., running weekly/monthly hours); check sequence diagrams against classes.
- [ ] Ensure the audit log traces through use case → class → sequence diagram.
- [ ] Resubmit updated requirements and class diagram in M2; keep them consistent with the class diagram and wireframes.
