const { join } = require('path');
const phrase = require('paraphrase/double');
const readFile = require('../readFile');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');
const constructAppData = require('./constructAppData');
const createActivities = require('./createActivities');
const createBundle = require('./createBundle');

process.on('unhandledRejection', console.error);

const dist = 'docs';
const lang = 'en';
const base = join(__dirname, '../../');

const sources = {
	activities: join(base, 'src/activities/en.txt'),
	template: join(base, 'src/template.html'),
	scripts: join(base, 'src/scripts/index.js'),
	glossary: join(base, 'src/scripts/glossary.js'),
	colours: join(base, 'src/colours.css'),
	meta: join(base, 'src/meta.html'),
	nav: join(base, 'src/nav.html'),
};

const destinations = {
	dictionary: join(base, dist, lang, 'dictionary.json'),
	list: join(base, dist, lang, 'list.json'),
	scripts: join(base, dist, 'scripts.js'),
	glossary: join(base, dist, 'scripts/glossary.js'),
};

(async function() {
	const start = process.hrtime.bigint();

	const activities = await createActivities(sources.activities);
	const appData = await constructAppData({ activities, sources });

	await writeFile(destinations.dictionary, JSON.stringify(activities));
	await writeFile(destinations.list, JSON.stringify(Object.keys(activities)));
	await writeFile(destinations.scripts, await createBundle(sources.scripts, appData));
	await writeFile(destinations.glossary, await createBundle(sources.glossary, appData));

	await sames(
		join(base, 'src', 'sames'),
		join(base, dist),
		content => phrase(content, appData),
	);

	const template = await readFile(sources.template);

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
		phrase(
			template,
			Object.assign(
				{ thing },
				appData,
				{
					tagline: thing,
					link: `${appData.homepage}/${join(lang, key)}/`,
				},
			),
		),
	);
}
