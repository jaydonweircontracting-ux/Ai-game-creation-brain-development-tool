<!--
Game Creation Engines / Brain — library manifest.
Staging dir assembled 2026-10-13 from https://github.com/jaydonweircontracting-ux/Adventure-game-
-->

# MANIFEST

## Classifications

- **REUSABLE ENGINE** — pure, game-agnostic; import as-is.
- **TOOL** — dev/build script; runs standalone.
- **PATTERN DOC** — design pattern with a worked example; adapt the idea.
- **PROCESS KNOWLEDGE** — how the source project was run; adopt the practice.
- **GAME ADAPTER (reference)** — reusable idea with game-specific
  dependencies; copy only with its dependency chain.

## engines/ — REUSABLE ENGINE (all TypeScript, zero runtime deps)

| File | Purpose | Dependencies |
|---|---|---|
| `noise.ts` | Deterministic noise primitives | none |
| `terrainNoise.ts` | Terrain noise layer | none |
| `elevation.ts` | Elevation field queries | `noise.ts` |
| `worldCore.ts` | World clock/ticks, `DEFAULT_WORLD_SEED` | none |
| `geology.ts` | Deterministic ore-deposit layer (6 tiers) | none |
| `skills.ts` | Skill framework: XP curve, levels, level-ups | none |
| `settlements.ts` | Settlement layout math (rects, lanes, plaza) | none |
| `organicTowns.ts` | Deterministic organic town generator | none |
| `fieldCollision.ts` | Pure field collision helpers | none |
| `spatialHash.ts` | Spatial hash for O(n) proximity queries | none |
| `flowField.ts` | Flow-field pathfinding structures | none |
| `entityPool.ts` | Entity pooling (GC pressure) | none |
| `workQueue.ts` | Budgeted work queue across ticks | none |
| `simLod.ts` | Simulation LOD tiers | none |
| `persistence.ts` | Save-schema helpers + `migrateSave()` | `worldCore.ts` |
| `mapBuilder.ts` | Pure tilemap paint helpers (editor tooling) | none |

## scripts/ — TOOL

| File | Purpose |
|---|---|
| `prepare-build-entry.cjs` | Stamps `window.__AG_BUILD` into `index.html` at build time (npm `prebuild`). Adapt the template to your entry HTML. |
| `gen-code-index.mjs` | Generates a module map of a codebase for agents. |
| `reuse-index.mjs` | Searchable catalog of existing functionality. |
| `safe-run.mjs` | Bounded retry with exponential backoff for flaky commands. |

## brain/ — TOOL (adapt paths: references source repo `docs/` layout)

| File | Purpose |
|---|---|
| `brain.mjs` | Unified dev loop: CONTEXT → INVESTIGATE → TEST → VERIFY → LEARN |
| `central-brain.mjs` | Coordinates brain + worker + audit + reuse + discovery |
| `consistency-audit.mjs` | Project-state consistency checks |
| `discover-tasks.mjs` | Task discovery from codebase inspection |
| `task-context.mjs` | Task context loader for worker agents |

## agents/ — TOOL / PATTERN DOC

| File | Purpose |
|---|---|
| `autonomous-engine.mjs` | Persistent session controller with checkpoint/resume (`docs/sessions`). |
| `worker.mjs` | Worker agent cycle script (adapt to your task queue). |

## testing/ — PATTERN DOC + TOOL

| File | Purpose |
|---|---|
| `SIMULATE_PATTERN.md` | The 55k-assertion harness pattern (determinism, invariants, failure budget) with a starter template. The full `simulate.ts` was not copied (game-coupled). |
| `PLAYWRIGHT_BRIDGE.md` | Real-game testing: Playwright vs the running app via test hooks (`?testmode=1`), local serve (Chromium can't reach the net through some proxies). |
| `helpers.mjs` | Playwright helper library from the source bridge. |

## telemetry/ — PATTERN DOC

| File | Purpose |
|---|---|
| `telemetry.mjs` | Live gameplay telemetry via Playwright test hooks. Targets the source game's hooks — adapt the event list and hook names. |

## recovery/ — PROCESS KNOWLEDGE

| File | Purpose |
|---|---|
| `RECOVERY_PROTOCOL.md` | OBSERVE → EXECUTE → VERIFY → DIAGNOSE → RECOVER → RETRY; diagnose-before-retry, max attempts. |

## documentation/ — PROCESS KNOWLEDGE

| File | Purpose |
|---|---|
| `ROADMAP.md` | Standing architecture rules ("extend, never duplicate; never regress"). |
| `CODE_INDEX.md` | Example output of the code-index generator. |
| `CURRENT_STATE.md` | Session-continuity state file pattern. |
| `ISSUES.json` | Bug-tracker data pattern (statuses, severity, evidence). |
| `BUILD_HISTORY.json` | Build history log pattern. |
| `IMPROVEMENT_ENGINE.md` | Improvement-engine notes. |

## instructions/ — PROCESS KNOWLEDGE (synthesized)

| File | Purpose |
|---|---|
| `OPERATING_RULES.md` | 8 standing rules, each grounded in source-repo evidence. |

## adapters/ — PATTERN DOC

| File | Purpose |
|---|---|
| `README.md` | The adapter pattern + worked `settlements.ts` example (engine rects → renderer/collision/NPC homes/doorways). |

## Deliberately excluded (with reasons)

- `src/App.tsx` (~9k lines) — the game itself: UI, game loop wiring, rendering. Game-specific by definition.
- `src/game/quests.ts`, `dialogue.ts`, `items.ts`, `worldLore.ts`, `questGen.ts`, `npcBarks.ts`, `landmarks.ts`, `pointsOfInterest.ts`, `questSites.ts` — story/quest/item/named-content: game-specific content.
- `src/game/npcNavigation.ts` — reusable A* idea, but imports `landscape.ts` → `landmarks.ts` (game-specific named content). **Adapter candidate**: copy only with its dependency chain rewritten against your own terrain queries. Not copied as a pure engine.
- `src/game/iso/*`, `src/game/monsterSprites/*`, `public/lpc/*` — renderer and art assets; game-presentation specific.
- `scripts/simulate.ts` (6,655 lines) — assertion bodies are game-coupled; the *pattern* is captured in `testing/SIMULATE_PATTERN.md`.
- `scripts/sim-lab.ts`, `scripts/playtest.ts`, `scripts/benchmark.ts`, `scripts/stress.ts` — game-sim harnesses; patterns covered by `SIMULATE_PATTERN.md` / `PLAYWRIGHT_BRIDGE.md`.
- `scripts/check-deployment.sh` — deployment check for the source game's Pages setup; environment-specific.
- `tests/real-game/*.mjs` (per-test files) — game-behavior assertions; the bridge pattern (`helpers.mjs`, README) is copied.
- `docs/sessions/*`, `docs/memory/*` — ephemeral session logs, not reusable knowledge.
- Media-generation JSON under `public/buildings`, `public/props` — asset pipeline scratch.

## Unsure about (flagged, not copied)

- `src/game/wfc.ts` + `wfcWorld.ts`/`wfcTown.ts`/`wfcDungeon.ts`/`wfcInfra.ts` — Wave Function Collapse systems look reusable, but I did not verify their import chains or game-coupling in this pass. Recommend a follow-up audit before copying.
- `src/game/civilization.ts`, `travelers.ts`, `villageLife.ts` — NPC/society simulation; likely reusable patterns but import chains unverified.
- `src/game/stoneSoupEngine.ts` — dungeon mini-game engine; possibly reusable, unverified.
