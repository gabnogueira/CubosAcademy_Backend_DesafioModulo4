const Router = require('koa-router');
const autenticacao = require('./controllers/autenticacao');
const funcoesDeUsuario = require('./controllers/usuarios');
const verifyUser = require('./middlewares/session');
const clientFunctions = require('./controllers/clientes');
const chargeFunctions = require('./controllers/cobrancas');
// const { verificacao } = require('./middlewares/session');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', autenticacao.autenticarUser);
router.post('/usuarios', funcoesDeUsuario.adicionarUsuario);

//* * Endpoints de clientes */
router.post('/clientes', verifyUser.verificacao, clientFunctions.addNewClient);
router.put(
	'/clientes',
	verifyUser.verificacao,
	clientFunctions.updateClientData
);

//* * Endpoints de cobranças */
router.post(
	'/cobrancas',
	verifyUser.verificacao,
	chargeFunctions.createCharges
);

module.exports = router;
