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

module.exports = { addNewClient };
