const { name, description: tagline, homepage } = require('../../../package.json');
const readFile = require('../../readFile');
const readLines = require('../../readLines');

module.exports = async function constructAppData({
	activities,
	anywhere,
	indoors,
	outdoors,
	sources,
}) {

	const all = Object.keys(activities);

	const cacheKeyVersion = await readFile(sources.cacheKeyVersion);

	const appData = {
		homepage,
		indoors: JSON.stringify(Object.keys({ ...indoors, ...anywhere })),
		outdoors: JSON.stringify(Object.keys({ ...outdoors, ...anywhere })),
		all: JSON.stringify(all),
		name,
		size: all.length,
		tagline,
		link: homepage,
		preview: [ homepage, 'images', '960x640.png' ].join('/'),
		cacheKeyVersion,
	};

	// Page meta tags
	appData.meta = await readFileAndTrim(sources.meta);

	// Page nav
	appData.nav = await readFileAndTrim(sources.nav);

	// That big, round "do" button
	appData['play-button'] = await readFileAndTrim(sources.playButton);

	// Colours
	const hexlist = (await readLines(sources.colours)).map(
		colour => colour.match(/\*{_:(#[\d|a-f]{6})}/)[1],
	).join(',');
	appData.hexlist = hexlist;

	appData.cards = Object.entries(activities).map(
		([ key, value ]) => `<a href="/${key}/">${value}</a>`,
	).join('\n');

	return appData;
};

async function readFileAndTrim(path) {
	const contents = await readFile(path);
	return contents.trim();
}
