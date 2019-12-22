import toast from '../toast/index.js';
import randomString from '../random-string/index.js';

let updated = false;

export default async function registerServiceWorker() {
	const supported = navigator.onLine && 'serviceWorker' in navigator;
	if (!supported) { return; }

	const registration = await navigator.serviceWorker.register('/serviceworker.js?ck=v-1');

	if (window.location.pathname === '/') {
		window.matchMedia('(display-mode:standalone)').metches
			&& listenToUpdates(registration);
		registration.update();
	}

	await navigator.serviceWorker.ready;
	setTimeout(
		() => navigator.serviceWorker.controller.postMessage({action: 'updateCacheKey', value: cacheKey()}),
		1000
	);
}

window.addEventListener('beforeunload', function() { updated = true; });

function listenToUpdates(registration) {
	registration.addEventListener(
		'updatefound',
		function updatefound() {
			if (updated) { return; }
			updated = true;

			const { installing } = registration;

			installing.addEventListener(
				'statechange',
				function statechanged() {
					installing.state === 'installed'
						&& navigator.serviceWorker.controller
						&& toast();
				}
			);
		}
	);
}

function cacheKey() {
	const metaCache = document.querySelector('meta[name="cache-key-version"]');

	return metaCache
		? metaCache.getAttribute('content')
		: randomString()
	;
}
