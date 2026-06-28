import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string({ required_error: 'MONGODB_URI environment variable is required' }).min(1),
  JWT_SECRET: z
    .string({ required_error: 'JWT_SECRET environment variable is required' })
    .min(8, 'JWT_SECRET must be at least 8 characters long'),
  CLIENT_URL: z.string({ required_error: 'CLIENT_URL environment variable is required' }).min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // AI Configuration
  AI_ENABLED: z.preprocess(
    (val) => val === 'true' || val === true || val === '1',
    z.boolean()
  ).default(true),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  GEMINI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(2048),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
}).refine(
  (data) => !data.AI_ENABLED || (data.GEMINI_API_KEY && data.GEMINI_API_KEY.trim().length > 0),
  {
    message: 'GEMINI_API_KEY environment variable is required when AI_ENABLED is true',
    path: ['GEMINI_API_KEY'],
  }
);

const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }

  // Override process.env with parsed values (like coerced PORT)
  Object.assign(process.env, result.data);
};

export default validateEnv;
