const jwt = require('jsonwebtoken');
const response = require('../utils/response');
require('dotenv').config();

const verifyUser = async (ctx, next) => {
	const [bearer, token] = ctx.headers.authorization.split(' ');

	try {
		const verification = await jwt.verify(token, process.env.JWT_SECRET);

		ctx.state.email = verification.email;
		ctx.state.id = verification.id;
		ctx.state.name = verification.name;
	} catch (err) {
		return response(ctx, 403, { message: 'Ação proibida' });
	}

	return next();
};

module.exports = { verifyUser };
