export default function link(href) {
	const draw = document.getElementById('draw');
	if (!draw) { return; }

	draw.setAttribute('href', href);

	const prerender = document.createElement('link');
	prerender.setAttribute('rel', 'prerender');
	prerender.setAttribute('href', href);
	prerender.setAttribute('as', 'fetch');
	document.querySelector('head').appendChild(prerender);
}
