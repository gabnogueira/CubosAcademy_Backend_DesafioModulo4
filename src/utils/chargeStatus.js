// eslint-disable-next-line consistent-return
const checkChargeStatus = (dueDate, paymentDate, today) => {
	if (paymentDate) {
		return 'PAGO';
	}
	if (!paymentDate && today < dueDate) {
		return 'AGUARDANDO';
	}
	if (!paymentDate && today > dueDate) {
		return 'VENCIDO';
	}
};

// eslint-disable-next-line consistent-return
const checkIfChargeIsOverdue = (dueDate, paymentDate, today) => {
	if (!paymentDate && today > dueDate) {
		return true;
	}
	if (!paymentDate && today < dueDate) {
		return false;
	}
	if (paymentDate) {
		return false;
	}
};

module.exports = { checkChargeStatus, checkIfChargeIsOverdue };
