import packageJson from "../../../package.json" with { type: "json" };
import escapeHtml from "../../escapeHtml/index.js";
import readFile from "../../readFile/index.js";
import readLines from "../../readLines/index.js";

const { name, description: tagline, homepage } = packageJson;

/**
 * Read a palette file into a comma separated list of colours
 * @param {string} file
 * @returns {Promise<string>}
 */
const palette = async (file) =>
	(await readLines(file))
		.map((line) => line.match(/#[\da-f]{6}/i)[0])
		.join(",");

/**
 * Values available to page templates as {{ key }}
 * @param {object} o
 * @param {Record<string, string>} o.activities All activities, by key
 * @param {string[]} o.indoors Keys of activities suitable indoors
 * @param {string[]} o.outdoors Keys of activities suitable outdoors
 * @param {Record<string, string>} o.sources Source file paths
 * @returns {Promise<Record<string, string | number>>}
 */
export default async function constructAppData({
	activities,
	indoors,
	outdoors,
	sources,
}) {
	const all = Object.keys(activities);

	return {
		homepage,
		indoors: JSON.stringify(indoors),
		outdoors: JSON.stringify(outdoors),
		all: JSON.stringify(all),
		name,
		size: all.length,
		tagline,
		link: homepage,
		preview: `${homepage}/images/960x640.png`,
		previewWidth: 960,
		previewHeight: 640,
		cacheKeyVersion: await readFile(sources.cacheKeyVersion),

		// Page meta tags
		meta: await readFile(sources.meta),

		// Page nav
		nav: await readFile(sources.nav),

		// That big, round "do" button
		"play-button": await readFile(sources.playButton),

		// Colours
		paletteBright: await palette(sources.paletteBright),
		paletteDark: await palette(sources.paletteDark),

		cards: Object.entries(activities)
			.map(([key, value]) => `<a href="/${key}/">${escapeHtml(value)}</a>`)
			.join("\n"),
	};
}
