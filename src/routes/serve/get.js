const { send } = require('micro');
const { compose, parseJSONInput } = require('micro-hoofs');

const fs = require('fs');
const fileModel = require('../../models/file');

const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

module.exports = compose(
	parseJSONInput
)(
	async (req, res) => {
		if(!req.params.hash 
			|| !req.params.username){
			return send(res, 400, {
				statusCode: 400,
				statusMessage: 'No file given'
			});
		}
		const file = await fileModel.getFile(req.params.hash, req.params.username);
		console.log(req.params, file);
		if(file && file.id){
			send(res, 200, {
				statusCode: 200,
				file: {
					name: file.name,
					hash: file.hash,
					ext: file.ext,
					mime: file.mime
				}
			});
			await fileModel.increaseFileView(file.id);
		}else{
			send(res, 404, {
				statusCode: 404,
				statusMessage: 'File not found'
			});
		}
	}
);