/**
 * Extracted from: https://github.com/jaydonweircontracting-ux/Adventure-game-
 * Origin path: src/game/townsfolk.ts (townsfolkHash only)
 * Extraction date: 2026-10-13
 * Purpose: Deterministic seeded integer hash [0,1). Swapped in for the game-coupled townsfolk.ts import used by civilization.ts/travelers.ts.
 *
 * READ-ONLY extraction — do not edit to match the source game; adapt
 * via the adapter pattern documented in adapters/README.md.
 */
// Deterministic 2D integer hash -> [0, 1). Pure, zero dependencies.
// Extracted verbatim from townsfolkHash(); renamed to avoid implying a
// dependency on the game's NPC module.
export function seededHash(a: number, b: number): number {
  let h = (Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265461)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
