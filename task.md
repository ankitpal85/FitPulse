# FitPulse — Execution Tracker

## Phase 1 — Environment & Configuration
- [x] Fix client `.env` with `VITE_API_URL` (empty = use Vite proxy; already correct)
- [x] `client/.env.example` already exists
- [x] `configs/api.ts` already has proper axios instance + auth interceptors
- [x] Vite proxy config already in place (port 5173 → 1337)
- [x] Server CORS middleware already configured for localhost:5173
- [x] Server `.env.example` already exists (has GEMINI_API_KEY placeholder)

## Phase 2 — Backend Fixes
- [x] `gemini.ts` — clean (uses `@google/genai`, reads MIME from extension, has null checks)
- [x] `image-analysis` controller — validated; uses raw ctx.status/ctx.body (no ctx.created)
- [x] `image-analysis` routes — **FIXED**: removed invalid `plugin::users-permissions.isAuthenticated` policy (does not exist in Strapi 5)
- [x] `food-log` controller — migrated from deprecated `entityService` → `documentService` (Strapi 5)
- [x] `food-log` routes — **FIXED**: removed invalid policy reference
- [x] `activity-log` controller — migrated from deprecated `entityService` → `documentService` (Strapi 5)
- [x] `activity-log` routes — **FIXED**: removed invalid policy reference
- [x] Schemas — `draftAndPublish: false`, required fields all present
- [x] **TS check: 0 errors** on server (`npx tsc --noEmit`)

## Phase 3 — Frontend Core Fixes
- [x] `types/index.ts` — clean, Strapi v5 flat format, no `any` types
- [x] `AppContext.tsx` — real Strapi API, exposes setters, user fetch works; handles both `{ data: [] }` and direct array responses
- [x] `ThemeContext.tsx` — properly applies `dark` class to `<html>`, persists to localStorage, detects system preference
- [x] `configs/api.ts` — centralized axios with auth interceptor and 401 auto-logout
- [x] **TS check: 0 errors** on client (`npx tsc --noEmit`)

## Phase 4 — Page Fixes
- [x] `Login.tsx` — has both login and register flows, no duplicate Toaster
- [x] `Dashboard.tsx` — correct flat API mapping, null checks, derives limits from user profile
- [x] `FoodLog.tsx` — image analysis working, flat API mapping, error handling
- [x] `Activity.tsx` — handleDelete implemented, correct API calls
- [x] `Profile.tsx` — uses `PUT /api/users/:id` endpoint correctly
- [x] `Onboarding.tsx` — correct endpoint, step validation, goal-based calorie calculation

## Phase 5 — Component Fixes
- [x] `BottomNav.tsx` — already renamed and fixed (isActive destructuring works)
- [x] `CaloriesChart.tsx` — dark mode support with theme-aware colors
- [x] `Sidebar.tsx` — no debug logs, dark mode works
- [x] `Layout.tsx` — imports BottomNav correctly
- [x] `Loading.tsx` — consistent gradient colors

## Phase 6 — Polish
- [x] `index.html` — SEO meta tags, theme-color, viewport
- [x] `index.css` — dark mode, animations, skeleton loaders, glassmorphism utilities
- [x] `main.tsx` — clean, proper provider tree
- [x] `ErrorBoundary.tsx` — NEW: graceful error fallback component
- [x] `App.tsx` — wrapped with ErrorBoundary
- [x] Final build test — ✅ PASSES (client: 0 TS errors, server: 0 TS errors)

## ✅ Both Servers Running
- **Strapi backend**: http://localhost:1337 — started successfully, no errors
- **Vite client**: http://localhost:5175/ — running with hot reload

## ⚠️ One-Time Admin Panel Setup Required

After the Strapi server first boots, you MUST enable API permissions:
1. Go to http://localhost:1337/admin
2. Navigate to: **Settings → Users & Permissions → Roles → Authenticated**
3. Enable all actions for: **food-log**, **activity-log**, **image-analysis**
4. Click **Save**

This is a one-time setup that persists in the SQLite database.

## Root Cause of the Critical Bug Fixed
**`plugin::users-permissions.isAuthenticated` does NOT exist as a policy in Strapi 5.**
- In Strapi 4, this was a valid policy.
- In Strapi 5, auth is handled via the admin panel's role-based permission system.
- The fix: removed all `policies: [...]` references from route configs and set them to empty `[]`.
- Auth is still enforced: any user who is not authenticated will receive 401 (handled by `ctx.state.user` checks in controllers).
