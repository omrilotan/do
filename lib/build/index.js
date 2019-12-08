const { join } = require('path');
const { rollup } = require('rollup');
const phrase = require('paraphrase/double');
const stringerprint = require('stringerprint');
const readFile = require('../readFile');
const readLines = require('../readLines');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');
const constructAppData = require('./constructAppData');

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
	const activities = Object.assign(
		...lines.filter(
			line => !/^#/.test(line),
		).map(
			line => ({ [stringerprint(line)]: line }),
		),
	);

	const template = await readFile(sources.template);

	const appData = await constructAppData({ activities, sources });

	await writeFile(destinations.dictionary, JSON.stringify(activities));
	await writeFile(destinations.list, JSON.stringify(Object.keys(activities)));

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

	Object.entries(activities).forEach(
		([key, thing]) => activityPage({key, thing, template, appData}),
	);

	logger.info([
		'Built site with ',
		JSON.parse(appData.keys).length,
		' activities in ',
		(Number(process.hrtime.bigint() - start) / 1e6).toFixed(2),
		'ms',
	].join(''));
})();

async function activityPage({key, thing, template, appData}) {
	await writeFile(
		join(base, dist, lang, key, ['index', 'html'].join('.')),
		phrase(template, Object.assign({ thing }, appData)),
	);
}
