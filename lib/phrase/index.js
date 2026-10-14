const PATTERN = /{{\s*([\w-]+)\s*}}/g;
const MAX_DEPTH = 10;

/**
 * Replace {{ key }} placeholders with values from data. Unknown keys are left intact.
 * Values may contain placeholders themselves (e.g. meta inside a page template).
 * @param {string} template
 * @param {Record<string, unknown>} data
 * @param {number} [depth]
 * @returns {string}
 */
export default function phrase(template, data, depth = 0) {
	return template.replace(PATTERN, (match, key) => {
		if (!Object.hasOwn(data, key)) {
			return match;
		}
		const value = String(data[key]);
		return depth < MAX_DEPTH ? phrase(value, data, depth + 1) : value;
	});
}
