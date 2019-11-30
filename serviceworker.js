(function() {
	const version = new URL(location).searchParams.get('ck');

	if (!version) { return; }

	const cacheKey = `cache-key-${version}`;

	const CACHED_FILES = [
		'/index.html',
		'/en/about/index.html',
		'/scripts.js',
		'/styles.css',
		'/favicon.ico',
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
		event => event.respondWith(
			caches.match(event.request).then(
				response => {
					if (response) {
						if (navigator.onLine) {

							// Refresh (async)
							fetch(event.request).then(
								response => {
									caches.open(cacheKey).then(
										cache => cache.put(event.request, response.clone())
									);
								}
							);
						}

						return response;
					} else {
						if (!navigator.onLine && isPage(event.request.url)) {
							return fetch(new Request('/offline/'));
						}

						return fetch(event.request).then(
							function(response) {
								const clone = response.clone();

								// Refresh (async)
								caches.open(cacheKey).then(
									cache => cache.put(event.request, clone)
								);
								return response;
							}
						);
					}
				}
			)
		)
	);

	function isPage(url) {
		const ext = url.replace(/\?.*/, '').split('.').pop();

		return ext === 'html' || !/^\w*$/.test(ext);
	}
})();
