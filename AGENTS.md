# Repository Guidelines

## Project Structure & Module Organization
`companion/index.ts` boots the agent server and wires firehose streams. Domain logic lives under `companion/cards/` (persona configs) and `companion/tools/` (`actions/` for interactive abilities, `knowledges/` for retrievable facts). Shared utilities are in `companion/utils/`. SQLite conversation state and caches are stored in `db/`. Keep new modules co-located with their card or tool to avoid cross-coupling.

## Build, Test, and Development Commands
Run `pnpm install` after cloning. Use `pnpm start` to launch the local agent with tsx. Static analysis runs with `pnpm check`; fixable issues can be auto-formatted via `pnpm check:fix`. Sync auxiliary tool dependencies with `apm sync` (requires `brew install akazdayo/tap/apm`). Ensure the Node runtime defined in `mise.toml` is available via `mise install`.

## Coding Style & Naming Conventions
Biome enforces two-space indentation, double quotes for strings, and recommended lint rules. Name cards using PascalCase files in `companion/cards/` (e.g., `Kyoko.ts`) and export a default factory. Tools should use descriptive kebab-case directories (`actions/notify-user.ts`). TypeScript modules must remain ESM (`type: "module"`). Run `pnpm check` before committing to maintain consistent formatting.

## Testing Guidelines
Automated tests are not yet configured; contributions that add behaviour should introduce targeted tests (prefer Vitest) alongside new code under a `__tests__/` sibling directory. Document manual verification steps in the PR and keep fixtures under 1 MB. Once a test suite exists, wire it to `pnpm test` so CI can hook in easily.

## Commit & Pull Request Guidelines
The history favours concise, descriptive summaries (often Japanese). Keep the first line under ~72 characters and focus on what changed. Reference related issues with `Refs #123` when applicable. Pull requests should explain the change, list validation steps (commands run, screenshots of agent output), and call out schema or database impacts. Request review before merging and wait for Biome checks to pass.

## Environment & Configuration Notes
Check `apm.toml` when adding new tools—plugins must sit under `companion/tools/`. Do not commit generated `.db` files; treat them as local state. Copy sensitive API keys into your shell environment or a `.env.local` ignored by git, and describe any new configuration in the README.
