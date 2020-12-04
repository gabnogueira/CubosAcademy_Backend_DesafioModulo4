/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const userQueries = require('../repositories/libraryUsers');
const response = require('../utils/response');
const passwords = require('../utils/passwords');

require('dotenv').config();

const authUser = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;

	if (!email || !senha) {
		return response(ctx, 400, { message: 'Pedido mal formatado' });
	}

	const result = await userQueries.getUserByEmail(email);

	if (result) {
		const comparacao = await passwords.check(senha, result.senha);

		if (comparacao) {
			const token = jwt.sign(
				/** isso irá ser passado a frente no session e possibilitará add o id do usuario nas cobranças */
				{ email: result.email, id: result.id, name: result.nome },
				process.env.JWT_SECRET || 'cubosacademy',
				{ expiresIn: '1h' }
			);

			return response(ctx, 200, {
				mensagem: 'Usuário logado com sucesso!',
				token,
			});
		}

		return response(ctx, 200, result);
	}
};

module.exports = { authUser };
