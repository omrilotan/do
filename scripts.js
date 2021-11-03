(function () {

	var random = items => items[Math.floor(Math.random() * items.length)];

	function randomDo(list) {
		const key = random(list);

		return document.location.href.includes(key)
			? randomDo(list)
			: `/${key}/`
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

		dialog.showModal
			? dialog.showModal()
			: dialog.setAttribute('open', 'open')
		;
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
			() => navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ action: 'updateCacheKey', value: cacheKey() }),
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

	function link$1(href) {
		const prerender = document.createElement('link');
		prerender.setAttribute('rel', 'prerender');
		prerender.setAttribute('href', href);
		prerender.setAttribute('as', 'fetch');
		document.querySelector('head').appendChild(prerender);

		document.querySelectorAll('[name="draw"]').forEach(
			draw => draw.setAttribute('href', href)
		);
	}

	/**
	 * @param {string} query Media query
	 * @returns {boolean} The media query was matches successfully
	 */
	function media(query) {
		try {
			return window.matchMedia(query).matches === true;
		} catch (error) {
			return false;
		}
	}

	function dataLayerPush(...args) {
		window.dataLayer && window.dataLayer.push(...args);
	}

	let link;
	let deferred;

	function beforeinstall(container) {
		window.addEventListener(
			'beforeinstallprompt',
			function beforeinstallprompt(event) {
				event.preventDefault();

				deferred = event;
				if (link) { return; }

				link = document.createElement('a');
				link.setAttribute('href', '#!');
				link.appendChild(document.createTextNode('Get the App'));
				link.addEventListener(
					'click',
					function triggerbeforeinstall(event) {
						event.preventDefault();
						deferred.prompt();
						deferred.userChoice.then(
							function result({ outcome }) {
								if (outcome === 'accepted') {
									link.parentNode && link.parentNode.removeChild(link);
								}
								deferred = null;
							}
						);

						dataLayerPush({ event: 'click-install' });
					}
				);
				container.insertBefore(link, container.firstElementChild);
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

		dataLayerPush({ event: 'click-share' });
		navigator.share({
			title: document.title,
			text: meta('description'),
			url: document.location.href
		}).catch(error => {
			if (error.name === 'AbortError') {

				dataLayerPush({ event: 'abort-share' });
				return;
			}
			error.message = 'Use browser share API: ' + error.message;
			throw error;
		});
	}

	/**
	 * @type {string}
	 */
	const STORAGE_KEY = 'activity-list';

	/**
	 * Mitigate local storage
	 */
	function get() {
		try {
			return window.localStorage.getItem(STORAGE_KEY);
		} catch (error) {
			return null;
		}
	}

	/**
	 * Mitigate local storage
	 */
	function remove() {
		try {
			window.localStorage.removeItem('activity-list');
		} catch (error) {
			// ignore
		}
	}

	/**
	 * Switch the behaviour of selected location (toggle)
	 */
	function location(nav) {
		const selectedLocation = get();
		if (!selectedLocation) {
			return;
		}

		const anchor = nav.querySelector(`a[href="/${selectedLocation}/"]`);
		if (!anchor) {
			return;
		}

		anchor.addEventListener('click', function(event) {
			event.preventDefault();
			remove();
			window.location.href = '/random';
		});
		anchor.classList.add('selected');
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
			dataLayerPush({ event: 'swipe-menu-open' });
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
				dataLayerPush({ event: 'swipe-menu-close' });
				kill();
			}
			document.body.addEventListener('touchstart', assign);
			document.body.addEventListener('touchend', kill);
		}
	}

	function menu() {
		const template = document.querySelector('template[name="nav"]');
		if (!template) { return; }

		const nav = template.content.querySelector('nav');
		insertShareLink(nav);
		location(nav);
		beforeinstall(nav);

		const hamburger = template.content.querySelector('.hamburger');
		hamburger.addEventListener(
			'click',
			function toggleMenu(event) {
				event.preventDefault();
				event.stopPropagation();
				document.body.classList.toggle('navopen');
				dataLayerPush({ event: 'click-hamburger' });
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

	/**
	 * @type {string[]} Existing lists
	 */
	const LISTS = [ 'all', 'indoors', 'outdoors' ];

	const next = location => fetch(`/${location}.json`)
		.then(
			res => res.json()
		).then(
			randomDo
		).then(
			link$1
		).then(
			() => meta('page-type') === 'activity' && addShareButton(document.body)
		).catch(error => {
			error.message = 'Fetch a random do: ' + error.message;
			throw error;
		})
	;

	(function start() {
		if (media('print')) {
			return;
		}

		const colours = media('(prefers-color-scheme: dark)')
			? '#003055,#002e53,#004a5a,#005f4f,#005f31,#007061,#004c4e,#001668,#02007e,#2d006b,#690000,#6e0035,#630070,#53006d,#5a0150,#480053,#550034,#46003d,#64002a,#5c2000,#360002,#3d1000,#530033,#580007,#490006,#69002a,#3f0900,#79005c,#461d00,#331300,#4b0400,#470000,#3d2200'.split(',')
			: '#0063b1,#0078d7,#0099bc,#00b294,#00cc6a,#018574,#038387,#107c10,#10893e,#2d7d9a,#39cccc,#4363d8,#469990,#498205,#567c73,#6b69d6,#744da9,#800000,#85144b,#881798,#911eb4,#9a0089,#b10dc9,#bf0077,#c239b3,#c30052,#ca5010,#d13438,#da3b01,#e3008c,#e74856,#e81123,#ea005e,#ef6950,#f012be,#f58231,#f7630c,#ff4136,#ff4343,#ff8c00'.split(',')
		;

		document.documentElement.style.setProperty(
			'--background-colour',
			random(colours)
		);

		const list = get();

		next(LISTS.includes(list) ? list : 'all');
		registerServiceWorker();
		menu();
	})();

})();
