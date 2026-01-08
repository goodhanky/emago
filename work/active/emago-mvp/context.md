# Emago MVP - Context Snapshot

**Last Updated:** 2026-01-08
**Purpose:** Resume in 2 minutes briefing for continuing work

---

## One-Liner

Building a web-based space strategy game (Ogame-inspired) with pixel art UI, lazy resource calculation, and server-side validation.

---

## Goals

- Single-player MVP with core gameplay loop: build, upgrade, research, build ships
- Pixel art retro aesthetics (Playful Retro tone)
- Zero pay-to-win foundation
- 30+ minute enjoyable gameplay session

## Non-Goals (Post-MVP)

- Fleet missions (no destinations in single-planet game)
- Multiplayer / combat
- Multiple races
- Colony system
- Cosmetic shop

---

## Status Snapshot

### Done

- [x] PRD v2.0 complete with verified formulas
- [x] Implementation plan created
- [x] User decisions confirmed (real pixel art, Vitest+Playwright, art spike first)
- [x] Next.js 16 + TypeScript + Tailwind initialized
- [x] ESLint + Prettier configured
- [x] Supabase project created and configured
- [x] Prisma 7 with pg adapter set up
- [x] Database schema created (11 tables)
- [x] GameConfig seeded (75 values)
- [x] Pixel art prompts created (47 assets documented)
- [x] Pixel art assets generated (42/42 core assets via GPT 5.2)
- [x] Authentication system (Supabase email/password)
- [x] Login/Register pages
- [x] Player registration API (creates Player + Planet + Buildings + Researches)
- [x] Game layout with navigation sidebar and resource bar
- [x] Dashboard page with planet info

### In Progress

- [ ] Formula engine implementation

### Next Up

1. Implement production/cost/time formulas
2. Create lazy resource calculator
3. Building system API + UI

### Blockers

- None

---

## Key Decisions (TL;DR)

| Decision             | Choice                    | Rationale                           |
| -------------------- | ------------------------- | ----------------------------------- |
| Resource calculation | Lazy (on read)            | Scales better, no background writes |
| Cron jobs            | Idempotent                | Safe to run multiple times          |
| UI updates           | Optimistic with rollback  | Instant feel                        |
| Art approach         | Real pixel art from start | Consistency, avoid rework           |
| Testing              | Vitest + Playwright       | Modern, fast, good Next.js support  |

---

## Key Files/Areas

| Area        | Path                             | Why                                    |
| ----------- | -------------------------------- | -------------------------------------- |
| PRD         | `/PRD-v2.0.md`                   | Source of truth for formulas, features |
| DB Schema   | `prisma/schema.prisma`           | Core data model                        |
| DB Client   | `src/lib/db/index.ts`            | Prisma client singleton                |
| Auth        | `src/lib/auth/`                  | Supabase browser/server clients        |
| Middleware  | `src/middleware.ts`              | Route protection                       |
| Game Layout | `src/app/(game)/layout.tsx`      | Navigation + resource bar              |
| Dashboard   | `src/app/(game)/dashboard/page.tsx` | Player dashboard                    |
| Sprites     | `public/sprites/`                | 42 pixel art assets                    |
| Formulas    | `src/lib/game/formulas/`         | Game economy calculations (TODO)       |

---

## Commands

```bash
# Development
npm run dev           # Start Next.js dev server

# Database
npm run db:migrate    # Run Prisma migrations
npm run db:seed       # Seed GameConfig
npm run db:studio     # Open Prisma Studio
npm run db:generate   # Regenerate Prisma client

# Build & Lint
npm run build         # Production build
npm run lint          # Run ESLint
npm run format        # Run Prettier
```

---

## Open Questions

1. **Domain/deployment:** Any specific domain or just Vercel preview URLs for now?

---

## Next 3 Actions

1. **Implement formula engine** - Production, cost, time, energy calculations from PRD
2. **Create lazy resource calculator** - Calculate resources on-demand with time delta
3. **Build buildings API** - GET/POST endpoints for upgrades with validation
