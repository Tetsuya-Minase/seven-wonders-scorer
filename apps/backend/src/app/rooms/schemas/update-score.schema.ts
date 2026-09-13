import { z } from 'zod';
import { usernameSchema } from './username.schema';

/**
 * 科学スコアの検証スキーマ
 * - gear: 歯車（0〜999の整数、省略可能）
 * - compass: コンパス（0〜999の整数、省略可能）
 * - tablet: 石版（0〜999の整数、省略可能）
 */
export const scienceScoreSchema = z
  .object({
    /** 歯車の数 */
    gear: z.number().int().min(0).max(999).optional(),
    /** コンパスの数 */
    compass: z.number().int().min(0).max(999).optional(),
    /** 石版の数 */
    tablet: z.number().int().min(0).max(999).optional(),
  })
  .strict();

/**
 * 科学スコアの型定義
 */
export type ScienceScore = z.infer<typeof scienceScoreSchema>;

/**
 * スコアデータの検証スキーマ
 * - 各種スコアは 0〜999 の整数（省略可能）
 * - militaryScore のみ -999〜999 の整数（省略可能）
 * - scienceScore は scienceScoreSchema に準拠（省略可能）
 */
export const scoreSchema = z
  .object({
    /** 市民スコア */
    civilScore: z.number().int().min(0).max(999).optional(),
    /** 軍事スコア（負値許容） */
    militaryScore: z.number().int().min(-999).max(999).optional(),
    /** 科学スコア */
    scienceScore: scienceScoreSchema.optional(),
    /** 商業スコア */
    commercialScore: z.number().int().min(0).max(999).optional(),
    /** ギルドスコア */
    guildScore: z.number().int().min(0).max(999).optional(),
    /** 都市スコア */
    cityScore: z.number().int().min(0).max(999).optional(),
    /** リーダースコア */
    leaderScore: z.number().int().min(0).max(999).optional(),
    /** コインスコア */
    coinScore: z.number().int().min(0).max(999).optional(),
    /** 七不思議スコア */
    wonderScore: z.number().int().min(0).max(999).optional(),
  })
  .strict();

/**
 * スコアデータの型定義
 */
export type Score = z.infer<typeof scoreSchema>;

/**
 * スコア更新要求の検証スキーマ
 * - username: ユーザー名スキーマに準拠
 * - score: スコアデータスキーマに準拠
 * - strict: 未知のプロパティを禁止
 */
export const updateScoreSchema = z
  .object({
    /** 対象ユーザー名 */
    username: usernameSchema,
    /** 更新するスコア情報 */
    score: scoreSchema,
  })
  .strict();

/**
 * スコア更新要求のペイロード型
 */
export type UpdateScorePayload = z.infer<typeof updateScoreSchema>;
