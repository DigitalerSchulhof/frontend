import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptResolversPluginConfig } from '@graphql-codegen/typescript-resolvers';
import path from 'path';

export default {
  generates: {
    [path.join(__dirname, 'src/resolvers/types.ts')]: {
      plugins: ['./codegen-plugin', 'typescript', 'typescript-resolvers'],
      schema: path.join(__dirname, 'src/resolvers/**/*.graphql'),
      config: {
        contextType: '../context#BackendContext',
        addUnderscoreToArgsType: true,
        mapperTypeSuffix: '_DSH_Model',
        showUnusedMappers: true,
        immutableTypes: true,
        strictScalars: true,
        scalars: {
          Date: 'Date',
        },
      } satisfies TypeScriptPluginConfig & TypeScriptResolversPluginConfig,
    },
  },
} satisfies CodegenConfig;
