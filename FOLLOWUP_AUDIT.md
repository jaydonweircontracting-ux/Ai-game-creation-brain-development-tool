<!--
Game Creation Engines / Brain — follow-up audit.
Staging audit assembled 2026-10-13 from https://github.com/jaydonweircontracting-ux/Adventure-game-
Source repo was READ-ONLY for this audit; nothing was modified.
-->

# FOLLOW-UP AUDIT — WFC, Civilization, Travelers, VillageLife, StoneSoup

Audited 2026-10-13. Each module's full import chain was traced by reading
the code (direct + transitive imports). Labels:

- **REUSABLE** — pure / game-agnostic, safe to copy.
- **GAME-COUPLED** — imports named game content, App.tsx, or a
  game-specific module (blocks clean extraction).
- **ADAPTER-CANDIDATE** — reusable idea/engine whose dependency needs a
  rewrite or data swap before it can be copied.

Verdicts at a glance:

| Module | Verdict |
|---|---|
| `src/game/wfc.ts` | COPY AS-IS |
| `src/game/wfcDungeon.ts` | COPY AS-IS |
| `src/game/wfcInfra.ts` | COPY AS-IS |
| `src/game/wfcTown.ts` | COPY AS-IS |
| `src/game/wfcWorld.ts` | COPY AS-IS |
| `src/game/civilization.ts` | COPY WITH ADAPTER NOTE |
| `src/game/travelers.ts` | COPY WITH ADAPTER NOTE |
| `src/game/villageLife.ts` | DO NOT COPY (document as pattern instead) |
| `src/game/stoneSoupEngine.ts` | COPY AS-IS |
| `src/game/npcNavigation.ts` | ADAPTER-CANDIDATE (interface sketch below) |

---

## 1. WFC chain — COPY AS-IS (all five files)

**`src/game/wfc.ts`** (291 lines) — Wave Function Collapse core engine:
tiles with directional sockets, compatibility rules, weighted collapse,
seeded RNG (`WfcSeededRng`), and the constraint solver.

Import chain:

- *(no imports)* — **REUSABLE**

**`src/game/wfcDungeon.ts`** (175 lines) — Dungeon tile set + generator
(floor/wall/door/corridor tiles with directional sockets; validates
entrance/exit reachability and no isolated sections).

- `./wfc` (`WfcTileSet`, `WfcTile`, `WfcSolver`, `WfcSeededRng`, `wfcSeedFor`) — **REUSABLE**

**`src/game/wfcInfra.ts`** (166 lines) — River/road infrastructure tiles
with directional sockets (e.g. a north–south river has WATER on N/S,
RIVERBANK on E/W, guaranteeing connectivity).

- `./wfc` (`WfcTileSet`, `WfcTile`) — **REUSABLE**

**`src/game/wfcTown.ts`** (60 lines) — Town layout tiles
(road/house/shop/farm/well/plaza/empty) with placement rules (houses on
paths, shops on main roads, farms on outskirts).

- `./wfc` (`WfcTileSet`) — **REUSABLE**

**`src/game/wfcWorld.ts`** (160 lines) — World-generation tile profiles:
biome tile set + elevation-band sockets (0=ocean … 5=peak).

- `./wfc` (`WfcTileSet`, `WfcTile`, `WfcSeededRng`, `WfcSolver`, `wfcSeedFor`) — **REUSABLE**

Verified by inspection:

- No file in the chain imports anything outside `./wfc`; `wfc.ts`
  itself has zero imports.
- No `Math.random` anywhere in the chain (determinism comes from
  `WfcSeededRng` / `wfcSeedFor`).
- No DOM/browser references, no App.tsx import.
- No game-specific names in code (the one mention of `worldMap.ts` is a
  comment noting the biome data was *mirrored inline* — the tile data is
  generic biome/elevation vocabulary, not game content).
- The earlier "import chains unverified" flag is now resolved: the chain
  is fully self-contained.

**Copy as-is.** `wfcWorld.ts`'s biome tiles are example profiles a
consumer can replace; that is normal data-driven use, not coupling.

---

## 2. `src/game/civilization.ts` — COPY WITH ADAPTER NOTE

(1550 lines) — Deterministic, clock-driven fantasy civilization
simulation: kingdoms + diplomacy, rulers with daily schedules, castles,
settlements with supply/demand economy and dynamic pricing, trade routes,
caravans (position = pure function of world clock), military units, world
events, and simulation LOD. No DOM, no App.tsx import, no `Math.random`
in sim decisions.

Import chain:

- `./worldCore` (`WorldClockState` type, `SeededRng`) — **REUSABLE**
  (already extracted).
- `./townsfolk` (`townsfolkHash`) — **ADAPTER-CANDIDATE**. The *module*
  is game-coupled (see §4), but the *function* is a pure 5-line integer
  hash (`townsfolk.ts:103-107`) with zero dependencies. It is used only
  for per-entity/per-day jitter — "never Math.random".

Game coupling (data, not logic):

- Hardcoded world-data tables: settlement list (Mosslight Crossing,
  Stormhaven, …), kingdoms (aldoria, thalara, …), trade routes, garrison
  units — all tied to the game's world seed and chunk coordinates.
- One comment references App.tsx ("settlements anchor to the real
  landmark chunks from App.tsx") — a comment, not an import.

**Adapter note for copying:**

1. Replace `import { townsfolkHash } from './townsfolk'` with a local
   5-line copy of the hash (or a new shared `hash.ts` in the library —
   recommended, since `travelers.ts` needs it too).
2. Replace the WORLD DATA tables (settlements, kingdoms, routes, units)
   with the consumer's own data. The simulation logic is data-driven;
   the tables are concentrated, not scattered through the logic.
3. Keep the `worldCore` imports (already in the library).

---

## 3. `src/game/travelers.ts` — COPY WITH ADAPTER NOTE

(199 lines) — Fully analytic road travel: travelers journey between
settlements along the road network; a traveler's position is a pure
function of (road link, world clock). No per-frame AI, no stored state.
Exports `buildRoadLinks` and `travelersForChunk`.

Import chain:

- `./worldCore` (`WorldClockState` type) — **REUSABLE**
- `./townsfolk` (`townsfolkHash`) — **ADAPTER-CANDIDATE** (same pure
  5-line hash as above; used for deterministic jitter).
- `./landmarks` (`LANDMARK_LIST`, `PlacedLandmark` type) —
  **GAME-COUPLED data, REUSABLE shape**. `landmarks.ts` itself has zero
  imports, but `LANDMARK_LIST` is named game content (Mosslight Crossing,
  Stormhaven, … at game-specific chunk coordinates validated against the
  game's world seed).

The coupling is exactly one default parameter:

```ts
export function buildRoadLinks(
  roadArmsFor: (chunk: { x: number; y: number }) => RoadArms,
  landmarks: PlacedLandmark[] = LANDMARK_LIST,   // <-- the only game tie
): RoadLink[]
```

The function already accepts landmarks as a parameter — it is nearly an
adapter already.

**Adapter note for copying:**

1. Drop the `LANDMARK_LIST` default (make `landmarks` a required
   parameter, or default it to a consumer-provided data file). Copy the
   `PlacedLandmark`/`Landmark` *type* shapes, not the game's table.
2. Replace the `townsfolkHash` import with the shared `hash.ts` copy.

---

## 4. `src/game/villageLife.ts` — DO NOT COPY

(475 lines) — Living-village layer on top of the townsfolk NPC
simulation: personality traits, age, needs, relationships, memories, a
lightweight personal economy, and village world events.

Import chain:

- `./townsfolk` (`townsfolkHash`, `townsfolkTarget`, `Townsperson`,
  `TownsfolkAnchors`, `TownsfolkTarget`, `TownsfolkArchetype`,
  `NPCMemory`) — **GAME-COUPLED**. Unlike `civilization.ts`/`travelers.ts`
  (which need only the hash), villageLife needs the actual NPC simulation
  types and functions.
- `./worldCore` (`WorldClockState` type) — **REUSABLE**

Why it cannot be extracted: `townsfolk.ts` is the game-specific NPC
engine. Its own chain drags in `npcNavigation` → `landscape` →
`landmarks` (game data), plus `housing`, `interiors`, `houseTypes`, and
`settlements` (Mosslight-specific layout data), plus a named NPC roster
with game content. Extracting villageLife would pull this entire stack.
It also contains hardcoded game flavor strings ('A traveler arrived in
Mosslight, asking about work.').

**Recommendation:** do not copy the module. Document the *idea* as a
PATTERN DOC instead: a deterministic, clock-driven needs / memories /
micro-economy layer that sits on top of an NPC simulation without storing
per-frame state.

---

## 5. `src/game/stoneSoupEngine.ts` — COPY AS-IS

(634 lines, 20 exports) — Self-contained turn-based roguelike
dungeon-crawler rules engine: grid tiles (wall/floor/door/stairs/altar/
water/lava), field-of-view `seen` flags, monsters, items, spells, player,
vaults, descending. Pure state-machine functions:
`createGame` / `step` / `waitTurn` / `collectItem` / `useInventoryItem` /
`castSpell` / `descend` / `tryOpenVault` / …

Verified by inspection:

- Zero imports. Zero DOM/browser references (`document.`/`window.`/
  `canvas`/`localStorage` count: 0).
- Zero game-specific names (no Ashfall/Mosslight/etc. anywhere).
- No dependency on App.tsx or any game module.

One caveat (document in the copy's header): `createGame()` defaults its
seed to `Date.now()` — pass an explicit seed for deterministic runs. This
is a roguelike *rules engine*, not game-specific content, so it belongs
in the library as a complete mini-game engine example.

---

## 6. npcNavigation.ts — ADAPTER-CANDIDATE (terrain-query interface)

`npcNavigation.ts` ("how NPCs walk": A* pathfinding, door traversal,
road bonuses, water avoidance — the no-teleport movement layer) imports:

- from `./landscape`: `waterAt`, `bridgeAt`, `roadCorridorsFor`,
  `LANDSCAPE_FIELD_SIZE` (= 280), `CorridorRect` (type)
- from `./fieldCamera`: `FIELD_SIZE` (= 280)

Its chain problem is `landscape.ts`, which imports `LANDMARK_LIST`
(game data) — **but only inside `townInfluenceAt`, which npcNavigation
does not use**. Everything npcNavigation actually needs is pure:

- `waterAt(wx, wy, worldSeed?)` → `{ kind, depth }` — rivers + lakes from
  noise/elevation. Chain: `noise` ✓ + `elevation` ✓ + `worldCore` ✓ (all
  already extracted as reusable).
- `bridgeAt(wx, wy, corridors, worldSeed?)` → `boolean` — needs only
  `waterAt` + the caller-supplied corridor rects.
- `roadCorridorsFor(road: string, opts?)` → `CorridorRect[]` — pure
  geometry from a road-piece string; no game imports.
- Both `*_FIELD_SIZE` constants are plain `280`.

**Yes — the chain is satisfiable by a small terrain-query interface.**
Sketch:

```ts
/** Minimal terrain surface the NPC navigation layer needs.
 *  Implement against your own world; the A* never sees game data. */
export interface TerrainQueries {
  /** Field size in world units (game used 280 for both constants). */
  fieldSize: number;
  /** Water sample at a world point: { kind: 'river'|'lake'|'none', depth }. */
  waterAt(wx: number, wy: number, worldSeed?: number): WaterSample;
  /** True when a road corridor crosses water here (walkable bridge). */
  bridgeAt(wx: number, wy: number, corridors: CorridorRect[],
           worldSeed?: number): boolean;
  /** Walkable road corridor rects for a road-piece descriptor. */
  roadCorridorsFor(road: string,
                  opts?: { margin?: number }): CorridorRect[];
}
export interface CorridorRect { x: number; y: number; w: number; h: number; }
export interface WaterSample { kind: string; depth: number; }
```

To extract `npcNavigation.ts`: replace its two imports with this
interface (constructor or module-level injection), delete the
`townInfluenceAt` dependency entirely (it was never used), and note that
the game also wired in door/interior transitions via its own types
(`DoorwayLink`, `NavPoint`) — those stay game-side.

This was **not** copied in this audit — interface design + extraction is
a follow-up task.

---

## Copy plan (for the parent agent)

Ready to copy now (no adapter work): `wfc.ts`, `wfcDungeon.ts`,
`wfcInfra.ts`, `wfcTown.ts`, `wfcWorld.ts`, `stoneSoupEngine.ts`.

Copy with small adapter edits: `civilization.ts` (hash swap + data
tables), `travelers.ts` (hash swap + landmarks param). Suggested shared
new file: `hash.ts` containing the 5-line `townsfolkHash` (renamed
e.g. `hash2`) so both modules import from the library.

Do not copy: `villageLife.ts` (pattern doc instead).

Follow-up: `npcNavigation.ts` extraction behind the `TerrainQueries`
interface sketched above.
