# Task Completion Checklist

When completing a development task, follow this checklist:

## 1. Code Quality Checks

### Linting
Run linting on the affected project(s):
```bash
nx lint seven-wonders-scorer    # If frontend changes
nx lint backend                 # If backend changes
```

### Formatting
Ensure code is formatted according to Prettier rules:
- Ideally, Prettier should be integrated with your editor for automatic formatting
- Manual formatting: `npx prettier --write <path>`

## 2. Testing

### Unit Tests
Run unit tests for affected project(s):
```bash
nx test seven-wonders-scorer    # If frontend changes
nx test backend                 # If backend changes
```

### E2E Tests (if applicable)
Run E2E tests for affected project(s):
```bash
nx e2e frontend-e2e             # If frontend functionality changed
nx e2e backend-e2e              # If backend API changed
```

## 3. Build Verification

### Build the Project
Verify that the build succeeds:
```bash
nx build seven-wonders-scorer   # Build frontend
nx build backend                # Build backend
```

### Check Build Output
- Verify no TypeScript compilation errors
- Check for bundle size warnings (frontend only)
- Ensure all dependencies are resolved

## 4. Manual Testing

### Start Development Server
```bash
npm start                       # Start both frontend and backend
```

### Test the Feature
- Navigate to http://localhost:4200
- Verify the implemented feature works as expected
- Test edge cases and error scenarios
- Test WebSocket connectivity if backend changes were made

## 5. Code Review Preparation

### Git Status Check
```bash
git status                      # Check modified files
git diff                        # Review changes
```

### Commit Message
Follow conventional commit format if established:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for refactoring
- `test:` for test-related changes
- `docs:` for documentation

## Quick Reference: Complete Task Flow
```bash
# 1. Lint
nx lint <project-name>

# 2. Test
nx test <project-name>

# 3. Build
nx build <project-name>

# 4. Manual verification
npm start
# Test at http://localhost:4200

# 5. Commit
git add .
git commit -m "feat: description of changes"
```

## Additional Considerations

### Module Boundaries
- Ensure no Nx module boundary violations
- Check with `nx lint` which enforces `@nx/enforce-module-boundaries`

### Type Safety
- Verify all TypeScript types are correct
- No `any` types unless absolutely necessary

### Performance
- Frontend: Check for unnecessary re-renders
- Backend: Verify no memory leaks in WebSocket connections

### Error Handling
- Ensure proper error handling for WebSocket events
- Frontend: User-friendly error messages
- Backend: Appropriate logging and error responses