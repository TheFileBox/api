const path = require('path');
const nconf = require('nconf');
const ENV = process.env.NODE_ENV || 'production';

nconf.argv().env();
nconf.file('default', path.join('config', path.sep, `${ENV}.json`));
nconf.set('base_dir', __dirname);
nconf.defaults({
	server: {
		name: 'FileBox',
		domain: 'updog.no',
		upload_path: '/tmp/uploads',
		register_type: 0
	},
	database: {
		client: 'mysql2',
		connection: {
			host: '127.0.0.1',
			user: 'your_database_user',
			password: 'your_database_password',
			database: 'myapp_test'
		}
	}
});
//nconf.save();

global.nconf = nconf;
global.dbInstance = initDb();

function initDb(){
	return require('knex')({
		client: nconf.get('database:client'),
		connection: {
			host: nconf.get('database:connection:host'),
			user: nconf.get('database:connection:user'),
			password: nconf.get('database:connection:password'),
			database: nconf.get('database:connection:database')
		}
	});
}

const { send } = require('micro');
const { compose } = require('micro-hoofs');
const microCors = require('micro-cors')
const { router, get, post, del } = require('microrouter')

const corsMiddleware = microCors({
	allowMethods: [ 'POST', 'GET', 'PUT', 'DELETE' ],
	allowHeaders: [ 'Content-Type', 'Authorization', 'Accept', 'X-Requested-With' ],
	maxAge: 86400,
	origin: '*'
})

const notfound = async (req, res) => {
	send(res, 404, await Promise.resolve('Not found route'))
};

module.exports = router(
	post('/upload', corsMiddleware(require('./routes/upload/post'))),
	get('/', corsMiddleware(require('./routes/index/get'))),
	get('/*', corsMiddleware(notfound))
);