# AGENTS.md: Chess Game Review (CGR)

React 19 + Vite + Tailwind + HeroUI chess-analysis app, deployed to GitHub Pages (`base: "/CGR/"`).

## Commands (use bun, not npm; README is stale)

- `bun install`, `bun run dev`, `bun run build`
- Tests: `bun test` (full), `bun test <file>` (single), `bun run test:analysis` (analysis only). No `test` script exists.
- Typecheck is split: `bun run typecheck` (`tsc -b`, app only) and `bunx tsc -p tsconfig.test.json --noEmit` (tests only). Run both.
- `bun run lint` (eslint), `bun run format` (prettier, printWidth 100, double quotes).
- CI (`.github/workflows/ci.yml`) runs format (auto-commits the result) → `tsc --build` → eslint. **CI never runs tests**: always run `bun test` locally yourself.

## Architecture

- `src/main.tsx` → `src/app/` (`full_board/`, `left_panel/`, `right_panel/`).
- `src/Logic/` is the core: `analyze.ts` (move classifier: `analyzeMove`), `pieces.ts` (tactics: pins/hanging/x-ray/material), `stockfish.ts` (engine Worker wrapper), `clocks.ts`, `state/game.ts` + `state/settings.ts` (zustand stores), `evalgraph.tsx`.
- `src/api/`: `lichess.ts`, `CDC.ts` (chess.com), `opening.ts` (local `openings.json` + lichess explorer fetch).
- `src/utils/archive.ts`: IndexedDB (`idb`) persistence. Records keyed by platform game `id` (+ `source`); no `date` field.
- Path alias `@/*` → `./src/*` (vite + tsconfig).

## Analysis tests (generated, read this before touching)

- `bun scripts/gen-analysis-tests.ts [chess_archive.json]` generates one file per game: `tests/analysis/game.<id>.test.ts`. Flags: `--games 0,1`, `--types blunder,miss`, `--limit N`, `--force`.
- Existing files are skipped unless `--force`; re-running preserves hand-edited `expectedMoveType`/`expectedComment` (matched on `moveIndex`). Shared runner lives in `tests/analysis/helpers.ts`: generated files must only import from it, never duplicate the block.
- `chess_archive.json` (local game export) is gitignored: never commit it, never load it from a test. Tests hardcode their data.
- `.prettierignore` excludes `tests/analysis/`: do not reformat generated files.
- `analyzeMove` takes `fetchOpening` (default `true`); tests pass `false` so no network is needed. Early-move book classification still works offline via local `openings.json`.

## Test conventions (enforced by review, follow them)

- No `test.each`, no loops producing assertions, no `describe`+`for` hybrids. One explicit `test()` per case.
- No banner/separator comments. Test names are short (`1. e4`, `37... Be4+`); scope via `describe` (`Game 0`).
- Chess vocabulary (`Game`, `Move`), never generic (`Archive`, `Case`).
- Import the start position as `DEFAULT_POSITION` from `chess.js`: never redefine the FEN literal.
- Expectations must come from domain knowledge (hand-counted material, rules of chess), never pasted from executing the implementation. Never assert the code against itself (e.g. a `getAll*` helper against the single-square function it loops over).
- Full assertions over single-aspect ones: assert complete sets/objects, and use new positions: never re-wrap the neighboring test's FEN with the same expectation.

## Test-environment gotchas

- Never instantiate `StockfishManager` in tests: the engine `Worker` does not run under `bun test`. Test pure logic with hand-built `StockfishOutput`.
- `document` and `localStorage` do not exist under bun: stub them if the code under test touches DOM/theme (settings store does); zustand `persist` only warns without storage.
- `strict` + `noUnusedLocals`/`noUnusedParameters` are on for tests: unused imports fail typecheck.
- `chess.js` validates FENs strictly: custom positions need both kings or construction throws (use `{ skipValidation: true }` only when the test demands it).
