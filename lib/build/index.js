const { join } = require('path');
const phrase = require('paraphrase/double');
const fingerprint = require('../fingerprint');
const readFile = require('../readFile');
const readLines = require('../readLines');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');

process.on('unhandledRejection', console.error);

const dist = 'docs';
const lang = 'en';
const base = join(__dirname, '../../');

const sources = {
	doos: join(base, 'src/doos/en.txt'),
	template: join(base, 'src/template.html'),
	scripts: join(base, 'src/scripts.js'),
	colours: join(base, 'src/colours.css'),
	meta: join(base, 'src/meta.html'),
};

const destinations = {
	dictionary: join(base, dist, lang, 'dictionary.json'),
	list: join(base, dist, lang, 'list.json'),
	scripts: join(base, dist, 'scripts.js'),
};
const appData = require(join(base, 'src/application-data.json'));

(async function() {
	const start = process.hrtime.bigint();

	const lines = await readLines(sources.doos);
	const things = Object.assign(
		...lines.filter(
			line => !/^#/.test(line),
		).map(
			line => ({ [fingerprint(line)]: line }),
		),
	);

	const template = await readFile(sources.template);
	const meta = await readFile(sources.meta);

	Object.assign(appData, { meta });

	await writeFile(destinations.dictionary, JSON.stringify(things));
	await writeFile(destinations.list, JSON.stringify(Object.keys(things)));

	await sames(
		join(base, 'src', 'sames'),
		join(base, dist),
		content => phrase(content, appData),
	);

	Object.entries(things).forEach(
		([key, thing]) => createThing({key, thing, template}),
	);

	const index = [
		'<script>',
		'const random = items => items[Math.floor(Math.random() * items.length)];',
		`const keys = ${JSON.stringify(Object.keys(things))};`,
		'window.location.href=`/en/${random(keys)}/`;',
		'</script>',
	].join('\n');

	const destination = join(__dirname, '../../', dist, lang, ['index', 'html'].join('.'));
	logger.info(['📝', destination].join(' '));

	writeFile(destination, index);

	{
		const template = await readFile(sources.scripts);
		const hexlist = JSON.stringify(
			(await readLines(sources.colours)).map(
				colour => colour.match(/\*{_:(#[\d|a-f]{6})}/)[1],
			),
		);

		writeFile(destinations.scripts, phrase(template, Object.assign({ hexlist })));

	}

	console.log([
		'Built in ',
		(Number(process.hrtime.bigint() - start) / 1e6).toFixed(2),
		'ms',
	].join(''));
})();

async function createThing({key, thing, template}) {
	await writeFile(
		join(__dirname, '../../', dist, lang, key, ['index', 'html'].join('.')),
		phrase(template, Object.assign({ thing }, appData)),
	);
}
