import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

/**
 * WebSocket向けのトークンバケット式レートリミットガード
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  /** 1秒あたりの最大イベント数（補充レート） */
  private readonly MAX_EVENTS_PER_SEC = 10;
  /** バーストを許容する最大トークン数 */
  private readonly BURST_LIMIT = 20;
  /** クライアントごとのトークン管理マップ */
  private clients: Map<string, { tokens: number; lastRefill: number }> = new Map();

  /**
   * クライアントのイベント送信レートが制限内かどうかを判定します。
   * 
   * @param context 実行コンテキスト
   * @returns 許可される場合は true
   * @throws WsException 制限を超過した場合は例外をスロー
   */
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const clientId = client.id;

    if (!clientId) return true;

    const now = Date.now();
    let clientData = this.clients.get(clientId);

    if (!clientData) {
      clientData = { tokens: this.BURST_LIMIT, lastRefill: now };
    } else {
      const timePassed = now - clientData.lastRefill;
      const refill = Math.floor(timePassed * (this.MAX_EVENTS_PER_SEC / 1000));
      
      if (refill > 0) {
        clientData.tokens = Math.min(this.BURST_LIMIT, clientData.tokens + refill);
        clientData.lastRefill = now;
      }
    }

    if (clientData.tokens > 0) {
      clientData.tokens -= 1;
      this.clients.set(clientId, clientData);
      return true;
    } else {
      this.clients.set(clientId, clientData);
      throw new WsException({ error: 'Rate limit exceeded' });
    }
  }
}
