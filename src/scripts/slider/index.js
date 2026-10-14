import dataLayerPush from "../dataLayerPush/index.js";

/**
 * Give up on a swipe that takes longer than this
 * @type {number}
 */
const SWIPE_TIMEOUT = 5000;

/**
 * Open the menu by swiping right from the left edge, close it by swiping left
 * @param {(open: boolean) => void} toggle
 */
export default function slider(toggle) {
	/**
	 * Threshold to recognise touch from edge
	 * @type {number}
	 */
	const EDGE_THRESHOLD = window.innerWidth / 3;

	/**
	 * Threshold to recognise a drag action
	 * @type {number}
	 */
	const DRAG_THRESHOLD = window.innerWidth / 6;

	/**
	 * Active swipe
	 * @type {{ startX: number, open: boolean, timer: number } | null}
	 */
	let active = null;

	function start({ touches: [{ pageX }] }) {
		end();
		const open = document.body.classList.contains("navopen");
		if (!open && pageX > EDGE_THRESHOLD) {
			return;
		}

		active = { startX: pageX, open, timer: setTimeout(end, SWIPE_TIMEOUT) };
		document.body.addEventListener("touchmove", move, { passive: true });
	}

	function end() {
		if (!active) {
			return;
		}
		clearTimeout(active.timer);
		active = null;
		document.body.removeEventListener("touchmove", move);
	}

	function move({ touches: [{ pageX }] }) {
		if (!active) {
			return;
		}
		const distance = active.open
			? active.startX - pageX
			: pageX - active.startX;
		if (distance < DRAG_THRESHOLD) {
			return;
		}
		toggle(!active.open);
		dataLayerPush({
			event: active.open ? "swipe-menu-close" : "swipe-menu-open",
		});
		end();
	}

	document.body.addEventListener("touchstart", start, { passive: true });
	document.body.addEventListener("touchend", end, { passive: true });
}
