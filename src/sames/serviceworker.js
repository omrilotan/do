// Bump src/cache-key-version.txt to drop every cached file on the next visit
const CACHE_KEY = "do-cache-v{{ cacheKeyVersion }}";
const OFFLINE_PAGE = "/offline/";

const CACHED_FILES = [
	"/",
	"/about/",
	"/suggest/",
	"/glossary/",
	OFFLINE_PAGE,
	"/scripts.js",
	"/scripts/index.js",
	"/scripts/suggest.js",
	"/scripts/glossary.js",
	"/styles.css",
	"/styles/glossary.css",
	"/styles/suggest.css",
	"/favicon.ico",
	"/images/do.svg",
];

/**
 * Cache the app shell and every activity page, so the app works offline
 */
async function install() {
	const cache = await caches.open(CACHE_KEY);
	await cache.addAll(CACHED_FILES);

	try {
		const response = await fetch("/all.json");
		const activities = await response.json();
		await cache.addAll(activities.map((key) => `/${key}/`));
	} catch (error) {
		console.error("Cache activity pages:", error);
	}
}

/**
 * Remove caches left behind by previous versions
 */
async function activate() {
	const keys = await caches.keys();
	await Promise.all(
		keys.filter((key) => key !== CACHE_KEY).map((key) => caches.delete(key)),
	);
	await self.clients.claim();
}

/**
 * Stale while revalidate: answer from cache, refresh the cache in the background.
 * Fall back to the network, then to the offline page for navigations.
 * @param {FetchEvent} event
 * @returns {Promise<Response>}
 */
async function respond(event) {
	const { request } = event;
	const cache = await caches.open(CACHE_KEY);
	const cached = await cache.match(request, { ignoreSearch: true });

	const network = fetch(request).then((response) => {
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	});

	if (cached) {
		event.waitUntil(network.catch(() => undefined));
		return cached;
	}

	try {
		return await network;
	} catch (error) {
		if (request.mode === "navigate") {
			const offline = await cache.match(OFFLINE_PAGE);
			if (offline) {
				return offline;
			}
		}
		throw error;
	}
}

self.addEventListener("install", (event) => {
	self.skipWaiting();
	event.waitUntil(install());
});

self.addEventListener("activate", (event) => event.waitUntil(activate()));

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (
		request.method !== "GET" ||
		new URL(request.url).origin !== self.location.origin
	) {
		return;
	}
	event.respondWith(respond(event));
});
