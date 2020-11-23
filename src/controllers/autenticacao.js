/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const database = require('../repositories/biblioteca');
const { response } = require('../utils/response');
const passwords = require('../utils/passwords');

require('dotenv').config();

const autenticarUser = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;

	if (!email || !senha) {
		return response(ctx, 400, { message: 'Pedido mal formatado' });
	}

	const result = await database.obterUsuariosPorEmail(email);

	if (result) {
		const comparacao = await passwords.check(senha, result.senha);

		if (comparacao) {
			const token = jwt.sign(
				{ email: result.email },
				process.env.JWT_SECRET || 'cubosacademy',
				{ expiresIn: '1h' }
			);

			return response(ctx, 200, { token });
		}

		return response(ctx, 200, result);
	}
};

module.exports = { autenticarUser };
