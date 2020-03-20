/**
 * sortObjectByValue
 * @param {object}
 * @returns {object}
 */
module.exports = (obj) => Object.fromEntries(Object.entries(obj).sort(sort));

function sort([, one], [, two]) {
	const [a, b] = [one, two].map(
		value => value.toLowerCase()
	);

	return a === b
		? 0
		: a > b
			? 1
			: -1
	;
}
