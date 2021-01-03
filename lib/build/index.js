const { join } = require('path');
const phrase = require('paraphrase/double');
const readFile = require('../readFile');
const writeFile = require('../writeFile');
const logger = require('../logger');
const sames = require('../sames');
const sortObjectByValue = require('../sortObjectByValue');
const activityPage = require('./activityPage');
const constructAppData = require('./constructAppData');
const createActivities = require('./createActivities');
const createBundle = require('./createBundle');
const createSitemap = require('./createSitemap');

process.on('unhandledRejection', console.error);

const dist = 'docs';
const base = join(__dirname, '../../');

const sources = {
	anywhere: join(base, 'src/activities/anywhere.txt'),
	indoors: join(base, 'src/activities/indoors.txt'),
	outdoors: join(base, 'src/activities/outdoors.txt'),

	cacheKeyVersion: join(base, 'src/cache-key-version.txt'),
	playButton: join(base, 'src/play-button.html'),
	paletteBright: join(base, 'src/palette-bright.css'),
	paletteDark: join(base, 'src/palette-dark.css'),
	suggest: join(base, 'src/scripts/suggest.js'),
	glossary: join(base, 'src/scripts/glossary.js'),
	meta: join(base, 'src/meta.html'),
	nav: join(base, 'src/nav.html'),
	scripts: join(base, 'src/scripts/index.js'),
	sitemap: join(base, 'src/sitemap.xml'),
	template: join(base, 'src/template.html'),
};

const destinations = {
	indoors: join(base, dist, 'indoors.json'),
	outdoors: join(base, dist, 'outdoors.json'),
	all: join(base, dist, 'all.json'),
	scripts: join(base, dist, 'scripts.js'),
	sitemap: join(base, dist, 'sitemap.xml'),
	suggest: join(base, dist, 'scripts/suggest.js'),
	glossary: join(base, dist, 'scripts/glossary.js'),
};

(async function() {
	const start = process.hrtime.bigint();

	const [
		anywhere,
		indoors,
		outdoors,
	] = await Promise.all([
		createActivities(sources.anywhere),
		createActivities(sources.indoors),
		createActivities(sources.outdoors),
	]);

	const activities = sortObjectByValue({
		...anywhere,
		...indoors,
		...outdoors,
	});

	const appData = await constructAppData({
		activities,
		anywhere,
		indoors,
		outdoors,
		sources,
	});

	await writeFile(destinations.indoors, JSON.stringify(Object.keys({ ...indoors, ...anywhere })));
	await writeFile(destinations.outdoors, JSON.stringify(Object.keys({ ...outdoors, ...anywhere })));
	await writeFile(destinations.all, JSON.stringify(Object.keys(activities)));

	await writeFile(destinations.scripts, await createBundle(sources.scripts, appData));
	await writeFile(destinations.glossary, await createBundle(sources.glossary, appData));
	await writeFile(destinations.suggest, await createBundle(sources.suggest, appData));

	await sames(
		join(base, 'src', 'sames'),
		join(base, dist),
		content => phrase(content, appData),
	);

	const template = await readFile(sources.template);

	Object.entries(activities).forEach(
		([ key, thing ]) => activityPage({ base, dist, key, thing, template, appData }),
	);

	await writeFile(destinations.sitemap, await createSitemap(sources.sitemap, appData));

	logger.info([
		'Built site with ',
		Object.keys(activities).length,
		' activities. ',
		'(', Object.keys({ ...indoors, ...anywhere }).length, ' indoors,',
		' ', Object.keys({ ...outdoors, ...anywhere }).length, ' outdoors)',
		'\n',
		'Build duration: ',
		(Number(process.hrtime.bigint() - start) / 1e6).toFixed(2),
		'ms',
	].join(''));
})();
