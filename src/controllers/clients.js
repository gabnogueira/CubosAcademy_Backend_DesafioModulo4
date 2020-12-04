const clientFunctionsQueries = require('../repositories/libraryClients');
const formatter = require('../utils/formatter');
const typeOfSearch = require('../utils/typeOfSearch');
const inputValidation = require('../utils/inputValidation');
const response = require('../utils/response');

// eslint-disable-next-line consistent-return
const addNewClient = async (ctx) => {
	const newClientInfo = ctx.request.body;
	const formattedCpf = formatter.cpfFormatter(newClientInfo.cpf);
	const userId = ctx.state.id;

	const getCpf = await clientFunctionsQueries.checkIfClientAlreadyExists(
		formattedCpf,
		userId
	);

	// eslint-disable-next-line no-unneeded-ternary
	const checkIfClientExists = getCpf ? true : false;

	const validCpf = inputValidation.validateCpf(newClientInfo.cpf);

	if (!validCpf) {
		return response(ctx, 400, { message: 'CPF inválido ' });
	}

	if (newClientInfo && !checkIfClientExists) {
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
	const userId = ctx.state.id;
	const formattedCpf = formatter.cpfFormatter(clientDataToBeUpdated.cpf);

	const validCpf = inputValidation.validateCpf(clientDataToBeUpdated.cpf);

	if (!validCpf) {
		return response(ctx, 400, { message: 'CPF inválido' });
	}

	if (clientDataToBeUpdated) {
		const updateClientDataQueryResult = await clientFunctionsQueries.queryToUpdateClientData(
			clientDataToBeUpdated.id,
			clientDataToBeUpdated.nome,
			formattedCpf,
			clientDataToBeUpdated.email,
			clientDataToBeUpdated.tel,
			userId
		);

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
	if (!clientDataToBeUpdated) {
		return response(ctx, 400, 'Erro. Reveja os dados a serem atualizados.');
	}
};

// eslint-disable-next-line consistent-return
const listOrSearchClients = async (ctx) => {
	const { offset } = ctx.query;
	const { clientesPorPagina } = ctx.query;
	const { busca } = ctx.query;
	const userId = ctx.state.id;

	const paginaAtual = Math.round(offset / clientesPorPagina + 1);

	if (busca) {
		const inputType = typeOfSearch.typeOfInput(busca);
		/** aqui vem a query pra buscar os clientes utiizando o tipo de input como criterio de busca */
		const limitedAndOffsetedClientsArrayWithSearch = await clientFunctionsQueries.queryToGetClientsByUserIdAndSearchCriteria(
			userId,
			inputType,
			busca,
			clientesPorPagina,
			offset
		);

		const numberOfClients = limitedAndOffsetedClientsArrayWithSearch.length;

		const totalDePaginas =
			Number(offset) === 0
				? 1
				: Math.round(numberOfClients / Number(clientesPorPagina));

		const issuedCharges = await clientFunctionsQueries.getTotalAmountOfIssuedChargesByClient(
			userId
		);

		const paidCharges = await clientFunctionsQueries.getTotalAmountOfPaidChargesByClient(
			userId
		);

		const overdueCharges = await clientFunctionsQueries.getTotalAmountOfOverdueChargesByClient(
			userId
		);

		const clients = (await limitedAndOffsetedClientsArrayWithSearch).map(
			(item) => {
				const { name } = item;
				const { email } = item;

				let cobrancasFeitas = 0;
				let cobrancasRecebidas = 0;
				let estaInadimplente = false;

				issuedCharges.filter((client) => {
					if (client && client.name === name) {
						cobrancasFeitas = client.cobrancasfeitas;
						return cobrancasFeitas;
					}
					return cobrancasFeitas;
				});

				paidCharges.filter((client) => {
					if (client && client.name === name) {
						cobrancasRecebidas = client.cobrancasrecebidas;
						return cobrancasRecebidas;
					}
					return cobrancasRecebidas;
				});

				overdueCharges.filter((client) => {
					if (client && client.name === name) {
						estaInadimplente = true;
						return estaInadimplente;
					}
					return estaInadimplente;
				});

				const cliente = {
					nome: name,
					email,
					cobrancasFeitas,
					cobrancasRecebidas,
					estaInadimplente,
				};

				return cliente;
			}
		);

		return response(ctx, 200, {
			paginaAtual,
			totalDePaginas,
			clientes: clients,
		});
	}
	if (!busca) {
		/** query para trazer todos os clientes do usuario, apenas limitando a paginação */
		const limitedAndOffsetedClientsArray = await clientFunctionsQueries.queryToGetAllClientsByUserIdWithLimitAndOffset(
			userId,
			clientesPorPagina,
			offset
		);

		const numberOfClients = limitedAndOffsetedClientsArray.length;

		const totalDePaginas =
			Number(offset) === 0
				? 1
				: Math.round(numberOfClients / Number(clientesPorPagina));

		const issuedCharges = await clientFunctionsQueries.getTotalAmountOfIssuedChargesByClient(
			userId
		);

		const paidCharges = await clientFunctionsQueries.getTotalAmountOfPaidChargesByClient(
			userId
		);

		const overdueCharges = await clientFunctionsQueries.getTotalAmountOfOverdueChargesByClient(
			userId
		);

		const clients = limitedAndOffsetedClientsArray.map((item) => {
			const { name } = item;
			const { email } = item;

			let cobrancasFeitas = 0;
			let cobrancasRecebidas = 0;
			let estaInadimplente = false;

			issuedCharges.filter((client) => {
				if (client && client.name === name) {
					cobrancasFeitas = client.cobrancasfeitas;
					return cobrancasFeitas;
				}
				return cobrancasFeitas;
			});

			paidCharges.filter((client) => {
				if (client && client.name === name) {
					cobrancasRecebidas = client.cobrancasrecebidas;
					return cobrancasRecebidas;
				}
				return cobrancasRecebidas;
			});

			overdueCharges.filter((client) => {
				if (client && client.name === name) {
					estaInadimplente = true;
					return estaInadimplente;
				}
				return estaInadimplente;
			});

			const cliente = {
				nome: name,
				email,
				cobrancasFeitas,
				cobrancasRecebidas,
				estaInadimplente,
			};

			return cliente;
		});

		return response(ctx, 200, {
			paginaAtual,
			totalDePaginas,
			clientes: clients,
		});
	}
};

module.exports = { addNewClient, updateClientData, listOrSearchClients };
