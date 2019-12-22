export default function slider() {
	/**
	 * Threshold to recognise touch from edge
	 * @type {number}
	 */
	const threshold = window.outerWidth / 6;

	document.body.addEventListener(
		'touchstart',
		function touchstart(event) {
			const { touches: [ touch ] } = event;
			new Slider(touch);
		}
	);

	document.body.addEventListener(
		'touchend',
		function touchstart() {
			Slider.kill();
		}
	);

	function touchmove({ touches: [ touch ] }) {
		Slider.check(touch);
	}

	class Slider {
		static check({ pageX }) {
			if (!Slider.active) { return; }
			if (pageX - Slider.active.startX > 100) {
				document.body.classList.add('navopen');
				Slider.kill();
			}
		}
		static kill() {
			if (!Slider.active) { return; }
			clearTimeout(Slider.active.timer);
			delete Slider.active;
			document.body.removeEventListener('touchmove', touchmove);
		}

		constructor({ pageX }) {
			if (pageX > threshold) {
				return;
			}

			this.startX = pageX;
			this.save();
			this.timer = setTimeout(Slider.kill, 5000);
		}

		save() {
			Slider.active = this;
			document.body.removeEventListener('touchmove', touchmove);
			document.body.addEventListener('touchmove', touchmove);
		}
	}
}
