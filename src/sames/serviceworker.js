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
				response => response || fetch(event.request)
			)
		)
	);
})();
