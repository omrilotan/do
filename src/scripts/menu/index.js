import beforeinstall from '../beforeinstall/index.js';
import dataLayerPush from '../dataLayerPush/index.js';
import share from '../share/index.js';
import slider from '../slider/index.js';

export default function menu() {
	const template =  document.querySelector('template[name="nav"]');
	if (!template) { return; }

	const nav = template.content.querySelector('nav');
	share(nav);
	beforeinstall(nav);

	const hamburger = template.content.querySelector('.hamburger');
	hamburger.addEventListener(
		'click',
		function toggleMenu(event) {
			event.preventDefault();
			event.stopPropagation();
			document.body.classList.toggle('navopen');
			dataLayerPush({click: 'hamburger'});
		}
	);

	document.body.appendChild(template.content);
	document.body.addEventListener(
		'click',
		function hideMenu(event) {
			let { target } = event;
			if (target === hamburger) { return; }
			while (target) {
				if (target === nav) { return; }
				target = target.parentElement;
			}
			if (document.body.classList.contains('navopen')) {
				event.preventDefault();
			}
			document.body.classList.remove('navopen');
		}
	);

	slider();
}
