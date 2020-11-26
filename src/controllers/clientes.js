const clientFunctionsQueries = require('../repositories/biblioteca');
const formatter = require('../utils/formatter');
const response = require('../utils/response');

const addNewClient = async (ctx) => {
	const newClientData = ctx.request.body;
	const formattedCpf = formatter.cpfFormatter(newClientData.cpf);

	const checkIfClientExists = await clientFunctionsQueries.checkIfClientAlreadyExists(
		formattedCpf
	);

	if (newClientData && !checkIfClientExists) {
		const userId = ctx.state.id;

		const addClientQueryResult = await clientFunctionsQueries.queryToAddNewClient(
			newClientData.nome,
			formattedCpf,
			newClientData.email,
			newClientData.tel,
			userId
		);

		return response(ctx, 201, { id: addClientQueryResult.rows.shift().id });
	}
	if (newClientData && checkIfClientExists) {
		return response(ctx, 404, { message: 'Esse CPF já foi cadastrado' });
	}
};

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
