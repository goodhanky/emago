# Emago MVP Implementation Plan

**Last Updated:** 2026-01-05
**Purpose:** Comprehensive implementation plan for Emago space strategy game MVP

---

## Executive Summary

Build a web-based space strategy game inspired by Ogame with pixel art retro aesthetics. The MVP focuses on single-player experience with one race (Dominion), covering the core gameplay loop: build resources, upgrade buildings, research technologies, and build ships.

**Key Differentiators:**

- Zero pay-to-win (cosmetics only, post-MVP)
- Pixel art retro UI with modern usability
- Lazy calculation architecture (resources calculated on read)
- Fair play from day one (server-side validation, rate limiting)

**Tech Stack:**

- Frontend: Next.js 14+ (App Router), TypeScript, PixiJS, Tailwind, Zustand, TanStack Query
- Backend: Supabase (PostgreSQL + Auth), Prisma ORM
- Deployment: Vercel + Supabase
- Testing: Vitest + Playwright

---

## Current State Analysis

### What Exists

- Comprehensive PRD v2.0 (1,898 lines) with complete game design
- All formulas verified against OGameX data
- Empty repository (no source code yet)

### Constraints

- Single developer with AI assistance
- Must be playable for 30+ minutes as success criteria
- Pixel art must be real from start (not placeholders)
- Art spike must complete before game UI coding

### Key Technical Decisions (from PRD)

- Lazy resource calculation (not background writes)
- Idempotent cron jobs for queue processing
- Optimistic UI with rollback on error
- Server-side validation for all mutations

---

## Proposed Future State

A fully playable single-player space strategy game with:

- Working authentication (email/password)
- 11 buildings with upgrade queue
- 9 technologies with research queue
- 5 ship types with build queue
- Fleet display (ships on planet)
- Dark Matter login rewards
- Pixel art UI throughout

**Out of Scope (Post-MVP):**

- Fleet missions (no destinations in single-planet game)
- Multiplayer
- Combat
- Multiple races
- Colony system

---

## Milestones / Phases

### Phase 1: Foundation (Weeks 1-3)

**Goal:** Core infrastructure, pixel art foundation, basic UI

- Week 1: Art spike + project setup
- Week 2: Database schema + Prisma migrations
- Week 3: Authentication + basic UI shell

**Exit Criteria:** Working login, seeded database, navigable UI

### Phase 2: Resource System (Weeks 4-6)

**Goal:** Working resource economy with lazy calculation

- Week 4: Formula engine implementation
- Week 5: Building system + validation
- Week 6: Queues + cron jobs + client-side ticking

**Exit Criteria:** Can build mines, see resources grow, energy system works

### Phase 3: Research System (Weeks 7-9)

**Goal:** Technology progression

- Week 7: Research formulas + prerequisites
- Week 8: Research API + cron job
- Week 9: Research UI + integration

**Exit Criteria:** Full research system with all 9 technologies

### Phase 4: Shipyard System (Weeks 10-12)

**Goal:** Build ships and display fleet

- Week 10: Ship formulas + prerequisites
- Week 11: Shipyard API + individual ship processing
- Week 12: Shipyard UI + fleet display

**Exit Criteria:** Can build all 5 ship types, view fleet

### Phase 5: Polish & Testing (Weeks 13-14)

**Goal:** MVP ready for play

- Week 13: Comprehensive testing
- Week 14: UI polish, tooltips, Dark Matter system

**Exit Criteria:** All tests pass, enjoyable 30+ minute gameplay

### Buffer (Weeks 15-18)

Handle overruns and additional polish.

---

## Implementation Approach

### Core Architecture Patterns

1. **Lazy Resource Calculation**

   ```
   currentResources = storedResources + (productionRate * timeSinceLastUpdate)
   ```

   - Never update resources in background
   - Calculate on every read
   - Update timestamp only when spending resources

2. **Idempotent Cron Jobs**
   - Always check `status === IN_PROGRESS` before processing
   - Use database transactions
   - Double-check status inside transaction (prevents races)

3. **Optimistic UI**
   - Update UI immediately on user action
   - Rollback on API error using TanStack Query patterns
   - Refetch authoritative state after mutation settles

4. **Server-Side Validation**
   - Validate all game mutations server-side
   - Rate limit (10 actions/minute)
   - Log all actions for audit trail

### Critical File Locations

| Purpose             | Path                                          |
| ------------------- | --------------------------------------------- |
| Database schema     | `prisma/schema.prisma`                        |
| Production formulas | `src/lib/game/formulas/production.ts`         |
| Cost formulas       | `src/lib/game/formulas/costs.ts`              |
| Lazy calculation    | `src/lib/game/resources.ts`                   |
| Building validation | `src/lib/game/validation/buildings.ts`        |
| Building cron       | `src/app/api/cron/process-buildings/route.ts` |
| Vercel cron config  | `vercel.json`                                 |

---

## Verification Plan

### Unit Tests (Vitest)

- All formula functions tested against PRD Appendix tables
- Validation functions tested (valid + invalid cases)
- Edge cases: level 0, max levels, energy deficit, storage caps

### Integration Tests (Vitest)

- API route tests for buildings, research, ships
- Queue cancellation and refund logic
- Concurrent request handling

### E2E Tests (Playwright)

- Register new account flow
- Building upgrade flow
- Research technology flow
- Ship building flow

### Manual Testing

- 30+ minute gameplay session
- Mobile responsiveness check
- Pixel art rendering verification (no blur)

---

## Risk Assessment + Mitigations

| Risk                        | Likelihood | Impact | Mitigation                                                       |
| --------------------------- | ---------- | ------ | ---------------------------------------------------------------- |
| Lazy calculation edge cases | Medium     | High   | Unit tests against PRD tables; test storage caps, energy deficit |
| Cron job race conditions    | Medium     | High   | Idempotent design with status checks in transactions             |
| Formula accuracy            | High       | High   | Automated tests comparing to Appendix A/B values                 |
| Pixel art consistency       | Medium     | Medium | Complete art spike before coding; style guide                    |
| Optimistic UI sync issues   | Medium     | Medium | Proper rollback with TanStack Query; refetch after mutations     |
| Scope creep                 | High       | High   | Strict MVP definition; "out of scope" checklist                  |

---

## Rollout / Rollback

### Deployment Strategy

- Deploy to Vercel with preview deployments for PRs
- Supabase handles database with automatic backups
- Environment variables for all secrets

### Rollback Plan

- Vercel instant rollback to previous deployment
- Prisma migrations are reversible
- Database backups available through Supabase

---

## Success Metrics + Definition of Done

### MVP Success Criteria

- [ ] Can create account and login
- [ ] Can build all 11 buildings to level 10+
- [ ] Can research all 9 technologies
- [ ] Can build all 5 ship types
- [ ] Ships display correctly on planet
- [ ] Actions feel instant (optimistic UI)
- [ ] Navigation is fast (< 1 second)
- [ ] Resource display ticks smoothly
- [ ] Pixel-perfect rendering (no blur)
- [ ] Art consistency across UI
- [ ] All queues process correctly
- [ ] No game-breaking bugs
- [ ] Enjoyable 30+ minute gameplay

### Technical Metrics

| Metric                 | Target      |
| ---------------------- | ----------- |
| Initial page load      | < 2 seconds |
| Menu navigation        | < 1 second  |
| API response (95th)    | < 200ms     |
| Database queries (avg) | < 100ms     |
| Cron job processing    | < 5 seconds |
| Uptime                 | 99%         |

---

## Dependencies / Required Resources

### External Services

- Supabase project (free tier sufficient for MVP)
- Vercel account (free tier sufficient for MVP)

### Tools

- Node.js 18+
- pnpm (package manager)
- Aseprite (pixel art creation)
- TexturePacker or similar (sprite atlas generation)

### Knowledge Requirements

- Next.js App Router patterns
- Prisma ORM
- Supabase Auth
- PixiJS basics
- Game formula implementation

---

## References

- [context.md](./context.md) - Quick resume briefing
- [tasks.md](./tasks.md) - Detailed task breakdown
- [decisions.md](./decisions.md) - Architecture decisions
- [log.md](./log.md) - Progress log
- [PRD-v2.0.md](../../PRD-v2.0.md) - Full product requirements
