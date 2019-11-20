(function() {
	const version = new URL(location).searchParams.get('ck');

	if (!version) { return; }

	const cacheKey = `cache-key-${version}`;

	const CACHED_FILES = ['index.html','about/en/index.html'];

	self.addEventListener(
		'install',
		event => event.waitUntil(
			caches.open(cacheKey).then(
				cache => cache.addAll(CACHED_FILES)
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
