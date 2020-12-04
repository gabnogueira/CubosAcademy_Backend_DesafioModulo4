const mainDatabase = require('../utils/database');

const queryToGetTotalNumberOfChargesPerStatus = async (userId) => {
	const query = {
		text: `select cobrancasvencidas.userid, cobrancasprevistas, cobrancaspagas, cobrancasvencidas from (
			select userid, count(id) as cobrancasVencidas from charges
			where
				userid = $1
				and paymentdate is null
				and duedate < now()
			group by userid 
			) as cobrancasVencidas
		left join
			(select userid, count(id) as cobrancasPagas from charges
				where
					userid = $1
					and paymentdate notnull
				group by userid 
				) as cobrancasPagas
		on cobrancasVencidas.userid = cobrancasPagas.userid
		left join
			(select userid, count(id) as cobrancasPrevistas from charges
				where
					userid = $1
					and paymentdate is null
					and duedate >= now()
				group by userid
				) as cobrancasPrevistas
		on cobrancasPagas.userid = cobrancasPrevistas.userid;`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	console.log(result.rows.shift());

	return result.rows.shift();
};

const queryToGetTotalNumberOfOverdueCharges = async (userId) => {
	const query = {
		text: `select userid, count(id) as cobrancasVencidas from charges
		where
			userid = $1
			and paymentdate is null
			and duedate < now()
		group by userid; `,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	// console.log(result.rows.shift());

	return result.rows.shift();
};

const queryToGetTotalNumberOfPaidCharges = async (userId) => {
	const query = {
		text: `select userid, count(id) as cobrancasPagas from charges
		where
			userid = $1
			and paymentdate notnull
		group by userid`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const queryToGetTotalNumberOfAwaitingPaymentCharges = async (userId) => {
	const query = {
		text: `select userid, count(id) as cobrancasPrevistas from charges
		where
			userid = $1
			and paymentdate is null
			and duedate >= now()
		group by userid`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	// console.log(result.rows.shift());

	return result.rows.shift();
};

const queryToGetCurrentBalance = async (userId) => {
	const query = {
		text: `select userid, sum(amount) as saldoEmConta from charges
					where
						userid = $1
						and paymentdate notnull
					group by userid;
					`,
		values: [userId],
	};

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

module.exports = {
	queryToGetTotalNumberOfChargesPerStatus,
	queryToGetCurrentBalance,
	queryToGetTotalNumberOfAwaitingPaymentCharges,
	queryToGetTotalNumberOfOverdueCharges,
	queryToGetTotalNumberOfPaidCharges,
};
