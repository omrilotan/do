#!/usr/bin/env node

import { resolve } from "node:path";
import caseInsensitive from "../../lib/caseInsensitive/index.js";
import readLines from "../../lib/readLines/index.js";
import writeFile from "../../lib/writeFile/index.js";

const files = process.argv.slice(2);

/**
 * Sort a file's lines case insensitively and remove duplicates
 * @param {string} filename
 */
async function sortFile(filename) {
	const filepath = resolve(filename);
	console.log(`Sorting ${filepath}`);

	const lines = await readLines(filepath);

	await writeFile(
		filepath,
		[...new Set(lines)].sort(caseInsensitive).join("\n") + "\n",
	);
}

await Promise.all(files.map(sortFile));
