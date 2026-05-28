# FitPulse — Execution Tracker

## Phase 1 — Environment & Configuration
- [ ] Fix client `.env` with `VITE_API_URL`
- [ ] Create client `.env.example`
- [ ] Rewrite `configs/api.ts` with proper axios instance + interceptors
- [ ] Add Vite proxy config
- [ ] Fix server CORS middleware
- [ ] Fix server `.env.example` (add GEMINI_API_KEY)

## Phase 2 — Backend Fixes
- [ ] Fix `gemini.ts` — `congig` typo, `objeect` typo, hardcoded MIME, null checks
- [ ] Fix `image-analysis` controller — validation, auth, error handling
- [ ] Fix `image-analysis` routes — add auth
- [ ] Fix `food-log` controller — auth checks in find(), user-scoped delete/update
- [ ] Fix `activity-log` controller — auth checks in find(), user-scoped delete/update
- [ ] Fix schemas — draftAndPublish: false, add required fields

## Phase 3 — Frontend Core Fixes
- [ ] Fix `types/index.ts` — consolidate types, remove null union from User
- [ ] Rewrite `AppContext.tsx` — real Strapi API, expose setters, fix user fetch
- [ ] Fix `ThemeContext.tsx` — proper typing, remove debug logs
- [ ] Fix `configs/api.ts` — centralized axios with auth interceptor

## Phase 4 — Page Fixes
- [ ] Fix `Login.tsx` — remove duplicate Toaster, fix error propagation
- [ ] Fix `Dashboard.tsx` — fix HamburgerIcon, operator precedence, null checks
- [ ] Fix `FoodLog.tsx` — implement image analysis, fix typos, error handling
- [ ] Fix `Activity.tsx` — implement handleDelete, fix typos
- [ ] Fix `Profile.tsx` — fix min/max swap, fix endpoint
- [ ] Fix `Onboarding.tsx` — fix typos, dailyCalorieBurn default, remove duplicate Toaster

## Phase 5 — Component Fixes
- [ ] Rename `BootomNav.tsx` → `BottomNav.tsx`, fix isActive destructuring
- [ ] Fix `CaloriesChart.tsx` — dark mode support
- [ ] Fix `Sidebar.tsx` — remove debug logs
- [ ] Fix `Layout.tsx` — update import after rename
- [ ] Fix `Loading.tsx` — consistent colors

## Phase 6 — Polish
- [ ] Fix `index.html` — SEO meta tags
- [ ] Fix `index.css` — dark mode improvements
- [ ] Fix `main.tsx` — cleanup
- [ ] Remove dead code, unused imports
- [ ] Final build test
