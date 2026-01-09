# Emago MVP - Progress Log

**Last Updated:** 2026-01-09
**Purpose:** Chronological record of progress and decisions

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
