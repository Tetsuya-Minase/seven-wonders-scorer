# Suggested Commands for Development

## Development Server Commands

### Start Both Frontend and Backend
```bash
npm start
# Starts both frontend and backend in parallel
# Frontend: http://localhost:4200
# Backend: http://localhost:3333 (default NestJS port)
```

### Start Frontend Only
```bash
npm run start:frontend
# or
nx serve seven-wonders-scorer
```

### Start Backend Only
```bash
npm run start:backend
# or
nx serve backend
```

## Build Commands

### Build (Default Configuration - Production)
```bash
nx build
# Builds with production configuration by default
```

### Build Specific Project
```bash
nx build seven-wonders-scorer   # Build frontend
nx build backend                # Build backend
```

### Build for Production
```bash
npm run build:prod
# or
nx build --prod
```

### Build Output
- Frontend build output: `dist/seven-wonders-scorer/`
- Backend build output: `dist/apps/backend/`

## Testing Commands

### Run Tests
```bash
npm test
# or
nx test
```

### Run Tests for Specific Project
```bash
nx test seven-wonders-scorer    # Test frontend
nx test backend                 # Test backend
```

### Run E2E Tests
```bash
nx e2e frontend-e2e             # Frontend E2E tests
nx e2e backend-e2e              # Backend E2E tests
```

## Linting Commands

### Lint Specific Project
```bash
nx lint seven-wonders-scorer    # Lint frontend
nx lint backend                 # Lint backend
```

### Lint All Projects
```bash
nx run-many -t lint
```

## Formatting Commands
(Note: Prettier is configured but no npm script is defined. Typically integrated with editor)

### Format with Prettier (manual)
```bash
npx prettier --write .
```

## Other Useful Commands

### Reset Nx Cache
```bash
npm run reset
# or
nx reset
```

### Deploy (GitHub Pages)
```bash
npm run deploy
# or
nx deploy
```

### List Available Nx Generators
```bash
nx list                         # List all available plugins
nx list <plugin-name>           # List generators for specific plugin
```

### Run Multiple Targets
```bash
nx run-many -t <target1> <target2>              # Run multiple targets
nx run-many -t <target1> <target2> -p <proj1>   # Run for specific projects
```

## Git Commands (macOS/Darwin System)
Standard git commands work on macOS:
```bash
git status
git add .
git commit -m "message"
git push
git pull
git branch
```

## System Utility Commands (macOS/Darwin)
```bash
ls              # List files
ls -la          # List with details including hidden files
cd <path>       # Change directory
pwd             # Print working directory
find <path>     # Find files
grep <pattern>  # Search text patterns
cat <file>      # Display file contents
```