const { name, description: tagline, homepage } = require('../../../package.json');
const readFile = require('../../readFile');
const readLines = require('../../readLines');

module.exports = async function constructAppData({ activities, sources }) {
	const appData = {
		name,
		tagline,
		homepage,
	};

	// Page meta tags
	const meta = await readFile(sources.meta);
	appData.meta = meta.trim();

	// Colours
	const hexlist = (await readLines(sources.colours)).map(
		colour => colour.match(/\*{_:(#[\d|a-f]{6})}/)[1],
	).join(',');
	appData.hexlist = hexlist;

	appData.keys = JSON.stringify(Object.keys(activities));

	appData.cards = Object.entries(activities).map(
		([ key, value ]) => `<a href="/en/${key}/">${value}</a>`,
	).join('\n');

	return appData;
};
