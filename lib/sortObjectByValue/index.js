import caseInsensitive from "../caseInsensitive/index.js";

/**
 * Sort an object's entries by value, case insensitive
 * @param {Record<string, string>} obj
 * @returns {Record<string, string>}
 */
export default (obj) =>
	Object.fromEntries(
		Object.entries(obj).sort(([, a], [, b]) => caseInsensitive(a, b)),
	);
