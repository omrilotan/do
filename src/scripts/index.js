import random from './random/index.js';
import randomDo from './random-do/index.js';
import serviceWorker from './service-worker/index.js';
import link from './link/index.js';
import menu from './menu/index.js';

const colours = '{{ hexlist }}'.split(',');

document.documentElement.style.setProperty(
	'--background-colour',
	random(colours)
);

const next = () => fetch('/en/list.json')
	.then(
		res => res.json()
	).then(
		randomDo
	).then(
		link
	).catch(
		console.error
	)
;

next();
serviceWorker();
menu();
