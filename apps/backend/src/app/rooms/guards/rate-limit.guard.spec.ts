import { ExecutionContext } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;

  beforeEach(() => {
    guard = new RateLimitGuard();
  });

  function createMockContext(clientId: string): ExecutionContext {
    return {
      switchToWs: () => ({
        getClient: () => ({ id: clientId }),
      }),
    } as any;
  }

  it('should allow requests to pass when request rate is within limit', () => {
    // Given
    const context = createMockContext('client-1');
    
    // When
    const results: boolean[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(guard.canActivate(context));
    }

    // Then
    expect(results).toHaveLength(10);
    expect(results.every((res) => res === true)).toBe(true);
  });

  it('should throw WsException when burst limit is exceeded', () => {
    // Given
    const context = createMockContext('client-2');
    for (let i = 0; i < 20; i++) {
      guard.canActivate(context);
    }

    // When
    const executeExceededRequest = () => guard.canActivate(context);

    // Then
    expect(executeExceededRequest).toThrow();
    try {
      executeExceededRequest();
    } catch (e: any) {
      expect(e.getError()).toEqual({ error: 'Rate limit exceeded' });
    }
  });
});
