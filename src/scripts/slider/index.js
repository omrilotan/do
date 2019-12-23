export default function slider() {
	/**
	 * Threshold to recognise touch from edge
	 * @type {number}
	 */
	const EDGE_THRESHOLD = window.outerWidth / 3;

	/**
	 * Threshold to recognise a drag action
	 * @type {number}
	 */
	const DRAG_THRESHOLD = window.outerWidth / 6;

	/**
	 * Active drag
	 * @type {Object}
	 */
	let active = null;

	document.body.addEventListener('touchstart', assign);
	document.body.addEventListener('touchend', kill);

	function assign({ touches: [ { pageX } ] }) {
		kill();
		if (pageX > EDGE_THRESHOLD) { return; }

		active = {
			startX: pageX,
			timer: setTimeout(kill, 5000)
		};
		document.body.addEventListener('touchmove', check);
	}

	function kill() {
		if (!active) { return; }
		clearTimeout(active.timer);
		active = null;
		document.body.removeEventListener('touchmove', check);
	}

	function check({ touches: [ { pageX } ] }) {
		if (!active) { return; }
		if (pageX - active.startX < DRAG_THRESHOLD) { return; }
		document.body.classList.add('navopen');
		kill();
	}

	window.addEventListener(
		'load',
		registerCloseNav,
		{ once: true }
	);

	function registerCloseNav() {
		const nav = document.querySelector('nav');
		if (!nav) { return; }

		let active = null;

		function assign({ touches: [ { pageX } ] }) {
			kill();
			active = {
				startX: pageX,
				timer: setTimeout(kill, 5000)
			};
			nav.addEventListener('touchmove', check);
		}
		function kill() {
			if (!active) { return; }
			clearTimeout(active.timer);
			active = null;
			nav.removeEventListener('touchmove', check);
		}
		function check({ touches: [ { pageX } ] }) {
			if (!active) { return; }
			if (active.startX - pageX < DRAG_THRESHOLD) { return; }
			document.body.classList.remove('navopen');
			kill();
		}
		nav.addEventListener('touchstart', assign);
		nav.addEventListener('touchend', kill);
	}
}
