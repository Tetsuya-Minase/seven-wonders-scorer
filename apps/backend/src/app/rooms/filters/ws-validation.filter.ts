import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

/**
 * WebSocketにおける例外をキャッチし、統一された { error: string } 形式でクライアントに返すフィルター
 */
@Catch(WsException, HttpException, Error)
export class WsValidationFilter extends BaseWsExceptionFilter {
  /**
   * 例外をキャッチし、適切にフォーマットして応答します。
   * 
   * @param exception 発生した例外
   * @param host 実行コンテキスト
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    let errorMessage = 'Internal server error';

    if (exception instanceof WsException) {
      const error = exception.getError();
      errorMessage = typeof error === 'string' ? error : (error as any).message || 'Validation failed';
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();
      errorMessage = typeof response === 'string' ? response : (response as any).message?.[0] || (response as any).message || 'Validation failed';
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    // In socket.io, the callback is the last argument of the args array
    const args = host.getArgByIndex(2); // usually the ack callback in Socket.io
    if (typeof args === 'function') {
      args({ error: errorMessage });
    } else {
      // If no ack callback, just emit an error event or send it back some other way
      client.emit('error', { error: errorMessage });
    }
  }
}
