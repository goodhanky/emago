# Emago MVP - Progress Log

**Last Updated:** 2026-01-10
**Purpose:** Chronological record of progress and decisions

---

## 2026-01-10 - Research System Complete

### What Changed

- Created research validation module (`src/lib/game/validation/research.ts`)
- Created Research API endpoints:
  - `GET /api/research` - Returns all 9 technologies with levels, costs, times
  - `POST /api/research/start` - Validates, deducts resources, creates queue
  - `POST /api/research/cancel` - Cancels queue, refunds 100% resources
- Created research completion cron job (`src/app/api/cron/research/route.ts`)
- Created Research page UI with ResearchList, ResearchCard, ActiveQueuePanel
- Added `GAME_SPEED = 100` constant for 100x faster testing
- Fixed cron auth to skip in development mode
- Fixed polling bug in BuildingsList and ResearchList (removed incorrect status check)
- Added admin give-resources endpoint for testing
- Updated vercel.json with research cron schedule

### Key Decisions Made

- ADR-011: GAME_SPEED multiplier for testing (set to 100 for dev, 1 for prod)
- Research uses placeholder icons (nav-research.png) until proper sprites generated

### What's Next

1. Shipyard system (validation, API, UI)
2. Ship completion cron job
3. Fleet page

### Blockers

- None

### Notes

- Research system manually tested end-to-end: start → completion → level increase
- Phase 3 (Research System) fully complete and verified
- Moving to Phase 4 (Shipyard System)

---

## 2026-01-09 - Building System Bug Fixes & Manual Test

### What Changed

- Fixed middleware routes (use `/dashboard` not `/game/dashboard`)
- Fixed navigation links in game layout
- Fixed building sprite paths (use correct subfolders: `resources/`, `facilities/`)
- Fixed progress bar to update smoothly (100ms intervals instead of 1s)
- Fixed queue completion to delete record instead of marking COMPLETED (unique constraint)
- Fixed cancel to delete queue instead of marking CANCELLED
- Added `unoptimized` flag to images for large sprite files
- Added `router.refresh()` to update header resources after upgrade/cancel
- Removed cancel confirmation dialog per user request
- Added auto-trigger of cron when building timer completes

### Key Decisions Made

- ADR-010: Delete queue records on completion/cancel (unique constraint on planetId prevents multiple records)

### What's Next

1. Implement Research system (validation, API, UI)
2. Research cron job
3. Shipyard system

### Blockers

- None

### Notes

- Building system manually tested end-to-end: upgrade → completion → level increase
- Cancel flow tested: cancel → refund → can start new build
- Phase 2 (Building System) fully complete and verified

---

## 2026-01-09 - Building Cron Job Complete

### What Changed

- Created building completion cron job (`src/app/api/cron/buildings/route.ts`)
- Idempotent: double-checks status inside transaction
- Updates building level, recalculates production rates and energy balance
- Increments fieldsUsed on planet
- Created `vercel.json` with cron schedule (every minute)

### What's Next

1. Research system validation + API
2. Research page UI
3. Shipyard system

### Blockers

- None

---

## 2026-01-09 - Building System Complete

### What Changed

- Created building validation module (`src/lib/game/validation/buildings.ts`):
  - `validateBuildingUpgrade()` - Checks queue, prerequisites, resources
  - `canUpgradeBuilding()` - Simplified boolean check for UI
  - Helper functions: `buildingArrayToMap()`, `researchArrayToMap()`, `planetToPlanetState()`
- Created Buildings API endpoints:
  - `GET /api/buildings` - Returns all 11 buildings with levels, costs, times, canUpgrade status
  - `POST /api/buildings/upgrade` - Validates, deducts resources atomically, creates queue
  - `POST /api/buildings/cancel` - Cancels queue, refunds 100% resources
- Created Buildings page UI:
  - Server component (`page.tsx`) with auth check
  - Client component (`BuildingsList.tsx`) with interactive functionality
  - `BuildingCard` - Displays building info, costs, upgrade button
  - `ActiveQueuePanel` - Countdown timer, progress bar, cancel button
- All API endpoints use Prisma transactions for atomic operations
- Build and lint pass

### Key Decisions Made

- Queue status checked via `status === 'IN_PROGRESS'` (not just existence)
- Resources calculated with lazy calculator at request time
- Full 100% refund on cancel (per ADR-008)
- Client fetches fresh data from API (not using server-passed initial data)

### What's Next

1. Create building completion cron job
2. Research system implementation
3. Shipyard system implementation

### Blockers

- None

### Notes

- Buildings can now be upgraded with proper validation
- Queue shows countdown timer that updates every second
- Cancel refunds resources (respects storage caps)
- Week 5 building tasks complete, next is cron job for queue completion

---

## 2026-01-09 - Formula Engine Complete

### What Changed

- Created complete formula engine with 9 new files:
  - `src/types/game.ts` - Type definitions (Resources, Costs, PlanetState, etc.)
  - `src/lib/game/formulas/constants.ts` - All static game values, prerequisites
  - `src/lib/game/formulas/energy.ts` - Energy consumption and factor calculations
  - `src/lib/game/formulas/production.ts` - Metal, Crystal, Deuterium, Solar production
  - `src/lib/game/formulas/storage.ts` - Storage capacity and clamping
  - `src/lib/game/formulas/costs.ts` - Building, Research, Ship cost calculations
  - `src/lib/game/formulas/time.ts` - Construction and research time formulas
  - `src/lib/game/formulas/index.ts` - Barrel exports
  - `src/lib/game/resources.ts` - Lazy resource calculator
- All formulas match PRD Appendix A/B values
- Build and lint pass

### Key Decisions Made

- Pure functions with no database access (easy to test)
- Types imported from Prisma (BuildingType, TechType, ShipType)
- Math.floor() for all calculations (matches OGame behavior)
- Constants file includes all prerequisites for buildings, research, ships

### What's Next

1. Create building validation logic
2. Build buildings API endpoints
3. Create buildings page UI

### Blockers

- None

### Notes

- Formula engine ready for integration with building system
- Week 4 tasks complete, moving to Week 5 (Building System)

---

## 2026-01-08 - Authentication System Complete

### What Changed

- Generated 42 core pixel art assets using GPT 5.2 (skipped 4 optional assets)
- Installed @supabase/supabase-js and @supabase/ssr
- Created Supabase browser client (src/lib/auth/supabase-client.ts)
- Created Supabase server client (src/lib/auth/supabase-server.ts)
- Implemented auth middleware (src/middleware.ts) with route protection
- Created login page with email/password form
- Created register page with username validation
- Created player registration API that atomically creates:
  - Player record (linked to Supabase auth)
  - Planet with random coordinates and starting resources
  - All 11 Building records at level 0
  - All 9 Research records at level 0
- Created game layout with navigation sidebar and resource bar
- Created dashboard page with planet info, production rates, queue status
- Fixed ESLint config to ignore Prisma generated files
- Fixed TypeScript error in generate-icons.ts

### Key Decisions Made

- None new (following existing ADRs)

### What's Next

1. Implement formula engine (production, cost, time calculations)
2. Create lazy resource calculator
3. Build buildings API with validation

### Blockers

- None

### Notes

- Authentication working end-to-end (register → login → dashboard)
- Resource bar shows current resources from database
- Navigation uses pixel art icons from sprites
- Phase 1 (Foundation) essentially complete

---

## 2026-01-05 - Pixel Art Prompts Created

### What Changed

- Created PIXEL_ART_PROMPTS.md with 47 detailed AI generation prompts
- Organized prompts by category: resources (4), buildings (11), ships (5), UI components, nav icons, status icons
- Created sprite folder structure: public/sprites/{resources,buildings,ships,ui,icons}
- Resolved open question: user will generate pixel art using AI with these prompts

### Key Decisions Made

- AI-generated pixel art approach (using prompts instead of manual Aseprite work)
- Prioritized asset generation order: resource icons + UI first, then buildings, ships last

### What's Next

1. Generate pixel art assets using AI with the prompts
2. Enable Supabase email/password authentication
3. Create login/register pages

### Blockers

- None

### Notes

- 47 total assets documented with specific dimensions and style guidance
- File naming convention established in PIXEL_ART_PROMPTS.md

---

## 2026-01-06 - Project Setup Complete

### What Changed

- Initialized Next.js 16 with TypeScript, Tailwind, App Router
- Configured ESLint + Prettier with eslint-config-prettier
- Created Supabase project (ywewwaoylyhgmrlhtcen)
- Set up Prisma 7 with @prisma/adapter-pg
- Created complete database schema (11 tables):
  - players, planets, buildings, researches, planet_ships
  - building_queues, research_queues, ship_queues
  - game_configs, dark_matter_ledger, action_logs
- Created and ran seed script (75 GameConfig values)
- Configured folder structure: src/{app,components,lib,stores,hooks,types}

### Key Decisions Made

- ADR-009: Using Prisma 7 with pg adapter (not Prisma Accelerate)
- Using npm instead of pnpm (pnpm not installed on system)
- Deferred art spike - prioritized project setup first

### What's Next

1. Authentication:
   - Enable Supabase email/password auth
   - Create login/register pages
   - Create player registration API
2. Game layout:
   - Navigation sidebar
   - Resource bar component
3. Formula engine implementation

### Blockers

- None

### Notes

- Prisma 7 has breaking changes: datasource URL must be in config or adapter
- Session pooler (port 5432 on pooler) works for migrations
- Build passes, all 75 game config values seeded successfully

---

## 2026-01-05 - Project Planning Complete

### What Changed

- Created comprehensive PRD v2.0 (already existed)
- Explored codebase (empty repository, only PRD and README)
- Created detailed implementation plan
- Gathered user decisions:
  - Real pixel art from start (not placeholders)
  - Vitest + Playwright for testing
  - Art spike completes before game UI coding
- Set up work tracking structure in `work/active/emago-mvp/`

### Key Decisions Made

- ADR-001 through ADR-008 documented in decisions.md
- Phase structure: Foundation → Resources → Research → Shipyard → Polish

### Blockers

- None

### Notes

- PRD is extremely detailed (1,898 lines) - great foundation
- All formulas verified against OGameX data
- MVP scope is well-defined with explicit out-of-scope items

---

## Template for Future Entries

```markdown
## YYYY-MM-DD - Brief Title

### What Changed

- Bullet points of completed work

### Key Decisions Made

- Any new decisions or changes

### What's Next

- Immediate next steps (1-3 items)

### Blockers

- Any issues blocking progress

### Notes

- Additional context or observations
```
