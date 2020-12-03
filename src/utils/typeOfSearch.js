// eslint-disable-next-line consistent-return
const typeOfInput = (busca) => {
	if (busca) {
		if (busca.includes('@')) {
			// console.log('email');
			return 'email';
		}
		if (/^\d*\.?\d+$/.test(busca) && busca.includes('@') === false) {
			// console.log('cpf');
			return 'cpf';
		}
		// console.log('name');
		return 'name';
	}
};

module.exports = { typeOfInput };
