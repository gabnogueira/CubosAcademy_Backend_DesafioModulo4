const userFunctionsQueries = require('../repositories/libraryUsers');
const encryptPassword = require('../utils/passwords');
const response = require('../utils/response');

// eslint-disable-next-line consistent-return
const addNewUser = async (ctx) => {
	const inputs = ctx.request.body;

	const getEmailAndName = await userFunctionsQueries.checkIfUserAlreadyExists(
		inputs.email,
		inputs.nome
	);

	// eslint-disable-next-line no-unneeded-ternary
	const checkIfUserExists = getEmailAndName ? true : false;

	console.log(checkIfUserExists);

	if (inputs && !checkIfUserExists) {
		const hash = await encryptPassword.encrypt(inputs.senha);

		const result = await userFunctionsQueries.addNewUser(
			inputs.email,
			hash,
			inputs.nome
		);

		return response(ctx, 200, { id: result.rows.shift().id });
	}
	if (inputs && checkIfUserExists) {
		return response(ctx, 400, {
			message: 'Email ou nome de usuário já está cadastrado.',
		});
	}
};

module.exports = { addNewUser };
