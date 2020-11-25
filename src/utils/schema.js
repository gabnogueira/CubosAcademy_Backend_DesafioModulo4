const databasePrincipal = require('./database');

const schemasToCreateTables = {
	1: `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255),
		senha VARCHAR(255),
		name TEXT NOT NULL,
		deletado BOOL DEFAULT FALSE
	)
	`,
	2: `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		cpf VARCHAR(11),
		email VARCHAR(255),
		phone VARCHAR(255),
		deleted BOOL DEFAULT FALSE,
		userId INTEGER NOT NULL
	)
	`,
	3: `
	CREATE TABLE IF NOT EXISTS charges (
		id SERIAL PRIMARY KEY,
		valor INTEGER NOT NULL,
		vencimento DATE,
		idDoCliente INTEGER NOT NULL,
		descricao TEXT NOT NULL,
		linkDoBoleto TEXT NOT NULL,
		codigoDeBarras TEXT NOT NULL,
		dataDePagamento DATE,
	)
	`,
};

const criarTabelas = async (num) => {
	await databasePrincipal.query({ text: schemasToCreateTables[num] });

	console.log(`tabela ${num} criada`);
};

const clientCheckByCpf = (cpf) => {
	const query = {
		text: `SELECT cpf FROM clients WHERE cpf = $1`,
		values: [cpf],
	};
	return databasePrincipal.query(query);
};

const dropTable = async (nomeTabela) => {
	if (nomeTabela) {
		await databasePrincipal.query(`DROP TABLE ${nomeTabela}`);
		console.log('Tabela dropada!');
	}
};

criarTabelas(1);
criarTabelas(2);
// criarTabelas(3);

module.exports = { schemasToCreateTables, dropTable, clientCheckByCpf };
