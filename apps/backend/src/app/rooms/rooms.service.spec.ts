import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsService],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
    // Initialize the module to start cleanup intervals
    service.onModuleInit();
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('should be defined when service is initialized', () => {
    // Given
    // Service is initialized in beforeEach

    // When
    const instance = service;

    // Then
    expect(instance).toBeDefined();
  });

  describe('limits', () => {
    it('should throw WsException when room limit is exceeded', () => {
      // Given
      for (let i = 0; i < 100; i++) {
        service.joinRoom(`client-${i}`, `room-${i}`, `user-${i}`);
      }
      
      // When
      const attemptJoinOverLimit = () => {
        service.joinRoom('client-101', 'room-101', 'user-101');
      };

      // Then
      expect(attemptJoinOverLimit).toThrow();
      try {
        attemptJoinOverLimit();
      } catch (e: any) {
        expect(e.getError()).toBe('Room limit reached');
      }
    });

    it('should throw WsException when user limit per room is exceeded', () => {
      // Given
      const roomId = service.joinRoom('client-0', 'my-room', 'user-0');
      for (let i = 1; i < 8; i++) {
        service.addUserToRoom(roomId, `user-${i}`);
      }
      
      // When
      const attemptAddUserOverLimit = () => {
        service.addUserToRoom(roomId, 'user-8');
      };

      // Then
      expect(attemptAddUserOverLimit).toThrow();
      try {
        attemptAddUserOverLimit();
      } catch (e: any) {
        expect(e.getError()).toBe('User limit per room reached');
      }
    });
  });

  describe('cleanup', () => {
    it('should clean up idle rooms and invoke onRoomExpired callback when rooms exceed idle TTL', () => {
      // Given
      jest.useFakeTimers();
      const roomId = service.joinRoom('client-1', 'idle-room', 'user-1');
      const expiredCallback = jest.fn();
      service.onRoomExpired = expiredCallback;

      jest.advanceTimersByTime(13 * 60 * 60 * 1000);
      
      // When
      service['cleanupIdleRooms']();
      
      // Then
      expect(service.getRoomData(roomId)).toBeUndefined();
      expect(expiredCallback).toHaveBeenCalledWith(roomId);
      
      jest.useRealTimers();
    });

    it('should not clean up rooms when room activity is within idle TTL', () => {
      // Given
      jest.useFakeTimers();
      const roomId = service.joinRoom('client-2', 'active-room', 'user-2');
      const expiredCallback = jest.fn();
      service.onRoomExpired = expiredCallback;

      jest.advanceTimersByTime(11 * 60 * 60 * 1000);
      
      // When
      service['cleanupIdleRooms']();
      
      // Then
      expect(service.getRoomData(roomId)).toBeDefined();
      expect(expiredCallback).not.toHaveBeenCalled();
      
      jest.useRealTimers();
    });

    it('should maintain score keys as subset of registered usernames when users are added', () => {
      // Given
      const roomId = service.joinRoom('client-a', 'room-a', 'user-a');
      service.addUserToRoom(roomId, 'user-b');
      
      // When
      const roomData = service.getRoomData(roomId);
      const registeredUsernames = roomData ? roomData.users.map(u => u.username) : [];
      const scoreKeys = roomData ? Object.keys(roomData.scores) : [];
      
      // Then
      expect(roomData).toBeDefined();
      for (const key of scoreKeys) {
        expect(registeredUsernames).toContain(key);
      }
    });

    it('should store room and client data in memory when instantiated', () => {
      // Given
      // Service is initialized

      // When
      const roomsStore = service['rooms'];
      const clientMap = service['clientRoomMap'];

      // Then
      expect(roomsStore).toBeInstanceOf(Map);
      expect(clientMap).toBeInstanceOf(Map);
    });
  });
});
