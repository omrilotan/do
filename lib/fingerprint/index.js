const { createHash } = require('crypto');

/**
 * Create a hash fingerprint for string value
 * @param  {string} string
 * @return {string}
 */
module.exports = string => createHash('md5').update(string, 'utf8').digest('hex');
