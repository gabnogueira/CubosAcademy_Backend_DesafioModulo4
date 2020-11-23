//* * Tudo começa aqui */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./src/routes');

const server = new Koa();

server.use(bodyparser());
server.use(router.routes());

server.use(async (ctx) => {
	ctx.body = 'Hello, World!';
});

server.listen(8081, () => console.log('O servidor está rodando!'));
