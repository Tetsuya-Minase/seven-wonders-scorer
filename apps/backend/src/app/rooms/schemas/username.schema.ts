import { z } from 'zod';

/**
 * 予約語のリスト（プロトタイプ汚染対策）
 */
const RESERVED_KEYWORDS = ['__proto__', 'constructor', 'prototype'] as const;

/**
 * ユーザー名の検証スキーマ
 * - 1〜20文字の文字列
 * - 空白のみの文字列は不可
 * - プロトタイプ汚染につながる予約語（__proto__, constructor, prototype）を含まないこと
 */
export const usernameSchema = z
  .string()
  .min(1, { message: 'Username is required' })
  .max(20, { message: 'Username must not exceed 20 characters' })
  .regex(/\S/, { message: 'Username must not be blank' })
  .refine(
    (val) => !RESERVED_KEYWORDS.some((keyword) => val.includes(keyword)),
    { message: 'Username cannot contain reserved words' }
  );

/**
 * ユーザー名の型定義
 */
export type Username = z.infer<typeof usernameSchema>;
