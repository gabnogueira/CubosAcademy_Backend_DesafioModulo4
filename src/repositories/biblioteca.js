const databasePrincipal = require('../utils/database');
const schema = require('../utils/schema');

//* * queries */
const obterUsuariosPorEmail = async (email) => {
	const query = `SELECT * FROM users WHERE email = '${email}';`;

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

const criarTabelas = (num) => {
	const query = schema.schemasToCreateTables[num];

	return databasePrincipal.query(query);
};

const adicionarUsuario = async (email, senha, nome) => {
	const query = {
		text: `INSERT INTO users (email, senha, name) VALUES ($1, $2, $3) RETURNING *`,
		values: [email, senha, nome],
	};

	return databasePrincipal.query(query);
};

module.exports = { obterUsuariosPorEmail, criarTabelas, adicionarUsuario };
