import { glob } from "node:fs/promises";
import phrase from "../../phrase/index.js";
import readFile from "../../readFile/index.js";

const IGNORE = new Set([
	"/404.html",
	"/indoors/",
	"/offline/",
	"/outdoors/",
	"/random/",
	"/splash/",
	"/suggest/",
]);

/**
 * Create sitemap from the HTML pages in the dist directory
 * @param {string} source Sitemap template
 * @param {string} dist
 * @param {object} appData
 * @returns {Promise<string>}
 */
export default async function createSitemap(source, dist, appData) {
	const pages = [];

	for await (const file of glob("**/*.html", { cwd: dist })) {
		const path = `/${file.split("\\").join("/")}`.replace(/index\.html$/, "");
		if (!IGNORE.has(path)) {
			pages.push(path);
		}
	}

	const sitemap = pages
		.sort()
		.map((path) =>
			["\t<url>", `\t\t<loc>${appData.homepage}${path}</loc>`, "\t</url>"].join(
				"\n",
			),
		)
		.join("\n");

	return phrase(await readFile(source), { sitemap });
}
