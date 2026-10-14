import { build } from "esbuild";
import phrase from "../../phrase/index.js";

/**
 * Create a browser script bundle
 * @param {string} input Path to source file
 * @param {object} appData String replacements
 * @returns {Promise<string>} Bundled code
 */
export default async function createBundle(input, appData) {
	const {
		outputFiles: [{ text }],
	} = await build({
		entryPoints: [input],
		bundle: true,
		format: "iife",
		target: "es2020",
		minify: true,
		write: false,
	});

	return phrase(text, appData);
}
