import { createRequire } from "node:module";
import { join } from "node:path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import writeFile from "../writeFile/index.js";

const require = createRequire(import.meta.url);

export const WIDTH = 1200;
export const HEIGHT = 630;
const MARGIN = 50;
const MAX_LINE_WIDTH = WIDTH - MARGIN - MARGIN;
const FILL = "#9a0089";
const FONT_FAMILY = "Roboto";
const FONT_WEIGHT = 100;
const FONT_SIZE = 72;
const LINE_HEIGHT = 100;

GlobalFonts.registerFromPath(
	require.resolve("@expo-google-fonts/roboto/100Thin/Roboto_100Thin.ttf"),
	FONT_FAMILY,
);

/**
 * Break text into lines that fit within the maximum width
 * @param {CanvasRenderingContext2D} context
 * @param {string} text
 * @returns {string[]}
 */
function wrap(context, text) {
	const lines = [];
	let line = "";

	for (const word of text.split(" ")) {
		const candidate = line ? `${line} ${word}` : word;
		if (line && context.measureText(candidate).width > MAX_LINE_WIDTH) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	lines.push(line);

	return lines;
}

/**
 * Render a social preview image for an activity
 * @param {object} o
 * @param {string} o.dist
 * @param {string} o.filename
 * @param {string} o.text
 * @returns {Promise<string>} Path of the image, relative to dist
 */
export default async function previewImage({ dist, filename, text }) {
	const canvas = createCanvas(WIDTH, HEIGHT);
	const context = canvas.getContext("2d");

	context.fillStyle = FILL;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	context.fillStyle = "white";
	context.font = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_FAMILY}`;
	context.textAlign = "center";
	context.textBaseline = "middle";

	const lines = wrap(context, text);
	const top = (HEIGHT - lines.length * LINE_HEIGHT) / 2 + LINE_HEIGHT / 2;
	lines.forEach((line, index) =>
		context.fillText(line, WIDTH / 2, top + index * LINE_HEIGHT),
	);

	const destination = `previews/${filename}.png`;
	await writeFile(join(dist, destination), await canvas.encode("png"));

	return destination;
}
