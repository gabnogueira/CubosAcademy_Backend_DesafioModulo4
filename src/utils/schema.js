const databasePrincipal = require('./database');

const schema = {
	1: `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255),
		senha VARCHAR(255),
		nome TEXT NOT NULL,
		deletado BOOL DEFAULT FALSE
	)
	`,
	2: `
	CREATE TABLE IF NOT EXISTS clients (
		id SERIAL PRIMARY KEY,
		nome TEXT NOT NULL
		cpf VARCHAR(11),
		email VARCHAR(255),
		telefone VARCHAR(255)
		deletado BOOL DEFAULT FALSE,
		idDoUsuario INTEGER NOT NULL
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

module.exports = { schema };
