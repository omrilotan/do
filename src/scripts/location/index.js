import { get, remove } from '../stored/index.js';

/**
 * Switch the behaviour of selected location (toggle)
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

	anchor.addEventListener('click', function(event) {
		event.preventDefault();
		remove();
		window.location.href = '/random';
	});
	anchor.classList.add('selected');
}
