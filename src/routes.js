const Router = require('koa-router');
const authentication = require('./controllers/authentication');
const userFunctions = require('./controllers/users');
const verifyUser = require('./middlewares/session');
const clientFunctions = require('./controllers/clients');
const chargeFunctions = require('./controllers/charges');
// const { verificacao } = require('./middlewares/session');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', authentication.authUser);
router.post('/usuarios', userFunctions.addNewUser);

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
router.get('/cobrancas', verifyUser.verificacao, chargeFunctions.listCharges);
router.put('/cobrancas', verifyUser.verificacao, chargeFunctions.payCharge);

module.exports = router;
