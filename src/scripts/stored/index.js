/**
 * @type {string}
 */
const STORAGE_KEY = 'activity-list';

/**
 * Mitigate local storage
 */
export function get() {
	try {
		return window.localStorage.getItem(STORAGE_KEY);
	} catch (error) {
		return null;
	}
}

/**
 * Mitigate local storage
 */
export function remove() {
	try {
		window.localStorage.removeItem('activity-list');
	} catch (error) {
		// ignore
	}
}
