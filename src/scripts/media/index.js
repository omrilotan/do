/**
 * @param {string} query Media query
 * @returns {boolean} The media query was matches successfully
 */
export default function media(query) {
	try {
		return window.matchMedia(query).matches === true;
	} catch (error) {
		return false;
	}
}
