import { Parse, v, validate } from 'vality';

const config = {
  db: {
    url: v.string,
    databaseName: v.string,
  },
  jwt: {
    privateKey: v.string,
  },
};

const environment = {
  db: {
    url: 'DATABASE_URL',
    databaseName: 'DATABASE_NAME',
  },
  jwt: {
    privateKey: 'JWT_PRIVATE_KEY',
  },
};

export type Config = Parse<typeof config>;

export function loadConfig(): Config {
  const envConfig = populateEnvironment(environment);

  const validatedConfig = validate(config, envConfig);
  if (!validatedConfig.valid) {
    console.log(validatedConfig.errors);
    throw new Error('Invalid config');
  }

  return validatedConfig.data;
}

function populateEnvironment(env: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in env) {
    const value = env[key];
    if (typeof value === 'object') {
      result[key] = populateEnvironment(value);
    } else {
      result[key] = process.env[value as keyof typeof process.env];
    }
  }
  return result;
}
