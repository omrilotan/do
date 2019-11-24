const { createServer } = require('http');
const { parse } = require('url');
const { join, resolve } = require('path');
const {
	promises: {
		readFile,
		stat,
	},
} = require('fs');
const logger = require('../logger');

module.exports = () => createServer(
	async function(request, response) {
		const { url } = request;

		let filename = join(
			resolve('docs'),
			parse(url).pathname,
		);

		try {
			const stats = await stat(filename);

			if (stats.isDirectory()) {
				filename += '/index.html';
			}

			const file = await readFile(filename);

			response.writeHead(200);
			response.write(file, 'binary');
			response.end();

			logger.info(['🌐 http://127.0.0.1:1337', url].join(''));

		} catch (error) {
			response.writeHead(500, {'Content-Type': 'text/plain'});
			response.write(error.message);
			response.end();

			logger.error(error);
		}
	},
).listen(1337, '127.0.0.1', () => logger.info('🌐 http://127.0.0.1:1337'));
