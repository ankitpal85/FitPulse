# FitPulse — Complete Audit, Repair & Completion Plan

Production-grade fitness and nutrition tracking app: **React 19 + Vite 8 + Tailwind v4** frontend ↔ **Strapi 5** (SQLite) backend with **Gemini AI** food image analysis.

---

## Architecture Overview

```mermaid
graph TB
    subgraph Frontend["Client (React 19 + Vite 8)"]
        App["App.tsx (Router)"]
        ThemeCtx["ThemeContext"]
        AppCtx["AppContext (Auth + State)"]
        Pages["Pages: Dashboard, FoodLog, Activity, Profile, Login, Onboarding"]
        Components["Components: Sidebar, BottomNav, CaloriesChart, Loading"]
    end
    
    subgraph Backend["Server (Strapi 5)"]
        APIs["Custom APIs: food-log, activity-log, image-analysis"]
        Auth["Users-Permissions Plugin"]
        DB["SQLite (.tmp/data.db)"]
        Gemini["Gemini AI Integration"]
    end
    
    Frontend -->|"axios (port ????)"| Backend
    APIs --> DB
    APIs --> Gemini
```

---

## User Review Required

> [!CAUTION]
> **Hardcoded Gemini API Key** found in [server/.env](file:///d:/Projects/Project4/FitPulse/server/.env#L25): `AIzaSyApHR_lgYM8f0V4kFuaPX9KDMsdJejD7bg`. This will be moved to `.env.example` as a placeholder. You'll need to provide your own valid key.

> [!IMPORTANT]
> **No registration endpoint** exists in the current Login page — only login. I will add a full register/login toggle flow using Strapi's built-in `/api/auth/local/register` endpoint.

> [!WARNING]
> **Strapi v5 breaking change**: The entire frontend maps API responses using `data.attributes.field` (Strapi v4 pattern). Strapi v5 uses flat `data.field` responses. Every API consumer must be rewritten.

---

## Open Questions

> [!IMPORTANT]
> **Gemini API Key**: Do you have a valid Gemini API key to use for the food image analysis feature? The current key in `.env` may be expired/invalid.

> [!NOTE]
> **Calorie/Nutrition Goals**: Currently hardcoded (2000 cal, 150g protein, etc.). Should these come from user profile data set during onboarding, or remain as configurable defaults?

---

## Proposed Changes

### Phase 1 — Environment & Configuration (Foundation)

#### [MODIFY] [.env](file:///d:/Projects/Project4/FitPulse/client/.env)
- Add `VITE_API_URL=http://localhost:1337` — currently **completely empty**, causing all API calls to fail

#### [NEW] [.env.example](file:///d:/Projects/Project4/FitPulse/client/.env.example)
- Create client environment template with documented variables

#### [MODIFY] [api.ts](file:///d:/Projects/Project4/FitPulse/client/src/configs/api.ts)
- Current: `export const API_URL = import.meta.env.VITE_API_URL`
- Fix: Add fallback URL, add `/api` suffix helper

#### [MODIFY] [vite.config.ts](file:///d:/Projects/Project4/FitPulse/client/vite.config.ts)
- Add API proxy configuration to avoid CORS issues in development

#### [MODIFY] [middlewares.ts](file:///d:/Projects/Project4/FitPulse/server/config/middlewares.ts)
- Fix CORS configuration — current config uses `strapi::cors` without proper origin whitelist

#### [MODIFY] [server/.env](file:///d:/Projects/Project4/FitPulse/server/.env)
- Sanitize hardcoded secrets in example, keep functional in actual env

#### [MODIFY] [.env.example](file:///d:/Projects/Project4/FitPulse/server/.env.example)
- Add `GEMINI_API_KEY` placeholder (currently missing from example)

---

### Phase 2 — Theme System (Dark/Light Mode)

#### [MODIFY] [ThemeContext.tsx](file:///d:/Projects/Project4/FitPulse/client/src/context/ThemeContext.tsx)
- **Bug**: Sets React state but **never applies `dark` class to `<html>` element**
- Fix: Add `useEffect` to toggle `document.documentElement.classList` and persist to `localStorage`
- Add system preference detection via `prefers-color-scheme`

#### [MODIFY] [index.css](file:///d:/Projects/Project4/FitPulse/client/src/index.css)
- Add comprehensive dark mode CSS variables and Tailwind dark mode utilities
- Current CSS has `@custom-variant dark` but theme is never applied to DOM

#### [MODIFY] [index.html](file:///d:/Projects/Project4/FitPulse/client/index.html)
- Add `class="dark"` support, proper meta tags, favicon

---

### Phase 3 — Strapi v5 Response Mapping (Critical Fix)

Every page currently uses Strapi v4 `data.attributes.field` pattern. Strapi v5 returns flat `data.field`.

#### [MODIFY] [AppContext.tsx](file:///d:/Projects/Project4/FitPulse/client/src/context/AppContext.tsx)
- Fix user fetch: currently accesses `res.data` but Strapi `/api/users/me` returns user object directly
- Fix JWT token handling — ensure `Authorization: Bearer` header is set globally on axios
- Add proper error handling for expired tokens
- Fix `onboardingCompleted` check — currently reads `user.onboardingCompleted` which may not exist in schema

#### [MODIFY] [Dashboard.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Dashboard.tsx)
- Fix `foodLogs.map(log => log.attributes.calories)` → `log.calories`
- Fix nutrient summation: `attributes.protein`, `attributes.carbs`, `attributes.fat` → flat fields
- Fix hardcoded calorie goal (2000) — derive from user profile
- Fix chart data mapping for CaloriesChart
- Fix date filtering logic
- Add proper loading and empty states

#### [MODIFY] [FoodLog.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/FoodLog.tsx)
- Fix response mapping from `data.data` with `attributes` to flat structure
- Fix image analysis endpoint URL (currently `/api/image-analyses` — should be `/api/image-analysis/analyze`)
- Fix FormData construction for image upload
- Fix food log creation — field mapping and user association
- Add proper validation and error states

#### [MODIFY] [Activity.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Activity.tsx)
- Fix `data.attributes.type` → `data.type` pattern throughout
- Fix activity log CRUD operations
- Fix date display and filtering
- Fix calorie calculation display

#### [MODIFY] [Profile.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Profile.tsx)
- Fix `updateMe` endpoint — Strapi uses `PUT /api/users/:id` not `/api/users/me`
- Fix field mapping for user profile updates
- Fix nutrition goal persistence
- Add proper form validation

#### [MODIFY] [Onboarding.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Onboarding.tsx)
- Fix user profile update endpoint
- Fix field mapping for height, weight, goals
- Fix redirect logic after completion
- Add proper step validation

#### [MODIFY] [CaloriesChart.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/CaloriesChart.tsx)
- Fix data prop interface to match actual API response
- Fix chart rendering with proper Recharts v3 API

---

### Phase 4 — Authentication & API Integration

#### [MODIFY] [Login.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Login.tsx)
- Add registration flow (currently login-only despite UI toggle)
- Fix Strapi auth endpoints: `/api/auth/local` for login, `/api/auth/local/register` for register
- Add proper form validation with error messages
- Add password strength indicator
- Fix JWT storage and axios header injection

#### [MODIFY] [AppContext.tsx](file:///d:/Projects/Project4/FitPulse/client/src/context/AppContext.tsx)
- Add global axios interceptor for auth token
- Add token refresh/expiry handling
- Add logout function that clears token
- Fix user state management

#### [MODIFY] [configs/api.ts](file:///d:/Projects/Project4/FitPulse/client/src/configs/api.ts)
- Create centralized axios instance with interceptors
- Add request/response interceptors for auth and error handling

---

### Phase 5 — Backend Hardening

#### [MODIFY] [image-analysis controller](file:///d:/Projects/Project4/FitPulse/server/src/api/image-analysis)
- Fix Gemini AI integration — verify import pattern for `@google/genai`
- Add input validation (file type, size limits)
- Add proper error handling for API failures
- Add rate limiting consideration
- Return structured nutrition data

#### [MODIFY] [food-log routes/controllers](file:///d:/Projects/Project4/FitPulse/server/src/api/food-log)
- Fix custom controller to properly handle Strapi v5 entity service
- Add user-scoping (users can only see their own logs)
- Add input validation
- Fix response format

#### [MODIFY] [activity-log routes/controllers](file:///d:/Projects/Project4/FitPulse/server/src/api/activity-log)
- Fix custom controller for Strapi v5
- Add user-scoping
- Add input validation
- Fix response format

#### [MODIFY] [middlewares.ts](file:///d:/Projects/Project4/FitPulse/server/config/middlewares.ts)
- Configure CORS properly for `http://localhost:5173` (Vite dev server)
- Add security headers

---

### Phase 6 — UI/UX Improvements

#### [MODIFY] [BootomNav.tsx → BottomNav.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/BootomNav.tsx)
- Rename file (fix typo)
- Fix active state detection
- Improve responsive behavior
- Add dark mode support

#### [MODIFY] [Sidebar.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/Sidebar.tsx)
- Fix active route highlighting
- Add dark mode support
- Improve mobile responsiveness

#### [MODIFY] [Layout.tsx](file:///d:/Projects/Project4/FitPulse/client/src/pages/Layout.tsx)
- Add proper responsive layout with sidebar + bottom nav
- Add dark mode class propagation
- Add error boundary wrapper

#### [MODIFY] [Loading.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/Loading.tsx)
- Upgrade from simple text to animated skeleton/spinner
- Add dark mode support

#### [MODIFY] [index.css](file:///d:/Projects/Project4/FitPulse/client/src/index.css)
- Add comprehensive dark mode variables
- Add animation utilities
- Add skeleton loader styles
- Improve typography with Google Fonts
- Add glassmorphism utilities

#### [MODIFY] [index.html](file:///d:/Projects/Project4/FitPulse/client/index.html)
- Add proper meta tags (SEO, viewport, theme-color)
- Add Google Fonts preload
- Add favicon

#### [NEW] [ErrorBoundary.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/ErrorBoundary.tsx)
- Create React error boundary component

#### [NEW] [SkeletonLoader.tsx](file:///d:/Projects/Project4/FitPulse/client/src/components/ui/SkeletonLoader.tsx)
- Create reusable skeleton loading components

---

### Phase 7 — Types & Code Quality

#### [MODIFY] [types/index.ts](file:///d:/Projects/Project4/FitPulse/client/src/types/index.ts)
- Fix type definitions to match Strapi v5 response format
- Add missing types for API responses
- Remove `any` types
- Add proper generics for API calls

---

### Phase 8 — Production Optimization

- Remove dead code and unused imports
- Optimize bundle size (lazy loading for routes)
- Add proper meta tags for SEO
- Ensure production build works cleanly
- Add proper error logging

---

## Verification Plan

### Automated Tests
```bash
# Client
cd d:\Projects\Project4\FitPulse\client
npm run build        # Verify TypeScript compilation + Vite build
npm run lint         # Verify no lint errors

# Server
cd d:\Projects\Project4\FitPulse\server
npm run build        # Verify Strapi build
```

### Manual Verification
1. Start Strapi server → verify admin panel accessible at `http://localhost:1337/admin`
2. Start Vite dev server → verify frontend at `http://localhost:5173`
3. Test registration flow → new user creation
4. Test login flow → JWT token stored, user fetched
5. Test onboarding → profile data saved
6. Test dashboard → charts render with real data
7. Test food logging → image upload + Gemini analysis
8. Test activity logging → CRUD operations
9. Test profile editing → data persists
10. Test dark/light mode toggle → persists across refresh
11. Test responsive layout → mobile + desktop
12. Run production build → no errors

---

## Execution Order

| Priority | Phase | Impact | Risk |
|----------|-------|--------|------|
| 🔴 P0 | Phase 1 — Environment & Config | Nothing works without this | Low |
| 🔴 P0 | Phase 3 — Strapi v5 Response Mapping | All data display broken | Medium |
| 🔴 P0 | Phase 4 — Auth & API Integration | Can't login or use app | Medium |
| 🟡 P1 | Phase 5 — Backend Hardening | Data integrity & security | Medium |
| 🟡 P1 | Phase 2 — Theme System | Dark mode completely broken | Low |
| 🟢 P2 | Phase 6 — UI/UX Improvements | Polish & usability | Low |
| 🟢 P2 | Phase 7 — Types & Code Quality | Maintainability | Low |
| 🟢 P2 | Phase 8 — Production Optimization | Performance & deployment | Low |
