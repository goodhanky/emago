# Emago MVP - Task Breakdown

**Last Updated:** 2026-01-09
**Purpose:** Actionable task checklist organized by phase with acceptance criteria

---

## Phase 1: Foundation (Weeks 1-3)

### Week 1: Art Spike + Project Setup

#### Art Direction (MUST COMPLETE BEFORE GAME UI)

- [ ] **Define color palette**
  - Acceptance: 5-7 primary colors + neutrals documented in STYLE_GUIDE.md
  - Effort: S
  - Dependencies: None

- [ ] **Lock pixel scale**
  - Acceptance: Pixel scale chosen (24px recommended), tested on mobile for readability
  - Effort: S
  - Dependencies: None

- [ ] **Select/create bitmap font**
  - Acceptance: BMFont format font file ready, renders crisp at chosen scale
  - Effort: M
  - Dependencies: Pixel scale decision

- [ ] **Create pixel UI kit v0**
  - Acceptance: Panel, button (4 states), tab, progress bar, badge, input sprites in atlas
  - Effort: L
  - Dependencies: Color palette, pixel scale

- [ ] **Create resource icons**
  - Acceptance: Metal, crystal, deuterium, energy icons in sprite atlas
  - Effort: M
  - Dependencies: Color palette, pixel scale

- [ ] **Create building icons**
  - Acceptance: 11 building icons (can be simplified versions) in sprite atlas
  - Effort: L
  - Dependencies: Color palette, pixel scale

- [ ] **Create ship silhouettes**
  - Acceptance: 5 ship type silhouettes in sprite atlas
  - Effort: M
  - Dependencies: Color palette, pixel scale

- [x] **Create AI generation prompts**
  - Acceptance: PIXEL_ART_PROMPTS.md with detailed prompts for all 47 assets
  - Effort: M
  - Dependencies: None
  - Completed: 2026-01-05

- [x] **Set up sprite folder structure**
  - Acceptance: public/sprites/{resources,buildings,ships,ui,icons} created
  - Effort: S
  - Dependencies: None
  - Completed: 2026-01-05

- [x] **Generate pixel art assets**
  - Acceptance: All 47 assets generated and saved to public/sprites/
  - Effort: L
  - Dependencies: AI prompts created
  - Completed: 2026-01-08
  - Note: 42 core assets generated via GPT 5.2 (optional assets skipped)

- [ ] **Set up sprite atlas pipeline**
  - Acceptance: Aseprite → TexturePacker → JSON atlas working, documented
  - Effort: M
  - Dependencies: All sprites created

- [ ] **Document in STYLE_GUIDE.md**
  - Acceptance: Palette, pixel scale, font, UI conventions all documented
  - Effort: S
  - Dependencies: All above art tasks

#### Project Setup (Can parallel with art)

- [x] **Initialize Next.js 14+ project**
  - Acceptance: `npx create-next-app` with TypeScript, Tailwind, App Router
  - Effort: S
  - Dependencies: None
  - Completed: 2026-01-06

- [x] **Configure TypeScript strict mode**
  - Acceptance: tsconfig.json has strict: true, no any allowed
  - Effort: S
  - Dependencies: Next.js init
  - Completed: 2026-01-06

- [x] **Set up ESLint + Prettier**
  - Acceptance: Linting works, formatting consistent
  - Effort: S
  - Dependencies: Next.js init
  - Completed: 2026-01-06

- [x] **Create folder structure**
  - Acceptance: src/app, src/components, src/lib, src/stores, src/hooks, src/types created
  - Effort: S
  - Dependencies: Next.js init
  - Completed: 2026-01-06

- [x] **Create Supabase project**
  - Acceptance: Project created, dashboard accessible
  - Effort: S
  - Dependencies: None
  - Completed: 2026-01-06

- [x] **Configure environment variables**
  - Acceptance: .env.local with Supabase URLs/keys, .env.example template
  - Effort: S
  - Dependencies: Supabase project
  - Completed: 2026-01-06

### Week 2: Database Schema

- [x] **Create Prisma schema**
  - Acceptance: All entities defined (Player, Planet, Building, Research, queues, etc.)
  - Effort: L
  - Dependencies: Project setup
  - Completed: 2026-01-06

- [x] **Define all enums**
  - Acceptance: BuildingType (11), TechType (9), ShipType (5), QueueStatus in schema
  - Effort: S
  - Dependencies: Prisma schema started
  - Completed: 2026-01-06

- [x] **Run initial migration**
  - Acceptance: `prisma migrate dev --name init` succeeds, tables created
  - Effort: S
  - Dependencies: Complete schema
  - Completed: 2026-01-06

- [x] **Create seed script**
  - Acceptance: prisma/seed.ts with all GameConfig values from PRD Appendix
  - Effort: M
  - Dependencies: Migration complete
  - Completed: 2026-01-06

- [x] **Run seed**
  - Acceptance: GameConfig table populated, values match PRD
  - Effort: S
  - Dependencies: Seed script
  - Completed: 2026-01-06

- [x] **Create Prisma client utility**
  - Acceptance: src/lib/db/prisma.ts exports singleton client
  - Effort: S
  - Dependencies: Migration complete
  - Completed: 2026-01-06

### Week 3: Authentication + Basic UI

- [x] **Enable Supabase email/password auth**
  - Acceptance: Auth enabled in Supabase dashboard, email templates configured
  - Effort: S
  - Dependencies: Supabase project
  - Completed: 2026-01-08

- [x] **Create Supabase browser client**
  - Acceptance: src/lib/auth/supabase-client.ts working
  - Effort: S
  - Dependencies: Environment variables
  - Completed: 2026-01-08

- [x] **Create Supabase server client**
  - Acceptance: src/lib/auth/supabase-server.ts working with cookies
  - Effort: M
  - Dependencies: Browser client
  - Completed: 2026-01-08

- [x] **Implement auth middleware**
  - Acceptance: Protected routes redirect to login, session validated
  - Effort: M
  - Dependencies: Server client
  - Completed: 2026-01-08

- [x] **Create login page**
  - Acceptance: /login page with email/password form, validation, error handling
  - Effort: M
  - Dependencies: Auth middleware
  - Completed: 2026-01-08

- [x] **Create register page**
  - Acceptance: /register page with username field, validation
  - Effort: M
  - Dependencies: Login page
  - Completed: 2026-01-08

- [x] **Create player registration API**
  - Acceptance: POST /api/auth/register creates Player + Planet with starting resources
  - Effort: L
  - Dependencies: Prisma client, auth
  - Completed: 2026-01-08

- [x] **Create game layout**
  - Acceptance: src/app/(game)/layout.tsx with navigation sidebar
  - Effort: M
  - Dependencies: Auth working
  - Completed: 2026-01-08

- [x] **Create resource bar component**
  - Acceptance: Displays Metal, Crystal, Deuterium, Energy with pixel icons
  - Effort: M
  - Dependencies: Game layout, sprite atlas
  - Completed: 2026-01-08

- [x] **Create navigation component**
  - Acceptance: Links to Dashboard, Buildings, Research, Shipyard, Fleet
  - Effort: S
  - Dependencies: Game layout
  - Completed: 2026-01-08

- [x] **Create dashboard page (static)**
  - Acceptance: Shows resources, queue status placeholders, navigation works
  - Effort: M
  - Dependencies: Layout, resource bar
  - Completed: 2026-01-08

---

## Phase 2: Resource System (Weeks 4-6)

### Week 4: Formula Engine

- [x] **Implement production formulas**
  - Acceptance: calculateMetalProduction, Crystal, Deuterium, Solar match PRD
  - Effort: M
  - Dependencies: Phase 1 complete
  - Completed: 2026-01-09

- [x] **Implement cost formulas**
  - Acceptance: Mine, facility, storage costs match PRD Appendix A
  - Effort: M
  - Dependencies: None
  - Completed: 2026-01-09

- [x] **Implement time formulas**
  - Acceptance: Building, research, ship time calculations correct
  - Effort: M
  - Dependencies: Cost formulas
  - Completed: 2026-01-09

- [x] **Implement energy formulas**
  - Acceptance: Consumption + energy factor calculations correct
  - Effort: M
  - Dependencies: Production formulas
  - Completed: 2026-01-09

- [x] **Implement storage formulas**
  - Acceptance: Capacity calculation matches PRD table
  - Effort: S
  - Dependencies: None
  - Completed: 2026-01-09

- [x] **Create lazy resource calculator**
  - Acceptance: calculateCurrentResources returns correct values with time delta
  - Effort: L
  - Dependencies: All formula files
  - Completed: 2026-01-09

- [ ] **Unit test all formulas**
  - Acceptance: Tests compare against PRD Appendix A/B values, all pass
  - Effort: L
  - Dependencies: All formulas implemented

### Week 5: Building System

- [x] **Define building prerequisites**
  - Acceptance: BUILDING_PREREQUISITES constant with all requirements
  - Effort: S
  - Dependencies: None
  - Completed: 2026-01-09
  - Note: Included in src/lib/game/formulas/constants.ts

- [x] **Create building validation**
  - Acceptance: validateBuildingUpgrade checks queue, resources, prerequisites
  - Effort: M
  - Dependencies: Prerequisites, lazy calculator
  - Completed: 2026-01-09

- [x] **Create GET /api/buildings endpoint**
  - Acceptance: Returns all buildings with levels for planet
  - Effort: S
  - Dependencies: Prisma client
  - Completed: 2026-01-09

- [x] **Create POST /api/buildings/upgrade endpoint**
  - Acceptance: Validates, deducts resources, creates queue entry atomically
  - Effort: L
  - Dependencies: Validation, lazy calculator
  - Completed: 2026-01-09

- [x] **Create POST /api/buildings/cancel endpoint**
  - Acceptance: Cancels queue, refunds 100% resources
  - Effort: M
  - Dependencies: Upgrade endpoint
  - Completed: 2026-01-09

- [ ] **Implement rate limiting**
  - Acceptance: Max 10 actions/minute per user, returns 429 if exceeded
  - Effort: M
  - Dependencies: API endpoints

- [ ] **Implement action logging**
  - Acceptance: All building actions logged to ActionLog table
  - Effort: S
  - Dependencies: API endpoints

### Week 6: Queues + UI

- [ ] **Create building completion cron job**
  - Acceptance: Idempotent, updates building level, recalculates production
  - Effort: L
  - Dependencies: Building API

- [ ] **Configure Vercel cron**
  - Acceptance: vercel.json with cron schedule every minute
  - Effort: S
  - Dependencies: Cron job

- [ ] **Create useResourceTicker hook**
  - Acceptance: Client-side ticking every 1 second, smooth display
  - Effort: M
  - Dependencies: Lazy calculator (client version)

- [ ] **Create usePlanetQuery hook**
  - Acceptance: TanStack Query polling every 15 seconds
  - Effort: S
  - Dependencies: Planet API

- [ ] **Create useBuildingUpgrade mutation**
  - Acceptance: Optimistic update, rollback on error, toast notifications
  - Effort: M
  - Dependencies: Building API, TanStack Query

- [x] **Create buildings page**
  - Acceptance: Lists all 11 buildings with current levels
  - Effort: M
  - Dependencies: Hooks, API
  - Completed: 2026-01-09

- [x] **Create BuildingCard component**
  - Acceptance: Shows name, level, cost, time, prerequisites, upgrade button
  - Effort: L
  - Dependencies: Buildings page
  - Completed: 2026-01-09

- [x] **Create BuildingQueue component**
  - Acceptance: Shows active queue with countdown, cancel button
  - Effort: M
  - Dependencies: Buildings page
  - Completed: 2026-01-09
  - Note: Named ActiveQueuePanel in implementation

- [ ] **Integration test building flow**
  - Acceptance: Full upgrade → completion → level increase tested
  - Effort: M
  - Dependencies: All building features

---

## Phase 3: Research System (Weeks 7-9)

### Week 7: Research Formulas

- [ ] **Implement research cost formulas**
  - Acceptance: All 9 tech costs match PRD
  - Effort: M
  - Dependencies: Phase 2 complete

- [ ] **Define research prerequisites**
  - Acceptance: Lab level + tech requirements for all 9 techs
  - Effort: S
  - Dependencies: None

- [ ] **Create research validation**
  - Acceptance: validateResearch checks queue, lab level, techs, resources
  - Effort: M
  - Dependencies: Prerequisites

- [ ] **Unit test research formulas**
  - Acceptance: All costs verified against PRD
  - Effort: S
  - Dependencies: Research formulas

### Week 8: Research API

- [ ] **Create GET /api/research endpoint**
  - Acceptance: Returns all tech levels for player
  - Effort: S
  - Dependencies: Prisma client

- [ ] **Create POST /api/research/start endpoint**
  - Acceptance: Validates, deducts resources, creates queue
  - Effort: L
  - Dependencies: Validation

- [ ] **Create POST /api/research/cancel endpoint**
  - Acceptance: Cancels queue, refunds resources
  - Effort: M
  - Dependencies: Start endpoint

- [ ] **Create research completion cron job**
  - Acceptance: Idempotent, updates tech level
  - Effort: M
  - Dependencies: Research API

- [ ] **Integration test research flow**
  - Acceptance: Full start → completion → level increase tested
  - Effort: M
  - Dependencies: All research API

### Week 9: Research UI

- [ ] **Create useResearchMutation hook**
  - Acceptance: Optimistic update with rollback
  - Effort: M
  - Dependencies: Research API

- [ ] **Create research page**
  - Acceptance: Lists all 9 technologies with levels
  - Effort: M
  - Dependencies: Hooks

- [ ] **Create ResearchCard component**
  - Acceptance: Shows name, level, cost, time, lab requirement, prerequisites
  - Effort: L
  - Dependencies: Research page

- [ ] **Create ResearchQueue component**
  - Acceptance: Shows active research with countdown
  - Effort: M
  - Dependencies: Research page

---

## Phase 4: Shipyard System (Weeks 10-12)

### Week 10: Ship Formulas

- [ ] **Define ship costs and stats**
  - Acceptance: All 5 ships with metal, crystal, deut, hull, shield, weapon, cargo, speed
  - Effort: M
  - Dependencies: Phase 3 complete

- [ ] **Define ship prerequisites**
  - Acceptance: Shipyard level + tech requirements for all 5 ships
  - Effort: S
  - Dependencies: None

- [ ] **Create ship validation**
  - Acceptance: validateShipBuild checks shipyard, techs, resources
  - Effort: M
  - Dependencies: Prerequisites

- [ ] **Unit test ship formulas**
  - Acceptance: Costs and build times verified
  - Effort: S
  - Dependencies: Ship formulas

### Week 11: Shipyard API

- [ ] **Create GET /api/ships endpoint**
  - Acceptance: Returns ship counts on planet
  - Effort: S
  - Dependencies: Prisma client

- [ ] **Create POST /api/ships/build endpoint**
  - Acceptance: Validates, deducts resources for batch, creates queue
  - Effort: L
  - Dependencies: Validation

- [ ] **Create POST /api/ships/cancel endpoint**
  - Acceptance: Cancels remaining ships, refunds their cost
  - Effort: M
  - Dependencies: Build endpoint

- [ ] **Create ship completion cron job**
  - Acceptance: Processes ONE ship at a time, updates completedCount
  - Effort: L
  - Dependencies: Ship API

- [ ] **Integration test ship flow**
  - Acceptance: Build batch → individual completions → correct ship counts
  - Effort: M
  - Dependencies: All ship API

### Week 12: Shipyard + Fleet UI

- [ ] **Create useShipBuild mutation**
  - Acceptance: Optimistic update with rollback
  - Effort: M
  - Dependencies: Ship API

- [ ] **Create shipyard page**
  - Acceptance: Lists all 5 ship types with costs
  - Effort: M
  - Dependencies: Hooks

- [ ] **Create ShipCard component**
  - Acceptance: Shows name, cost, time, prerequisites, quantity input, stats
  - Effort: L
  - Dependencies: Shipyard page

- [ ] **Create ShipQueue component**
  - Acceptance: Shows "Building X (3/10)" with countdown
  - Effort: M
  - Dependencies: Shipyard page

- [ ] **Create fleet page**
  - Acceptance: Lists all ships on planet with counts
  - Effort: M
  - Dependencies: Ship API

- [ ] **Create FleetDisplay component**
  - Acceptance: Ship counts, stats, "missions coming soon" placeholder
  - Effort: M
  - Dependencies: Fleet page

---

## Phase 5: Polish & Testing (Weeks 13-14)

### Week 13: Testing

- [ ] **Configure Vitest**
  - Acceptance: vitest.config.ts set up, runs with `pnpm test`
  - Effort: S
  - Dependencies: None

- [ ] **Configure Playwright**
  - Acceptance: playwright.config.ts set up, runs E2E tests
  - Effort: M
  - Dependencies: None

- [ ] **Write formula unit tests**
  - Acceptance: All production, cost, time, energy formulas tested
  - Effort: L
  - Dependencies: Vitest config

- [ ] **Write validation unit tests**
  - Acceptance: Building, research, ship validation tested
  - Effort: M
  - Dependencies: Vitest config

- [ ] **Write API integration tests**
  - Acceptance: All endpoints tested with test database
  - Effort: L
  - Dependencies: Vitest config

- [ ] **Write E2E auth tests**
  - Acceptance: Register, login, logout flows tested
  - Effort: M
  - Dependencies: Playwright config

- [ ] **Write E2E gameplay tests**
  - Acceptance: Building, research, ship flows tested end-to-end
  - Effort: L
  - Dependencies: Playwright config

### Week 14: Polish

- [ ] **Implement Dark Matter login rewards**
  - Acceptance: 10 DM daily, 100 DM weekly streak, logged in ledger
  - Effort: M
  - Dependencies: Auth system

- [ ] **Create tooltip system**
  - Acceptance: Tooltips on all buildings, techs, ships with descriptions
  - Effort: M
  - Dependencies: All UI components

- [ ] **Create Getting Started guide**
  - Acceptance: /help page with basic gameplay instructions
  - Effort: M
  - Dependencies: None

- [ ] **Add toast notifications**
  - Acceptance: Success/error toasts for all actions
  - Effort: S
  - Dependencies: All mutations

- [ ] **Add loading states**
  - Acceptance: Skeleton loaders for all async content
  - Effort: M
  - Dependencies: All pages

- [ ] **Performance optimization**
  - Acceptance: Database indexes added, queries optimized, < 200ms API responses
  - Effort: M
  - Dependencies: All features complete

- [ ] **Manual playtest**
  - Acceptance: 30+ minute session, gameplay feels satisfying
  - Effort: L
  - Dependencies: All features complete

- [ ] **Bug fixes**
  - Acceptance: All critical/major bugs from testing fixed
  - Effort: XL (variable)
  - Dependencies: Testing complete
