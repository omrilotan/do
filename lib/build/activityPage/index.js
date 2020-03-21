const { join } = require('path');
const phrase = require('paraphrase/double');
const writeFile = require('../../writeFile');
const previewImage = require('../../previewImage');

/**
 * @param {string} o.key
 * @param {string} o.thing
 * @param {string} o.template
 * @param {object} o.appData
 */
module.exports = async function activityPage({base, dist, key, thing, template, appData}) {
	const preview = await previewImage({
		dist: join(base, dist),
		filename: key,
		text: thing,
	});

	await writeFile(
		join(base, dist, key, ['index', 'html'].join('.')),
		phrase(
			template,
			Object.assign(
				{ thing },
				appData,
				{
					tagline: thing,
					link: `${appData.homepage}/${join(key)}/`,
					preview: `${appData.homepage}/${preview}`,
				},
			),
		),
	);
};
