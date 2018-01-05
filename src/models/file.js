const dbInstance = global.dbInstance;
module.exports = {
	getFile: (hash, uploader) => {
		return new Promise((resolve, reject) => {
			dbInstance('files')
			.join('users as u1', 'u1.user_id', '=', 'files.uploader_id')
			.where({
				hash: hash,
				'u1.username': uploader
			})
			.debug(true)
			.select('files.*','u1.user_id', 'u1.username')
			.first()
			.then((result) => {
				resolve(result);
			})
			.catch((e) => {reject(e);});
		});
	},

	insertFile: (file) => {
		return new Promise((resolve, reject) => {
			dbInstance('files')
			.insert(file)
			.debug(true)
			.then((result) => {
				resolve(result);
			})
			.catch((e) => {reject(e);});
		});
	},

	increaseFileView: (id) => {
		return new Promise((resolve, reject) => {
			dbInstance('files')
			.where({
				id
			})
			.debug(true)
			.increment('views', 1)
			.then((result) => {
				resolve(result);
			})
			.catch((e) => {reject(e);});
		});
	}
}