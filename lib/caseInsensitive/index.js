/**
 * Case insensitive sort comparator
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export default function caseInsensitive(a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();

	return a > b ? 1 : b > a ? -1 : 0;
}
