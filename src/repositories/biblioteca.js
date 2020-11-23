const databasePrincipal = require('../utils/database');
const schema = require('../utils/schema');

//* * queries */
const obterUsuariosPorEmail = async (email) => {
	const query = `${email}`;

	const result = await databasePrincipal.query(query);

	return result.rows.shift();
};

const criarTabelas = (index) => {
	const query = schema.schema[index];

	return databasePrincipal.query(query);
};

const adicionarUsuario = (email, senha, nome) => {
	const query = {
		text: `INSERT INTO users (email, senha, nome) VALUES $1, $2, $3 RETURNING *`,
		values: [email, senha, nome],
	};

	return databasePrincipal.query(query);
};

module.exports = { obterUsuariosPorEmail, criarTabelas, adicionarUsuario };
