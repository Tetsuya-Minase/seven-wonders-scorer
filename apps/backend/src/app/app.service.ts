import { Injectable } from '@nestjs/common';

/**
 * ルートサービス
 */
@Injectable()
export class AppService {
  /**
   * 基本メッセージデータを返します。
   * 
   * @returns メッセージオブジェクト
   */
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
