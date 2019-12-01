export default function link(href) {
	const prerender = document.createElement('link');
	prerender.setAttribute('rel', 'prerender');
	prerender.setAttribute('href', href);
	prerender.setAttribute('as', 'fetch');
	document.querySelector('head').appendChild(prerender);

	document.querySelectorAll('[name="draw"]').forEach(
		draw => draw.setAttribute('href', href)
	);
}
