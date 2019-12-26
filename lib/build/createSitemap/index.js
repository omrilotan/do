const { resolve } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const phrase = require('paraphrase/double');
const readFile = require('../../readFile');

const IGNORE = [
	'/404.html',
	'/en/',
	'/en/glossary/',
	'/en/suggest/',
	'/offline/',
	'/splash/',
];

//      <loc>http://www.example.com/</loc>
//      <lastmod>2005-01-01</lastmod>
//      <changefreq>monthly</changefreq>
//      <priority>0.8</priority>

module.exports = async function createSitemap(source, appData) {
	const files = await glob(resolve('docs/**/*'));

	const sitemap = files.filter(
		file => file.endsWith('.html')
	).map(
		file => file.replace(resolve('docs'), '')
	).map(
		file => file.replace(/index\.html$/, '')
	).filter(
		file => !IGNORE.includes(file)
	).map(
		file => [
			'\t<url>',
			`\t\t<loc>${appData.homepage}${file}</loc>`,
			'\t</url>'
		].join('\n')
	).join('\n');

	const template = await readFile(source);
	return phrase(template, { sitemap });
}
