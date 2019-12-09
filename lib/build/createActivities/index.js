const stringerprint = require('stringerprint');
const readLines = require('../../readLines');

/**
 * Turn activities file into object
 * @param  {string} activitiesFile Path to file
 * @return {object}                {[fingerprint]: activity}
 */
module.exports = async function createActivities(activitiesFile) {
	const lines = await readLines(activitiesFile);

	return Object.assign(
		...lines.filter(
			notComment,
		).map(
			line => ({ [stringerprint(line)]: line }),
		),
	);
};

/**
 * If the line is a comment return false
 * @param  {string}  str
 * @return {boolean}
 */
const notComment = str => !/^#/.test(str);
