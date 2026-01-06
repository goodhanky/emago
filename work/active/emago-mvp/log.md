# Emago MVP - Progress Log

**Last Updated:** 2026-01-06
**Purpose:** Chronological record of progress and decisions

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
