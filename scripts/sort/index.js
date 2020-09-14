#!/usr/bin/env node

const { join } = require('path');
const readLines = require('../../lib/readLines');
const writeFile = require('../../lib/writeFile');

const [ , , ...files ] = process.argv;

async function sortFile (filename) {
	const filepath = join(process.cwd(), filename);
	console.log(`Sorting ${filepath}`);

	const lines = await readLines(filepath);

	await writeFile(filepath, dedup(lines).sort(sort).join('\n') + '\n');
}

/**
 * Case insensitive Sort
 * @param  {String} a
 * @param  {String} b
 * @return {Number}
 */
function sort (a, b) {
	a = a.toLowerCase();
	b = b.toLowerCase();

	return a > b ? 1 : b > a ? -1 : 0;
}

/**
 * Create array without the duplicates
 * @param  {Array} list
 * @return {Array}
 */
const dedup = list => Array.from(new Set(list));

files.forEach(file => sortFile(file));
