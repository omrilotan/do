const { promises: {
	copyFile,
	mkdir,
	readdir,
	readFile,
	stat,
	writeFile,
} } = require('fs');
const { join } = require('path');

const editable = [
	'css',
	'html',
	'js',
	'json',
	'txt',
	'webmanifest',
];

module.exports = async function sames(source, destination, processor = input => input) {

	const files = await readdir(source);
	let file = files.pop();

	while (file) {
		const _source = join(source, file);
		const _destination = join(destination, file);
		const stats = await stat(_source);

		if (stats.isDirectory()) {
			await mkdir(_destination, { recursive: true });
			await sames(_source, _destination, processor);
		} else if (stats.isSymbolicLink()) {
			// nothing

		}	else if (editable.includes(file.split('.').pop())) {
			const content = (await readFile(_source)).toString();
			await writeFile(_destination, processor(content));

		} else {
			await copyFile(_source, _destination);
		}

		file = files.pop();
	}
};
