export default function(url) {
	navigator.onLine &&
		'serviceWorker' in navigator &&
		navigator.serviceWorker.register(url);
}
