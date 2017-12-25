const { send } = require('micro');
const url = require('url');
const apiKeyModel = require('../models/apiKey');
module.exports = fn => async (req, res) => {
	const bearerToken = req.headers.authorization;
	const pathname = url.parse(req.url).pathname;

	if(!bearerToken){
		send(res, 401, {
			statusCode: 401,
			statusMessage: 'Missing Authorization header'
		});
		return;
	}

	const apiKey = req.headers.authorization.replace('Bearer ', '');

	if(!(await apiKeyModel.isValidApiKey(apiKey))){
		return send(res, 401, {
			statusCode: 401,
			statusMessage: 'Wrong API key'
		});
	}

	req.user = {
		apiKey: apiKey,
		name: 'kittens'
	};

	return await fn(req, res);
};