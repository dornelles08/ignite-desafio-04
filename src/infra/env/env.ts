import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  PORT: z.coerce.number().optional().default(3333),

  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  CLOUDEFLARE_ACCOUNT_ID: z.string(),

  // REDIS_HOST: z.string().optional().default("127.0.0.1"),
  // REDIS_PORT: z.coerce.number().optional().default(6379),
  // REDIS_DB: z.coerce.number().optional().default(0),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
});

export type Env = z.infer<typeof envSchema>;
