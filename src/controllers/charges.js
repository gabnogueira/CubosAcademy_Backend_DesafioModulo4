const pagarme = require('../utils/pagarme');
const chargeQueries = require('../repositories/libraryCharges');
const clientQueries = require('../repositories/libraryClients');
const formatter = require('../utils/formatter');
const functionToCheckChargeStatus = require('../utils/chargeStatus');
const inputValidation = require('../utils/inputValidation');
const response = require('../utils/response');

const createCharges = async (ctx) => {
	const newChargeInfo = ctx.request.body;
	const userId = ctx.state.id;
	const clientData = await clientQueries.queryToGetClientById(
		newChargeInfo.idDoCliente,
		userId
	);

	const formattedDueDate = formatter.dateFormatter(newChargeInfo.vencimento);

	const validAmount = inputValidation.validateAmount(newChargeInfo.valor);
	const validDate = inputValidation.validateDate(formattedDueDate);

	if (!validAmount) {
		return response(ctx, 400, { message: 'Valor inválido' });
	}

	if (!validDate) {
		return response(ctx, 400, {
			message:
				'Data de vencimento inválida. Não é possível criar uma cobrança com vencimento em uma data passada.',
		});
	}

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

	const numberOfCharges = chargesArray.length;
	const totalDePaginas =
		Number(offset) === 0
			? 1
			: Math.round(numberOfCharges / Number(cobrancasPorPagina));

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

const payCharge = async (ctx) => {
	const chargeId = ctx.request.body;
	const userId = ctx.state.id;
	const paymentDate = new Date().toISOString().substr(0, 10);

	const payChargeById = await chargeQueries.payChargeById(
		userId,
		chargeId.idDaCobranca,
		paymentDate
	);

	if (chargeId && payChargeById) {
		return response(ctx, 200, {
			mensagem: 'Cobrança paga com sucesso.',
		});
	}
	return response(ctx, 400, {
		mensagem: 'Erro no pagamento. Confira os dados da cobrança.',
	});
};

module.exports = { createCharges, listCharges, payCharge };
