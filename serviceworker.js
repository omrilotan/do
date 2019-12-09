(function() {
	const version = new URL(location).searchParams.get('ck');

	if (!version) { return; }

	const cacheKey = `cache-key-${version}`;

	const CACHED_FILES = [
		'/',
		'/en/about/',
		'/en/suggest/',
		'/en/dictionary/',
		'/scripts.js',
		'/styles.css',
		'/favicon.ico',
		'/share.svg',
		'/zany.svg'
	];

	self.addEventListener(
		'install',
		event => event.waitUntil(
			caches.open(cacheKey).then(
				cache => {
					fetch('/en/list.json').then(
						response => response.ok && response.json()
					).then(
						list => {
							const files = list.map(
								id => `/en/${id}/`
							).concat(
								CACHED_FILES
							);

							cache.addAll(files);
						}
					).catch(
						console.error
					);
				}
			)
		)
	);

	self.addEventListener(
		'activate',
		event => event.waitUntil(
			caches.keys().then(
				keys => keys.filter(
					key => key !== cacheKey
				).forEach(
					key => caches.delete(key)
				)
			)
		)
	);

	self.addEventListener(
		'fetch',
		function(event) {
			const { request } = event;

			if (request.method.toUpperCase() !== 'GET') {
				event.respondWith(fetch(request));
				return;
			}

			event.respondWith(
				caches.match(request).then(
					response => {
						if (response) {
							if (navigator.onLine) {

								// Refresh (async)
								fetch(request).then(
									response => {
										response.ok && caches.open(cacheKey).then(
											cache => cache.put(request, response.clone())
										);
									}
								);
							}

							return response;
						} else {
							if (!navigator.onLine && isPage(request.url)) {
								return fetch(new Request('/offline/'));
							}

							return fetch(request).then(
								function(response) {
									const clone = response.clone();

									// Refresh (async)
									response.ok && caches.open(cacheKey).then(
										cache => cache.put(request, clone)
									);
									return response;
								}
							);
						}
					}
				)
			);
		}
	);

	function isPage(url) {
		const ext = url.replace(/\?.*/, '').split('.').pop();

		return ext === 'html' || !/^\w*$/.test(ext);
	}
})();
