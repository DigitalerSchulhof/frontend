import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createYoga as realCreateYoga } from 'graphql-yoga';
import * as path from 'path';
import { loadConfig } from './config';
import { createContext, CreateContextContext } from './context';
import { Database } from 'arangojs';

function createSchema() {
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

const config = loadConfig();

const db = new Database({
  url: config.db.url,
  databaseName: config.db.databaseName,
});

const createContextContext: CreateContextContext = {
  config,
  db,
};

export function createYoga() {
  return realCreateYoga({
    batching: true,
    schema: createSchema(),
    context: createContext(createContextContext),
    landingPage: false,
    graphqlEndpoint: '/',
  });
}
