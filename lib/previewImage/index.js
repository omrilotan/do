const { join } = require('path');
const { generate } = require('text-to-image');
const writeFile = require('../writeFile');

/**
 * @param {string} o.dist
 * @param {string} o.filename
 * @param {string} o.text
 * @returns {string} file URL
 */
module.exports = async function previewImage({ dist, filename, text }) {
	const image = await generate(
		` \n${text}\n `,
		{
			// debug: true,
			maxWidth: 1400,
			fontSize: 84,
			fontFamily: 'Helvetica',
			textAlign: 'center',
			lineHeight: 120,
			margin: 15,
			bgColor: '#9a0089',
			textColor: 'white',
		},
	);

	const destination = `previews/${filename}.png`;
	await writeFile(
		join(dist, destination),
		image.replace(/^data:image\/png;base64,/, ''),
		'base64',
	);

	return destination;
};
