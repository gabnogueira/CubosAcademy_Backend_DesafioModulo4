const clientFunctionsQueries = require('../repositories/biblioteca');
const formatter = require('../utils/formatter');
const response = require('../utils/response');

// eslint-disable-next-line consistent-return
const addNewClient = async (ctx) => {
	const newClientInfo = ctx.request.body;
	const formattedCpf = formatter.cpfFormatter(newClientInfo.cpf);

	const checkIfClientExists = await clientFunctionsQueries.checkIfClientAlreadyExists(
		formattedCpf
	);

	if (newClientInfo && !checkIfClientExists) {
		const userId = ctx.state.id;

		const addClientQueryResult = await clientFunctionsQueries.queryToAddNewClient(
			newClientInfo.nome,
			formattedCpf,
			newClientInfo.email,
			newClientInfo.tel,
			userId
		);

		return response(ctx, 201, { id: addClientQueryResult.rows.shift().id });
	}
	if (newClientInfo && checkIfClientExists) {
		return response(ctx, 404, { message: 'Esse CPF já foi cadastrado' });
	}
};

// eslint-disable-next-line consistent-return
const updateClientData = async (ctx) => {
	const clientDataToBeUpdated = ctx.request.body;
	const formattedCpf = formatter.cpfFormatter(clientDataToBeUpdated.cpf);

	const checkIfClientExists = await clientFunctionsQueries.checkIfClientAlreadyExists(
		formattedCpf
	);

	console.log(checkIfClientExists);

	if (clientDataToBeUpdated && !checkIfClientExists) {
		const updateClientDataQueryResult = await clientFunctionsQueries.queryToUpdateClientData(
			clientDataToBeUpdated.id,
			clientDataToBeUpdated.nome,
			formattedCpf,
			clientDataToBeUpdated.email,
			clientDataToBeUpdated.tel
		);

		console.log(updateClientDataQueryResult);

		return response(ctx, 200, {
			dados: {
				id: updateClientDataQueryResult.id,
				nome: updateClientDataQueryResult.name,
				cpf: updateClientDataQueryResult.cpf,
				email: updateClientDataQueryResult.email,
				tel: updateClientDataQueryResult.phone,
			},
		});
	}
	if (clientDataToBeUpdated && checkIfClientExists) {
		return response(ctx, 404, 'Esse CPF já foi usado em outro cadastro.');
	}
};

module.exports = { addNewClient, updateClientData };
