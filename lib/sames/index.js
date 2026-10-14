import {
	copyFile,
	mkdir,
	readdir,
	readFile,
	writeFile,
} from "node:fs/promises";
import { extname, join } from "node:path";

/**
 * File extensions whose content goes through the processor
 * @type {Set<string>}
 */
const EDITABLE = new Set([
	".css",
	".html",
	".js",
	".json",
	".txt",
	".webmanifest",
	".xml",
]);

/**
 * Copy a directory tree, passing text files through a processor
 * @param {string} source
 * @param {string} destination
 * @param {(content: string) => string} [processor]
 */
export default async function sames(
	source,
	destination,
	processor = (input) => input,
) {
	await mkdir(destination, { recursive: true });
	const entries = await readdir(source, { withFileTypes: true });

	await Promise.all(
		entries.map(async (entry) => {
			const from = join(source, entry.name);
			const to = join(destination, entry.name);

			if (entry.isDirectory()) {
				await sames(from, to, processor);
			} else if (entry.isSymbolicLink()) {
				// skip
			} else if (EDITABLE.has(extname(entry.name))) {
				await writeFile(to, processor(await readFile(from, "utf8")));
			} else {
				await copyFile(from, to);
			}
		}),
	);
}
