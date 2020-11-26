const Router = require('koa-router');
const autenticacao = require('./controllers/autenticacao');
const funcoesDeUsuario = require('./controllers/usuarios');
const verifyUser = require('./middlewares/session');
const clientFuncions = require('./controllers/clientes');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', autenticacao.autenticarUser);
router.post('/usuarios', funcoesDeUsuario.adicionarUsuario);

//* * Endpoints de clientes */
router.post('/clientes', verifyUser.verificacao, clientFuncions.addNewClient);
router.put(
	'/clientes',
	verifyUser.verificacao,
	clientFuncions.updateClientData
);

//* * Endpoints de cobranças */

module.exports = router;
