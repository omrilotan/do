import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Ensure directory exists and write file
 * @param {string} destination
 * @param {string | Uint8Array} content
 * @returns {Promise<void>}
 */
export default async function (destination, content) {
	await mkdir(dirname(destination), { recursive: true });
	await writeFile(destination, content);
}
