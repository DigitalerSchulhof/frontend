import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as path from 'path';

export function createSchema() {
  const resolvers = mergeResolvers(
    loadFilesSync(path.join(__dirname, 'resolvers/**/*.resolve.ts'))
  );
  const typeDefs = loadFilesSync(
    path.join(__dirname, 'resolvers/**/*.graphql')
  );

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}
