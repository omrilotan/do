(function () {

	function dataLayerPush(...args) {
		window.dataLayer && window.dataLayer.push(...args);
	}

	/**
	 * @param {string} query Media query
	 * @returns {boolean} The media query was matches successfully
	 */
	function media(query) {
		try {
			return window.matchMedia(query).matches === true;
		} catch (error) {
			return false;
		}
	}

	let debounce;

	/**
	 * @param {Element[]} cards
	 * @param {string} o.attr   Attribute name for height memory
	 */
	function cardHeightSetup(cards, { attr } = {}) {
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
		});
	}

	/**
	 * Height memory attribute
	 * @type {string}
	 */
	const HEIGHT_MEM_ATTR = 'h';

	media('print') || window.addEventListener(
		'load',
		function prepareGlossary() {
			const search = document.createElement('input');
			search.setAttribute('type', 'search');

			const cards = document.querySelectorAll('.cards a');

			cardHeightSetup(cards, { attr: HEIGHT_MEM_ATTR });

			function searchChange({ target: { value } }) {
				const pattern = new RegExp(value, 'i');

				[].forEach.call(
					cards,
					function resizeCard(card) {
						const match = !value || card.innerText.toLowerCase().includes(value.toLowerCase());

						card.classList.toggle('hidden', !match);
						match
							? card.removeAttribute('tabindex')
							: card.setAttribute('tabindex', '-1')
						;
						card.style.height = match
							? card.hasAttribute(HEIGHT_MEM_ATTR)
								? card.getAttribute(HEIGHT_MEM_ATTR) + 'px'
								: 'auto'
							: '0px'
						;
						card.innerHTML = card.innerText.replace(pattern, match => `<mark>${match}</mark>`);
					}
				);

				dataLayerPush({ event: 'search-glossary' });
			}

			search.addEventListener('keyup', searchChange);
			search.addEventListener('change', searchChange);
			search.addEventListener('search', searchChange);

			document.body.insertBefore(search, document.body.firstElementChild);
		}
	);

})();
