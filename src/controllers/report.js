const clientFunctionsQueries = require('../repositories/libraryClients');
const reportQueries = require('../repositories/libraryReport');
const response = require('../utils/response');

const getReport = async (ctx) => {
	const userId = ctx.state.id;

	const overdueChargesByClient = await clientFunctionsQueries.getTotalAmountOfOverdueChargesByClient(
		userId
	);
	const totalNumberOfClients = await clientFunctionsQueries.queryToGetAllClientsByUserId(
		userId
	);

	const arrayOfChargesByStatus = await reportQueries.queryToGetTotalNumberOfChargesPerStatus(
		userId
	);

	const getCurrentBalance = await reportQueries.queryToGetCurrentBalance(
		userId
	);

	const qtdClientsInadimplentes = overdueChargesByClient.length;
	const qtdClientesAdimplentes =
		totalNumberOfClients.length - qtdClientsInadimplentes;

	const totalNumberOfChargesByStatus = {
		qtdCobrancasPrevistas: arrayOfChargesByStatus.cobrancasprevistas,
		qtdCobrancasPagas: arrayOfChargesByStatus.cobrancaspagas,
		qtdCobrancasVencidas: arrayOfChargesByStatus.cobrancasvencidas,
	};

	const saldoEmConta = getCurrentBalance.saldoemconta;

	const report = {
		qtdClientesAdimplentes,
		qtdClientsInadimplentes,
		...totalNumberOfChargesByStatus,
		saldoEmConta,
	};

	return response(ctx, 200, { relatorio: report });
};

module.exports = { getReport };
