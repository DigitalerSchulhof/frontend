import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptResolversPluginConfig } from '@graphql-codegen/typescript-resolvers';
import * as fs from 'fs';
import * as path from 'path';
import * as globby from 'globby';

const _resolvers = path.join(__dirname, 'src/resolvers');

const modelFiles = globby.sync('**/models.d.ts', {
  cwd: _resolvers,
});

const mappers: Record<string, string> = {};
for (const modelFile of modelFiles) {
  const modelsFileContent = fs.readFileSync(
    path.join(_resolvers, modelFile),
    'utf-8'
  );
  const models = [
    ...modelsFileContent.matchAll(/export interface (\w+)/g),
    ...modelsFileContent.matchAll(/export type (\w+)/g),
  ];

  for (const model of models) {
    const [, modelName] = model;
    if (modelName === 'Collection' || modelName === 'Edge') continue;

    mappers[modelName] = `./${modelFile.replace(/\.d\.ts$/, '')}#${modelName}`;
  }
}

/* eslint-disable @typescript-eslint/naming-convention */
export default {
  generates: {
    [path.join(_resolvers, 'types.d.ts')]: {
      plugins: ['./codegen-plugin', 'typescript', 'typescript-resolvers'],
      schema: path.join(_resolvers, '**/*.graphql'),
      config: {
        contextType: '../server/context#BackendContext',
        addUnderscoreToArgsType: true,
        mapperTypeSuffix: '_DSH_Model',
        showUnusedMappers: true,
        immutableTypes: true,
        strictScalars: true,
        enumsAsTypes: true,
        scalars: {
          Date: 'number',
        },
        mappers,
      } satisfies TypeScriptPluginConfig & TypeScriptResolversPluginConfig,
    },
  },
} satisfies CodegenConfig;
/* eslint-enable @typescript-eslint/naming-convention */
