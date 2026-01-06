# Product Requirements Document (PRD)

## Emago - Space Strategy Game

**Version:** 2.0 - MVP (AI-Assisted Development)
**Art Direction:** Pixel Art Retro (Playful Retro tone) (Full Game)
**Date:** 2026-01-05
**Author:** Product Owner + AI Developer
**Status:** Ready for Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Goals](#project-goals)
3. [Target Audience](#target-audience)
4. [Game Overview](#game-overview)
5. [Art Direction & Visual Identity](#art-direction--visual-identity)
6. [Core Game Mechanics](#core-game-mechanics)
7. [Game Formulas](#game-formulas)
8. [Data Model](#data-model)
9. [Technical Architecture](#technical-architecture)
10. [MVP Feature Set](#mvp-feature-set)
11. [Post-MVP Features](#post-mvp-features)
12. [Development Roadmap](#development-roadmap)
13. [Success Metrics](#success-metrics)
14. [Appendix A: Building Cost Tables](#appendix-a-building-cost-tables)
15. [Appendix B: Production & Energy Tables](#appendix-b-production--energy-tables)

---

## Executive Summary

A web-based space strategy game inspired by Ogame, featuring asymmetric 3-race gameplay similar to StarCraft, presented in **retro pixel art**. Players manage planets, gather resources, research technologies, build fleets, and engage in tactical combat.

**MVP Focus:** Single-player experience with one race, focusing on perfecting the core gameplay loop (build → upgrade → research → build ships) with a complete **pixel-art UI + asset baseline**.

**Vision:** Rock-Paper-Scissors balance between three distinct races in a persistent multiplayer universe.

---

## Project Goals

### Primary Goals

- Create an engaging space strategy game with meaningful progression
- Build a solid foundation for asymmetric 3-race gameplay
- Learn modern web development through a passion project

### Secondary Goals

- Develop reusable game architecture for future expansion
- Create an active player community (post-MVP)
- Potentially monetize through optional cosmetics (far future)

---

## Target Audience

**Primary Audience:**

- Strategy game enthusiasts (Age: 25-45)
- Former Ogame/browser game players
- StarCraft fans looking for persistent strategy experience
- Players who enjoy slow-burn, long-term progression

**User Characteristics:**

- Willing to check in multiple times per day
- Enjoy planning and optimization
- Like competitive/comparative gameplay
- Comfortable with browser-based games

---

## Game Overview

### Core Concept

Manage a space empire through resource management, technological advancement, and fleet operations. The game runs in real-time (like Ogame), requiring periodic attention throughout the day.

### Key Differentiators

- **3-Race System**: Asymmetric gameplay similar to StarCraft (Terran/Zerg/Protoss balance)
- **Strategic Depth**: Each race has unique strengths, weaknesses, and playstyles
- **Rock-Paper-Scissors Balance**: No single "best" race, counter-strategies required
- **Pixel Art Retro UI/UX**: Full pixel-art presentation (UI + world) with modern usability (fast navigation, clear feedback, responsive layout)
- **Mobile-ready**: Desktop-first, but must be comfortable on mobile (legible text, usable touch targets)
- **Fair & Skill-Based**: Zero pay-to-win, success determined by strategy not wallet

### Lessons from Ogame (What We're Fixing)

**Research conducted on Ogame player communities revealed critical failure points:**

❌ **What Killed Ogame:**

- Pay-to-win dominance ($1000+ required to compete)
- 24/7 time commitment requiring sleep disruption (4AM fleet save alarms)
- Dead/dying universes (servers dying in 3 months vs years)
- Mid-game crushing by top players with no comeback mechanics
- Severe class imbalance (Discoverer overpowered, other classes unviable)
- Rampant botting with slow enforcement
- Content stagnation (no new features for years)
- Brutal new player experience (crushed before learning)

✅ **How Emago Fixes This:**

- **ZERO pay-to-win**: Cosmetics only, never power/resources
- **Single-player MVP**: No dead server problem
- **Balanced races**: All three viable, extensive testing, patch-ready
- **Fair play enforced**: Strong anti-cheat from day one
- **Content pipeline**: Regular updates planned (new ships, mechanics every 3-6 months)
- **Fleet save mechanics**: Strategic risk/reward (not removing core gameplay)

**Player Quote that Guides Us:**

> "OGame is no longer a race to see who has the greatest skill and knowledge of the game. It has become a game of who can spend the most and best." - We will NOT make this mistake.

---

## Art Direction & Visual Identity

### North Star

**Emago must look and feel like a premium retro pixel-art strategy game** (nostalgic visuals, modern usability). Pixel art applies to **everything**: UI, icons, backgrounds, buildings, ships, and combat scenes.

### Tone Options (Choose One "World Feel")

Tone is set to **Playful Retro (Arcade Space)**. Below are four viable directions; the chosen tone will drive palette, UI framing, sound, and narrative flavor:

1. **Playful Retro (Arcade Space)**

- **Palette:** brighter primaries + clean neutrals (high readability)
- **UI motifs:** chunky rounded pixel panels, cheerful alerts, "arcade cabinet" framing
- **Vibe:** optimistic, exploration-first, light humor in tooltips
- **Example:** "Build complete!" pops with a short 8-bit jingle and a starburst sprite

2. **Gritty Industrial (Salvage Sci‑Fi)**

- **Palette:** steel/ash + hazard accents (yellow/orange/red)
- **UI motifs:** riveted panels, warning stripes, utilitarian icons, "shipyard terminal" feel
- **Vibe:** hard work, scarcity, engineering pride
- **Example:** upgrades spark/weld; resource shortages trigger caution tape overlays

3. **Neon Synthwave (Retro-Future)**

- **Palette:** deep purples/blues + neon cyan/magenta highlights
- **UI motifs:** holographic pixel lines, waveform accents, minimal scanline effects
- **Vibe:** stylish, fast, "night city in space"
- **Example:** fleet counts glow subtly; buttons pulse on hover (still pixel-perfect)

4. **Cosmic Noir (Cold Space / Mystery)**

- **Palette:** dark/navy + muted teals with selective warm highlights
- **UI motifs:** thin pixel frames, starfield depth, subtle "radar" UI elements
- **Vibe:** quiet intensity, espionage/mystery undertone, high contrast silhouettes
- **Example:** combat UI feels like a surveillance console; logs read like debrief notes

> **Decision Gate (Phase 1):** Pick the tone and lock a master palette + UI kit before building many screens.

### Pixel Scale & Rendering Rules

Pixel scale is currently **TBD**. We will decide during an "Art Spike" in Phase 1.

**Recommended default to start (mobile-friendly):** **24px** baseline sprites with integer scaling where possible.

- **16px**: classic/chunky, but can get hard to read on mobile
- **24px**: good balance of detail + readability
- **32px**: very readable, but increases asset workload and screen density constraints

**Rendering requirements (non-negotiable):**

- Use nearest-neighbor rendering (no blur).
- Avoid fractional scaling for core sprites/UI; prefer integer scaling.
- UI layout must respect pixel grid (no "almost-aligned" borders).

### UI/UX Style Requirements (Pixel + Modern)

- Pixel-art UI components (panels, tabs, buttons, progress bars, badges).
- Clear hierarchy and fast navigation remain core goals (optimistic UI, strong tooltips).
- Mobile: prioritize **legibility** over "tiny authentic pixels."
  - Minimum tap targets and readable text sizes.
  - Collapsible panels and "summary-first" layouts on small screens.

### Battle Presentation (Future Combat)

When combat exists, it must be shown as a **simple pixel battle scene**:

- 2D side-view or top-down "tactical vignette" (pick one) with readable silhouettes
- Minimal animation frames (key poses > flashy effects)
- Combat report remains available as text, but the scene is the default presentation

### Asset Pipeline (MVP-Friendly)

- Use sprite atlases (texture packing) for UI + game objects.
- All icons must be pixel-styled (no Lucide/outline icon set in production UI).
- Establish naming conventions and versioning for sprites early to avoid rework.

### Audio Direction (Optional but Strongly Recommended)

- Retro UI sounds (click/confirm/warn) + subtle ambient loop matching chosen tone.
- Sounds should be short and non-fatiguing (players check in multiple times/day).

### Definition of Done (Art Consistency)

A feature is not "done" unless:

- Visuals are pixel-perfect (no blur) across common desktop resolutions and mobile breakpoints.
- Uses the approved palette + UI kit components.
- Icons/illustrations follow the same pixel scale rules.

## Monetization Strategy

### Core Philosophy: ZERO Pay-to-Win

**HARD RULES (Non-Negotiable):**

- ❌ **NEVER sell**: Resources, time skips, power, stat boosts, research speed
- ❌ **NEVER sell**: Ships, buildings, technologies, advantages
- ✅ **Only sell**: Cosmetics, visual variety, personalization

### MVP Monetization

**For MVP (Single-Player):**

- **FREE, period.**
- Dark Matter: Track login streaks only (daily login + weekly streak bonus)
- No cosmetic shop (just accumulate DM for future use)
- No achievements (deferred to post-MVP)
- Focus on building great game first

**Post-MVP (Multiplayer):**

- Cosmetic shop using Dark Matter
- Achievement system that awards DM
- All gameplay features remain free forever
- **No real-money purchases** - Dark Matter earned through play only

**Emago's Promise:**

> "Your success is determined by strategy, planning, and skill. Your wallet doesn't matter. A player who spends $0 can beat a player who spends $1000."

---

## Core Game Mechanics

### 1. Resource System

Based on Ogame's proven model with three primary resources plus a cosmetic currency:

**Primary Resources:**

- **Metal** - Basic construction material, most abundant
- **Crystal** - Advanced technology component, moderate rarity
- **Deuterium** - Fuel and high-tech research, rarest resource

**Cosmetic Currency:**

- **Dark Matter (DM)** - Cosmetic-only currency, cannot be purchased with real money
  - MVP: Earned through daily logins only (10 DM/day, 100 DM weekly streak)
  - Post-MVP: Also earned through achievements
  - Used exclusively for cosmetics (post-MVP shop)
  - **NEVER** affects gameplay, stats, or progression

**Resource Mechanics:**

- Continuous production based on mine levels (Metal, Crystal, Deuterium)
- Storage capacity limits (upgrades required)
- Production rates affected by:
  - Mine level
  - Energy availability
  - Race bonuses (future)
  - Research bonuses

### 2. Planet & Colony Management

**Home Planet:**

- Starting planet with enough resources for a fair start (same for every player)
- Limited building slots (expands with upgrades)
- Core of empire operations

**Starting Planet Configuration:**
| Attribute | Value |
|-----------|-------|
| Starting Metal | 500 |
| Starting Crystal | 500 |
| Starting Deuterium | 0 |
| Starting Energy | 0 |
| All Buildings | Level 0 |
| Planet Temperature | 25°C (fixed for MVP simplicity) |
| Planet Fields | 163 (standard size) |

**Colonies (Future - Post-MVP Phase 2):**

- Expand to new planets
- Different planet types with different bonuses
- Distance affects fleet travel time

**Building System:**

- Buildings produce resources (mines)
- Buildings enable capabilities (shipyard, research lab)
- Buildings provide storage (warehouses)
- Building queue (one at a time)
- Construction time based on cost and facility level

### 3. Research System

**Technology Trees:**

- **Resource Technologies**: Improve mining efficiency
- **Ship Technologies**: Unlock new ship types, improve stats
- **Defense Technologies**: Improve planetary defenses (future)
- **Drive Technologies**: Faster fleet travel
- **Weapons & Shields**: Combat effectiveness (future)
- **Computer Technology**: Fleet slots

**Research Mechanics:**

- Requires Research Lab
- Only one research at a time (global)
- Research persists across all planets
- Prerequisites required for advanced tech
- **Race-Specific Branches (Future)**: Each race has unique tech paths

### 4. Shipyard & Fleet System

**Ship Types (Baseline for MVP - Dominion Race):**

| Ship Class        | Role      | Cost   | Speed  | Combat       |
| ----------------- | --------- | ------ | ------ | ------------ |
| **Small Cargo**   | Transport | Low    | Fast   | Weak         |
| **Large Cargo**   | Transport | Medium | Slow   | Weak         |
| **Light Fighter** | Combat    | Low    | Fast   | Light attack |
| **Heavy Fighter** | Combat    | Medium | Medium | Heavy attack |
| **Cruiser**       | Combat    | High   | Medium | Anti-fighter |

**MVP Scope (Ships Only, No Missions):**

- Build ships in shipyard queue
- Ships are displayed on planet ("Your Fleet")
- Ship stats visible (speed, cargo, combat power)
- **Fleet missions are POST-MVP** (no destinations in single-planet game)

**Post-MVP Fleet Mechanics:**

- Organize ships into fleets
- Send fleets on missions (Transport, Deploy, Attack, etc.)
- Fleet travel time based on distance
- Fuel consumption

### 5. Time-Based Progression

**Real-Time Mechanics:**

- Buildings construct over time (seconds to hours)
- Research completes over time (minutes to days)
- Ships build over time (seconds to hours)
- Resources accumulate over time (continuous)

**Player Interaction Pattern:**

- Morning: Check overnight production, queue new builds
- Midday: Check progress, adjust production
- Evening: Review progress, plan next phase
- Similar to Ogame's "check in 3-5 times per day" model

### 6. Queue Cancellation Mechanics

**Building Queue Cancellation:**

- Player can cancel an in-progress building upgrade
- **Refund:** 100% of resources returned (no penalty for MVP)
- Queue status changes to CANCELLED
- Building level remains unchanged

**Research Queue Cancellation:**

- Player can cancel an in-progress research
- **Refund:** 100% of resources returned
- Queue status changes to CANCELLED
- Tech level remains unchanged

**Ship Queue Cancellation:**

- Player can cancel remaining ships in queue
- **Refund:** 100% for ships not yet started
- Ships already completed remain on planet
- Partial batches: completed ships stay, rest refunded

**Rationale:** 100% refund for MVP simplifies logic and is player-friendly. Post-MVP may introduce partial refunds for balance.

### 7. Fair Play Infrastructure (MVP)

**Prevention (Day One):**

- Rate limiting on all API endpoints
- Server-side validation of all actions
- Impossible action detection (e.g., can't build without resources)
- Timing validation (can't complete in 1 second what takes 10 minutes)
- Database integrity constraints

**Logging:**

- Log all game actions with timestamps
- Establish patterns for future multiplayer analysis

**Why This Matters:**

> "Botting has become a part of OGame culture... with no improvements on the horizon"

We will NOT let this happen. Fair play is non-negotiable.

---

## Game Formulas

### CRITICAL: All formulas use values from GameConfig table (not hardcoded)

### NOTE: All formulas verified against OGameX data (see Appendix A for reference tables)

### Resource Production (Lazy Calculation)

**Metal Mine Production:**

```
hourly_production = base_production * level * (1.1 ^ level) * energy_factor
```

- `base_production`: 30 (from GameConfig)
- `level`: Current mine level
- `energy_factor`: min(1.0, available_energy / required_energy)

**Crystal Mine Production:**

```
hourly_production = base_production * level * (1.1 ^ level) * energy_factor
```

- `base_production`: 20 (from GameConfig)

**Deuterium Synthesizer Production:**

```
hourly_production = base_production * level * (1.1 ^ level) * energy_factor * temperature_factor
```

- `base_production`: 10 (from GameConfig)
- `temperature_factor`: 1.36 - 0.004 \* planet_temperature

**Solar Plant Energy:**

```
energy_output = base_energy * level * (1.1 ^ level)
```

- `base_energy`: 20 (from GameConfig)

### Energy Consumption

**Metal Mine:**

```
energy_consumption = 10 * level * (1.1 ^ level)
```

**Crystal Mine:**

```
energy_consumption = 10 * level * (1.1 ^ level)
```

**Deuterium Synthesizer:**

```
energy_consumption = 20 * level * (1.1 ^ level)
```

**Energy Factor Calculation:**

```
total_consumption = metal_mine_consumption + crystal_mine_consumption + deuterium_consumption
energy_factor = min(1.0, total_energy_production / total_consumption)
```

- If `energy_factor < 1.0`, ALL mine production is reduced proportionally
- Display warning in UI when energy deficit occurs

### Building Costs

> **Note:** All costs verified against OGameX. See Appendix A for pre-calculated tables.

**Metal Mine:**

```
metal_cost = 80 * (1.5 ^ (level - 1))
crystal_cost = 20 * (1.5 ^ (level - 1))
```

**Crystal Mine:**

```
metal_cost = 64 * (1.5 ^ (level - 1))
crystal_cost = 32 * (1.5 ^ (level - 1))
```

**Deuterium Synthesizer:**

```
metal_cost = 340 * (1.5 ^ (level - 1))
crystal_cost = 100 * (1.5 ^ (level - 1))
```

**Solar Plant:**

```
metal_cost = 100 * (1.5 ^ (level - 1))
crystal_cost = 40 * (1.5 ^ (level - 1))
```

**Metal Storage:**

```
metal_cost = 10000 * (2 ^ level)
```

- Note: Level 1 costs 20,000 metal (10000 \* 2^1)

**Crystal Storage:**

```
metal_cost = 10000 * (2 ^ level)
crystal_cost = 5000 * (2 ^ level)
```

- Note: Level 1 costs 20,000 metal + 10,000 crystal

**Deuterium Tank:**

```
metal_cost = 10000 * (2 ^ level)
crystal_cost = 10000 * (2 ^ level)
```

- Note: Level 1 costs 20,000 metal + 20,000 crystal

**Research Lab:**

```
metal_cost = 200 * (2 ^ (level - 1))
crystal_cost = 400 * (2 ^ (level - 1))
deuterium_cost = 200 * (2 ^ (level - 1))
```

**Shipyard:**

```
metal_cost = 400 * (2 ^ (level - 1))
crystal_cost = 200 * (2 ^ (level - 1))
deuterium_cost = 100 * (2 ^ (level - 1))
```

**Robot Factory:**

```
metal_cost = 400 * (2 ^ (level - 1))
crystal_cost = 120 * (2 ^ (level - 1))
deuterium_cost = 200 * (2 ^ (level - 1))
```

**Nanite Factory:**

```
metal_cost = 1000000 * (2 ^ (level - 1))
crystal_cost = 500000 * (2 ^ (level - 1))
deuterium_cost = 100000 * (2 ^ (level - 1))
```

**Fusion Reactor (Post-MVP):**

```
metal_cost = 900 * (2 ^ (level - 1))
crystal_cost = 360 * (2 ^ (level - 1))
deuterium_cost = 180 * (2 ^ (level - 1))
```

### Building Prerequisites

| Building              | Prerequisites                                           |
| --------------------- | ------------------------------------------------------- |
| Metal Mine            | None                                                    |
| Crystal Mine          | None                                                    |
| Deuterium Synthesizer | None                                                    |
| Solar Plant           | None                                                    |
| Metal Storage         | None                                                    |
| Crystal Storage       | None                                                    |
| Deuterium Tank        | None                                                    |
| Research Lab          | None                                                    |
| Robot Factory         | None                                                    |
| Shipyard              | Robot Factory 2                                         |
| Nanite Factory        | Robot Factory 10, Computer Technology 10                |
| Fusion Reactor        | Deuterium Synthesizer 5, Energy Technology 3 (Post-MVP) |

### Building Time

```
construction_seconds = (metal_cost + crystal_cost) / (2500 * (1 + robot_factory_level) * (2 ^ nanite_factory_level)) * 3600
```

- Minimum: 1 second
- Robot Factory reduces time linearly
- Nanite Factory reduces time exponentially

### Research Costs

**Energy Technology:**

```
crystal_cost = 800 * (2 ^ (level - 1))
deuterium_cost = 400 * (2 ^ (level - 1))
```

**Computer Technology:**

```
crystal_cost = 400 * (2 ^ (level - 1))
deuterium_cost = 600 * (2 ^ (level - 1))
```

**Weapons Technology:**

```
metal_cost = 800 * (2 ^ (level - 1))
crystal_cost = 200 * (2 ^ (level - 1))
```

**Shielding Technology:**

```
metal_cost = 200 * (2 ^ (level - 1))
crystal_cost = 600 * (2 ^ (level - 1))
```

**Armor Technology:**

```
metal_cost = 1000 * (2 ^ (level - 1))
```

**Combustion Drive:**

```
metal_cost = 400 * (2 ^ (level - 1))
deuterium_cost = 600 * (2 ^ (level - 1))
```

**Impulse Drive:**

```
metal_cost = 2000 * (2 ^ (level - 1))
crystal_cost = 4000 * (2 ^ (level - 1))
deuterium_cost = 600 * (2 ^ (level - 1))
```

**Hyperspace Drive:**

```
metal_cost = 10000 * (2 ^ (level - 1))
crystal_cost = 20000 * (2 ^ (level - 1))
deuterium_cost = 6000 * (2 ^ (level - 1))
```

**Espionage Technology:**

```
metal_cost = 200 * (2 ^ (level - 1))
crystal_cost = 1000 * (2 ^ (level - 1))
deuterium_cost = 200 * (2 ^ (level - 1))
```

### Research Prerequisites

| Technology           | Research Lab Level | Prerequisites           |
| -------------------- | ------------------ | ----------------------- |
| Energy Technology    | 1                  | None                    |
| Computer Technology  | 1                  | None                    |
| Weapons Technology   | 4                  | None                    |
| Shielding Technology | 6                  | Energy Technology 3     |
| Armor Technology     | 2                  | None                    |
| Combustion Drive     | 1                  | Energy Technology 1     |
| Impulse Drive        | 2                  | Energy Technology 1     |
| Hyperspace Drive     | 7                  | Hyperspace Technology 3 |
| Espionage Technology | 3                  | None                    |

### Research Time

```
research_seconds = (metal_cost + crystal_cost + deuterium_cost) / (1000 * (1 + research_lab_level)) * 3600
```

### Ship Costs

| Ship          | Metal  | Crystal | Deuterium | Cargo  | Speed  | Fuel/unit |
| ------------- | ------ | ------- | --------- | ------ | ------ | --------- |
| Small Cargo   | 2,000  | 2,000   | 0         | 5,000  | 5,000  | 10        |
| Large Cargo   | 6,000  | 6,000   | 0         | 25,000 | 7,500  | 50        |
| Light Fighter | 3,000  | 1,000   | 0         | 50     | 12,500 | 20        |
| Heavy Fighter | 6,000  | 4,000   | 0         | 100    | 10,000 | 75        |
| Cruiser       | 20,000 | 7,000   | 2,000     | 800    | 15,000 | 300       |

### Ship Combat Stats

| Ship          | Hull   | Shield | Weapon |
| ------------- | ------ | ------ | ------ |
| Small Cargo   | 4,000  | 10     | 5      |
| Large Cargo   | 12,000 | 25     | 5      |
| Light Fighter | 4,000  | 10     | 50     |
| Heavy Fighter | 10,000 | 25     | 150    |
| Cruiser       | 27,000 | 50     | 400    |

### Ship Prerequisites

| Ship          | Shipyard Level | Research Prerequisites                |
| ------------- | -------------- | ------------------------------------- |
| Small Cargo   | 2              | Combustion Drive 2                    |
| Large Cargo   | 4              | Combustion Drive 6                    |
| Light Fighter | 1              | Combustion Drive 1                    |
| Heavy Fighter | 3              | Armor Technology 2, Impulse Drive 2   |
| Cruiser       | 5              | Impulse Drive 4, Weapons Technology 2 |

### Ship Build Time

```
build_seconds = (metal_cost + crystal_cost) / (2500 * (1 + shipyard_level) * (2 ^ nanite_factory_level)) * 3600
```

### Ship Queue Processing

Ships are built **one at a time** from the queue:

- Each ship has its own build time
- Cron job completes ships individually as each finishes
- UI displays: "Building Light Fighter (3/10) - 2:34 remaining"
- `completed_count` field tracks progress within a batch

### Storage Capacity

```
storage_capacity = 5000 * floor(2.5 * e^(20 * level / 33))
```

**Reference Table:**

| Storage Level | Capacity  |
| ------------- | --------- |
| 0             | 10,000    |
| 1             | 20,000    |
| 2             | 40,000    |
| 3             | 75,000    |
| 4             | 140,000   |
| 5             | 255,000   |
| 10            | 2,550,000 |

### Fleet Formulas (Post-MVP Reference)

**Fleet Travel Time:**

```
distance = sqrt((x2-x1)^2 + (y2-y1)^2) * 1000
duration_seconds = (10 + (35000 / speed_percentage) * sqrt(10 * distance / slowest_ship_speed)) * 3600
```

**Fuel Consumption:**

```
fuel = sum_for_each_ship(base_fuel * ship_count * distance / 35000 * (speed_percentage / 100)^2)
```

---

## Data Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (auth.users)                        │
│  id, email, created_at                                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ 1:1
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           PLAYER                                 │
│  id, user_id, username, dark_matter_balance,                    │
│  last_login_at, login_streak, created_at                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼ 1:N           ▼ 1:N           ▼ 1:N (post-MVP)
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│      PLANET       │ │    RESEARCH     │ │      FLEET      │
│  id, player_id,   │ │  id, player_id, │ │  (post-MVP)     │
│  name, coord_x,   │ │  tech_type,     │ │                 │
│  coord_y,         │ │  level,         │ │                 │
│  temperature,     │ │  updated_at     │ │                 │
│  fields,          │ └─────────────────┘ │                 │
│  metal,           │                     │                 │
│  crystal,         │                     │                 │
│  deuterium,       │                     │                 │
│  last_resource_   │                     │                 │
│  update           │                     │                 │
└───────────────────┘                     └─────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────┐     ┌───────────────────┐
│     BUILDING      │     │   PLANET_SHIP     │
│  id, planet_id,   │     │  id, planet_id,   │
│  building_type,   │     │  ship_type,       │
│  level            │     │  count            │
└───────────────────┘     └───────────────────┘
```

### Queue Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                      BUILDING_QUEUE                              │
│  id, planet_id, building_type, target_level,                    │
│  start_time, end_time, status                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      RESEARCH_QUEUE                              │
│  id, player_id (unique), tech_type, target_level,               │
│  planet_id, start_time, end_time, status                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        SHIP_QUEUE                                │
│  id, planet_id, ship_type, quantity, completed_count,           │
│  start_time, end_time, current_ship_end_time, status            │
└─────────────────────────────────────────────────────────────────┘
```

**Ship Queue Fields Explained:**

- `quantity`: Total ships requested (e.g., 10)
- `completed_count`: Ships finished so far (e.g., 3)
- `current_ship_end_time`: When the current single ship finishes
- `end_time`: When the entire batch will be done

### Configuration & Audit Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                       GAME_CONFIG                                │
│  key (unique), value (JSON), description, updated_at            │
│                                                                  │
│  Examples:                                                       │
│  - key: "METAL_MINE_BASE_PRODUCTION", value: 30                 │
│  - key: "METAL_MINE_BASE_METAL_COST", value: 80                 │
│  - key: "METAL_MINE_BASE_CRYSTAL_COST", value: 20               │
│  - key: "BUILDING_COST_MULTIPLIER", value: 1.5                  │
│  - key: "GAME_SPEED", value: 1.0                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DARK_MATTER_LEDGER                            │
│  id, player_id, amount (+/-), reason, reference_id,             │
│  balance_after, created_at                                      │
│                                                                  │
│  MVP Examples (login only):                                      │
│  - amount: +10, reason: "DAILY_LOGIN"                           │
│  - amount: +100, reason: "WEEKLY_STREAK"                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ACTION_LOG                                  │
│  id, player_id, action_type, details (JSON),                    │
│  ip_address, created_at                                         │
│                                                                  │
│  For anti-cheat audit trail                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Key Relationships

| Entity | Relationship | Entity                          |
| ------ | ------------ | ------------------------------- |
| User   | 1:1          | Player                          |
| Player | 1:1          | Planet (MVP: one planet only)   |
| Player | 1:N          | Research                        |
| Player | 0:1          | ResearchQueue (only one active) |
| Player | 1:N          | DarkMatterLedger                |
| Player | 1:N          | ActionLog                       |
| Planet | 1:N          | Building                        |
| Planet | 0:1          | BuildingQueue (only one active) |
| Planet | 1:N          | ShipQueue                       |
| Planet | 1:N          | PlanetShip                      |

### Enums

**BuildingType:** METAL_MINE, CRYSTAL_MINE, DEUTERIUM_SYNTHESIZER, SOLAR_PLANT, METAL_STORAGE, CRYSTAL_STORAGE, DEUTERIUM_TANK, RESEARCH_LAB, SHIPYARD, ROBOT_FACTORY, NANITE_FACTORY

**TechType:** ENERGY, COMPUTER, WEAPONS, SHIELDING, ARMOR, COMBUSTION_DRIVE, IMPULSE_DRIVE, HYPERSPACE_DRIVE, ESPIONAGE

**ShipType:** SMALL_CARGO, LARGE_CARGO, LIGHT_FIGHTER, HEAVY_FIGHTER, CRUISER

**QueueStatus:** IN_PROGRESS, COMPLETED, CANCELLED

---

## Technical Architecture

### Decisions Made

| Question             | Decision                                      | Rationale                                                                  |
| -------------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| Real-time updates    | **Polling (10-30 sec) + client-side ticking** | Simplest for MVP                                                           |
| Resource calculation | **Lazy Calculation**                          | Calculate on read, not background                                          |
| Session management   | **Supabase Auth**                             | Built-in, works with database                                              |
| Image assets         | **Pixel art sprite atlases**                  | Pixel art applies to the full game; no non-pixel icon set in production UI |
| Error tracking       | **Vercel logs**                               | Free, sufficient for MVP                                                   |
| Game balance storage | **Database (GameConfig)**                     | Live tuning without redeploy                                               |
| Fleet missions       | **Deferred to Post-MVP**                      | No destinations in single-planet MVP                                       |

### CRITICAL: Lazy Calculation Architecture

**Problem with Background Updates:**
Updating resources every minute for all players doesn't scale. With 1,000 players, that's 1,000+ database writes per minute.

**Solution: Calculate on Read (Lazy Calculation)**

Resources are NOT updated in the background. Instead:

1. **Store:** `last_resource_update` timestamp and production rates
2. **On Read:** Calculate current resources mathematically
3. **On Write:** Validate resources exist, then update timestamp

```typescript
// Lazy resource calculation
function getCurrentResources(planet: Planet): Resources {
  const now = Date.now()
  const hoursSinceUpdate = (now - planet.lastResourceUpdate.getTime()) / 3600000

  return {
    metal: Math.min(
      planet.metal + planet.metalPerHour * hoursSinceUpdate,
      getStorageCapacity(planet, 'metal')
    ),
    crystal: Math.min(
      planet.crystal + planet.crystalPerHour * hoursSinceUpdate,
      getStorageCapacity(planet, 'crystal')
    ),
    deuterium: Math.min(
      planet.deuterium + planet.deuteriumPerHour * hoursSinceUpdate,
      getStorageCapacity(planet, 'deuterium')
    ),
  }
}

// When spending resources (e.g., building upgrade)
async function spendResources(planet: Planet, cost: Resources): Promise<boolean> {
  const current = getCurrentResources(planet)

  if (
    current.metal < cost.metal ||
    current.crystal < cost.crystal ||
    current.deuterium < cost.deuterium
  ) {
    return false // REJECT - anti-cheat validation
  }

  // Update stored values and timestamp atomically
  await prisma.planet.update({
    where: { id: planet.id },
    data: {
      metal: current.metal - cost.metal,
      crystal: current.crystal - cost.crystal,
      deuterium: current.deuterium - cost.deuterium,
      lastResourceUpdate: new Date(),
    },
  })

  return true
}
```

### Cron Job Design (Idempotent)

**CRITICAL: Cron jobs must be safe to run multiple times (idempotent)**

```typescript
// GOOD: Idempotent queue processing
async function processCompletedBuildings() {
  const now = new Date()

  // Only get IN_PROGRESS items that are past endTime
  const completed = await prisma.buildingQueue.findMany({
    where: {
      status: 'IN_PROGRESS',
      endTime: { lte: now },
    },
  })

  for (const item of completed) {
    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Double-check status hasn't changed (prevents race conditions)
      const current = await tx.buildingQueue.findUnique({
        where: { id: item.id },
      })

      if (current?.status !== 'IN_PROGRESS') {
        return // Already processed, skip
      }

      // Update building level
      await tx.building.upsert({
        where: { planetId_type: { planetId: item.planetId, type: item.buildingType } },
        update: { level: item.targetLevel },
        create: { planetId: item.planetId, type: item.buildingType, level: item.targetLevel },
      })

      // Mark queue item as completed
      await tx.buildingQueue.update({
        where: { id: item.id },
        data: { status: 'COMPLETED' },
      })

      // Recalculate production rates if mine was upgraded
      await recalculateProductionRates(tx, item.planetId)
    })
  }
}
```

**Ship Queue Processing (Individual Ships):**

```typescript
async function processShipQueue() {
  const now = new Date()

  const activeQueues = await prisma.shipQueue.findMany({
    where: {
      status: 'IN_PROGRESS',
      currentShipEndTime: { lte: now },
    },
  })

  for (const queue of activeQueues) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.shipQueue.findUnique({ where: { id: queue.id } })
      if (current?.status !== 'IN_PROGRESS') return

      // Add completed ship to planet
      await tx.planetShip.upsert({
        where: { planetId_shipType: { planetId: queue.planetId, shipType: queue.shipType } },
        update: { count: { increment: 1 } },
        create: { planetId: queue.planetId, shipType: queue.shipType, count: 1 },
      })

      const newCompletedCount = current.completedCount + 1

      if (newCompletedCount >= current.quantity) {
        // All ships done
        await tx.shipQueue.update({
          where: { id: queue.id },
          data: { status: 'COMPLETED', completedCount: newCompletedCount },
        })
      } else {
        // More ships to build - update next ship end time
        const shipBuildTime = calculateShipBuildTime(queue.shipType, queue.planetId)
        await tx.shipQueue.update({
          where: { id: queue.id },
          data: {
            completedCount: newCompletedCount,
            currentShipEndTime: new Date(now.getTime() + shipBuildTime * 1000),
          },
        })
      }
    })
  }
}
```

**What Cron Jobs Process (Discrete Events Only):**

- Building completion → update building level, recalculate rates
- Research completion → update tech level
- Ship construction completion → add ships to PlanetShip (one at a time)

**What Cron Jobs DON'T Process:**

- ❌ Resource accumulation (calculated on read)

**Cron Schedule:**

```
Every 1 minute: Process completion queues (idempotent)
  - BuildingQueue: endTime <= now AND status = IN_PROGRESS
  - ResearchQueue: endTime <= now AND status = IN_PROGRESS
  - ShipQueue: currentShipEndTime <= now AND status = IN_PROGRESS

Every 1 hour: Cleanup old logs
  - Delete ActionLog entries older than 30 days
```

### Frontend Stack

- **App Shell / Routing**: Next.js 14+ (App Router)
- **Primary Game Renderer (UI + World + Combat)**: PixiJS (WebGL) with a single canvas per "game session"
- **Language**: TypeScript
- **Styling**: Tailwind CSS (app shell + non-game pages). In-game UI uses pixel sprites (panels/buttons/icons), not a typical web component library.
- **UI Primitives (Optional, for non-canvas overlays)**: Radix UI (headless) for accessible dialogs/menus on login/settings pages
- **Icons**: Custom pixel icon set (sprite atlas). No generic icon pack in production UI.
- **State Management**: Zustand (shared store usable by React + Pixi) + TanStack Query (server state)
- **Data Fetching (Reads)**: Server endpoints (preferred) + TanStack Query
- **Auth Client**: Supabase Client (session/login only)
- **Audio**: Howler.js (SFX + ambient loops)
- **Asset Pipeline**: Aseprite → spritesheets/atlases (TexturePacker or equivalent) + bitmap fonts (BMFont) for crisp pixel text

**Rationale (Pixel-Art Optimization):**

- Canvas/WebGL sprite rendering provides consistent pixel-perfect visuals, smoother animation, and better performance for a retro game UI than DOM-first components.
- React remains ideal for routing/auth/settings, but the _game_ runs in a renderer designed for games.

### Pixel Rendering (Web)

- **Pixel-perfect filtering**: force nearest-neighbor for all sprites (no smoothing).
  - PixiJS: `SCALE_MODE = NEAREST`, mipmaps **off**, and `roundPixels = true` where appropriate.
  - Canvas CSS: `image-rendering: pixelated` (plus `crisp-edges` fallback where supported).
- **Resolution & scaling**: render to a fixed internal resolution (e.g., 640×360 or 800×450) and scale up by **integer multipliers** when possible.
  - Provide a player-facing **UI Scale** setting (2x / 3x / 4x) to keep the experience legible on both desktop and mobile without blur.
- **Performance**: sprite atlases + batching; avoid many small image requests; keep effects "retro" (short loops, few frames).
- **Mobile**: "fit-to-viewport" layout with safe-area padding; clamp minimum readable text; large tap targets for primary actions.

### Client-Side Resource Display

```typescript
// Client-side ticking display (no server calls)
function useResourceTicker(planet: Planet) {
  const [resources, setResources] = useState(calculateResources(planet))

  useEffect(() => {
    const interval = setInterval(() => {
      // Recalculate locally every second for smooth display
      setResources(calculateResources(planet))
    }, 1000)

    return () => clearInterval(interval)
  }, [planet])

  return resources
}

// Poll server every 10-30 seconds for authoritative state
const { data: planet } = useQuery({
  queryKey: ['planet', planetId],
  queryFn: () => fetchPlanet(planetId),
  refetchInterval: 15000, // 15 seconds
})
```

### Optimistic UI Pattern (React Query)

```typescript
const upgradeMutation = useMutation({
  mutationFn: (buildingType: string) => api.upgradeBuilding(planetId, buildingType),

  onMutate: async (buildingType) => {
    await queryClient.cancelQueries(['planet', planetId])
    const previous = queryClient.getQueryData(['planet', planetId])

    // Optimistic update
    queryClient.setQueryData(['planet', planetId], (old: Planet) => ({
      ...old,
      buildingQueue: { buildingType, status: 'IN_PROGRESS' },
    }))

    return { previous }
  },

  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['planet', planetId], context?.previous)
    toast.error('Upgrade failed: ' + err.message)
  },

  onSettled: () => {
    queryClient.invalidateQueries(['planet', planetId])
  },
})
```

### Backend Stack

- **Runtime**: Node.js (Next.js route handlers / API routes for MVP)
- **API Style**: JSON HTTP (server-authoritative for all game mutations)
- **Database Access (Server)**: Prisma → Supabase Postgres connection string (transactions/atomic updates)
- **Authentication**: Supabase Auth (JWT sessions); server verifies user identity for requests
- **Validation**: Zod (schema validation)
- **Background Jobs (Post-MVP / scale)**: BullMQ + Redis (ticks, fleet arrivals, notifications)

**Why this change (beyond Frontend):**

- Pixel art doesn't affect backend directly, but **server-authoritative writes** are essential for anti-cheat and consistent battle reports.
- Using Prisma server-side avoids relying on client-side database calls for any state that impacts gameplay.

### Database

- **Primary DB**: Supabase PostgreSQL (managed)
- **Schema & Migrations**: Prisma Migrate
- **Row-Level Security (RLS)**: Use for user-owned _read_ access where helpful, but keep **game mutations** behind server endpoints for integrity
- **Battle Data Model (for pixel battle scene)**: Store a compact, deterministic **battle event timeline** (or seed + event list) so the client can replay animations consistently

### Hosting & Deployment

- **Web App (App Shell + API routes)**: Vercel (Next.js)
- **Database + Auth**: Supabase
- **Static Game Assets (Sprites/SFX)**: Supabase Storage (MVP) **or** S3/Cloudflare R2 (recommended if assets grow)
- **CDN**: Fronted by Vercel/Supabase CDN; ensure long-cache + hash-based filenames for atlases
- **CI/CD**: Vercel Git integration + asset build pipeline (atlas generation) in CI

**Asset Build Pipeline (Required)**

- Aseprite sources → atlas pack (TexturePacker / free alternatives) → JSON metadata
- Bitmap font export (BMFont) → packaged with atlases
- Automated "pixel lint": nearest-neighbor settings, integer scale previews, palette checks

### Performance Requirements

| Metric            | Target                    |
| ----------------- | ------------------------- |
| Initial page load | < 2 seconds               |
| Menu navigation   | < 1 second                |
| Action buttons    | Instant (optimistic UI)   |
| API response time | < 200ms (95th percentile) |
| Database queries  | < 100ms average           |

### Anti-Cheat Validation Flow

```
User clicks "Upgrade Metal Mine to Level 5"
    ↓
Client: Optimistic UI update (show "Upgrading...")
    ↓
API Route receives request
    ↓
Step 1: Authenticate user (Supabase Auth)
    ↓
Step 2: Rate limit check (max 10 actions/minute)
    ↓
Step 3: Load planet data
    ↓
Step 4: LAZY CALCULATE current resources
    ↓
Step 5: Validate:
  - Does player own this planet?
  - Is building queue empty?
  - Are there enough resources? (lazy calculated)
  - Are prerequisites met?
    ↓
Step 6: If valid → Deduct resources, create queue entry, log action
        If invalid → Return error, log suspicious activity
    ↓
Client: On success → keep optimistic state
        On error → ROLLBACK UI, show error message
```

---

## MVP Feature Set

### ✅ Must Have (Core Loop)

#### Authentication & Account

- [ ] Email/password registration
- [ ] Login/logout
- [ ] Session persistence

#### Dashboard

- [ ] Display current resources (Metal, Crystal, Deuterium, Energy) - lazy calculated
- [ ] Resource production rates per hour
- [ ] Current queues status (building, research, shipyard)
- [ ] Quick navigation to all sections
- [ ] Dark Matter balance display

#### Planet View

- [ ] Building list with current levels
- [ ] Upgrade buttons with cost/time display
- [ ] Building queue indicator (one active build)
- [ ] Resource storage capacity indicators

#### Buildings (11 types)

- [ ] Metal Mine (levels 1-25)
- [ ] Crystal Mine (levels 1-25)
- [ ] Deuterium Synthesizer (levels 1-25)
- [ ] Solar Plant (levels 1-30)
- [ ] Metal Storage
- [ ] Crystal Storage
- [ ] Deuterium Tank
- [ ] Research Lab
- [ ] Shipyard
- [ ] Robot Factory
- [ ] Nanite Factory

#### Research Lab Interface

- [ ] Available technologies list
- [ ] Current research progress
- [ ] Prerequisites display
- [ ] Research queue (one active globally)

#### Technologies (9 types)

- [ ] Energy Technology
- [ ] Computer Technology
- [ ] Weapons Technology
- [ ] Shielding Technology
- [ ] Armor Technology
- [ ] Combustion Drive
- [ ] Impulse Drive
- [ ] Hyperspace Drive
- [ ] Espionage Technology

#### Shipyard Interface

- [ ] Available ship types (5 for MVP)
- [ ] Ship build costs and time
- [ ] Production queue with progress (X/Y complete)
- [ ] Ship statistics display

#### Ships (5 types)

- [ ] Small Cargo Ship
- [ ] Large Cargo Ship
- [ ] Light Fighter
- [ ] Heavy Fighter
- [ ] Cruiser

#### Fleet Display (Build Only - No Missions)

- [ ] View all ships stationed on planet
- [ ] Ship counts and totals
- [ ] "Fleet missions coming soon" placeholder
- [ ] Ship stats display (speed, cargo, combat power)

#### Queue System

- [ ] Building queue (one at a time per planet)
- [ ] Research queue (one at a time globally)
- [ ] Shipyard queue (can queue multiple ships, built one at a time)
- [ ] Queue cancellation with full refund
- [ ] Cron job processing completions (idempotent, every 60 seconds)

#### Help & Tooltips

- [ ] Tooltips on all buildings, tech, ships
- [ ] Cost and time information
- [ ] Prerequisite indicators
- [ ] Basic "Getting Started" guide (static page)

#### Fair Play (MVP Foundation)

- [ ] Server-side validation for all actions (with lazy resource calculation)
- [ ] Rate limiting on API endpoints (10 actions/minute)
- [ ] Action logging with timestamps (ActionLog table)
- [ ] Resource validation before any spend operation

#### Dark Matter (Login Rewards Only)

- [ ] Track last login timestamp
- [ ] Track login streak (consecutive days)
- [ ] Display DM balance in UI
- [ ] Award DM on login:
  - 10 DM for daily login
  - 100 DM bonus for 7-day streak (resets streak counter)
- [ ] DarkMatterLedger - immutable transaction log
- [ ] No shop, no spending - just accumulation for future

### ⚠️ Nice to Have (If Time Permits)

- [ ] Dark mode toggle
- [ ] Optional CRT/scanline effect toggle (off by default)
- [ ] Basic sound effects
- [ ] Resource production graphs
- [ ] Galaxy view placeholder (visual only)
- [ ] Simple Admin View (read-only player states)

### ❌ Explicitly Out of Scope for MVP

- ❌ Fleet missions (Transport, Deploy, Attack) - no destinations
- ❌ Multiplayer functionality
- ❌ AI opponents / NPC combat
- ❌ Player vs Player combat
- ❌ Second and third races
- ❌ Colony system (multiple planets)
- ❌ Alliance/guild system
- ❌ Chat system
- ❌ Espionage missions
- ❌ Leaderboards
- ❌ Achievement system (beyond login tracking)
- ❌ Cosmetic shop (DM spending)
- ❌ Mobile native apps
- ❌ WebSockets/real-time push
- ❌ Full admin panel with edit capability

---

## Post-MVP Features

_High-level roadmap (detailed specs in separate document):_

### Phase 2: Combat & Colonies

- Colony ships and multiple planets (gives fleets destinations!)
- Fleet missions (Transport, Deploy)
- Basic NPC pirate raids (optional combat introduction)
- Galaxy map with coordinates
- Defense structures

### Phase 3: Full Combat

- Player vs Player combat
- **Pixel battle scene**: simple 2D combat vignette (default) + text report
- Espionage missions
- Combat reports and replays
- Advanced defense structures

### Phase 4: Race Diversity

- Broodkin race (swarm/Zerg-like)
- Xelari race (tech/Protoss-like)
- Race-specific ships, buildings, research

### Phase 5: Multiplayer & Social

- Real-time multiplayer universe
- Alliance system
- Trade system
- Leaderboards
- Chat system

### Phase 6: Retention & Polish

- Achievement system (with DM rewards)
- Cosmetic shop
- Daily quests
- Seasonal events
- Mobile optimization

---

## Development Roadmap

**Development Approach:** AI-assisted development with human oversight
**Timeline:** Estimated 14-18 weeks for MVP (reduced scope: no fleet missions)

### Phase 1: Foundation (Weeks 1-3)

**Goal:** Core infrastructure, pixel-art foundation, and basic UI

**Art Spike (Week 1):**

- [ ] Choose **tone** (Playful Retro / Gritty Industrial / Neon Synthwave / Cosmic Noir)
- [ ] Decide **pixel scale** (16/24/32) and lock a master palette
- [ ] Create a minimal **pixel UI kit v0** (panels/buttons/tabs/badges) + pixel font choice
- [ ] Establish sprite atlas pipeline + naming conventions

- [ ] Set up project repository (Next.js + TypeScript)
- [ ] Set up Supabase project (database, auth)
- [ ] Implement database schema (Prisma)
  - Include GameConfig table with initial values
  - Include DarkMatterLedger table
  - Include ActionLog table
- [ ] Configure Supabase Auth (email/password)
- [ ] Create main layout and navigation
- [ ] Build dashboard page (static mockup)
- [ ] Implement authentication flow
- [ ] Seed GameConfig with formula constants (see Appendix A)

**Deliverable:** Working login + basic UI shell + database

---

### Phase 2: Resource System (Weeks 4-6)

**Goal:** Working resource economy with lazy calculation

- [ ] Implement lazy resource calculation functions
- [ ] Create building system (all 11 buildings)
- [ ] Build queue system with completion time tracking
- [ ] Queue cancellation with refund
- [ ] Vercel Cron job (idempotent) for building completions
- [ ] Storage system with capacity limits
- [ ] Energy system (production vs consumption)
- [ ] UI for building upgrades with optimistic updates + rollback
- [ ] Client-side resource ticking display
- [ ] Polling for authoritative state (every 15 seconds)

**Deliverable:** Can build mines and see resources grow

---

### Phase 3: Research System (Weeks 7-9)

**Goal:** Technology progression

- [ ] Design research tech tree (9 technologies)
- [ ] Implement research prerequisites
- [ ] Create research queue system (one global)
- [ ] Build research UI
- [ ] Research completion processing (cron)
- [ ] Display research effects on game

**Deliverable:** Full research system working

---

### Phase 4: Shipyard (Weeks 10-12)

**Goal:** Build ships and display fleet

- [ ] Implement shipyard building requirements
- [ ] Create ship entities (5 types)
- [ ] Ship build queue system (individual ship processing)
- [ ] PlanetShip tracking (ships on planet)
- [ ] Fleet display UI ("Your Ships")
- [ ] Ship statistics display
- [ ] "Fleet missions coming in future update" placeholder

**Deliverable:** Can build ships, see fleet strength

---

### Phase 5: Polish & Testing (Weeks 13-14)

**Goal:** MVP ready for play

- [ ] Comprehensive testing of all systems
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Add tooltips and help text
- [ ] Balance tuning (adjust GameConfig values)
- [ ] Documentation

**Deliverable:** Polished MVP, ready to play

---

### Buffer (Weeks 15-18)

**Goal:** Handle overruns and additional polish

- [ ] Address any delayed features
- [ ] Additional testing
- [ ] User feedback incorporation
- [ ] Prepare for Phase 2 (Colonies) planning

---

## Success Metrics

### MVP Success Criteria

- [ ] Can create account and login
- [ ] Can build and upgrade all 11 buildings to level 10+
- [ ] Can research all 9 technologies
- [ ] Can build all 5 ship types
- [ ] Ships display correctly on planet
- [ ] **Actions feel instant** (optimistic UI with rollback)
- [ ] **Navigation is fast** (< 1 second between pages)
- [ ] **Resource display ticks smoothly** (client-side calculation)
- [ ] **Pixel-perfect rendering** (no blur) on desktop + mobile breakpoints
- [ ] **Art consistency**: UI kit + icons + sprites match chosen tone
- [ ] All queues process correctly (cron jobs stable and idempotent)
- [ ] No game-breaking bugs
- [ ] **Enjoyable to play for 30+ minutes** (qualitative check)
- [ ] Satisfying progression loop for 2+ weeks

### Technical Metrics

| Metric                   | Target      |
| ------------------------ | ----------- |
| Initial page load        | < 2 seconds |
| Menu navigation          | < 1 second  |
| API response time (95th) | < 200ms     |
| Database queries (avg)   | < 100ms     |
| Cron job processing      | < 5 seconds |
| Uptime                   | 99%         |
| Data loss incidents      | Zero        |

---

## Design Principles

### Art Direction Principles

1. **Pixel-Perfect Consistency**: one pixel scale per asset group; no mixed densities
2. **Readable Silhouettes**: ships/buildings must be recognizable at a glance
3. **Modern Usability**: retro visuals, not retro frustration (clear feedback, tooltips, fast navigation)
4. **Mobile Legibility**: UI must remain readable and tappable on phones

### Gameplay Principles

1. **Respect Player Time**: Progress happens while offline
2. **Skill Over Wallet**: Zero pay-to-win, cosmetics only
3. **Meaningful Choices**: Every upgrade/research matters
4. **Clear Feedback**: Always show why/what/when

### Technical Principles

1. **Lazy Calculation**: Calculate on read, not background writes
2. **Idempotent Operations**: Safe to retry any operation
3. **Optimistic UI**: Actions update immediately, rollback on error
4. **Performance First**: Few DB writes, fast reads
5. **Data Integrity**: Never lose player progress

### Development Principles

1. **Iterative Development**: Build incrementally, test frequently
2. **Human Validation**: Test and approve each phase
3. **Don't Over-Engineer**: YAGNI - MVP first
4. **Scope Discipline**: If it's not in MVP, it waits

---

## Risks & Mitigations

### Technical Risks

| Risk                                               | Likelihood | Impact | Mitigation                                                                       |
| -------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------- |
| Pixel art production workload / inconsistent style | Medium     | High   | Lock tone + palette + pixel scale early; build UI kit; enforce review checklist  |
| Mobile pixel readability issues                    | Medium     | Medium | Set minimum font sizes/tap targets; test early on phones; allow UI scale setting |
| Database design mistakes                           | High       | High   | Use Prisma migrations, can refactor                                              |
| Lazy calculation edge cases                        | Medium     | Medium | Thorough testing, handle overflow/caps                                           |
| Cron job failures                                  | Medium     | Medium | Idempotent design, status field checks                                           |
| Optimistic UI sync issues                          | Medium     | Medium | Proper rollback, React Query patterns                                            |

### Scope Risks

| Risk                       | Likelihood | Impact | Mitigation                                |
| -------------------------- | ---------- | ------ | ----------------------------------------- |
| Feature creep              | High       | High   | Strict MVP scope, explicit "out of scope" |
| "Just one more feature"    | High       | Medium | Fleet missions explicitly deferred        |
| Underestimating complexity | High       | Medium | 18-week timeline has 4-week buffer        |

---

## Appendix A: Building Cost Tables

> **Source:** OGameX (Vega server) - verified data
> **Note:** Numbers use period (.) as thousands separator

### Metal Mine

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 80      | 20      | 0         |
| 2     | 118     | 29      | 0         |
| 3     | 175     | 43      | 0         |
| 4     | 259     | 64      | 0         |
| 5     | 383     | 95      | 0         |
| 6     | 568     | 142     | 0         |
| 7     | 840     | 210     | 0         |
| 8     | 1.244   | 311     | 0         |
| 9     | 1.841   | 460     | 0         |
| 10    | 2.725   | 681     | 0         |
| 11    | 4.033   | 1.008   | 0         |
| 12    | 5.969   | 1.492   | 0         |
| 13    | 8.835   | 2.208   | 0         |
| 14    | 13.076  | 3.269   | 0         |
| 15    | 19.353  | 4.838   | 0         |
| 16    | 28.642  | 7.160   | 0         |
| 17    | 42.391  | 10.597  | 0         |
| 18    | 62.739  | 15.684  | 0         |
| 19    | 92.854  | 23.213  | 0         |
| 20    | 137.423 | 34.355  | 0         |

### Crystal Mine

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 64      | 32      | 0         |
| 2     | 94      | 47      | 0         |
| 3     | 140     | 70      | 0         |
| 4     | 207     | 103     | 0         |
| 5     | 307     | 153     | 0         |
| 6     | 454     | 227     | 0         |
| 7     | 672     | 336     | 0         |
| 8     | 995     | 497     | 0         |
| 9     | 1.473   | 736     | 0         |
| 10    | 2.180   | 1.090   | 0         |
| 11    | 3.226   | 1.613   | 0         |
| 12    | 4.775   | 2.387   | 0         |
| 13    | 7.068   | 3.534   | 0         |
| 14    | 10.461  | 5.230   | 0         |
| 15    | 15.482  | 7.741   | 0         |
| 16    | 22.914  | 11.457  | 0         |
| 17    | 33.913  | 16.956  | 0         |
| 18    | 50.191  | 25.095  | 0         |
| 19    | 74.283  | 37.141  | 0         |
| 20    | 109.939 | 54.969  | 0         |

### Deuterium Synthesizer

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 340     | 100     | 0         |
| 2     | 503     | 148     | 0         |
| 3     | 744     | 219     | 0         |
| 4     | 1.102   | 324     | 0         |
| 5     | 1.631   | 479     | 0         |
| 6     | 2.414   | 710     | 0         |
| 7     | 3.573   | 1.050   | 0         |
| 8     | 5.288   | 1.555   | 0         |
| 9     | 7.826   | 2.301   | 0         |
| 10    | 11.583  | 3.406   | 0         |
| 11    | 17.143  | 5.042   | 0         |
| 12    | 25.372  | 7.462   | 0         |
| 13    | 37.550  | 11.044  | 0         |
| 14    | 55.575  | 16.345  | 0         |
| 15    | 82.251  | 24.191  | 0         |
| 16    | 121.731 | 35.803  | 0         |
| 17    | 180.163 | 52.989  | 0         |
| 18    | 266.641 | 78.424  | 0         |
| 19    | 394.629 | 116.067 | 0         |
| 20    | 584.051 | 171.779 | 0         |

### Solar Plant

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 100     | 40      | 0         |
| 2     | 150     | 60      | 0         |
| 3     | 225     | 90      | 0         |
| 4     | 337     | 135     | 0         |
| 5     | 506     | 202     | 0         |
| 6     | 759     | 303     | 0         |
| 7     | 1.139   | 455     | 0         |
| 8     | 1.708   | 683     | 0         |
| 9     | 2.562   | 1.025   | 0         |
| 10    | 3.844   | 1.537   | 0         |
| 11    | 5.766   | 2.306   | 0         |
| 12    | 8.649   | 3.459   | 0         |
| 13    | 12.974  | 5.189   | 0         |
| 14    | 19.461  | 7.784   | 0         |
| 15    | 29.192  | 11.677  | 0         |
| 16    | 43.789  | 17.515  | 0         |
| 17    | 65.684  | 26.273  | 0         |
| 18    | 98.526  | 39.410  | 0         |
| 19    | 147.789 | 59.115  | 0         |
| 20    | 221.683 | 88.673  | 0         |

### Metal Storage

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 20.000  | 0       | 0         |
| 2     | 30.000  | 0       | 0         |
| 3     | 45.000  | 0       | 0         |
| 4     | 67.500  | 0       | 0         |
| 5     | 101.250 | 0       | 0         |
| 6     | 151.875 | 0       | 0         |
| 7     | 227.812 | 0       | 0         |
| 8     | 341.718 | 0       | 0         |
| 9     | 512.578 | 0       | 0         |
| 10    | 768.867 | 0       | 0         |

### Crystal Storage

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 20.000  | 10.000  | 0         |
| 2     | 30.000  | 15.000  | 0         |
| 3     | 45.000  | 22.500  | 0         |
| 4     | 67.500  | 33.750  | 0         |
| 5     | 101.250 | 50.625  | 0         |
| 6     | 151.875 | 75.937  | 0         |
| 7     | 227.812 | 113.906 | 0         |
| 8     | 341.718 | 170.859 | 0         |
| 9     | 512.578 | 256.289 | 0         |
| 10    | 768.867 | 384.433 | 0         |

### Deuterium Tank

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 20.000  | 20.000  | 0         |
| 2     | 30.000  | 30.000  | 0         |
| 3     | 45.000  | 45.000  | 0         |
| 4     | 67.500  | 67.500  | 0         |
| 5     | 101.250 | 101.250 | 0         |
| 6     | 151.875 | 151.875 | 0         |
| 7     | 227.812 | 227.812 | 0         |
| 8     | 341.718 | 341.718 | 0         |
| 9     | 512.578 | 512.578 | 0         |
| 10    | 768.867 | 768.867 | 0         |

### Robot Factory

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 400     | 120     | 200       |
| 2     | 800     | 240     | 400       |
| 3     | 1.600   | 480     | 800       |
| 4     | 3.200   | 960     | 1.600     |
| 5     | 6.400   | 1.920   | 3.200     |
| 6     | 12.800  | 3.840   | 6.400     |
| 7     | 25.600  | 7.680   | 12.800    |
| 8     | 51.200  | 15.360  | 25.600    |
| 9     | 102.400 | 30.720  | 51.200    |
| 10    | 204.800 | 61.440  | 102.400   |

### Shipyard

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 400     | 200     | 100       |
| 2     | 800     | 400     | 200       |
| 3     | 1.600   | 800     | 400       |
| 4     | 3.200   | 1.600   | 800       |
| 5     | 6.400   | 3.200   | 1.600     |
| 6     | 12.800  | 6.400   | 3.200     |
| 7     | 25.600  | 12.800  | 6.400     |
| 8     | 51.200  | 25.600  | 12.800    |
| 9     | 102.400 | 51.200  | 25.600    |
| 10    | 204.800 | 102.400 | 51.200    |

### Research Lab

| Level | Metal   | Crystal | Deuterium |
| ----- | ------- | ------- | --------- |
| 1     | 200     | 400     | 200       |
| 2     | 400     | 800     | 400       |
| 3     | 800     | 1.600   | 800       |
| 4     | 1.600   | 3.200   | 1.600     |
| 5     | 3.200   | 6.400   | 3.200     |
| 6     | 6.400   | 12.800  | 6.400     |
| 7     | 12.800  | 25.600  | 12.800    |
| 8     | 25.600  | 51.200  | 25.600    |
| 9     | 51.200  | 102.400 | 51.200    |
| 10    | 102.400 | 204.800 | 102.400   |

### Nanite Factory

| Level | Metal      | Crystal   | Deuterium |
| ----- | ---------- | --------- | --------- |
| 1     | 1.000.000  | 500.000   | 100.000   |
| 2     | 2.000.000  | 1.000.000 | 200.000   |
| 3     | 4.000.000  | 2.000.000 | 400.000   |
| 4     | 8.000.000  | 4.000.000 | 800.000   |
| 5     | 16.000.000 | 8.000.000 | 1.600.000 |

---

## Appendix B: Production & Energy Tables

> **Source:** OGameX (Vega server) - verified data

### Metal Mine Production & Energy

| Level | Production/hr | Energy Consumption |
| ----- | ------------- | ------------------ |
| 1     | 33            | 11                 |
| 2     | 73            | 24                 |
| 3     | 120           | 40                 |
| 4     | 176           | 59                 |
| 5     | 242           | 81                 |
| 6     | 319           | 106                |
| 7     | 409           | 136                |
| 8     | 514           | 171                |
| 9     | 637           | 212                |
| 10    | 778           | 259                |
| 11    | 942           | 314                |
| 12    | 1.130         | 377                |
| 13    | 1.346         | 449                |
| 14    | 1.595         | 532                |
| 15    | 1.880         | 627                |

### Crystal Mine Production & Energy

| Level | Production/hr | Energy Consumption |
| ----- | ------------- | ------------------ |
| 1     | 29            | 11                 |
| 2     | 63            | 24                 |
| 3     | 104           | 40                 |
| 4     | 152           | 59                 |
| 5     | 209           | 81                 |
| 6     | 276           | 106                |
| 7     | 355           | 136                |
| 8     | 446           | 171                |
| 9     | 552           | 212                |
| 10    | 674           | 259                |
| 11    | 816           | 314                |
| 12    | 979           | 377                |
| 13    | 1.167         | 449                |
| 14    | 1.382         | 532                |
| 15    | 1.629         | 627                |

### Deuterium Synthesizer Production & Energy

> **Note:** Production varies by planet temperature. Values shown for 25°C.

| Level | Production/hr | Energy Consumption |
| ----- | ------------- | ------------------ |
| 1     | 10            | 22                 |
| 2     | 22            | 48                 |
| 3     | 36            | 80                 |
| 4     | 53            | 117                |
| 5     | 73            | 161                |
| 6     | 97            | 213                |
| 7     | 124           | 273                |
| 8     | 156           | 343                |
| 9     | 193           | 424                |
| 10    | 236           | 519                |
| 11    | 285           | 628                |
| 12    | 342           | 753                |
| 13    | 408           | 898                |
| 14    | 483           | 1.063              |
| 15    | 569           | 1.253              |

### Solar Plant Energy Production

| Level | Energy Output |
| ----- | ------------- |
| 1     | 22            |
| 2     | 48            |
| 3     | 80            |
| 4     | 117           |
| 5     | 161           |
| 6     | 213           |
| 7     | 273           |
| 8     | 343           |
| 9     | 424           |
| 10    | 519           |
| 11    | 628           |
| 12    | 753           |
| 13    | 898           |
| 14    | 1.063         |
| 15    | 1.253         |

---

## Changelog

### Version 2.0 (2026-01-05)

- **Corrected Building Cost Formulas to Match OGameX**
  - Metal Mine: 80/20 base (was 60/15)
  - Crystal Mine: 64/32 base (was 48/24)
  - Deuterium Synthesizer: 340/100 base (was 225/75)
  - Solar Plant: 100/40 base (was 75/30)
  - Storage buildings: corrected formulas (10000 \* 2^level)
- **Added Appendix A: Building Cost Tables**
  - Pre-calculated costs for levels 1-20 (mines, solar)
  - Pre-calculated costs for levels 1-10 (facilities, storage)
  - Verified against OGameX data
- **Added Appendix B: Production & Energy Tables**
  - Production rates for levels 1-15
  - Energy consumption for levels 1-15
  - Solar plant output for levels 1-15
- **Added Fusion Reactor formula (Post-MVP)**
- **Updated GameConfig examples** to include base costs

### Version 1.9 (2026-01-05)

- Added Energy Consumption Formulas
- Added Missing Building Costs (Robot/Nanite/Storage)
- Added Building Prerequisites Table
- Added Research Prerequisites Table
- Added Ship Prerequisites Table
- Added Ship Combat Stats Table
- Added Research Costs for all 9 technologies
- Added Starting Planet Configuration
- Added Queue Cancellation Mechanics
- Updated Ship Queue Data Model
- Status changed to "Ready for Development"

### Version 1.8 (2026-01-05)

- Added **Pixel Art Retro** art direction as a core product requirement (UI + world)
- Added tone options + pixel scale decision gate (Phase 1 Art Spike)
- Updated technical stack guidance for pixel rendering + sprite atlases
- Added pixel battle scene requirement for future combat presentation
- Added new success metrics + risks for art consistency and mobile legibility

### Version 1.7 (2025-12-30)

- Resolved MVP Scope Contradictions
- Clarified Fleet MVP Scope
- Added Idempotent Cron Job Design
- Updated Client Architecture
- Reduced Timeline to 14-18 weeks
- Simplified Data Model

### Version 1.6 (2025-12-30)

- Added Lazy Calculation architecture
- Added complete Game Formulas section
- Added GameConfig, DarkMatterLedger, ActionLog tables

### Version 1.5 (2025-12-30)

- Added Data Model section
- Simplified Dark Matter system
- Extended timeline to 16-20 weeks

### Version 1.4 (2025-12-30)

- Restructured for AI-Assisted Development

### Version 1.0 (2025-12-27)

- Initial PRD creation

---

## Next Steps

1. ~~Choose Art Direction~~ - Playful Retro selected; finalize palette + pixel scale in Phase 1
2. ~~Approve this PRD~~ - **Version 2.0 is ready for development**
3. **Start Phase 1** - Project setup and database
4. **Seed GameConfig** - Use values from Appendix A
5. **Create Prisma Schema** - With updated ShipQueue fields

---

**Development Model:** AI builds → You test/approve → Iterate → Next phase

Your role is Product Owner: making game design decisions, testing features, and providing feedback. 🚀
