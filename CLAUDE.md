# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seven Wonders Scorer is a real-time score tracking application for the board game "7 Wonders". It uses a pnpm monorepo structure with an Angular frontend and NestJS backend communicating via WebSocket.

## Commands

### Development

```bash
# Start both frontend and backend (recommended)
pnpm dev

# Start individual services
pnpm dev:frontend     # Angular dev server at http://localhost:4200
pnpm dev:backend      # NestJS server with hot reload
```

### Build

```bash
pnpm build            # Build all packages
pnpm build:frontend   # Build frontend only
pnpm build:backend    # Build backend only
```

### Testing

```bash
pnpm test             # Run all tests
pnpm test:frontend    # Frontend unit tests (Jest)
pnpm test:backend     # Backend unit tests (Jest)

# Watch mode (from app directories)
pnpm --filter @seven-wonders/frontend test:watch
pnpm --filter @seven-wonders/backend test:watch

# E2E tests
pnpm e2e:frontend     # Cypress E2E tests
pnpm e2e:backend      # Backend E2E tests
```

### Linting & Formatting

```bash
pnpm lint             # Lint all packages
pnpm format           # Format all files with Prettier
pnpm format:check     # Check formatting
```

## Architecture

### Monorepo Structure

```
apps/
├── frontend/         # Angular 21 standalone components
├── backend/          # NestJS 10 WebSocket server
├── frontend-e2e/     # Cypress E2E tests
└── backend-e2e/      # Backend E2E tests
```

### Frontend (Angular 21)

- **State Management**: Signal-based state using custom `SignalState<T>` pattern (`apps/frontend/src/app/types/signal-state.ts`)
- **Styling**: TailwindCSS 4
- **Real-time**: Socket.io-client for WebSocket communication
- **Components**: All standalone (no NgModules)
- **Component Prefix**: `seven-wonders-scorer-`

Key service layer:
- `WebSocketService` - Global WebSocket connection management
- `ScoreService` - Score state management with computed totals
- `RoomService` - Room join/leave operations
- `UserService` - User session management

### Backend (NestJS 10)

- **Real-time**: `@nestjs/websockets` with Socket.io
- `RoomsGateway` - WebSocket gateway handling room events
- `RoomsService` - Room and user state management

### WebSocket Events

Frontend → Backend:
- `joinRoom` - Join a score tracking room
- `leaveRoom` - Leave current room
- `updateScore` - Update a player's score

Backend → Frontend:
- `roomState` - Full room state sync
- `userJoined` / `userLeft` - User presence updates
- `scoreUpdated` - Score change broadcast

### Score Categories

Scores are tracked per user across categories: `civilScore`, `militaryScore`, `scienceScore` (gear/compass/tablet), `commercialScore`, `guildScore`, `cityScore`, `leaderScore`, `coinScore`, `wonderScore`.

## Code Conventions

- **TypeScript**: ES2022 target, strict mode
- **Formatting**: Single quotes (Prettier)
- **Testing**: Jest with AAA pattern, test files as `*.spec.ts`
- **Documentation**: TSDoc for public functions/classes

### Frontend Patterns

```typescript
// Signal-based state
private state = signalState<MyState>({ ... });
readonly value = this.state.asReadonly().value;

// Standalone components
@Component({
  selector: 'seven-wonders-scorer-my-component',
  standalone: true,
  imports: [...],
})
```

### Backend Patterns

```typescript
// WebSocket gateway
@WebSocketGateway({ cors: true })
export class MyGateway {
  private readonly logger = new Logger(MyGateway.name);

  @SubscribeMessage('eventName')
  handleEvent(@MessageBody() data: EventData) { ... }
}
```

## Tech Stack

- **Frontend**: Angular 21, TailwindCSS 4, Socket.io-client, RxJS
- **Backend**: NestJS 10, Socket.io, Express
- **Tooling**: pnpm workspaces, TypeScript 5.9, Jest 30, Cypress 15, ESLint 9