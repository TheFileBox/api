const dbInstance = global.dbInstance;
module.exports = {
	getAPIKey: (apiKey) => {
		return new Promise((resolve, reject) => {
			dbInstance('api_keys').where({
				api_key: apiKey
			})
			.join('users as u1', 'u1.user_id', '=', 'api_keys.user_id')
			.debug(true)
			.select('api_keys.*', 'u1.user_id', 'u1.username')
			.first()
			.then((result) => {
				resolve(result);
			})
			.catch((e) => {reject(e);});
		});
	}
}