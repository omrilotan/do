import dataLayerPush from './dataLayerPush/index.js';
import media from './media/index.js';
import cardHeightSetup from './cardHeightSetup/index.js';

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
