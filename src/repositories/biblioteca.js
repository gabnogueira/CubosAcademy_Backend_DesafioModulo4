const mainDatabase = require('../utils/database');
const schema = require('../utils/schema');

/** query para criar tabela */
const criarTabelas = (num) => {
	const query = schema.schemasToCreateTables[num];

	return mainDatabase.query(query);
};

/** queries de Usuarios */
const obterUsuariosPorEmail = async (email) => {
	const query = `SELECT * FROM users WHERE email = '${email}';`;

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const adicionarUsuario = async (email, senha, nome) => {
	const query = {
		text: `INSERT INTO users (email, senha, name) VALUES ($1, $2, $3) RETURNING *;`,
		values: [email, senha, nome],
	};

	return mainDatabase.query(query);
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

	return mainDatabase.query(query);
};

const queryToUpdateClientData = async (clientId, name, cpf, email, tel) => {
	const query = {
		text: `UPDATE clients SET name = $1, cpf = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *;`,
		values: [name, cpf, email, tel, clientId],
	};

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const queryToGetClientById = async (clientId, userId) => {
	const query = {
		text: `SELECT * FROM clients WHERE id = $1 AND userid = $2`,
		values: [clientId, userId],
	};

	const result = await mainDatabase.query(query);

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

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const getAllChargesbyUserId = async (userId) => {
	const query = {
		text: `SELECT * FROM charges WHERE userid = $1;`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const getLimitedAndOffsetedChargesList = async (userId, limit, offset) => {
	const query = {
		text: `SELECT * FROM charges WHERE userid = $1 LIMIT $2 OFFSET $3;`,
		values: [userId, limit, offset],
	};

	const result = await mainDatabase.query(query);
	console.log(result.rows);
	console.log(result.rows.length);

	return result.rows;
};

const payChargeById = async (userId, chargeId, paymentDate) => {
	const query = {
		text: `UPDATE charges SET paymentdate = $3 WHERE userid = $1 AND id = $2 RETURNING *;`,
		values: [userId, chargeId, paymentDate],
	};

	const result = await mainDatabase.query(query);

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
	getAllChargesbyUserId,
	getLimitedAndOffsetedChargesList,
	payChargeById,
};
