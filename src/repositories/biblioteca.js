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

const queryToGetAllClientsByUserId = async (userId, limit, offset) => {
	const query = {
		text: `SELECT * FROM clients WHERE userid = $1 LIMIT $2 OFFSET $3`,
		values: [userId, limit, offset],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const queryToGetClientsByUserIdAndSearchCriteria = async (
	userId,
	type,
	criteria,
	limit,
	offset
) => {
	const query = {
		text: `SELECT * FROM clients WHERE userid = $1 and ${type} LIKE '%${criteria}%' LIMIT $2 OFFSET $3;`,
		values: [userId, limit, offset],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const getTotalAmountOfIssuedChargesByClient = async (userId) => {
	const query = {
		text: `select * from (
			select clientid, sum(amount) as cobrancasFeitas  from (
				select * from (
					select * from clients
					where userid = $1) as clients
				join
					(select * from charges
					where userid = $1) as charges
				on clients.id = charges.clientid) as clientsByCharges
			group by clientid
			) as cobrancasFeirasPorId
		join
			(select * from clients
			where userid = $1) as clients
		on clientid = clients.id`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const getTotalAmountOfPaidChargesByClient = async (userId) => {
	const query = {
		text: `select * from (
			select clientid, sum(amount) as cobrancasRecebidas  from (
				select *from (
					select * from clients
					where userid = $1) as clients
				join
					(select * from charges
					where userid = $1)as charges
				on clients.id = charges.clientid) as clientsByCharges
			where paymentdate notnull
			group by clientid
			) as cobrancasRecebidasPorId
		join
			(select * from clients
			where userid = $1) as clients
		on clientid = clients.id`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const getTotalAmountOfOverdueChargesByClient = async (userId) => {
	const query = {
		text: `select * from (
			select clientid , sum(amount) as cobrancasVencidas  from (
				select *from (
					select * from clients
					where userid = $1) as clients
				join
					(select * from charges
					where userid = $1)as charges
				on clients.id = charges.clientid) as clientsByCharges
			where 
				paymentdate is null
				and duedate < now() 
			group by clientid
		) as cobrancasVencidasPorId
		join
			(select * from clients
			where userid = $1) as clients
		on clientid = clients.id`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
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
	queryToGetAllClientsByUserId,
	getTotalAmountOfIssuedChargesByClient,
	getTotalAmountOfPaidChargesByClient,
	getTotalAmountOfOverdueChargesByClient,
	queryToGetClientsByUserIdAndSearchCriteria,
};
