const { join } = require('path');
const phrase = require('paraphrase/double');
const writeFile = require('../../writeFile');

/**
 * @param {string} o.key
 * @param {string} o.thing
 * @param {string} o.template
 * @param {object} o.appData
 */
module.exports = async function activityPage({base, dist, key, thing, template, appData}) {
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
				},
			),
		),
	);
};
