<!--
Game Creation Engines / Brain — reuse index.
Search this file before writing new code. Keyword -> file -> one-line purpose.
-->

# REUSE INDEX

## World generation

- **noise, perlin, value noise, seeded rng** → `engines/noise.ts` — deterministic noise primitives.
- **terrain noise, biome noise** → `engines/terrainNoise.ts` — terrain-oriented noise layer.
- **elevation, hills, cliffs, slopes** → `engines/elevation.ts` — elevation field queries (needs `noise.ts`).
- **ore, mining, deposits, geology** → `engines/geology.ts` — deterministic 6-tier ore layer, coordinate-hash placement, terrain-gated.
- **town, village, hamlet, houses, procedural town** → `engines/organicTowns.ts` — deterministic road-aware town generator.
- **settlement, layout, lanes, plaza** → `engines/settlements.ts` — settlement layout math; see `adapters/README.md` for the worked example.

## Simulation

- **clock, ticks, world time, seed** → `engines/worldCore.ts` — world clock/tick state, `DEFAULT_WORLD_SEED`.
- **spatial hash, proximity, neighbor query, NPC separation** → `engines/spatialHash.ts` — O(n) proximity queries.
- **flow field, pathfinding, crowd** → `engines/flowField.ts` — flow-field structures.
- **entity pool, object pool, GC** → `engines/entityPool.ts` — pooling to avoid GC churn.
- **work queue, budgeted, spread across ticks** → `engines/workQueue.ts` — budgeted deferred work.
- **LOD, level of detail, distant simulation** → `engines/simLod.ts` — full/reduced/abstract/statistical tiers.
- **collision, field collision, walkability** → `engines/fieldCollision.ts` — pure collision helpers.

## Player systems

- **skills, XP, levels, RuneScape-style** → `engines/skills.ts` — XP curve, level calc, level-up detection. Honesty rule: award XP only on real successful actions.
- **save, load, persistence, migration** → `engines/persistence.ts` — save-schema helpers, `migrateSave()` (needs `worldCore.ts`).

## Editor / tooling

- **tilemap, map editor, paint terrain** → `engines/mapBuilder.ts` — pure tilemap paint helpers.
- **build number, build marker, index.html stamp** → `scripts/prepare-build-entry.cjs` — `window.__AG_BUILD` injection at build time.
- **code index, module map, agent context** → `scripts/gen-code-index.mjs`
- **reuse search, find existing code** → `scripts/reuse-index.mjs`
- **retry, backoff, flaky commands** → `scripts/safe-run.mjs`

## Agent / brain systems

- **dev loop, investigate, verify, learn** → `brain/brain.mjs` — CONTEXT → INVESTIGATE → TEST → VERIFY → LEARN (adapt `docs/` paths).
- **orchestration, coordinate workers** → `brain/central-brain.mjs`
- **consistency audit, project health** → `brain/consistency-audit.mjs`
- **task discovery** → `brain/discover-tasks.mjs`
- **task context for workers** → `brain/task-context.mjs`
- **autonomous loop, checkpoint/resume, sessions** → `agents/autonomous-engine.mjs`
- **worker cycle** → `agents/worker.mjs`

## Testing

- **assertion harness, 55k assertions, determinism tests** → `testing/SIMULATE_PATTERN.md` — pattern + starter template + per-engine checklist.
- **playwright, real-game testing, test hooks, E2E** → `testing/PLAYWRIGHT_BRIDGE.md`, `testing/helpers.mjs` — test the running app, not mocks; serve locally (`?testmode=1`).
- **telemetry, gameplay events** → `telemetry/telemetry.mjs` — live event collection via Playwright (adapt hooks).

## Process knowledge

- **operating rules, engineering discipline** → `instructions/OPERATING_RULES.md` — 8 rules with source evidence.
- **adapter pattern, engine vs game** → `adapters/README.md` — one-way dependency, worked settlements example.
- **roadmap, architecture rules** → `documentation/ROADMAP.md`
- **recovery, self-healing, retry protocol** → `recovery/RECOVERY_PROTOCOL.md`
- **bug tracker, issue format** → `documentation/ISSUES.json`
- **build history** → `documentation/BUILD_HISTORY.json`
- **session continuity** → `documentation/CURRENT_STATE.md`

## Deliberately NOT here (game-specific)

quests, dialogue trees, item databases, named NPCs/landmarks, story lore,
the App.tsx game shell, iso renderer, sprite packs — these live in the game,
not the library. `npcNavigation.ts` (A*) is an adapter candidate pending
dependency-chain rewrite (see MANIFEST.md).
