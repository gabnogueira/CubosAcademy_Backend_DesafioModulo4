const queriesParaFuncoesDeUsuarios = require('../repositories/biblioteca');
const encriptarSenha = require('../utils/passwords');
const response = require('../utils/response');

const adicionarUsuario = async (ctx) => {
	const inputs = ctx.request.body;

	console.log(inputs);
	if (inputs) {
		const hash = await encriptarSenha.encrypt(inputs.senha);

		const result = await queriesParaFuncoesDeUsuarios.adicionarUsuario(
			inputs.email,
			hash,
			inputs.nome
		);

		return response(ctx, 200, { id: result.rows.shift().id });
	}
	return response(ctx, 200, 'Sucesso!');
};

module.exports = { adicionarUsuario };
