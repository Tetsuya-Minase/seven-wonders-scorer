import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { RoomsGateway } from './rooms.gateway';
import { RoomsService } from './rooms.service';
import { GATEWAY_OPTIONS } from '@nestjs/websockets/constants';

describe('RoomsGateway', () => {
  let gateway: RoomsGateway;

  beforeEach(async () => {
    process.env.CORS_ORIGIN = '';
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsGateway, RoomsService],
    }).compile();

    gateway = module.get<RoomsGateway>(RoomsGateway);
  });

  it('should be defined when module is initialized', () => {
    // Given
    // Module and gateway are initialized in beforeEach

    // When
    const instance = gateway;

    // Then
    expect(instance).toBeDefined();
  });

  it('should fallback to localhost:4200 when CORS_ORIGIN environment variable is not set', () => {
    // Given
    // process.env.CORS_ORIGIN is empty from beforeEach
    
    // When
    const options = Reflect.getMetadata(GATEWAY_OPTIONS, RoomsGateway);
    
    // Then
    expect(options?.cors?.origin).toBe('http://localhost:4200');
  });
});
