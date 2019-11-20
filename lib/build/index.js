const { join } = require('path');
const fingerprint = require('../fingerprint');
const readFile = require('../readFile');
const readLines = require('../readLines');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');

process.on('unhandledRejection', console.error);

const dist = 'docs/en';
const base = join(__dirname, '../../');
const source = join(base, 'src/things.txt');
const html = join(base, 'src/template.html');
const destinations = {
	dictionary: join(base, dist, 'dictionary.json'),
	list: join(base, dist, 'list.json'),
};

(async function() {
	const start = process.hrtime.bigint();

	const lines = await readLines(source);
	const things = Object.assign(
		...lines.map(
			line => ({
				[fingerprint(line)]: line,
			})
		)
	);

	const template = await readFile(html);

	await writeFile(destinations.dictionary, JSON.stringify(things));
	await writeFile(destinations.list, JSON.stringify(Object.keys(things)));

	await sames(
		join(base, 'src', 'sames'),
		join(base, 'docs')
	);

	Object.entries(things).forEach(
		([key, thing]) => createThing({key, thing, template})
	);

	const index = [
		'<script>',
		'const random = items => items[Math.floor(Math.random() * items.length)];',
		`const keys = ${JSON.stringify(Object.keys(things))};`,
		'window.location.href=`/en/${random(keys)}/`;',
		'</script>',
	].join('\n');

	const destination = join(__dirname, '../../', dist, ['index', 'html'].join('.'));
	logger.info(['📝', destination].join(' '));

	writeFile(destination, index);

	console.log([
		'Built in ',
		(Number(process.hrtime.bigint() - start) / 1e6).toFixed(2),
		'ms',
	].join(''));
})();

async function createThing({key, thing, template}) {
	writeFile(
		join(__dirname, '../../', dist, [key, 'txt'].join('.')), thing
	);
	writeFile(
		join(__dirname, '../../', dist, key, ['index', 'html'].join('.')), template.replace(/{{ thing }}/g, thing)
	);

}
