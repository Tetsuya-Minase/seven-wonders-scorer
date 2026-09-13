import { z } from 'zod';
import { usernameSchema } from './username.schema';

/**
 * ユーザー追加要求の検証スキーマ
 * - username: ユーザー名スキーマに準拠
 * - strict: 未知のプロパティを禁止
 */
export const addUserSchema = z
  .object({
    /** 追加するユーザー名 */
    username: usernameSchema,
  })
  .strict();

/**
 * ユーザー追加要求のペイロード型
 */
export type AddUserPayload = z.infer<typeof addUserSchema>;
