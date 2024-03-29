import random from './random/index.js';
import randomDo from './random-do/index.js';
import serviceWorker from './service-worker/index.js';
import link from './link/index.js';
import media from './media/index.js';
import menu from './menu/index.js';
import meta from './meta/index.js';
import * as stored from './stored/index.js';
import { addShareButton } from './share/index.js';

/**
 * @type {string[]} Existing lists
 */
const LISTS = [ 'all', 'indoors', 'outdoors' ];

const next = location => fetch(`/${location}.json`)
	.then(
		res => res.json()
	).then(
		randomDo
	).then(
		link
	).then(
		() => meta('page-type') === 'activity' && addShareButton(document.body)
	).catch(error => {
		error.message = 'Fetch a random do: ' + error.message;
		throw error;
	})
;

(function start() {
	if (media('print')) {
		return;
	}

	const colours = media('(prefers-color-scheme: dark)')
		? '{{ paletteDark }}'.split(',')
		: '{{ paletteBright }}'.split(',')
	;

	document.documentElement.style.setProperty(
		'--background-colour',
		random(colours)
	);

	const list = stored.get();

	next(LISTS.includes(list) ? list : 'all');
	serviceWorker();
	menu();
})();
