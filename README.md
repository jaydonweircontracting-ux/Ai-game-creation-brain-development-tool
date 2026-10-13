# AI Game Creation Brain — Development Tool

Reusable game-creation engines, AI/automation tooling, and brain
(operating instructions) extracted from a real shipped game project.

**Source game (read-only extraction):**
https://github.com/jaydonweircontracting-ux/Adventure-game-

**Scope:** game-creation files, AI files, and brain files only.
No game-specific content lives here — no story, quests, items, maps,
named NPCs, or rendering. See `MANIFEST.md` for the full catalog and
`instructions/OPERATING_RULES.md` before using these engines with agents.

## What's inside

| Directory | Contents |
|---|---|
| `engines/` | 25 pure TypeScript modules: noise, terrain, elevation, world clock, geology/ore, skills/XP, settlement math, organic towns, collision, spatial hash, flow fields, entity pooling, work queue, sim LOD, persistence/migrations, map-builder helpers, seeded hashing, full WFC chain (core + dungeon/infra/town/world), a roguelike dungeon-crawler rules engine, a civilization sim, and analytic road travel |
| `scripts/` | Build stamping, code indexing, reuse search, bounded retry |
| `brain/` | The unified dev loop (CONTEXT → INVESTIGATE → TEST → VERIFY → LEARN) + coordination scripts |
| `agents/` | Agent worker patterns |
| `instructions/` | Operating rules for agents working with these engines |
| `adapters/` | The one-way adapter pattern (engine stays pure; game-specific code adapts to it) |
| `generators/`, `testing/`, `telemetry/`, `recovery/`, `documentation/`, `examples/` | Generation systems, test harness patterns, telemetry, recovery protocol, project docs |

Every copied file carries a provenance header (source URL, origin path,
extraction date, purpose). Files needing adaptation are marked
**ADAPTER** with notes on what to swap.

## Using it

Import any `engines/` module directly — they are zero-dependency or
pure-chain TypeScript and compile standalone (`tsc --noEmit --strict`).

## Importing into Replit

Create a new Repl → **Import from GitHub** → paste this repo's URL.
