/**
 * @param {string} query Media query
 * @returns {boolean} The media query matches
 */
export default function media(query) {
	try {
		return window.matchMedia(query).matches;
	} catch {
		return false;
	}
}
