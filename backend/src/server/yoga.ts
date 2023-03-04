import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga as realCreateYoga } from 'graphql-yoga';
import * as path from 'path';
import { loadConfig } from '../config';
import { createContextCreator } from './context';
import { useHandleArangoErrors } from './plugins/use-handle-arango-errors';
import { useHandleValidationErrors } from './plugins/use-handle-validation-errors';

function createSchema() {
  const resolvers = mergeResolvers(
    loadFilesSync(path.resolve(__dirname, '../resolvers/**/*.resolve.ts'))
  );
  const typeDefs = loadFilesSync(
    path.resolve(__dirname, '../resolvers/**/*.graphql')
  );

  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}

const config = loadConfig();

export function createYoga() {
  return realCreateYoga({
    batching: true,
    schema: createSchema(),
    context: createContextCreator(config),
    landingPage: false,
    graphqlEndpoint: '/',
    plugins: [useHandleValidationErrors(), useHandleArangoErrors()],
  });
}
