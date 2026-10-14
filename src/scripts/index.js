import random from "./random/index.js";
import randomDo from "./random-do/index.js";
import serviceWorker from "./service-worker/index.js";
import link from "./link/index.js";
import media from "./media/index.js";
import menu from "./menu/index.js";
import meta from "./meta/index.js";
import * as stored from "./stored/index.js";
import { addShareButton } from "./share/index.js";

/**
 * @type {string[]} Existing lists
 */
const LISTS = ["all", "indoors", "outdoors"];

async function next(list) {
	try {
		const response = await fetch(`/${list}.json`);
		link(randomDo(await response.json()));
		if (meta("page-type") === "activity") {
			addShareButton(document.body);
		}
	} catch (error) {
		error.message = `Fetch a random do: ${error.message}`;
		throw error;
	}
}

/**
 * Paint the page in a random colour, and match the browser UI to it
 */
function paint() {
	const colours = (
		media("(prefers-color-scheme: dark)")
			? "{{ paletteDark }}"
			: "{{ paletteBright }}"
	).split(",");
	const colour = random(colours);

	document.documentElement.style.setProperty("--background-colour", colour);
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", colour);
}

if (!media("print")) {
	paint();

	const list = stored.get();
	next(LISTS.includes(list) ? list : "all");
	serviceWorker();
	menu();
}
