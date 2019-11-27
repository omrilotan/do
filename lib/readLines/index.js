const readFile = require('../readFile');

/**
 * Read a file and return an array of its non empty lines
 * @param  {string} file
 * @return {array}
 */
module.exports = async file =>
	(await readFile(file))
		.split('\n')
		.filter(Boolean);
