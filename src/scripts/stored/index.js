/**
 * @type {string}
 */
const STORAGE_KEY = "activity-list";

/**
 * Read the selected activity list. Storage may be unavailable (private mode, blocked cookies).
 * @returns {string | null}
 */
export function get() {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

/**
 * Forget the selected activity list
 */
export function remove() {
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
