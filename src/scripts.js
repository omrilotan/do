(function({ hex }) {
	const random = items => items[Math.floor(Math.random() * items.length)];

	document.documentElement.style.setProperty('--background-colour', random(hex));

	fetch('/en/list.json').then(res => res.json()).then(randomDo).then(link).catch(console.error);
	function link(href) {
		document.getElementById('draw').setAttribute('href', href);
		const prerender = document.createElement('link');
		prerender.setAttribute('rel', 'prerender');
		prerender.setAttribute('href', random);
		document.querySelector('head').appendChild(prerender);
	}

	function randomDo(list) {
		const key = random(list);

		return document.location.href.includes(key)
			? console.log('rerand', key) || randomDo(list)
			: `/en/${key}/`
		;
	}

	navigator.onLine &&
		'serviceWorker' in navigator &&
		navigator.serviceWorker.register('/serviceworker.js?ck=v1');
})({
	hex: {{ hexlist }}
});
