const { join } = require('path');
const Canvas = require('canvas');
const writeFile = require('../writeFile');

const WIDTH = 1400;
const HEIGHT = 900;
const MARGIN = 50;
const MAX_LINE_WIDTH = WIDTH - MARGIN - MARGIN;
const FILL = '#9a0089';
const FONT_FAMILY = 'Roboto'; // Helvetica
const FONT_WEIGHT = 100;
const FONT_SIZE = 84;
const LINE_HEIGHT = 120;

/**
 * @param {string} o.dist
 * @param {string} o.filename
 * @param {string} o.text
 * @returns {string} file URL
 */
module.exports = async function previewImage({ dist, filename, text }) {

	// create a tall context so we definitely can fit all text
	const textCanvas = Canvas.createCanvas(WIDTH, 1000);
	const textContext = textCanvas.getContext('2d');

	let textY = 0;
	const textX = WIDTH / 2;
	textContext.textAlign = 'center';

	// Fill background
	textContext.fillStyle = FILL;
	textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);

	// Draw text
	textContext.fillStyle = 'white';
	textContext.font = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_FAMILY}`;
	textContext.textBaseline = 'top';

	const words = text.split(' ');
	let line = '';

	words.forEach(
		function (word) {
			const testLine = [line, word].filter(Boolean).join(' ');
			const testLineWidth = textContext.measureText(testLine).width;
			if (testLineWidth > MAX_LINE_WIDTH) {

				// Text is too long, fill with existing line and reset line with new word
				textContext.fillText(line, textX, textY);
				line = word;

				// move one line down
				textY += LINE_HEIGHT;
			} else {
				line = testLine;
			}
		},
	);
	textContext.fillText(line, textX, textY);
	const height = textY + LINE_HEIGHT;
	const textData = textContext.getImageData(0, 0, WIDTH, height);

	const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext('2d');
	ctx.globalAlpha = 1;
	ctx.fillStyle = FILL;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(textData, 0, (HEIGHT - height) / 2);
	const image = canvas.toDataURL();

	const destination = `previews/${filename}.png`;
	await writeFile(
		join(dist, destination),
		image.replace(/^data:image\/png;base64,/, ''),
		'base64',
	);

	return destination;
};
