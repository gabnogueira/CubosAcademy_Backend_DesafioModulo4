const axios = require('axios').default;
// const response = require('../utils/response');

require('dotenv').config();

const createChargesAtPagarme = async (
	amount,
	dueDate,
	clientId,
	clientName,
	clientEmail,
	clientCpf,
	clientPhone
) => {
	try {
		const transaction = await axios.post(
			'https://api.pagar.me/1/transactions',
			{
				amount,
				payment_method: 'boleto',
				boleto_instructions: 'Teste',
				boleto_expiration_date: dueDate,
				customer: {
					external_id: String(clientId),
					name: clientName,
					type: 'individual',
					country: 'br',
					email: clientEmail,
					documents: [
						{
							type: 'cpf',
							number: clientCpf,
						},
					],
					phone_numbers: [clientPhone],
					// birthday: '2000-01-01',
				},
				api_key: process.env.PAGARME_KEY,
			}
		);
		console.log(transaction.data);
		return transaction.data;
	} catch (err) {
		console.log(err.response.data);
		return {
			status: 'error',
			data: { message: 'Erro na criação da nova cobrança' },
		};
	}
};

module.exports = { createChargesAtPagarme };
