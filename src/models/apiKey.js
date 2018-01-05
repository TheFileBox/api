const dbInstance = global.dbInstance;
module.exports = {
	getAPIKey: (apiKey) => {
		return new Promise((resolve, reject) => {
			dbInstance('api_keys').where({
				api_key: apiKey
			})
			.debug(true)
			.select('*')
			.first()
			.then((result) => {
				resolve(result);
			})
			.catch((e) => {reject(e);});
		});
	}
}