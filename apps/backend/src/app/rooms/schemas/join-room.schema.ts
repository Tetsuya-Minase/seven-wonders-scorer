import { z } from 'zod';
import { usernameSchema } from './username.schema';

/**
 * ルーム参加要求の検証スキーマ
 * - roomName: 1〜20文字の文字列
 * - username: ユーザー名スキーマに準拠
 * - strict: 未知のプロパティを禁止
 */
export const joinRoomSchema = z
  .object({
    /** 参加対象のルーム名 */
    roomName: z
      .string()
      .min(1, { message: 'Room name is required' })
      .max(20, { message: 'Room name must not exceed 20 characters' }),
    /** 参加するユーザー名 */
    username: usernameSchema,
  })
  .strict();

/**
 * ルーム参加要求のペイロード型
 */
export type JoinRoomPayload = z.infer<typeof joinRoomSchema>;
