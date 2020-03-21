const { promises: { mkdir, writeFile } } = require('fs');
const { parse } = require('path');

/**
 * Ensure directory exists and write file
 * @param  {string} destination
 * @param  {string} content
 * @return {Promise<>}
 */
module.exports = async function(destination, content, encoding) {
	const { dir } = parse(destination);
	await mkdir(dir, { recursive: true });

	await writeFile(destination, content, encoding);
};
