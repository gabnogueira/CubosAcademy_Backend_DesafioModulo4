const Router = require('koa-router');
const autenticacao = require('./controllers/autenticacao');
const funcoesDeUsuario = require('./controllers/usuarios');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', autenticacao.autenticarUser);
router.post('/usuarios', funcoesDeUsuario.adicionarUsuario);

//* * Endpoints de clientes */

//* * Endpoints de cobranças */

module.exports = router;
