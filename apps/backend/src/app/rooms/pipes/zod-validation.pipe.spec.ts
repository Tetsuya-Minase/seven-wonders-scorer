import { WsException } from '@nestjs/websockets';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const testSchema = z
    .object({
      name: z.string().min(1, { message: 'Name is required' }).max(10, { message: 'Name too long' }),
      age: z.number().int().min(0),
    })
    .strict();

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  it('should return validated data when payload is valid', () => {
    // Given
    const payload = { name: 'alice', age: 20 };

    // When
    const result = pipe.transform(payload);

    // Then
    expect(result).toEqual(payload);
  });

  it('should throw WsException with first issue message when validation fails', () => {
    // Given
    const payload = { name: 'a'.repeat(11), age: 20 };

    // When
    const executeTransform = () => pipe.transform(payload);

    // Then
    expect(executeTransform).toThrow(WsException);
    try {
      executeTransform();
    } catch (e: any) {
      expect(e).toBeInstanceOf(WsException);
      expect(e.getError()).toBe('Name too long');
    }
  });

  it('should throw WsException when input is not an object', () => {
    // Given
    const invalidInputs = [null, undefined, 'string', 123, true];

    for (const input of invalidInputs) {
      // When
      const executeTransform = () => pipe.transform(input);

      // Then
      expect(executeTransform).toThrow(WsException);
      try {
        executeTransform();
      } catch (e: any) {
        expect(e).toBeInstanceOf(WsException);
      }
    }
  });

  it('should bypass validation and return original value when argument metadata type is not body', () => {
    // Given
    const mockSocket = { id: 'socket-123' };
    const metadata = { type: 'custom' } as any;

    // When
    const result = pipe.transform(mockSocket, metadata);

    // Then
    expect(result).toBe(mockSocket);
  });

  describe('Invariants', () => {
    it('should always throw only WsException for any invalid input', () => {
      // Given
      const badInputs = [
        {},
        { name: 123 },
        { extraKey: 'unexpected' },
        Symbol('test'),
        () => {},
      ];

      for (const input of badInputs) {
        // When
        const executeTransform = () => pipe.transform(input);

        // Then
        expect(executeTransform).toThrow(WsException);
      }
    });
  });
});
