import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

/* eslint-disable @typescript-eslint/naming-convention */
const configSchema = {
  grpc: {
    address: v.string,
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
