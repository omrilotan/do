import dataLayerPush from "../dataLayerPush/index.js";
import meta from "../meta/index.js";

const valid = () => typeof navigator.share === "function" && navigator.onLine;

/**
 * Add a "Share" link to the start of the container
 * @param {HTMLElement} container
 */
export function insertShareLink(container) {
	if (!valid()) {
		return;
	}

	const link = document.createElement("a");
	link.href = "#!";
	link.textContent = "Share";
	link.addEventListener("click", sharePage);
	container.prepend(link);
}

/**
 * Add a floating share button to the container
 * @param {HTMLElement} container
 */
export function addShareButton(container) {
	if (!valid()) {
		return;
	}

	const button = document.createElement("button");
	button.className = "share";
	button.setAttribute("aria-label", "Share this page");
	button.addEventListener("click", sharePage);
	container.append(button);
}

async function sharePage(event) {
	event?.preventDefault();

	dataLayerPush({ event: "click-share" });
	try {
		await navigator.share({
			title: document.title,
			text: meta("description"),
			url: document.location.href,
		});
	} catch (error) {
		if (error.name === "AbortError") {
			dataLayerPush({ event: "abort-share" });
			return;
		}
		error.message = `Use browser share API: ${error.message}`;
		throw error;
	}
}
