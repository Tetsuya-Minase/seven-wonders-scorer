import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { type ZodType } from 'zod';

/**
 * WebSocketメッセージのペイロードをZodスキーマに基づいて検証するカスタムパイプ
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  /**
   * ZodValidationPipe を初期化します。
   * 
   * @param schema 検証に使用するZodスキーマ
   */
  constructor(private readonly schema: ZodType) {}

  /**
   * 受信した値をスキーマに従って検証・変換します。
   * `@MessageBody()` 以外の引数（`@ConnectedSocket()` など）は検証をスキップしてそのまま返します。
   * 
   * @param value 検証対象の入力値
   * @param metadata 引数のメタデータ情報
   * @returns 検証済みのデータ
   * @throws WsException 検証に失敗した場合、または予期せぬエラーが発生した場合
   */
  transform(value: unknown, metadata?: ArgumentMetadata): unknown {
    if (metadata && metadata.type !== 'body') {
      return value;
    }

    try {
      const result = this.schema.safeParse(value);

      if (!result.success) {
        const firstIssue = result.error.issues[0];
        const errorMessage = firstIssue ? firstIssue.message : 'Validation failed';
        throw new WsException(errorMessage);
      }

      return result.data;
    } catch (error) {
      if (error instanceof WsException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Validation failed';
      throw new WsException(message);
    }
  }
}
