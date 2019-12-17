(function () {
	window.addEventListener(
		'load',
		function prepareGlossary() {
			const search = document.createElement('input');
			search.setAttribute('type', 'search');
			search.setAttribute('placeholder', '🔍');

			const cards = document.querySelectorAll('.cards a');
			[].forEach.call(
				cards,
				function setupCard(card) {
					card.style.height = card.offsetHeight + 'px';
					card.setAttribute('h', card.offsetHeight);
				}
			);

			function searchChange({ target: { value } }) {
				[].forEach.call(
					cards,
					function resizeCard(card) {
						const match = !value || card.innerText.toLowerCase().includes(value.toLowerCase());

						card.classList.toggle('hidden', !match);
						card.style.height = match
							? card.getAttribute('h') + 'px'
							: '0px'
						;
					}
				);
			}

			search.addEventListener('keyup', searchChange);
			search.addEventListener('change', searchChange);

			document.body.appendChild(search);
		}
	);

}());
