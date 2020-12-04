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

	const totalNumberOfOverdueCharges = await reportQueries.queryToGetTotalNumberOfOverdueCharges(
		userId
	);

	const totalNumberOfPaidCharges = await reportQueries.queryToGetTotalNumberOfPaidCharges(
		userId
	);

	const totalNumberOfAwaitingPaymentCharges = await reportQueries.queryToGetTotalNumberOfAwaitingPaymentCharges(
		userId
	);

	const getCurrentBalance = await reportQueries.queryToGetCurrentBalance(
		userId
	);

	const qtdClientsInadimplentes = overdueChargesByClient.length;
	const qtdClientesAdimplentes =
		totalNumberOfClients.length - qtdClientsInadimplentes;

	const totalNumberOfChargesByStatus = {
		qtdCobrancasPrevistas: !totalNumberOfAwaitingPaymentCharges
			? 0
			: Number(totalNumberOfAwaitingPaymentCharges.cobrancasprevistas),
		qtdCobrancasPagas: !totalNumberOfPaidCharges
			? 0
			: Number(totalNumberOfPaidCharges.cobrancaspagas),
		qtdCobrancasVencidas: !totalNumberOfOverdueCharges
			? 0
			: Number(totalNumberOfOverdueCharges.cobrancasvencidas),
	};

	const saldoEmConta = !getCurrentBalance
		? 0
		: Number(getCurrentBalance.saldoemconta);

	const report = {
		qtdClientesAdimplentes,
		qtdClientsInadimplentes,
		...totalNumberOfChargesByStatus,
		saldoEmConta,
	};

	return response(ctx, 200, { relatorio: report });
};

module.exports = { getReport };
