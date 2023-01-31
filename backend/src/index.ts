import * as Koa from 'koa';
import * as compress from 'koa-compress';
import { createYoga } from './yoga';

const app = new Koa();
const yoga = createYoga();

app.use(compress());

app.use(async (ctx, next) => {
  const response = await yoga.handleNodeRequest(ctx.req, ctx);

  ctx.status = response.status;

  response.headers.forEach((value, key) => {
    ctx.append(key, value);
  });

  ctx.body = response.body;

  next();
});

app.listen(4000, () => {
  console.log('🚀 Server ready');
});
