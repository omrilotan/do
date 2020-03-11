import random from './random/index.js';
import randomDo from './random-do/index.js';
import serviceWorker from './service-worker/index.js';
import link from './link/index.js';
import media from './media/index.js';
import menu from './menu/index.js';
import meta from './meta/index.js';
import { addShareButton } from './share/index.js';

const next = () => fetch('/en/list.json')
	.then(
		res => res.json()
	).then(
		randomDo
	).then(
		link
	).then(
		() => meta('page-type') === 'activity' && addShareButton(document.body)
	).catch(error => {
		error.flow = 'Fetch a random do';
		throw error;
	})
;

(function start() {
	if (media('print')) {
		return;
	}

	const colours = '{{ hexlist }}'.split(',');

	document.documentElement.style.setProperty(
		'--background-colour',
		random(colours)
	);
	next();
	serviceWorker();
	menu();
})();
