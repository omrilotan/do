/**
 * Report an analytics event, when an analytics data layer is present
 * @param {...object} args
 */
export default function dataLayerPush(...args) {
	window.dataLayer?.push(...args);
}
