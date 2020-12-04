const mainDatabase = require('../utils/database');

const getUserByEmail = async (email) => {
	const query = `SELECT * FROM users WHERE email = '${email}';`;

	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

const addNewUser = async (email, senha, nome) => {
	const query = {
		text: `INSERT INTO users (email, senha, name) VALUES ($1, $2, $3) RETURNING *;`,
		values: [email, senha, nome],
	};

	return mainDatabase.query(query);
};

const checkIfUserAlreadyExists = async (email, name) => {
	const query = {
		text: `SELECT email, name FROM users WHERE email = $1 or name = $2`,
		values: [email, name],
	};
	const result = await mainDatabase.query(query);

	return result.rows.shift();
};

module.exports = { getUserByEmail, addNewUser, checkIfUserAlreadyExists };
