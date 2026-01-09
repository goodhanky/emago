# Emago MVP - Architecture Decisions

**Last Updated:** 2026-01-09
**Purpose:** Record key technical and design decisions in ADR format

---

## ADR-001: Lazy Resource Calculation

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Resources are calculated on read using `lastResourceUpdate` timestamp + production rates, not updated in background.

### Alternatives Considered

1. **Background job updates** - Cron job updates all player resources every minute
2. **WebSocket push** - Real-time updates pushed to clients
3. **Lazy calculation** - Calculate on demand

### Rationale

- Background updates don't scale (1000 players = 1000 writes/minute)
- WebSockets add complexity for MVP
- Lazy calculation is O(1) per read, scales infinitely
- Same pattern used by Ogame

### Consequences

- Must update timestamp when spending resources (atomic operation)
- Client needs to calculate locally for smooth display
- Storage caps must be applied during calculation

---

## ADR-002: Idempotent Cron Jobs

**Date:** 2026-01-05
**Status:** Accepted

### Decision

All cron jobs must be idempotent - safe to run multiple times without side effects.

### Alternatives Considered

1. **Lock-based processing** - Acquire lock before processing
2. **Status field checking** - Only process IN_PROGRESS items
3. **Event sourcing** - Replay events to derive state

### Rationale

- Vercel Cron may occasionally double-fire
- Status field checking is simple and effective
- Transaction with double-check prevents races
- No external lock service needed

### Consequences

- Every queue entity needs `status` field
- Must check status inside transaction
- Can safely retry failed cron runs

---

## ADR-003: Optimistic UI with Rollback

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Use optimistic updates for all user actions, rollback on API error.

### Alternatives Considered

1. **Wait for server** - Show loading until response
2. **Optimistic only** - Update without rollback
3. **Optimistic with rollback** - Update immediately, revert on error

### Rationale

- Strategy games need instant feel
- Users expect immediate feedback
- TanStack Query has built-in rollback support
- Server is authoritative, so rollback is safe

### Consequences

- More complex mutation logic
- Must track previous state
- Error handling with toast notifications required

---

## ADR-004: Real Pixel Art From Start

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Create real pixel art assets before coding game UI, not placeholders.

### Alternatives Considered

1. **Placeholders first** - Geometric shapes, replace later
2. **Real art first** - Create sprites before UI code
3. **Parallel** - Code and art simultaneously

### Rationale

- User preference (confirmed in planning)
- Avoids rework when integrating real art
- Ensures consistent visual style from start
- PixiJS setup depends on sprite atlas format

### Consequences

- Week 1 focused on art spike
- Some coding can parallel (project setup, schema)
- Game UI coding blocked until art complete

---

## ADR-005: Testing Framework Choice

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Use Vitest for unit/integration tests, Playwright for E2E tests.

### Alternatives Considered

1. **Jest + Cypress** - More established, larger ecosystem
2. **Vitest + Playwright** - Modern, faster, better Next.js integration
3. **Minimal testing** - Only critical paths

### Rationale

- User preference (confirmed in planning)
- Vitest is faster than Jest
- Playwright has better modern browser support
- Both integrate well with Next.js 14+

### Consequences

- Need to configure both frameworks
- Test database setup for integration tests
- CI pipeline must run both test types

---

## ADR-006: Single Building/Research Queue

**Date:** 2026-01-05
**Status:** Accepted

### Decision

One building queue per planet, one research queue globally (like Ogame).

### Alternatives Considered

1. **Multiple queues** - Queue up several builds
2. **Single queue** - One at a time
3. **Premium queue slots** - Pay for more slots

### Rationale

- Matches Ogame's proven model
- Creates meaningful decisions (what to build next)
- Simpler implementation
- No pay-to-win queue slots

### Consequences

- Players must wait or cancel current build
- Queue cancellation returns 100% resources
- Must prevent queue while one is active

---

## ADR-007: Ship Queue Individual Processing

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Ships are built one at a time from queue, each with its own completion time.

### Alternatives Considered

1. **Batch completion** - All ships finish at once
2. **Individual completion** - One ship at a time
3. **Parallel building** - Multiple ships simultaneously

### Rationale

- Matches Ogame behavior
- More engaging (see progress: "3/10 complete")
- Allows partial queue cancellation
- Cron job processes naturally (check currentShipEndTime)

### Consequences

- ShipQueue needs `completedCount` and `currentShipEndTime` fields
- Cron job must update next ship time after each completion
- UI shows "Building X (3/10)"

---

## ADR-008: 100% Refund on Cancel

**Date:** 2026-01-05
**Status:** Accepted

### Decision

Cancelling any queue returns 100% of resources (no penalty).

### Alternatives Considered

1. **No refund** - Resources lost on cancel
2. **Partial refund** - 50% or time-based
3. **Full refund** - 100% resources returned

### Rationale

- Player-friendly for MVP
- Simpler implementation
- Encourages experimentation
- Can adjust post-MVP if needed for balance

### Consequences

- Must track original costs in queue
- Atomic operation: update resources + mark cancelled
- Players can freely change plans

---

## ADR-009: Prisma 7 with pg Adapter

**Date:** 2026-01-06
**Status:** Accepted

### Decision

Use Prisma 7 with @prisma/adapter-pg for database connections instead of Prisma Accelerate.

### Alternatives Considered

1. **Prisma Accelerate** - Managed connection pooling service
2. **pg adapter** - Direct PostgreSQL connections via node-postgres
3. **Older Prisma version** - Use Prisma 5/6 with built-in URL config

### Rationale

- Prisma 7 removes datasource URL from schema (must use config or adapter)
- pg adapter provides direct connection without additional service dependency
- Supabase already provides connection pooling via Supavisor
- Avoids Prisma Accelerate costs for MVP

### Consequences

- Must configure pg Pool in client instantiation
- Requires @prisma/adapter-pg and pg dependencies
- Connection string passed to Pool, not PrismaClient directly
