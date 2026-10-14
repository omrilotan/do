import { get, remove } from "../stored/index.js";

/**
 * Mark the selected location in the menu. Clicking it again clears the selection.
 * @param {HTMLElement} nav
 */
export function location(nav) {
	const selectedLocation = get();
	if (!selectedLocation) {
		return;
	}

	const anchor = nav.querySelector(`a[href="/${selectedLocation}/"]`);
	if (!anchor) {
		return;
	}

	anchor.addEventListener("click", (event) => {
		event.preventDefault();
		remove();
		window.location.href = "/random/";
	});
	anchor.classList.add("selected");
	anchor.setAttribute("aria-current", "true");
}
