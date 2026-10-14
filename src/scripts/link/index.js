/**
 * Point every "draw" link at the given page and ask the browser to load it ahead of time
 * @param {string} href
 */
export default function link(href) {
	if (HTMLScriptElement.supports?.("speculationrules")) {
		const rules = document.createElement("script");
		rules.type = "speculationrules";
		rules.textContent = JSON.stringify({ prerender: [{ urls: [href] }] });
		document.head.append(rules);
	} else {
		const prefetch = document.createElement("link");
		prefetch.rel = "prefetch";
		prefetch.href = href;
		document.head.append(prefetch);
	}

	for (const draw of document.querySelectorAll("[data-draw]")) {
		draw.setAttribute("href", href);
	}
}
