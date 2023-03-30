import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

/* eslint-disable @typescript-eslint/naming-convention */
const config = {
  cache: {
    engine: ['void', 'memory', 'redis'],
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

export type Config = Parse<typeof config>;

export function loadConfig(): Config {
  const validatedConfig = loadEnv(config);

  if (!validatedConfig.valid) {
    console.log(validatedConfig.errors);
    throw new Error('Invalid config');
  }

  return validatedConfig.data;
}