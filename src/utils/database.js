const { Client } = require('pg');

require('dotenv').config();

const databasePrincipal = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PW,
	database: process.env.DB_NAME,
	ssl: {
		rejectUnauthorized: false,
	},
});

databasePrincipal
	.connect()
	.then(() => console.log('Connected'))
	.catch((err) => console.log('Connectior error', err.stack));

module.exports = databasePrincipal;
