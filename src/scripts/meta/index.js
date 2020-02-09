/**
 * Get the content attribute value of a meta tag by name
 * @param {*} name 
 * 
 * @example
 * meta('page-type') // 'activity'
 */
export default function meta(name) {
	const tag = document.querySelector(`meta[name="${name}"]`);
	if (!tag) { return null; }

	return tag.content;
}