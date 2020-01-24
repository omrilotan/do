import dataLayerPush from '../dataLayerPush/index.js';

let link;
let deferred;

export default function beforeinstall(container) {
	window.addEventListener(
		'beforeinstallprompt',
		function beforeinstallprompt(event) {
			event.preventDefault();

			deferred = event;
			if (link) { return; }

			link = document.createElement('a');
			link.setAttribute('href', '#!');
			link.appendChild(document.createTextNode('Get the App'));
			link.addEventListener(
				'click',
				function triggerbeforeinstall(event) {
					event.preventDefault();
					deferred.prompt();
					deferred.userChoice.then(
						function result({ outcome }) {
							if (outcome === 'accepted') {
								link.parentNode.removeChild(link);
							}
							deferred = null;
						}
					);

					dataLayerPush({ event: 'click', target: 'install' });
				}
			);
			container.insertBefore(link, container.firstElementChild);
		}
	);
}
