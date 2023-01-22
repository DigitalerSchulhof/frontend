import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import globby from 'globby';
import path from 'path';
import { __root, __src } from './utils';

const generates: CodegenConfig['generates'] = {};

const queries = globby.sync(path.join(__src, '**/*.gql'));

for (const query of queries) {
  generates[`${query.substring(0, query.length - '.gql'.length)}.query.ts`] = {
    plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
    documents: query,
    schema: path.join(__root, 'backend/src/resolvers/**/*.graphql'),
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
