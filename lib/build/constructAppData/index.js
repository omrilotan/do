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
	const meta = await readFile(sources.meta);
	appData.meta = meta.trim();

	// Page nav
	const nav = await readFile(sources.nav);
	appData.nav = nav.trim();

	// analytics
	const analytics = await readFile(sources.analytics);
	appData.analytics = analytics.trim();

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
