import dataLayerPush from "../dataLayerPush/index.js";

/**
 * Add a "Get the App" link to the container when the browser offers to install the app
 * @param {HTMLElement} container
 */
export default function beforeinstall(container) {
	let link;
	let deferred;

	window.addEventListener("beforeinstallprompt", (event) => {
		event.preventDefault();

		deferred = event;
		if (link) {
			return;
		}

		link = document.createElement("a");
		link.href = "#!";
		link.textContent = "Get the App";
		link.addEventListener("click", async (event) => {
			event.preventDefault();
			dataLayerPush({ event: "click-install" });

			if (!deferred) {
				return;
			}
			deferred.prompt();
			const { outcome } = await deferred.userChoice;
			if (outcome === "accepted") {
				link.remove();
			}
			deferred = null;
		});
		container.prepend(link);
	});

	window.addEventListener("appinstalled", () => link?.remove());
}
