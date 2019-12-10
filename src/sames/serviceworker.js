(function() {
	const version = new URL(location).searchParams.get('ck');

	if (!version) { return; }

	const cacheKey = `cache-key-${version}`;
	const _root = location.hostname.includes('doowat.net')
		? 'https://doowat.net/'
		: '/'
	;
	const base = str => _root + str;

	const CACHED_FILES = [
		'',
		'en/about/',
		'en/suggest/',
		'en/dictionary/',
		'offline/',
		'scripts.js',
		'scripts/index.js',
		'scripts/suggest.js',
		'styles.css',
		'styles/dictionary.css',
		'styles/suggest.css',
		'favicon.ico',
		'share.svg',
		'zany.svg'
	].map(
		url => base(url)
	);

	self.addEventListener(
		'install',
		event => event.waitUntil(
			caches.open(cacheKey).then(
				cache => {
					fetch(base('en/list.json')).then(
						response => response.ok && response.json()
					).then(
						list => {
							const files = list.map(
								id => base(`en/${id}/`)
							).concat(
								CACHED_FILES
							);

							cache.addAll(files).catch(error => err(error, files.join(', ')));
						}
					).catch(
						error => console.error(error, base('en/list.json'))
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
				event.respondWith(
					fetch(request).catch(error => err(error, request.url))
				);
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
								).catch(error => err(error, request.url));
							}

							return response;
						} else {
							if (!navigator.onLine && isPage(request.url)) {
								return fetch(
									new Request(base('offline/'))
								).catch(error => err(error, 'offline/'));
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
							).catch(error => err(error, request.url));
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

	function err(error, message) {
		error.message = [error.message, message].join(' ');
		setTimeout(() => { throw error; });
	}
})();
