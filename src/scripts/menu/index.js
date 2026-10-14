import beforeinstall from "../beforeinstall/index.js";
import dataLayerPush from "../dataLayerPush/index.js";
import { insertShareLink } from "../share/index.js";
import { location } from "../location/index.js";
import slider from "../slider/index.js";

/**
 * Build the navigation menu from its template
 */
export default function menu() {
	const template = document.getElementById("nav");
	if (!template) {
		return;
	}

	const { content } = template;
	const nav = content.querySelector("nav");
	const hamburger = content.querySelector(".hamburger");
	insertShareLink(nav);
	location(nav);
	beforeinstall(nav);

	/**
	 * @param {boolean} open
	 */
	function toggle(open) {
		document.body.classList.toggle("navopen", open);
		hamburger.setAttribute("aria-expanded", String(open));
	}

	hamburger.addEventListener("click", (event) => {
		event.preventDefault();
		event.stopPropagation();
		toggle(!document.body.classList.contains("navopen"));
		dataLayerPush({ event: "click-hamburger" });
	});

	document.body.append(content);

	document.body.addEventListener("click", (event) => {
		if (
			!document.body.classList.contains("navopen") ||
			nav.contains(event.target)
		) {
			return;
		}
		event.preventDefault();
		toggle(false);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && document.body.classList.contains("navopen")) {
			toggle(false);
			hamburger.focus();
		}
	});

	slider(toggle);
}
