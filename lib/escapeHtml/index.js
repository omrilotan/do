const ENTITIES = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

/**
 * Escape text for use in HTML content and attribute values
 * @param {string} string
 * @returns {string}
 */
export default (string) =>
	string.replace(/[&<>"']/g, (character) => ENTITIES[character]);
