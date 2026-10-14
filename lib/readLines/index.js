import readFile from "../readFile/index.js";

/**
 * Read a file and return an array of its non empty lines
 * @param {string} file
 * @returns {Promise<string[]>}
 */
export default async (file) =>
	(await readFile(file)).split("\n").filter(Boolean);
