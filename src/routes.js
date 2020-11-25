const Router = require('koa-router');
const autenticacao = require('./controllers/autenticacao');
const funcoesDeUsuario = require('./controllers/usuarios');
const verifyUser = require('./middlewares/session');
const clientFuncions = require('./controllers/clientes');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', autenticacao.autenticarUser);
router.post('/usuarios', funcoesDeUsuario.adicionarUsuario);
router.post('/clientes', verifyUser.verificacao, clientFuncions.addNewClient);

//* * Endpoints de clientes */

//* * Endpoints de cobranças */

module.exports = router;
