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
		text: `INSERT INTO users (email, senha, name) VALUES ($1, $2, $3) RETURNING *`,
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
		text: `INSERT INTO clients (name, cpf, email, phone, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
		values: [name, cpf, email, tel, userId],
	};

	return databasePrincipal.query(query);
};

module.exports = {
	obterUsuariosPorEmail,
	criarTabelas,
	adicionarUsuario,
	queryToAddNewClient,
	checkIfClientAlreadyExists,
};
