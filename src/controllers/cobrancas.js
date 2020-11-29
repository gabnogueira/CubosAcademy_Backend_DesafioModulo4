const pagarme = require('../utils/pagarme');
const chargeQueries = require('../repositories/biblioteca');
const formatter = require('../utils/formatter');
const functionToCheckChargeStatus = require('../utils/chargeStatus');
const response = require('../utils/response');

const createCharges = async (ctx) => {
	const newChargeInfo = ctx.request.body;
	const userId = ctx.state.id;
	const clientData = await chargeQueries.queryToGetClientById(
		newChargeInfo.idDoCliente,
		userId
	);

	const formattedDueDate = formatter.dateFormatter(newChargeInfo.vencimento);

	const pagarmeData = await pagarme.createChargesAtPagarme(
		newChargeInfo.valor,
		formattedDueDate,
		newChargeInfo.idDoCliente,
		clientData.name,
		clientData.email,
		clientData.cpf,
		clientData.phone
	);

	if (newChargeInfo && pagarmeData) {
		const newCharge = await chargeQueries.queryToCreateNewCharge(
			userId,
			newChargeInfo.idDoCliente,
			newChargeInfo.descricao,
			newChargeInfo.valor,
			pagarmeData.boleto_expiration_date,
			pagarmeData.boleto_url,
			pagarmeData.boleto_barcode,
			pagarmeData.tid
		);

		// console.log(newCharge);

		const { duedate } = newCharge;
		const { paymentdate } = newCharge;
		const today = Date.now();

		const chargeStatus = functionToCheckChargeStatus.checkChargeStatus(
			duedate,
			paymentdate,
			today
		);

		const cobranca = {
			idDoCliente: newCharge.clientid,
			descricao: newCharge.description,
			valor: newCharge.amount,
			vencimento: newCharge.duedate,
			linkDoBoleto: newCharge.banksliplink,
			status: chargeStatus,
		};
		console.log(cobranca);

		return response(ctx, 201, { cobranca });
	}
	return response(ctx, 400, 'Erro. Reveja as informações de cobrança');
};

const listCharges = async (ctx) => {
	const { offset } = ctx.query;
	const { cobrancasPorPagina } = ctx.query;
	const userId = ctx.state.id;

	const paginaAtual = Math.round(offset / cobrancasPorPagina + 1);

	const chargesArray = await chargeQueries.getAllChargesbyUserId(userId);
	const totalDePaginas = Math.round(chargesArray.length / cobrancasPorPagina);

	const limitedAndOffsetedChargesArray = await chargeQueries.getLimitedAndOffsetedChargesList(
		userId,
		cobrancasPorPagina,
		offset
	);

	const cobrancas = limitedAndOffsetedChargesArray.map((item) => {
		const { duedate } = item;
		const { paymentdate } = item;
		const today = Date.now();

		const chargeStatus = functionToCheckChargeStatus.checkChargeStatus(
			duedate,
			paymentdate,
			today
		);

		const cobranca = {
			idDoCliente: item.clientid,
			descricao: item.description,
			valor: item.amount,
			vencimento: item.duedate,
			linkDoBoleto: item.banksliplink,
			status: chargeStatus,
		};

		return cobranca;
	});

	return response(ctx, 200, {
		paginaAtual,
		totalDePaginas,
		cobrancas,
	});
};

module.exports = { createCharges, listCharges };
