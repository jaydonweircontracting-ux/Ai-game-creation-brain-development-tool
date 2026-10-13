/**
 * Extracted from: https://github.com/jaydonweircontracting-ux/Adventure-game-
 * Origin path: src/game/persistence.ts
 * Extraction date: 2026-10-13
 * Purpose: Save-schema helpers; depends only on worldCore.ts.
 *
 * READ-ONLY extraction — do not edit to match the source game; adapt
 * via the adapter pattern documented in adapters/README.md.
 */
import { DEFAULT_WORLD_SEED } from './worldCore';

export const SAVE_FILE_FORMAT = 'adventure-game-save';
export const CURRENT_SAVE_VERSION = 2;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function legacySaveId(value: Record<string, unknown>) {
  const stamp = typeof value.savedAt === 'string' ? value.savedAt : 'unknown';
  return 'legacy-' + stamp.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 48);
}

export function migrateSave(value: unknown): unknown {
  if (!isRecord(value) || value.format !== SAVE_FILE_FORMAT) return null;
  if (value.version === CURRENT_SAVE_VERSION) return value;
  if (value.version !== 1) return null;
  return {
    ...value,
    version: CURRENT_SAVE_VERSION,
    saveId: legacySaveId(value),
    worldSeed: typeof value.worldSeed === 'number' && Number.isFinite(value.worldSeed) ? value.worldSeed : DEFAULT_WORLD_SEED,
    simulatedAdventurers: Array.isArray(value.simulatedAdventurers) ? value.simulatedAdventurers : [],
    townsfolk: Array.isArray(value.townsfolk) ? value.townsfolk : [],
  };
}
