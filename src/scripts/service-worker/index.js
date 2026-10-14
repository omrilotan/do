import toast from "../toast/index.js";
import media from "../media/index.js";

/**
 * Register the service worker. In the installed app, offer a reload when a new version arrives.
 */
export default async function registerServiceWorker() {
	if (!("serviceWorker" in navigator)) {
		return;
	}

	const registration = await navigator.serviceWorker.register(
		"/serviceworker.js",
		{
			updateViaCache: "none",
		},
	);

	if (media("(display-mode: standalone)")) {
		listenToUpdates(registration);
	}
}

/**
 * @param {ServiceWorkerRegistration} registration
 */
function listenToUpdates(registration) {
	let notified = false;

	registration.addEventListener("updatefound", () => {
		const { installing } = registration;

		installing?.addEventListener("statechange", () => {
			if (
				notified ||
				installing.state !== "installed" ||
				!navigator.serviceWorker.controller
			) {
				return;
			}
			notified = true;
			toast();
		});
	});
}
