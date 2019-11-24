const {
	promises: { readFile },
	watch,
} = require('fs');
const { resolve } = require('path');
const clear = require('clear-module');
const logger = require('../logger');
const serve = require('../serve');

(async() => {
	const pattern = [
		...(
			await readFile(resolve('.gitignore'))
		)
			.toString()
			.split('\n')
			.map(s => s.trim().replace(/(\.|\*)/g, '\\$1'))
			.filter(Boolean),
		'^\\.git',
	].join('|');
	const ignore = new RegExp(pattern);

	serve();
	build();
	watch(
		process.cwd(),
		{ recursive: true },
		(type, file) => ignore.test(file)
			? null
			: build(),
	);
})();

function build() {
	logger.info('🔨 Build');
	clear('../build');
	require('../build');
}
