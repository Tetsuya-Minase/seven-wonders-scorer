# Code Style and Conventions

## General TypeScript Conventions

### Naming Conventions
- **Classes**: PascalCase (e.g., `ScoreComponent`, `RoomsGateway`)
- **Methods/Functions**: camelCase (e.g., `addUser`, `handleConnection`)
- **Properties/Variables**: camelCase (e.g., `roomName`, `currentUsername`)
- **Interfaces/Types**: PascalCase (e.g., `ScoreType`, `SignalState`)
- **Constants**: camelCase or UPPER_SNAKE_CASE depending on context
- **Files**: kebab-case for file names (e.g., `score.component.ts`, `rooms.gateway.ts`)

### TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext
- **Decorators**: Experimental decorators enabled
- **Emit Decorator Metadata**: Enabled (required for NestJS)
- **Strict Mode**: Type checking enforced
- **Library**: ES2020, DOM

### Code Formatting (Prettier)
- **Single Quotes**: Always use single quotes for strings
- **Default Prettier rules** for other formatting aspects

### Linting (ESLint)
- **Nx ESLint Plugin**: Enforces module boundaries and buildable library dependencies
- **Angular ESLint**: For Angular-specific rules
- **TypeScript ESLint**: For TypeScript-specific rules

## Angular-Specific Conventions

### Component Structure
- **Standalone Components**: Prefer standalone components over NgModule-based components
- **Component Selector Prefix**: `seven-wonders-scorer-` prefix for component selectors
- **File Structure**: Component files follow `.component.ts`, `.component.html`, `.component.css` pattern

### State Management
- **Signals**: Use Angular signals for reactive state management
- **RxJS**: Use RxJS for asynchronous operations and streams
- **Services**: Stateful logic encapsulated in services marked with `@Injectable({ providedIn: 'root' })`

### Dependency Injection
- Constructor injection preferred (e.g., `constructor(private roomService: RoomService)`)
- Use `inject()` function for functional contexts if needed

## NestJS-Specific Conventions

### Module Organization
- Feature-based modules (e.g., `RoomsModule`)
- Each module has its own directory with gateway, service, and module files

### Decorators
- Use NestJS decorators consistently:
  - `@WebSocketGateway()` for WebSocket gateways
  - `@SubscribeMessage()` for message handlers
  - `@Injectable()` for services
  - `@Module()` for modules

### Logging
- Use NestJS Logger for consistent logging
- Example: `private readonly logger = new Logger(RoomsGateway.name);`

## File Organization
- Group related files in feature directories
- Keep types/interfaces in dedicated `types/` directories or co-located with components
- Services in `services/` directories
- State management in `state/` directories (for frontend)

## Testing Conventions
- Test files follow `.spec.ts` naming convention
- Unit tests use Jest
- E2E tests use Cypress
- Test configuration per project in `jest.config.ts`

## Import Organization
(No explicit import ordering rules found in configuration, but follow these best practices)
1. Angular/NestJS core imports
2. Third-party library imports
3. Application imports (absolute paths if configured)
4. Relative imports