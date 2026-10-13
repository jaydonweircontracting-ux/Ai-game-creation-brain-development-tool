<!--
Extracted from: https://github.com/jaydonweircontracting-ux/Adventure-game-
Origin path: scripts/simulate.ts (pattern documented; file not copied — 6655 lines, game-coupled assertions)
Extraction date: 2026-10-13
Purpose: The assertion-harness pattern used to test pure game logic at scale.
-->

# The simulate.ts Assertion Pattern

The source game tests its pure `src/game` modules with a single TypeScript
harness, `scripts/simulate.ts` (~6,600 lines, ~55,000 assertions). The file
itself is game-coupled and is not copied here; this document captures the
pattern so a new project can replicate it.

## How it works

1. **One runner, many modules.** A single `tsc`-compiled script imports
   every pure module and runs assertion blocks against each. No test
   framework — just a tiny `assert(cond, label)` helper and a
   pass/fail counter.
2. **Determinism first.** For every generator: same seed → same output
   (run twice, compare); different seeds → different output; negative and
   large coordinates behave.
3. **Invariants, not snapshots.** Assertions state rules: "no house on a
   road", "no overlaps", "ore never on water", "NPC destinations clamp to
   field bounds". Invariants survive refactors; snapshots don't.
4. **Order independence.** World-gen queries must not depend on call order
   or chunk-visit order (e.g. "no cross-chunk duplicates").
5. **Failure budget.** A failing assertion prints the module, the label,
   and the offending values — then the run continues to the end so one
   breakage doesn't hide the next.

## Minimal starter (adapt freely)

```ts
// sim.ts — run with: npx tsc sim.ts --outDir /tmp/sim && node /tmp/sim/sim.js
let pass = 0, fail = 0;
function assert(cond: boolean, label: string, extra?: unknown) {
  if (cond) { pass++; }
  else { fail++; console.error(`FAIL ${label}`, extra ?? ""); }
}

// Example: determinism of a pure generator
import { organicTownSpecs } from "./engines/organicTowns";
const a = JSON.stringify(organicTownSpecs(1234, 2, "ns", 280));
const b = JSON.stringify(organicTownSpecs(1234, 2, "ns", 280));
assert(a === b, "town gen is deterministic");
const c = JSON.stringify(organicTownSpecs(9999, 2, "ns", 280));
assert(a !== c, "different seeds differ");

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
```

## What to assert per engine (checklist)

- `noise.ts` / `terrainNoise.ts`: determinism, seed sensitivity, value ranges.
- `geology.ts`: determinism, no cross-chunk duplicates, terrain gating
  (ore never on water/meadow), richness bounds 1–3.
- `settlements.ts` / `organicTowns.ts`: no overlaps, lane/building
  separation, deterministic variants.
- `npcNavigation`-style A*: path exists where one should, no path through
  walls, destination clamping to bounds.
- `skills.ts`: XP curve monotonicity, level thresholds, no XP on failed
  actions (the honesty rule).
- `spatialHash.ts`: query returns exactly the entities in range, O(n)
  behavior on bulk inserts.
