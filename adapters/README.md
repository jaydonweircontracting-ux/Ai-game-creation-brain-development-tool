<!--
Extracted from: https://github.com/jaydonweircontracting-ux/Adventure-game-
Origin path: (new file, synthesized for this library)
Extraction date: 2026-10-13
Purpose: The adapter pattern: how reusable engine math connects to game-specific systems.
-->

# The Adapter Pattern

Engines in `engines/` are pure: deterministic functions of their inputs,
no DOM, no framework, no game content. A game consumes an engine through
an **adapter** — a thin, game-specific layer that translates engine output
into the game's renderer, entities, coordinates, or mechanics.

```
engines/settlements.ts        adapters/<game>/settlementRenderer
(pure layout math)     --->   (engine rects -> sprites, collision, doors)
```

Rules:

1. The engine never imports the game. The dependency arrow points one way.
2. The adapter owns all game-specific knowledge: sprite names, tile sizes,
   coordinate scaling, collision layers, save formats.
3. If the same adaptation is needed twice, it graduates into a shared
   adapter; if it is needed once, it stays with the game.
4. Never "adapt" by copying the engine into the game and editing the copy.
   Import it. A copied engine is a fork that will drift.

## Worked example: `settlements.ts`

`engines/settlements.ts` (extracted from the source game) computes
deterministic settlement layouts: hamlet/village rects, lane polylines,
plaza ellipses, prop placements. It knows nothing about rendering.

In the source game, the adapter layer (which lives in the game, NOT in
this library) did the following with that output:

- **Renderer**: mapped each cottage rect to a sprite variant
  (`house-timber`, `blue-house`, …) chosen deterministically from the
  rect data, drew lane polylines as dirt paths, plaza ellipses as decals.
- **Collision**: fed the same rects into the field collision grid, so
  walls block exactly where the walls are drawn.
- **NPC AI**: assigned cottages as NPC homes and derived doorways from
  rect edges, so NPCs path to visible doors.
- **Doors/interiors**: doorway positions computed from the rect, never
  stored as separate static coordinates.

The key property: renderer, collision, NPC homes, and doorways all consumed
the **same** layout object. When the layout changed, everything moved
together — there was no second source of truth to desync.

A new game reuses the engine as-is and writes its own adapter: different
sprites, different tile scale, same rects. The engine does not change.
