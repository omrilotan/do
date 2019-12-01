export default () => navigator.onLine &&
	'serviceWorker' in navigator &&
	navigator.serviceWorker.register(`/serviceworker.js?ck=v-${cacheKey()}`);

function cacheKey() {
	const metaCache = document.querySelector('meta[name="cache-key-version"]');
	return metaCache
		? metaCache.getAttribute('content')
		: Math.random().toString('36').substr(5)
	;
}
