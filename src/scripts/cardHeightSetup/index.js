let debounce;

/**
 * @param {Element[]} cards
 * @param {string} o.attr   Attribute name for height memory
 */
export default function cardHeightSetup(cards, { attr } = {}) {
	function resetCards() {
		[].forEach.call(
			cards,
			function setupCard(card) {
				if (card.classList.contains('hidden')) {
					card.removeAttribute(attr);
					return;
				}
				card.style.height = 'auto';
				window.requestAnimationFrame(function() {
					card.style.height = card.offsetHeight + 'px';
					card.setAttribute(attr, card.offsetHeight);
				});
			}
		);
	}
	resetCards();

	window.addEventListener('orientationchange', () => {
		clearTimeout(debounce);
		debounce = setTimeout(resetCards, 100);
	})
}
