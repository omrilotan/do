(function () {
	'use strict';

	var random = items => items[Math.floor(Math.random() * items.length)];

	function randomDo(list) {
		const key = random(list);

		return document.location.href.includes(key)
			? randomDo(list)
			: `/en/${key}/`
		;
	}

	function serviceWorker(url) {
		navigator.onLine &&
			'serviceWorker' in navigator &&
			navigator.serviceWorker.register(url);
	}

	function link(href) {
		const draw = document.getElementById('draw');
		if (!draw) { return; }

		draw.setAttribute('href', href);

		const prerender = document.createElement('link');
		prerender.setAttribute('rel', 'prerender');
		prerender.setAttribute('href', href);
		prerender.setAttribute('as', 'fetch');
		document.querySelector('head').appendChild(prerender);
	}

	function share() {
		if (navigator.share && navigator.onLine) {
			const article = document.querySelector('article');
			if (!article) { return; }

			const share = document.createElement('a');
			const img = document.createElement('img');
			share.className = 'share';
			share.addEventListener(
				'click',
				() => navigator.share({
					title: document.title,
					text: document.querySelector('meta[name="description"]').content,
					url: document.location.href
				}).catch(console.error)
			);
			img.setAttribute('src', '/share.svg');
			img.setAttribute('alt', 'share');
			share.appendChild(img);
			article.appendChild(share);
		}
	}

	const colours = '#0063b1,#0078d7,#0099bc,#00b294,#00cc6a,#018574,#038387,#107c10,#10893e,#2d7d9a,#39cccc,#4363d8,#469990,#498205,#567c73,#6b69d6,#744da9,#800000,#85144b,#881798,#911eb4,#9a0089,#b10dc9,#bf0077,#c239b3,#c30052,#ca5010,#d13438,#da3b01,#e3008c,#e74856,#e81123,#ea005e,#ef6950,#f012be,#f58231,#f7630c,#ff4136,#ff4343,#ff8c00'.split(',');

	document.documentElement.style.setProperty(
		'--background-colour',
		random(colours)
	);

	const next = () => fetch('/en/list.json')
		.then(
			res => res.json()
		).then(
			randomDo
		).then(
			link
		).catch(
			console.error
		)
	;

	next();
	serviceWorker('/serviceworker.js?ck=v1');
	share();

}());
