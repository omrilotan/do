import { join } from "node:path";
import escapeHtml from "../../escapeHtml/index.js";
import phrase from "../../phrase/index.js";
import previewImage, { HEIGHT, WIDTH } from "../../previewImage/index.js";
import writeFile from "../../writeFile/index.js";

/**
 * Write an activity's page and its social preview image
 * @param {object} o
 * @param {string} o.dist
 * @param {string} o.key
 * @param {string} o.thing
 * @param {string} o.template
 * @param {object} o.appData
 */
export default async function activityPage({
	dist,
	key,
	thing,
	template,
	appData,
}) {
	const preview = await previewImage({ dist, filename: key, text: thing });

	const text = escapeHtml(thing);

	await writeFile(
		join(dist, key, "index.html"),
		phrase(template, {
			...appData,
			thing: text,
			tagline: text,
			link: `${appData.homepage}/${key}/`,
			preview: `${appData.homepage}/${preview}`,
			previewWidth: WIDTH,
			previewHeight: HEIGHT,
		}),
	);
}
