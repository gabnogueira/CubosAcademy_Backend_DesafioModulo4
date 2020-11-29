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

module.exports = { checkChargeStatus };
