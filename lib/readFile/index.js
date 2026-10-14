import { readFile } from "node:fs/promises";

/**
 * Read file, return the trimmed string content
 * @param {string} file
 * @returns {Promise<string>}
 */
export default async (file) => (await readFile(file, "utf8")).trim();
