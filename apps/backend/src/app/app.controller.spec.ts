import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return welcome message when getData is called', () => {
      // Given
      const appController = app.get<AppController>(AppController);

      // When
      const result = appController.getData();

      // Then
      expect(result).toEqual({ message: 'Hello API' });
    });
  });
});
