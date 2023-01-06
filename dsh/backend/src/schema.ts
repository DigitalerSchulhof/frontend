import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as path from 'path';
import { yieldModules } from './utils';

export function createSchema() {
  const moduleDirs = [...yieldModules()].map(([dir]) => dir);

  const resolvers = mergeResolvers(
    loadFilesSync([
      path.resolve(__dirname, '../resolvers/**/*.resolve.ts'),
      ...moduleDirs
        .map((dir) => [
          path.join(dir, 'resolvers/**/*.resolve.ts'),
          path.join(dir, 'backend/resolvers/**/*.resolve.ts'),
        ])
        .flat(),
    ])
  );
  const typeDefs = loadFilesSync([
    path.resolve(__dirname, '../resolvers/**/*.graphql'),
    ...moduleDirs
      .map((dir) => [
        path.join(dir, 'resolvers/**/*.graphql'),
        path.join(dir, 'backend/resolvers/**/*.graphql'),
      ])
      .flat(),
  ]);

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}
