const Router = require('koa-router');
const authentication = require('./controllers/authentication');
const userFunctions = require('./controllers/users');
const verifyFunction = require('./middlewares/session');
const clientFunctions = require('./controllers/clients');
const chargeFunctions = require('./controllers/charges');
const reportFunction = require('./controllers/report');

const router = new Router();

//* * Endpoints de login e usuário */
router.post('/auth', authentication.authUser);
router.post('/usuarios', userFunctions.addNewUser);

//* * Endpoints de clientes */
router.post(
	'/clientes',
	verifyFunction.verifyUser,
	clientFunctions.addNewClient
);
router.put(
	'/clientes',
	verifyFunction.verifyUser,
	clientFunctions.updateClientData
);

router.get(
	'/clientes',
	verifyFunction.verifyUser,
	clientFunctions.listOrSearchClients
);

//* * Endpoints de cobranças */
router.post(
	'/cobrancas',
	verifyFunction.verifyUser,
	chargeFunctions.createCharges
);
router.get(
	'/cobrancas',
	verifyFunction.verifyUser,
	chargeFunctions.listCharges
);
router.put('/cobrancas', verifyFunction.verifyUser, chargeFunctions.payCharge);

//* * Endpoint do relatório */
router.get('/relatorios', verifyFunction.verifyUser, reportFunction.getReport);

module.exports = router;
