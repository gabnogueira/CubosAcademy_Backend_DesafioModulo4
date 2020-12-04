// eslint-disable-next-line consistent-return
const validateCpf = (cpf) => {
	if (cpf.length === 14) {
		return true;
	}
	if (cpf.length !== 14) {
		return false;
	}
};

const validateAmount = (amount) => {
	if (amount > 0) {
		return true;
	}
	return false;
};

const validateDate = (date) => {
	if (new Date(date) >= Date.now()) {
		return true;
	}
	return false;
};

module.exports = { validateCpf, validateAmount, validateDate };

// validateDate('2020-12-02');
