import { joinRoomSchema } from './schemas/join-room.schema';
import { addUserSchema } from './schemas/add-user.schema';
import { updateScoreSchema } from './schemas/update-score.schema';

describe('Zod Schema Validation', () => {
  describe('joinRoomSchema', () => {
    it('should pass validation when roomName and username are valid', () => {
      // Given
      const payload = { roomName: 'my-room', username: 'alice' };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    it('should fail validation when roomName exceeds 20 characters', () => {
      // Given
      const payload = { roomName: 'a'.repeat(21), username: 'alice' };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['roomName']);
      }
    });

    it('should pass validation when roomName and username are exactly 20 characters', () => {
      // Given
      const payload = { roomName: 'a'.repeat(20), username: 'b'.repeat(20) };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
    });

    it('should fail validation when username contains only whitespaces', () => {
      // Given
      const payload = { roomName: 'my-room', username: '   ' };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['username']);
      }
    });

    it('should fail validation when username contains reserved words', () => {
      // Given
      const reservedWords = ['__proto__', 'constructor', 'prototype', 'prefix__proto__suffix'];

      for (const word of reservedWords) {
        const payload = { roomName: 'my-room', username: word };

        // When
        const result = joinRoomSchema.safeParse(payload);

        // Then
        expect(result.success).toBe(false);
      }
    });

    it('should fail validation when payload contains unrecognized keys', () => {
      // Given
      const payload = { roomName: 'my-room', username: 'alice', extra: 1 };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should fail validation when username exceeds 20 characters', () => {
      // Given
      const payload = { roomName: 'my-room', username: 'a'.repeat(21) };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });
  });

  describe('addUserSchema', () => {
    it('should pass validation when username is valid', () => {
      // Given
      const payload = { username: 'bob' };

      // When
      const result = addUserSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ username: 'bob' });
      }
    });

    it('should fail validation when username contains only whitespaces', () => {
      // Given
      const payload = { username: '   ' };

      // When
      const result = addUserSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should fail validation when username contains reserved words', () => {
      // Given
      const reservedWords = ['__proto__', 'constructor', 'prototype'];

      for (const word of reservedWords) {
        const payload = { username: word };

        // When
        const result = addUserSchema.safeParse(payload);

        // Then
        expect(result.success).toBe(false);
      }
    });
  });

  describe('updateScoreSchema', () => {
    it('should pass validation when valid score update payload is provided', () => {
      // Given
      const payload = { username: 'alice', score: { civilScore: 1 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.score.civilScore).toBe(1);
      }
    });

    it('should pass validation when militaryScore is a negative value within limits', () => {
      // Given
      const payload = { username: 'alice', score: { militaryScore: -6 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
    });

    it('should fail validation when score contains unrecognized keys', () => {
      // Given
      const payload = { username: 'alice', score: { hack: 'x', civilScore: 1 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should fail validation when score value is out of upper bounds', () => {
      // Given
      const payload = { username: 'alice', score: { civilScore: 1000 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should fail validation when score value is a string type', () => {
      // Given
      const payload = { username: 'alice', score: { civilScore: '1' } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should fail validation when score value is a floating point number', () => {
      // Given
      const payload = { username: 'alice', score: { civilScore: 1.5 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should pass validation when nested scienceScore is provided', () => {
      // Given
      const payload = {
        username: 'alice',
        score: { scienceScore: { gear: 1, compass: 2, tablet: 3 } },
      };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
    });

    it('should fail validation when nested scienceScore value is out of bounds', () => {
      // Given
      const payload = {
        username: 'alice',
        score: { scienceScore: { gear: 1000 } },
      };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });

    it('should pass validation when score values are at exact boundary limits', () => {
      // Given
      const payload = {
        username: 'alice',
        score: { civilScore: 0, coinScore: 999, militaryScore: -999 },
      };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
    });

    it('should fail validation when username contains reserved words', () => {
      // Given
      const payload = { username: '__proto__', score: { civilScore: 1 } };

      // When
      const result = updateScoreSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(false);
    });
  });

  describe('Invariants', () => {
    it('should ensure that validated data only contains schema-defined keys when parsing is successful', () => {
      // Given
      const payload = { roomName: 'room', username: 'alice' };

      // When
      const result = joinRoomSchema.safeParse(payload);

      // Then
      expect(result.success).toBe(true);
      if (result.success) {
        const allowedKeys = ['roomName', 'username'];
        expect(Object.keys(result.data).every((k) => allowedKeys.includes(k))).toBe(true);
      }
    });

    it('should ensure that all score values are integers within bounds when parsing is successful', () => {
      // Given
      const validScores = [0, 10, 999];

      for (const score of validScores) {
        const payload = { username: 'alice', score: { civilScore: score } };

        // When
        const result = updateScoreSchema.safeParse(payload);

        // Then
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Number.isInteger(result.data.score.civilScore)).toBe(true);
          expect(result.data.score.civilScore).toBeGreaterThanOrEqual(0);
          expect(result.data.score.civilScore).toBeLessThanOrEqual(999);
        }
      }
    });
  });
});
