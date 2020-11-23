const queriesParaFuncoesDeUsuarios = require('../repositories/biblioteca');
const encriptarSenha = require('../utils/passwords');
const response = require('../utils/response');

const adicionarUsuario = async (ctx) => {
	await queriesParaFuncoesDeUsuarios.criarTabelas(1);
	const inputs = ctx.request.body;

	const hash = encriptarSenha.encrypt(inputs.senha);

	const result = queriesParaFuncoesDeUsuarios.adicionarUsuario(
		inputs.email,
		hash,
		inputs.nome
	);

	return response(ctx, 200, { id: result.rows.shift() });
};

module.exports = { adicionarUsuario };
