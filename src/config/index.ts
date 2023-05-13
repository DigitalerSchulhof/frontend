import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

/* eslint-disable @typescript-eslint/naming-convention */
const configSchema = {
  cache: {
    engine: ['void', 'memory', 'redis'],
    shouldSaveMemoryToDisk: v.env('SAVE_MEMORY_CACHE_TO_DISK', v.boolean),
    'redis?': {
      host: v.string,
      port: v.number,
      'password?': v.string,
    },
  },
  database: {
    host: v.string,
    name: v.string,
  },
  jwtSecret: v.string,
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

export type Config = Parse<typeof configSchema>;

function loadConfig(): Config {
  const validatedConfig = loadEnv(configSchema);

  if (!validatedConfig.valid) {
    console.log(validatedConfig.errors);
    throw new Error('Invalid config');
  }

  return validatedConfig.data;
}

export const config = loadConfig();
