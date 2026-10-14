import dataLayerPush from "./dataLayerPush/index.js";
import media from "./media/index.js";

/**
 * Replace the card's content with its text, wrapping matches of the query in <mark>
 * @param {HTMLElement} card
 * @param {string} text Original card text
 * @param {string} query Lower case search query
 */
function highlight(card, text, query) {
	if (!query) {
		card.textContent = text;
		return;
	}

	const nodes = [];
	const lower = text.toLowerCase();
	let index = 0;
	let found = lower.indexOf(query);

	while (found !== -1) {
		nodes.push(text.slice(index, found));
		const mark = document.createElement("mark");
		mark.textContent = text.slice(found, found + query.length);
		nodes.push(mark);
		index = found + query.length;
		found = lower.indexOf(query, index);
	}
	nodes.push(text.slice(index));
	card.replaceChildren(...nodes);
}

if (!media("print")) {
	const cards = [...document.querySelectorAll(".cards a")].map((card) => ({
		card,
		text: card.textContent,
	}));

	const search = document.createElement("input");
	search.type = "search";
	search.setAttribute("aria-label", "Search activities");
	search.placeholder = "Search";

	let reported = false;

	search.addEventListener("input", () => {
		const query = search.value.trim().toLowerCase();

		for (const { card, text } of cards) {
			const match = !query || text.toLowerCase().includes(query);
			card.classList.toggle("hidden", !match);
			card.toggleAttribute("inert", !match);
			highlight(card, text, match ? query : "");
		}

		if (!reported) {
			reported = true;
			dataLayerPush({ event: "search-glossary" });
		}
	});

	document.body.prepend(search);
}
