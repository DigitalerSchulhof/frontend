import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

const config = {
  db: {
    url: v.env('DATABASE_URL', v.string),
    databaseName: v.env('DATABASE_NAME', v.string),
  },
  jwt: {
    privateKey: v.string,
  },
};

export type Config = Parse<typeof config>;

export function loadConfig(): Config {
  const validatedConfig = loadEnv(config);

  if (!validatedConfig.valid) {
    console.log(validatedConfig.errors);
    throw new Error('Invalid config');
  }

  return validatedConfig.data;
}
