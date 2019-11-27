const { promises: {
	mkdir,
	readdir,
	readFile,
	stat,
	writeFile,
} } = require('fs');
const { join } = require('path');

module.exports = async function sames(source, destination, processor = input => input) {

	const files = await readdir(source);
	let file = files.pop();

	while (file) {
		const source1 = join(source, file);
		const destination1 = join(destination, file);
		const stats = await stat(source1);

		if (stats.isDirectory()) {
			await mkdir(destination1, { recursive: true });
			await sames(source1, destination1, processor);
		} else if (stats.isSymbolicLink()) {
			// nothing

		}	else {
			const content = (await readFile(source1)).toString();
			await writeFile(destination1, processor(content));
		}

		file = files.pop();
	}
};
