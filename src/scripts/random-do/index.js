import random from "../random/index.js";

/**
 * Pick a random activity other than the current one
 * @param {string[]} list Activity keys
 * @returns {string} Activity path
 */
export default function randomDo(list) {
	const current = document.location.pathname.split("/")[1];
	const options =
		list.length > 1 ? list.filter((key) => key !== current) : list;

	return `/${random(options)}/`;
}
