# Emago MVP - Context Snapshot

**Last Updated:** 2026-01-05
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
- [x] Sprite folder structure created

### In Progress

- [ ] Art asset generation (using AI with prompts from PIXEL_ART_PROMPTS.md)

### Next Up

1. Generate pixel art assets (resource icons, UI components first)
2. Authentication (Supabase email/password)
3. Game layout + navigation

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
| Art Prompts | `PIXEL_ART_PROMPTS.md`      | AI prompts for all 47 game assets      |
| Sprites     | `public/sprites/`           | Generated pixel art assets             |
| Formulas    | `src/lib/game/formulas/`    | Game economy calculations              |
| Lazy calc   | `src/lib/game/resources.ts` | Central resource calculation           |
| Validation  | `src/lib/game/validation/`  | Server-side checks                     |
| Cron jobs   | `src/app/api/cron/`         | Queue processing                       |

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

1. **Generate pixel art** - Use AI with prompts from PIXEL_ART_PROMPTS.md (resource icons + UI first)
2. **Enable Supabase Auth** - Configure email/password authentication
3. **Create auth pages** - Login/register pages with Supabase
