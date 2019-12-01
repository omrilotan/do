const { join } = require('path');
const { rollup } = require('rollup');
const phrase = require('paraphrase/double');
const fingerprint = require('../fingerprint');
const readFile = require('../readFile');
const readLines = require('../readLines');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');
const { name, description: tagline, homepage } = require('../../package.json');

process.on('unhandledRejection', console.error);

const dist = 'docs';
const lang = 'en';
const base = join(__dirname, '../../');

const sources = {
	activities: join(base, 'src/activities/en.txt'),
	template: join(base, 'src/template.html'),
	scripts: join(base, 'src/scripts/index.js'),
	colours: join(base, 'src/colours.css'),
	meta: join(base, 'src/meta.html'),
};

const destinations = {
	dictionary: join(base, dist, lang, 'dictionary.json'),
	list: join(base, dist, lang, 'list.json'),
	scripts: join(base, dist, 'scripts.js'),
};

(async function() {
	const start = process.hrtime.bigint();

	const lines = await readLines(sources.activities);
	const things = Object.assign(
		...lines.filter(
			line => !/^#/.test(line),
		).map(
			line => ({ [fingerprint(line)]: line }),
		),
	);

	const template = await readFile(sources.template);
	const appData = { name, tagline, homepage };

	const meta = await readFile(sources.meta);
	appData.meta = phrase(meta.trim(), appData);

	const hexlist = (await readLines(sources.colours)).map(
		colour => colour.match(/\*{_:(#[\d|a-f]{6})}/)[1],
	).join(',');
	appData.hexlist = hexlist; // eslint-disable-line require-atomic-updates

	appData.keys = JSON.stringify(Object.keys(things));

	await writeFile(destinations.dictionary, JSON.stringify(things));
	await writeFile(destinations.list, JSON.stringify(Object.keys(things)));

	{
		const bundle = await rollup({
			input: join(base, 'src/scripts/index.js'),
		});
		const { output: [{ code }] } = await bundle.generate({
			format: 'iife',
		});

		writeFile(destinations.scripts, phrase(code, appData));
	}

	await sames(
		join(base, 'src', 'sames'),
		join(base, dist),
		content => phrase(content, appData),
	);

	Object.entries(things).forEach(
		([key, thing]) => createThing({key, thing, template, appData}),
	);

	console.log([
		'Built in ',
		(Number(process.hrtime.bigint() - start) / 1e6).toFixed(2),
		'ms',
	].join(''));
})();

async function createThing({key, thing, template, appData}) {
	await writeFile(
		join(__dirname, '../../', dist, lang, key, ['index', 'html'].join('.')),
		phrase(template, Object.assign({ thing }, appData)),
	);
}
