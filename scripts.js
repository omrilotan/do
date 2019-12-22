(function () {
	var random = items => items[Math.floor(Math.random() * items.length)];

	function randomDo(list) {
		const key = random(list);

		return document.location.href.includes(key)
			? randomDo(list)
			: `/en/${key}/`
		;
	}

	function toast() {
		const dialog = document.createElement('dialog');
		dialog.appendChild(document.createTextNode('New update available!'));

		const menu = document.createElement('menu');

		const update = document.createElement('button');
		update.appendChild(document.createTextNode('update'));
		update.onclick = () => dialog.close() || window.location.reload();

		const close = document.createElement('button');
		close.appendChild(document.createTextNode('close'));
		close.onclick = () => dialog.close();

		dialog.appendChild(menu);
		menu.appendChild(update);
		menu.appendChild(close);
		document.body.appendChild(dialog);

		dialog.showModal();
		setTimeout(() => dialog.classList.add('show'));
		setTimeout(() => dialog.classList.remove('show'), 20000);
	}

	var randomString = () => Math.random().toString('36').substr(5);

	let updated = false;

	async function registerServiceWorker() {
		const supported = navigator.onLine && 'serviceWorker' in navigator;
		if (!supported) { return; }

		const registration = await navigator.serviceWorker.register(`/serviceworker.js?ck=v-${cacheKey()}`);

		if (window.location.pathname === '/') {
			window.matchMedia('(display-mode:standalone)').metches
				&& listenToUpdates(registration);
			registration.update();
		}
	}

	window.addEventListener('beforeunload', function() { updated = true; });

	function listenToUpdates(registration) {
		registration.addEventListener(
			'updatefound',
			function updatefound() {
				if (updated) { return; }
				updated = true;

				const { installing } = registration;

				installing.addEventListener(
					'statechange',
					function statechanged() {
						installing.state === 'installed'
							&& navigator.serviceWorker.controller
							&& toast();
					}
				);
			}
		);
	}

	function cacheKey() {
		const metaCache = document.querySelector('meta[name="cache-key-version"]');

		return metaCache
			? metaCache.getAttribute('content')
			: randomString()
		;
	}

	function link(href) {
		const prerender = document.createElement('link');
		prerender.setAttribute('rel', 'prerender');
		prerender.setAttribute('href', href);
		prerender.setAttribute('as', 'fetch');
		document.querySelector('head').appendChild(prerender);

		document.querySelectorAll('[name="draw"]').forEach(
			draw => draw.setAttribute('href', href)
		);
	}

	let link$1;
	let deferred;

	function beforeinstall(container) {
		window.addEventListener(
			'beforeinstallprompt',
			function beforeinstallprompt(event) {
				event.preventDefault();

				deferred = event;
				if (link$1) { return; }

				link$1 = document.createElement('a');
				link$1.setAttribute('href', '#!');
				link$1.appendChild(document.createTextNode('Get the App'));
				link$1.addEventListener(
					'click',
					function triggerbeforeinstall(event) {
						event.preventDefault();
						deferred.prompt();
						deferred.userChoice.then(
							function result({ outcome }) {
								if (outcome === 'accepted') {
									link$1.parentNode.removeChild(link$1);
								}
								deferred = null;
							}
						);
					}
				);
				container.insertBefore(link$1, container.firstElementChild);
			}
		);
	}

	function share(container) {
		if (navigator.share && navigator.onLine) {
			const link = document.createElement('a');
			link.setAttribute('href', '#!');
			link.addEventListener(
				'click',
				function sharePage(event) {
					event.preventDefault();
					navigator.share({
						title: document.title,
						text: document.querySelector('meta[name="description"]').content,
						url: document.location.href
					}).catch(console.error);
				}
			);
			link.appendChild(document.createTextNode('Share'));
			container.insertBefore(link, container.firstElementChild);
		}
	}

	function slider() {
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
	}

	function menu() {
		const template =  document.querySelector('template[name="nav"]');
		const nav = template.content.querySelector('nav');

		if (!template) { return; }

		share(nav);
		beforeinstall(nav);

		const hamburger = template.content.querySelector('.hamburger');
		hamburger.addEventListener(
			'click',
			function toggleMenu(event) {
				event.preventDefault();
				event.stopPropagation();
				document.body.classList.toggle('navopen');
			}
		);

		document.body.appendChild(template.content);
		document.body.addEventListener(
			'click',
			function hideMenu(event) {
				let { target } = event;
				if (target === hamburger) { return; }
				while (target) {
					if (target === nav) { return; }
					target = target.parentElement;
				}
				if (document.body.classList.contains('navopen')) {
					event.preventDefault();
				}
				document.body.classList.remove('navopen');
			}
		);

		slider();
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
	registerServiceWorker();
	menu();

}());
