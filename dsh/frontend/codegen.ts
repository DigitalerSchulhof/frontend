import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import globby from 'globby';
import path from 'path';

const _dsh = path.resolve(__dirname, '..');
const _packages = path.resolve(__dirname, '../../packages');

const generates: CodegenConfig['generates'] = {};

const queries = globby.sync(path.join(_packages, '*/**/*.gql'));

for (const query of queries) {
  generates[`${query.substring(0, query.length - '.gql'.length)}.query.ts`] = {
    plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    documents: query,
    schema: [
      path.join(_packages, '*/backend/resolvers/**/*.graphql'),
      path.join(_packages, '*/resolvers/**/*.graphql'),
      path.join(_dsh, 'backend/resolvers/**/*.graphql'),
    ],
    config: {
      addUnderscoreToArgsType: true,
      immutableTypes: true,
      strictScalars: true,
      scalars: {
        Date: 'Date',
      },
    } satisfies TypeScriptPluginConfig &
      TypeScriptDocumentsPluginConfig &
      TypeScriptTypedDocumentNodesConfig,
  };
}

export default {
  generates,
} satisfies CodegenConfig;
