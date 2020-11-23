const bcrypt = require('bcryptjs');

const encrypt = async (senha) => {
	const hash = await bcrypt.hash(senha, 10);

	return hash;
};

const check = async (senha, hash) => {
	const comparacao = await bcrypt.compare(senha, hash);

	return comparacao;
};

module.exports = { encrypt, check };
