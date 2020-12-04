const mainDatabase = require('../utils/database');

const checkIfClientAlreadyExists = async (cpf, userId) => {
	const query = {
		text: `SELECT cpf FROM clients WHERE cpf = $1 and userid = $2`,
		values: [cpf, userId],
	};
	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const queryToAddNewClient = async (name, cpf, email, tel, userId) => {
	const query = {
		text: `INSERT INTO clients (name, cpf, email, phone, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
		values: [name, cpf, email, tel, userId],
	};

	return mainDatabase.query(query);
};

const queryToUpdateClientData = async (
	clientId,
	name,
	cpf,
	email,
	tel,
	userId
) => {
	const query = {
		text: `UPDATE clients SET name = $1, cpf = $2, email = $3, phone = $4 WHERE id = $5 and userid = $6 RETURNING *;`,
		values: [name, cpf, email, tel, clientId, userId],
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

const queryToGetAllClientsByUserIdWithLimitAndOffset = async (
	userId,
	limit,
	offset
) => {
	const query = {
		text: `SELECT * FROM clients WHERE userid = $1 LIMIT $2 OFFSET $3`,
		values: [userId, limit, offset],
	};

	const result = await mainDatabase.query(query);

	return result.rows;
};

const queryToGetAllClientsByUserId = async (userId) => {
	const query = {
		text: `SELECT * FROM clients WHERE userid = $1`,
		values: [userId],
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

module.exports = {
	checkIfClientAlreadyExists,
	queryToAddNewClient,
	queryToUpdateClientData,
	queryToGetClientById,
	queryToGetAllClientsByUserIdWithLimitAndOffset,
	queryToGetAllClientsByUserId,
	queryToGetClientsByUserIdAndSearchCriteria,
	getTotalAmountOfIssuedChargesByClient,
	getTotalAmountOfPaidChargesByClient,
	getTotalAmountOfOverdueChargesByClient,
};
