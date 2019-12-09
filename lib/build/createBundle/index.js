const { rollup } = require('rollup');
const phrase = require('paraphrase/double');

/**
 * Create the site's script bundle
 * @param  {string} input   Path to source file
 * @param  {object} appData String replacements
 * @return {string}         Bundled code
 */
module.exports = async function createBundle(input, appData) {
	const bundle = await rollup({ input });
	const { output: [{ code }] } = await bundle.generate({
		compact: false,
		strict: false,
		format: 'iife',
	});

	return phrase(code, appData);
};
