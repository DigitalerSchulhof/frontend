import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { loadConfig } from './config';
import { createContext, CreateContextContext } from './context';
import { createSchema } from './schema';

const config = loadConfig();

const createContextContext: CreateContextContext = {
  config,
};

const server = createServer(
  createYoga({
    batching: true,
    schema: createSchema(),
    context: createContext(createContextContext),
    landingPage: false,
    graphqlEndpoint: '/',
  })
);

server.listen(3000, () => {
  console.log('🚀 Server ready');
});
