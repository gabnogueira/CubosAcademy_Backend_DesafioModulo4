const clientFunctionsQueries = require('../repositories/biblioteca');
const formatter = require('../utils/formatter');
const typeOfSearch = require('../utils/typeOfSearch');
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

// eslint-disable-next-line consistent-return
const listOrSearchClients = async (ctx) => {
	const { offset } = ctx.query;
	const { clientesPorPagina } = ctx.query;
	const { busca } = ctx.query;
	const userId = ctx.state.id;

	const paginaAtual = Math.round(offset / clientesPorPagina + 1);

	// console.log(offset);
	// console.log(clientesPorPagina);
	// console.log(busca);

	if (busca) {
		const inputType = typeOfSearch.typeOfInput(busca);
		/** aqui vem a query pra buscar os clientes utiizando o tipo de input como criterio de busca */
		const limitedAndOffsetedClientsArrayWithSearch = clientFunctionsQueries.queryToGetClientsByUserIdAndSearchCriteria(
			userId,
			inputType,
			busca,
			clientesPorPagina,
			offset
		);

		const totalDePaginas = Math.round(
			limitedAndOffsetedClientsArrayWithSearch.length / clientesPorPagina
		);

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
		const limitedAndOffsetedClientsArray = await clientFunctionsQueries.queryToGetAllClientsByUserId(
			userId,
			clientesPorPagina,
			offset
		);
		const totalDePaginas = Math.round(
			limitedAndOffsetedClientsArray.length / clientesPorPagina
		);

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
