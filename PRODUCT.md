# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

SvelteKit + `@sveltejs/adapter-static`, Svelte 5, Tailwind CSS v4, `shadcn-svelte` primitives, `lucide-svelte` icons, `Geist` typography, `zod` schema validation, `npm`, `oxlint`, `oxfmt`.

## Users

1. **School Managers (2 on 43-hour weekly shifts):** Balance weekly teaching assignments across 9 teachers and 5 studios, inspect the top 3 lowest-allocated staff, compare up to 3 pre-verified candidate teachers side-by-side, approve warning-tier overtime (`40.0h–44.0h`), resolve job rejection requests, inspect studio utilisation, and audit scheduling history.
2. **Music Teachers (9 certified instructors — 5 Piano, 1 Drums, 2 Violin, 1 Trumpet):** Declare recurring 30-minute monthly availability (`>= 60.0h` minimum) before `23:59` on the 19th of each month, set preferred teaching days and preferred studio ID, inspect personal weekly timetables with assigned studio locations and student details, and request job rejections after acknowledging a manager consultation warning.
3. **IT Administrators:** Provision and logically deactivate staff/manager/admin accounts without physical record deletion, configure studio instrument equipment (`Studios 1–5`; `Studio 5` sole drum-equipped room), and schedule studio maintenance windows.

## Product Purpose

Web-based workload allocation and resource scheduling application for Harmony Academy that eliminates manual Excel rostering collisions, balances faculty teaching hours equitably, maximizes 86-hour weekly studio utilisation, and enforces Singapore Employment Act Part IV working-hour limits with a 24-month immutable audit trail.

## Positioning

Pre-verified constraint scheduling: every candidate teacher and studio option is evaluated within `<= 300ms` before confirmation against instrument qualification, declared availability, the 4.0-hour continuous block / 1.0-hour rest limit, studio equipment/maintenance status, and the 3-tier statutory weekly workload model (`< 40.0h` OK, `40.0h–44.0h` Warning, `> 44.0h` Overworked).

## Operating Context

- **Studios:** 5 physical studios (`S-01` to `S-05`). All 5 hold pianos; `S-05` uniquely holds a drum kit. Only 1 teacher occupies a studio per 30-minute individual lesson slot.
- **Operating Hours:** Mon–Fri `09:00–21:00` (60h) and Sat–Sun `08:00–21:00` (26h) = `86.0` weekly operating hours per studio (`430.0h` academy-wide); closed on public holidays.
- **Monthly Planning Cycle:** Teachers submit availability up to 1 month ahead before `23:59` on the 19th (`>= 60.0h` monthly minimum). Monthly planning starts on the 20th, allocated one calendar week at a time.

## Capabilities and Constraints

- Complete functional coverage of `FR-01` through `FR-17` and non-functional coverage of `NFR-USE-01` (`375px–1920px` zero horizontal scroll), `NFR-USE-02` (3-tier color + text badges), `NFR-PER-02` (`<= 300ms` eligibility validation), `NFR-REL-02` (logical soft-deactivation), `NFR-SEC-01` (role-based access control), and `NFR-COM-01`/`02` (24-month immutable audit retention & 44.0h statutory cap).
- Sufficiency & minimalism: de-duplicated copy, zero redundant explanatory prose, separate focused routes per workflow rather than crowding everything onto one long page.

## Brand Commitments

- **Reference System:** GitHub Primer (`primer/css`) structural discipline paired with `shadcn-svelte` controls and a school-intranet weekly timetable calendar (`Time x Monday..Sunday`).
- **Palette Rule:** Strictly monochromatic (`#ffffff` / `#f6f8fa` surfaces, `1px #d0d7de` hairline borders, `#1f2328` primary ink) except where `NFR-USE-02` explicitly requires semantic 3-tier workload status colors: Green `OK` (`< 40.0h`), Amber `Warning` (`40.0h–44.0h`), and Red `Overworked` (`> 44.0h`).
- **Typography:** `Geist Sans` for UI and `Geist Mono` (`tabular-nums`) for hours, timestamps, IDs, and audit hashes.

## Evidence on Hand

- Official brief (`Music School.md`): 9 teachers, 251 enrolled students (168 Piano, 26 Drums, 38 Violin, 19 Trumpet), 31 unassigned students (17 Piano, 5 Drums, 7 Violin, 2 Trumpet), 5 studios.
- Finalized M2 specification (`report/INF2001-M2-P5-5.md`): Tables 1.1–1.3 (`FR-01..17`, `NFR-*`, `UC-01..17`), Decision Table Rules `R1..R7`.

## Product Principles

1. **Completeness with Sufficiency:** Implement every required capability (`FR-01..17`) cleanly while omitting unrequested extras and verbose meta-commentary.
2. **Zero Redundancy:** State every operational metric, status, or constraint once in its canonical control; never echo the same fact across subtitles, banners, and footers.
3. **Verify Before Allocate:** Surface eligibility, ranking order (`WorkloadDeficitStrategy` vs `PreferenceMatchStrategy`), continuous-block status, and studio equipment/maintenance state upfront before confirmation.
4. **Role-Scoped Clarity:** Restrict navigation and actions strictly to the active persona (`Manager`, `Teacher`, `IT Administrator`) while keeping all mutations synchronized through a single reactive store and append-only audit log.

## Accessibility & Inclusion

- WCAG 2.2 AA contrast (`>= 4.5:1`) and non-color text badges (`OK`, `Warning`, `Overworked`) paired with semantic colors (`NFR-USE-02`).
- Responsive layout across `375px` mobile and `1920px` desktop viewports without horizontal page overflow (`NFR-USE-01`).
