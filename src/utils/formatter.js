const cpfFormatter = (cpf) => {
	const formattedCpf = cpf.replace('.', '').replace('.', '').replace('-', '');

	return formattedCpf;
};

const dateFormatter = (date) => {
	const formattedDate = date.split('/').reverse().join('-');

	return formattedDate;
};

module.exports = { cpfFormatter, dateFormatter };
