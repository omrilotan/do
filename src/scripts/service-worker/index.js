import toast from '../toast/index.js';

const rand = () => Math.random().toString('36').substr(5);
let updated = false;

export default async function registerServiceWorker() {
	const supported = navigator.onLine && 'serviceWorker' in navigator;
	if (!supported) { return; }

	const registration = await navigator.serviceWorker.register(`/serviceworker.js?ck=v-${cacheKey()}`);

	if (window.location.pathname === '/') {
		window.matchMedia('(display-mode:standalone)').metches
			&& listenToUpdates(registration);
		registration.update();
	}
}

window.addEventListener('beforeunload', function() { updated = true; });

function listenToUpdates(registration) {
	registration.onupdatefound = function updatefound() {
		if (updated) { return; }
		updated = true;

		window.registration = registration;
		const { installing } = registration;

		installing.onstatechange = function statechanged() {
			installing.state === 'installed'
				&& navigator.serviceWorker.controller
				&& toast();
		};
	};
}

function cacheKey() {
	const metaCache = document.querySelector('meta[name="cache-key-version"]');

	return metaCache
		? metaCache.getAttribute('content')
		: rand()
	;
}
