import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return welcome message when getData is called', () => {
      // Given
      const appService = service;

      // When
      const result = appService.getData();

      // Then
      expect(result).toEqual({ message: 'Hello API' });
    });
  });
});
