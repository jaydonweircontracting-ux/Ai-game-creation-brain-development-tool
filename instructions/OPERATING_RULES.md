<!--
Extracted from: https://github.com/jaydonweircontracting-ux/Adventure-game-
Origin path: (new file, synthesized for this library)
Extraction date: 2026-10-13
Purpose: Standing engineering rules derived from the source repo's own evidence.
-->

# OPERATING RULES

Standing engineering rules for any agent working with these engines. Every
rule below is grounded in evidence from the source repository — file
references are given so the rule can be checked, not taken on faith.

## 1. Extend — never duplicate, never rewrite

> Evidence: `ROADMAP.md` — "Extend existing systems; never duplicate them.
> Never regress." / "Architecture (authoritative — do not replace)"

Before creating a system, search the engines for one that already exists.
Improve it in place. A second competing implementation of the same system
(simulation, pathfinding, persistence) is a defect, not progress.

## 2. Diagnose before changing

> Evidence: `docs/RECOVERY_PROTOCOL.md` — "diagnose before retrying, max 3
> attempts per strategy"; `scripts/brain.mjs` — CONTEXT → INVESTIGATE →
> TEST SELECTION → VERIFY → LEARN

Trace the failing path to the exact broken link before writing a fix.
Guess-builds that "might" fix it are forbidden. State the root cause in
one sentence, then make the smallest change that addresses it.

## 3. Keep logic pure and deterministic so it can be tested

> Evidence: `src/game/organicTowns.ts` header — "Pure and deterministic so
> scripts/simulate.ts can unit-test the placement invariants"; same pattern
> in `mapBuilder.ts`, `npcEntry.ts`, `worldEditor.ts`

Game logic lives in pure modules with no DOM, no framework, and no hidden
state. Deterministic functions of their inputs. If a module cannot be
unit-tested without booting the app, it is in the wrong layer — extract the
pure core (see `adapters/README.md`).

## 4. Test against the real thing, not mocks

> Evidence: `tests/real-game/README.md` — "Automated tests against the
> **actual running React game** — not mocks"; `scripts/telemetry.mjs` —
> observes the live game through test hooks

Assertion suites (`simulate.ts` pattern) cover pure logic. The Playwright
bridge covers behavior: serve the real build, drive real inputs, assert real
outcomes. A feature is not done because the code compiles — it is done when
the running game exhibits it.

## 5. Version the build marker; never hardcode-then-forget

> Evidence: `scripts/prepare-build-entry.cjs` — injects
> `window.__AG_BUILD` into `index.html` at build time; `src/App.tsx`
> `BUILD_NOTES` record maps each build number to its change note

The build number is the identity of a release. It is stamped mechanically
at build time and every build carries a one-line note of what changed.
Deployment success is not the verification — the served marker is.

## 6. Save games are sacred: version and migrate

> Evidence: `src/game/persistence.ts` — `migrateSave()` upgrades old saves
> to `CURRENT_SAVE_VERSION`; unknown versions are rejected, never silently
> overwritten

Never casually invalidate persisted state. Version the schema, migrate old
data forward, and reject what you cannot understand — loudly, not silently.

## 7. Coordinates are law; one space per concern

> Evidence: `src/game/settlements.ts` — single authoritative layout consumed
> by renderer, collision, NPC homes, and doorways alike

Every system that places, collides, or navigates must agree on where an
object is. One module owns the layout math; renderers, collision, and AI
consume it. A second coordinate space is a second source of truth.

## 8. Bounded autonomy

> Evidence: `docs/RECOVERY_PROTOCOL.md` — max attempts, no unbounded retry;
> `scripts/safe-run.mjs` — bounded retry with exponential backoff;
> `src/game/workQueue.ts` — budgeted work spreading across ticks

No infinite retry loops, no unbounded spending, no endless commits.
Budgets, retry limits, backoff, and safe shutdown are part of every
autonomous loop, not afterthoughts.
