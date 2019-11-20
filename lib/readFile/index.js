const { promises: { readFile } } = require('fs');

/**
 * Read file, return the string content
 * @param  {string} file
 * @return {string}
 */
module.exports = async file => (await readFile(file)).toString();
