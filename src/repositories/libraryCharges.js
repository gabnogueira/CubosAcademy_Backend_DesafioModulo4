const mainDatabase = require('../utils/database');
const schema = require('../utils/schema');

/** query para criar tabela */
const criarTabelas = (num) => {
	const query = schema.schemasToCreateTables[num];

	return mainDatabase.query(query);
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
	criarTabelas,
	queryToCreateNewCharge,
	getAllChargesbyUserId,
	getLimitedAndOffsetedChargesList,
	payChargeById,
};
