import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * ルートコントローラー
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * アプリケーションの基本情報を返します。
   * 
   * @returns メッセージオブジェクト
   */
  @Get()
  getData() {
    return this.appService.getData();
  }
}
