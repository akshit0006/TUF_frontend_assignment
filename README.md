# Wall Calendar — Interactive Range Planner

A polished, responsive wall‑calendar UI built in React (Vite) that recreates a physical calendar aesthetic with a hero image, interactive date‑range selection, and integrated notes. Designed as a frontend‑only component with local persistence and delightful micro‑interactions.

Live Demo: https://tuf-frontend-assignment-m5p1-r6uordhwu.vercel.app/

## Highlights
- Wall‑calendar layout with a **hero image panel** anchoring the month.
- **Date range selection** with clear states (start, end, in‑between, today).
- **Range notes** tied to selected dates.
- **Monthly notes** for freeform planning.
- **Local persistence** using `localStorage` (no backend).
- Fully **responsive** with mobile‑friendly stacking.
- Optional **theme toggle** (Paper / Ink) and subtle **month flip** animation.

## Core Features

### 1) Wall‑Calendar Aesthetic
- Prominent hero image at the left/top with year and month overlay.
- Calendar grid and notes positioned to mimic a printed wall calendar.
- Paper‑like background textures and soft shadowing for depth.

### 2) Date Range Selection
- Click once to set **start date**.
- Click again to set **end date**.
- Hover preview shows the in‑between range before finalizing.
- Start / end days are visually emphasized, in‑between days are highlighted.
- “Jump to Today” and “Clear Selection” shortcuts for usability.

### 3) Integrated Notes
- **Monthly Notes**: freeform notes for the month.
- **Range Notes**: attach notes to a selected date range.
- Notes are stored locally so you don’t lose work on refresh.

### 4) Responsive Layout
- Desktop: hero panel and calendar sit side‑by‑side.
- Mobile: layout stacks vertically, calendar remains fully usable.

### 5) Extra Touches
- Theme switcher (Paper / Ink) for light & dark styling.
- Subtle flip animation when navigating months.

## Tech Stack
- **React 18**
- **Vite 5**
- **Vanilla CSS** (custom design system + variables)

## Project Structure
```
.
├─ public/
│  └─ hero.jpg
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ index.html
├─ package.json
└─ README.md
```

## Getting Started (Local)

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Build

```bash
npm run build
```

The production output will be in `dist/`.

## Deployment (Vercel)
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

## UX Notes
- Selection is designed to be fast: start → end.
- Hover preview helps visualize the range before confirming.
- Notes encourage planning at two levels: month‑wide and range‑specific.

## Known Limitations / Future Ideas
- No backend (intentionally per requirements).
- Could add per‑day notes, drag selection, or export as image.

---

Built as a frontend engineering challenge to demonstrate UI craftsmanship, interaction design, and responsive layout execution.
