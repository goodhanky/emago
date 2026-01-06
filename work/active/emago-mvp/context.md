# Emago MVP - Context Snapshot

**Last Updated:** 2026-01-06
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

### In Progress

- [ ] Art spike (deferred - project setup done first)

### Next Up

1. Authentication (Supabase email/password)
2. Game layout + navigation
3. Formula engine implementation

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
| Art spike            | Complete before coding    | Avoid UI rework                     |

---

## Key Files/Areas

| Area        | Path                        | Why                                    |
| ----------- | --------------------------- | -------------------------------------- |
| PRD         | `/PRD-v2.0.md`              | Source of truth for formulas, features |
| DB Schema   | `prisma/schema.prisma`      | Core data model (created)              |
| DB Client   | `src/lib/db/index.ts`       | Prisma client singleton                |
| Formulas    | `src/lib/game/formulas/`    | Game economy calculations              |
| Lazy calc   | `src/lib/game/resources.ts` | Central resource calculation           |
| Validation  | `src/lib/game/validation/`  | Server-side checks                     |
| Cron jobs   | `src/app/api/cron/`         | Queue processing                       |
| Style guide | `STYLE_GUIDE.md`            | Art direction (to be created)          |

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

1. **Pixel art creation:** Will you create the sprites yourself or use a specific tool/asset pack?
2. **Domain/deployment:** Any specific domain or just Vercel preview URLs for now?

---

## Next 3 Actions

1. **Enable Supabase Auth** - Configure email/password authentication
2. **Create auth pages** - Login/register pages with Supabase
3. **Create game layout** - Navigation sidebar, resource bar component
