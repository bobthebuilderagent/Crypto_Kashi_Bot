# Dev Plan: Navigation Routing Fix

## Date: 2026-04-26
## Status: **Completed** ✅

## Problem
Clicking nav buttons (Home / Crypto Bot / Predictions) in the Header updated the React context `section` state but never called `router.push()`, so the actual URL never changed. Pages like `PredictionsPage` and `CryptoPage` had guards (`if (section !== "crypto") return null`) that checked context state instead of the URL, resulting in blank screens when navigating.

In Next.js App Router, the **URL itself routes** — pages mount/unmount based on the path, not context state. Context was being used incorrectly as a gatekeeper for routing.

## Root Cause
1. **Header.tsx**: `setSection()` was called but `router.push()` was not — URL never changed
2. **Pages**: Used context state (`section`) as a conditional gate instead of trusting the URL
3. **Race condition**: Home page (`/`) had a useEffect that read `pathname` and called `setSection(pathname)`, but when on `/crypto`, the `/` route wasn't mounted, so its useEffect didn't run — causing context and URL to drift apart

## Fixes Applied

### 1. `src/components/Header.tsx`
- Derive `currentSection` from `usePathname()` (the real URL), not from context state
- `navigate()` now calls **both** `setCtxSection(s)` (for nav highlighting) **and** `router.push(s)` (for actual navigation)
- Active tab highlighting uses the URL-derived value, so browser back/forward still highlights the correct button
- Removed dependency on `useAppContext().section` for routing logic

### 2. `src/app/page.tsx` (Home)
- Removed the `useEffect` that synced `setSection()` from `pathname` — page just renders `<HomePage />` unconditionally

### 3. `src/app/crypto/page.tsx`
- Removed the bare `setSection("crypto")` call (not in useEffect, so never ran)
- Page just renders `<CryptoBotPage />` unconditionally

### 4. `src/app/predictions/page.tsx`
- Removed guard `if (section !== "predictions") return null`
- Page just renders `<PredictionsPage />` unconditionally

## Architecture Note
In Next.js App Router:
- **URL is the source of truth** for which route/page is active
- Context state (`section`) is now only used for **UI decoration** (highlighting active nav buttons)
- Pages should never gate their render on a context variable that's meant to represent routing state
- If you need context across pages, keep it for UI state (theme, section highlight) but not for routing gates

## Files Changed
- `src/components/Header.tsx` — Added `router.push()`, derive active section from `usePathname()`
- `src/app/page.tsx` — Removed unnecessary context sync
- `src/app/crypto/page.tsx` — Removed dead `setSection()` call
- `src/app/predictions/page.tsx` — Removed context-gate conditional

## Next Steps
1. Test all three nav links work correctly (click, back/forward, direct URL entry)
2. Verify active tab highlighting updates on navigation
3. Consider moving context-only UI state (section) to a ref or direct calc if highlighting can be done entirely from `pathname`
4. Build bot configuration pages (grid, DCA, market-making strategy forms)
