const cpfFormatter = (cpf) => {
	const formattedCpf = cpf.replace('.', '').replace('.', '').replace('-', '');

	return formattedCpf;
};

module.exports = { cpfFormatter };
