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

		const message = document.createElement('h3');
		message.appendChild(document.createTextNode('New update available!'));

		const menu = document.createElement('menu');
		const update = document.createElement('button');
		update.appendChild(document.createTextNode('update'));
		update.onclick = () => dialog.close() || window.location.reload();
		menu.appendChild(update);

		const ignore = document.createElement('button');
		ignore.className = 'close';
		ignore.appendChild(document.createTextNode('\u00D7'));
		ignore.onclick = () => dialog.close();

		dialog.appendChild(ignore);
		dialog.appendChild(message);
		dialog.appendChild(menu);
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

		const registration = await navigator.serviceWorker.register(
			'/serviceworker.js?ck=v-1',
			{
				updateViaCache: 'none'
			}
		);

		window.matchMedia('(display-mode:standalone)').matches && listenToUpdates(registration);
		registration.update();

		await navigator.serviceWorker.ready;
		setTimeout(
			() => navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({action: 'updateCacheKey', value: cacheKey()}),
			1000
		);
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

	function dataLayerPush(...args) {
		window.dataLayer && window.dataLayer.push(...args);
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

						dataLayerPush({ event: 'click', target: 'install' });
					}
				);
				container.insertBefore(link$1, container.firstElementChild);
			}
		);
	}

	/**
	 * Get the content attribute value of a meta tag by name
	 * @param {*} name 
	 * 
	 * @example
	 * meta('page-type') // 'activity'
	 */
	function meta(name) {
		const tag = document.querySelector(`meta[name="${name}"]`);
		if (!tag) { return null; }

		return tag.content;
	}

	const valid = () => navigator.share && navigator.onLine;

	function insertShareLink(container) {
		if (!valid()) { return; }

		const link = document.createElement('a');
		link.setAttribute('href', '#!');
		link.addEventListener('click', sharePage);
		link.appendChild(document.createTextNode('Share'));
		container.insertBefore(link, container.firstElementChild);
	}

	function addShareButton(container) {
		if (!valid()) { return; }

		const link = document.createElement('button');
		link.className = 'share';
		link.setAttribute('aria-label', 'Share this page');
		link.addEventListener('click', sharePage);
		container.appendChild(link);
	}

	function sharePage(event) {
		if (event) { event.preventDefault(); }

		dataLayerPush({ event: 'click', target: 'share' });
		navigator.share({
			title: document.title,
			text: meta('description'),
			url: document.location.href
		}).catch(error => {
			error.flow = 'Use browser share API';
			throw error;
		});
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
			dataLayerPush({ event: 'swipe', target: 'menu', action: 'open' });
			kill();
		}

		window.addEventListener(
			'load',
			registerCloseNav,
			{ once: true }
		);

		function registerCloseNav() {
			if (!document.querySelector('nav')) { return; }

			let active = null;

			function assign({ touches: [ { pageX } ] }) {
				kill();
				if (!document.body.classList.contains('navopen')) { return; }
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
				if (active.startX - pageX < DRAG_THRESHOLD) { return; }
				document.body.classList.remove('navopen');
				dataLayerPush({ event: 'swipe', target: 'menu', action: 'close' });
				kill();
			}
			document.body.addEventListener('touchstart', assign);
			document.body.addEventListener('touchend', kill);
		}
	}

	function menu() {
		const template =  document.querySelector('template[name="nav"]');
		if (!template) { return; }

		const nav = template.content.querySelector('nav');
		insertShareLink(nav);
		beforeinstall(nav);

		const hamburger = template.content.querySelector('.hamburger');
		hamburger.addEventListener(
			'click',
			function toggleMenu(event) {
				event.preventDefault();
				event.stopPropagation();
				document.body.classList.toggle('navopen');
				dataLayerPush({ event: 'click', target: 'hamburger' });
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
		).then(
			() => meta('page-type') === 'activity' && addShareButton(document.body)
		).catch(error => {
			error.flow = 'Fetch a random do';
			throw error;
		})
	;

	next();
	registerServiceWorker();
	menu();

}());
