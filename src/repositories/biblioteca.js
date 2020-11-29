const databasePrincipal = require('../utils/database');
const schema = require('../utils/schema');

/** query para criar tabela */
const criarTabelas = (num) => {
	const query = schema.schemasToCreateTables[num];

	return databasePrincipal.query(query);
};

/** queries de Usuarios */
const obterUsuariosPorEmail = async (email) => {
	const query = `SELECT * FROM users WHERE email = '${email}';`;

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

const adicionarUsuario = async (email, senha, nome) => {
	const query = {
		text: `INSERT INTO users (email, senha, name) VALUES ($1, $2, $3) RETURNING *;`,
		values: [email, senha, nome],
	};

	return databasePrincipal.query(query);
};

/** queries para funções de clientes */

const checkIfClientAlreadyExists = async (cpf) => {
	const check = await schema.clientCheckByCpf(cpf);

	return check.rows.shift();
};

const queryToAddNewClient = async (name, cpf, email, tel, userId) => {
	const query = {
		text: `INSERT INTO clients (name, cpf, email, phone, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
		values: [name, cpf, email, tel, userId],
	};

	return databasePrincipal.query(query);
};

const queryToUpdateClientData = async (clientId, name, cpf, email, tel) => {
	const query = {
		text: `UPDATE clients SET name = $1, cpf = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *;`,
		values: [name, cpf, email, tel, clientId],
	};

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

const queryToGetClientById = async (clientId, userId) => {
	const query = {
		text: `SELECT * FROM clients WHERE id = $1 AND userid = $2`,
		values: [clientId, userId],
	};

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

/** queries para funções de cobranças */

const queryToCreateNewCharge = async (
	userId,
	clientId,
	description,
	amount,
	dueDate,
	bankslipLink,
	bankslipBarcode,
	pagarmeTid
) => {
	const query = {
		text: `INSERT INTO CHARGES (amount, dueDate, clientId, userId, description, bankslipLink, bankslipBarcode, pagarmeTid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
		values: [
			amount,
			dueDate,
			clientId,
			userId,
			description,
			bankslipLink,
			bankslipBarcode,
			pagarmeTid,
		],
	};

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

module.exports = {
	obterUsuariosPorEmail,
	criarTabelas,
	adicionarUsuario,
	queryToAddNewClient,
	checkIfClientAlreadyExists,
	queryToUpdateClientData,
	queryToCreateNewCharge,
	queryToGetClientById,
};
