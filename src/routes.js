const Router = require('koa-router');
const authentication = require('./controllers/authentication');
const userFunctions = require('./controllers/users');
const verifyFunction = require('./middlewares/session');
const clientFunctions = require('./controllers/clients');
const chargeFunctions = require('./controllers/charges');
// const { verificacao } = require('./middlewares/session');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', authentication.authUser);
router.post('/usuarios', userFunctions.addNewUser);

//* * Endpoints de clientes */
router.post(
	'/clientes',
	verifyFunction.verificacao,
	clientFunctions.addNewClient
);
router.put(
	'/clientes',
	verifyFunction.verificacao,
	clientFunctions.updateClientData
);

router.get(
	'/clientes',
	verifyFunction.verificacao,
	clientFunctions.listOrSearchClients
);

//* * Endpoints de cobranças */
router.post(
	'/cobrancas',
	verifyFunction.verificacao,
	chargeFunctions.createCharges
);
router.get(
	'/cobrancas',
	verifyFunction.verificacao,
	chargeFunctions.listCharges
);
router.put('/cobrancas', verifyFunction.verificacao, chargeFunctions.payCharge);

module.exports = router;
