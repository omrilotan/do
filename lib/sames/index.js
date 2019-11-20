const { promises: { copyFile, mkdir, readdir, stat } } = require('fs');
const { join } = require('path');

module.exports = async function sames(source, destination) {

	const files = await readdir(source);
	let file = files.pop();

	while (file) {
		const source1 = join(source, file);
		const destination1 = join(destination, file);
		const stats = await stat(source1);

		if (stats.isDirectory()) {
			await mkdir(destination1, { recursive: true });
			await sames(source1, destination1);
		} else if (stats.isSymbolicLink()) {
			// nothing

		}	else {
			await copyFile(source1, destination1);
		}

		file = files.pop();
	}
};
