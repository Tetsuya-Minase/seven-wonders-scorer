# Codebase Structure

## Root Structure
```
seven-wonders-scorer/
├── apps/                    # Application code
│   ├── frontend/           # Angular frontend application
│   ├── backend/            # NestJS backend application
│   ├── frontend-e2e/       # Frontend E2E tests
│   └── backend-e2e/        # Backend E2E tests
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── .nx/                    # Nx cache
├── package.json            # Root package configuration
├── nx.json                 # Nx workspace configuration
├── tsconfig.base.json      # Base TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── .prettierrc             # Prettier configuration
└── jest.config.ts          # Jest configuration
```

## Frontend Structure (apps/frontend/)
```
apps/frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── score/              # Main score tracking page
│   │   │   │   ├── components/     # Score-related components
│   │   │   │   │   ├── user-card/
│   │   │   │   │   │   └── score-item/
│   │   │   │   │   └── score-update-modal/
│   │   │   │   ├── services/       # Score, room, user services
│   │   │   │   ├── state/          # Signal-based state management
│   │   │   │   └── types/          # TypeScript types
│   │   │   └── login/              # Login page
│   │   ├── services/               # Global services (websocket)
│   │   ├── types/                  # Global types (nominal, utility, signal-state)
│   │   ├── app.component.ts
│   │   └── app.routes.ts           # Routing configuration
│   ├── environments/               # Environment configurations
│   ├── main.ts                     # Application entry point
│   └── styles.css                  # Global styles
├── project.json                    # Nx project configuration
└── jest.config.ts                  # Jest configuration
```

## Backend Structure (apps/backend/)
```
apps/backend/
├── src/
│   ├── app/
│   │   ├── rooms/                  # Room management module
│   │   │   ├── rooms.gateway.ts    # WebSocket gateway
│   │   │   ├── rooms.service.ts    # Room business logic
│   │   │   └── rooms.module.ts     # NestJS module
│   │   ├── app.controller.ts       # Main controller
│   │   ├── app.service.ts          # Main service
│   │   └── app.module.ts           # Root module
│   └── main.ts                     # Application entry point
├── project.json                    # Nx project configuration
└── webpack.config.js               # Webpack configuration
```

## Key Architecture Patterns

### Frontend
- **Standalone Components**: Using Angular's standalone components (no NgModules for most components)
- **Signal-based State**: State management using Angular signals
- **Service Layer**: Separation of concerns with dedicated services for WebSocket, room, user, and score management
- **Type Safety**: Strong typing with TypeScript, including nominal types and utility types

### Backend
- **NestJS Modular Architecture**: Feature-based modules (e.g., rooms module)
- **WebSocket Gateway**: Real-time communication using @WebSocketGateway decorator
- **Service Pattern**: Business logic encapsulated in services