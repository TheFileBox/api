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

	const result = await apiKeyModel.getAPIKey(apiKey);
	if(result){
		console.log(result);
		req.user = {
			apiKey: apiKey,
			id: result.user_id,
			name: result.username
		};
	}else{
		return send(res, 401, {
			statusCode: 401,
			statusMessage: 'Wrong API key'
		});
	}
	return await fn(req, res);
};