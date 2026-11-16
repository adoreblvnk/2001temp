# Design System — Harmony Academy Scheduling

## Visual Direction
Utilitarian **GitHub Primer Light** (`primer/css`) operational interface with strict monochromatic restraint and school-intranet tabular scheduling clarity.

## Typography
- **UI & Headings:** `Geist Variable` (`14px` base, `18px` `font-semibold` page titles, `12px` table headers & controls; zero kickers/eyebrows).
- **Data, Hours, Timestamps & IDs:** `Geist Mono Variable` with `font-variant-numeric: tabular-nums`.

## Color Tokens
- **Canvas & Surfaces (Monochrome):**
  - `--color-canvas-default`: `#ffffff`
  - `--color-canvas-subtle`: `#f6f8fa`
  - `--color-canvas-inset`: `#eff2f5`
- **Borders & Dividers:**
  - `--color-border-default`: `#d0d7de` (`1px` solid)
  - `--color-border-muted`: `#d8dee4`
  - `--color-border-strong`: `#8c959f`
- **Foreground & Controls:**
  - `--color-fg-default`: `#1f2328` (primary ink & solid primary button fill)
  - `--color-fg-muted`: `#59636e`
  - `--color-fg-subtle`: `#6e7781`
- **Mandatory 3-Tier Statutory Status Tokens (`NFR-USE-02` Only):**
  - **OK (`< 40.0 h`):** `#1a7f37` fg / `#dafbe1` bg / `#4ac26b` border
  - **Warning (`40.0–44.0 h`):** `#9a6700` fg / `#fff8c5` bg / `#d4a72c` border
  - **Overworked (`> 44.0 h`):** `#cf222e` fg / `#ffebe9` bg / `#ff8182` border

## State Encoding Without Excess Hue
- **Confirmed Lesson:** Solid `1px` `#8c959f` border on `#f6f8fa` fill.
- **Pending Rejection / Deactivated Account:** `1px` dashed `#1f2328` / `#8c959f` border.
- **Closed Operating Hours / Maintenance Exclusion:** `-45deg` diagonal hairline hatch (`hatch-closed` / `hatch-maint`).

## Layout & Responsiveness
- Max content container: `1360px` centered with `16px–24px` horizontal padding.
- Responsive adaptation from `375px` mobile to `1920px` desktop with `0px` horizontal document overflow (`NFR-USE-01`); dense schedule grids scroll cleanly inside bounded `overflow-x-auto` containers.
