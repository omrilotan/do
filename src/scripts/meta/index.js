/**
 * Get the content attribute value of a meta tag by name
 * @param {string} name
 * @returns {string | null}
 *
 * @example
 * meta('page-type') // 'activity'
 */
export default (name) =>
	document.querySelector(`meta[name="${name}"]`)?.content ?? null;
