export default function dataLayerPush(...args) {
	window.dataLayer && window.dataLayer.push(...args);
}
