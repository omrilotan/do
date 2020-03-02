const { name, description: tagline, homepage } = require('../../../package.json');
const readFile = require('../../readFile');
const readLines = require('../../readLines');

module.exports = async function constructAppData({ activities, sources }) {
	const keys = Object.keys(activities);

	const appData = {
		homepage,
		keys: JSON.stringify(keys),
		name,
		size: keys.length,
		tagline,
		link: homepage,
	};

	// Page meta tags
	appData.meta = await readFileAndTrim(sources.meta);

	// Page nav
	appData.nav = await readFileAndTrim(sources.nav);

	// Third party integrations
	appData.integrations = await readFileAndTrim(sources.integrations);

	// That big, round "do" button
	appData['play-button'] = await readFileAndTrim(sources.playButton);

	// Colours
	const hexlist = (await readLines(sources.colours)).map(
		colour => colour.match(/\*{_:(#[\d|a-f]{6})}/)[1],
	).join(',');
	appData.hexlist = hexlist;

	appData.cards = Object.entries(activities).map(
		([ key, value ]) => `<a href="/en/${key}/">${value}</a>`,
	).join('\n');

	return appData;
};

async function readFileAndTrim(path) {
	const contents = await readFile(path);
	return contents.trim();
}
