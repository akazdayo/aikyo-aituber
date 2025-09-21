# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Setup:**
```bash
pnpm install          # Install all dependencies
apm sync              # Sync aikyo tool dependencies (requires: brew install akazdayo/tap/apm)
mise install          # Install Node.js 24.8 runtime
```

**Backend (companion server):**
```bash
pnpm start            # Start the AI agent companion server
pnpm check            # Run Biome linting and type checking
pnpm check:fix        # Auto-fix Biome issues
```

**Frontend (aituber-frontend):**
```bash
pnpm --filter aituber-frontend dev      # Start Vite dev server
pnpm --filter aituber-frontend build    # Build for production
pnpm --filter aituber-frontend preview  # Preview production build
```

**Note:** Frontend expects Firehose WebSocket server on ws://localhost:8080. Configure via VITE_FIREHOSE_URL environment variable.

## Architecture Overview

This is an AIVTuber streaming application with two main components:

**Backend (`companion/`):**
- `companion/index.ts` - Main entry point that boots the agent server and wires Firehose streams
- `companion/cards/` - AI persona configurations (e.g., `kyoko.ts`) using PascalCase naming
- `companion/tools/actions/` - Interactive AI abilities/actions using kebab-case directories
- `companion/tools/knowledges/` - Retrievable facts and knowledge base
- `companion/utils/` - Shared utilities
- `db/` - SQLite conversation state and caches (not committed to git)

**Frontend (`frontend/`):**
- React + TypeScript + Vite application for streaming interface
- Three.js + VRM for 3D character display
- Tailwind CSS v4 + shadcn/ui for styling
- WebSocket connection to Firehose for real-time updates
- `src/components/Stage.tsx` - Main VRM display stage
- `src/hooks/useFirehose.ts` - WebSocket state management
- `src/config/characters.ts` - Character configuration

## Code Style & Conventions

- **Linting:** Biome enforces 2-space indentation, double quotes, and recommended rules
- **Module system:** ESM modules (`type: "module"` in package.json)
- **Cards:** PascalCase files in `companion/cards/` with default factory exports
- **Tools:** kebab-case directories under `companion/tools/actions/` or `companion/tools/knowledges/`
- **Always run `pnpm check` before committing**

## Key Configuration Files

- `apm.toml` - Aikyo plugin manager config (tools directory: `./companion/tools/`)
- `mise.toml` - Node.js 24.8 runtime requirement
- `biome.json` - Code formatting and linting rules
- `pnpm-workspace.yaml` - Monorepo workspace configuration

## VRM Assets

Place VRM character files in `frontend/public/avatars/`:
- `kyoko.vrm` for companion_kyoko character
- Character mappings configured in `frontend/src/config/characters.ts`

## Testing

No automated test suite currently configured. Manual verification steps should be documented in PRs. Future test additions should use Vitest under `__tests__/` directories and wire to `pnpm test`.