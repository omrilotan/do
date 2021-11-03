(function () {

	var random = items => items[Math.floor(Math.random() * items.length)];

	(function() {
		const patch = [
			'https://discordapp.com/api',
			'webhooks',
			'662732577182056458',
			'tEx0sR7n_6Dtk3V2fXd4gcR8Mn4E82pPB4XXBRJ3RLP-I-ezYxXWaLrV88M4Kv0vCFay',
			'slack'
		];

		const [ form ] = document.forms;

		form.addEventListener(
			'submit',
			function sendForm(event) {
				event.preventDefault();
				const { target } = event;
				if (target.hasAttribute('disabled')) {
					return;
				}

				const [ textarea ] = target;
				const { value } = textarea;
				if (!value) { return textarea.focus(); }
				[ target, textarea ].forEach(e => e.setAttribute('disabled', 'disabled'));
				send(value).then(thanks).catch(
					() => [ target, textarea ].forEach(e => e.removeAttribute('disabled'))
				);
			}
		);

		const send = text => fetch(patch.join('/'), {
			method: 'POST',
			body: JSON.stringify({ text, username: username() })
		});

		function thanks() {
			const div = document.querySelector('div');
			div.style.height = div.offsetHeight + 'px';
			setTimeout(() => { div.style.height = '0px'; }, 200);
			const h1 = document.querySelector('h1');
			h1.parentNode.replaceChild(document.querySelector('template[name="thanks"]').content, h1);
		}

		const username = () => [ random(adjectives), random(animals) ].join(' ');

		const animals = [
			'Alpaca',
			'Anteater',
			'Bonobo',
			'Chinchilla',
			'Fox',
			'Hedgehog',
			'Lemur',
			'Meerkat',
			'Otter',
			'Panda',
			'Panda',
			'Platypus',
			'Raccoon',
			'Sloth'
		];
		const adjectives = [
			'Ambitious',
			'Bright',
			'Clever',
			'Confident',
			'Eager',
			'Enthusiastic',
			'Exuberant',
			'Friendly',
			'Helpful',
			'Inventive',
			'Sincere',
			'Thoughtful',
			'Witty'
		];

	})();

	(function() {
		function init() {
			const textarea = document.querySelector('textarea');
			let timer;

			function resize() {
				textarea.style.height = 'auto';
				textarea.style.height = textarea.scrollHeight + 'px';
			}

			function debounced() {
				clearTimeout(timer);
				timer = setTimeout(resize, 0);
			}

			[
				'change',
				'cut',
				'paste',
				'drop',
				'keydown'
			].forEach(
				event => textarea.addEventListener(event, debounced, false)
			);
		}
		window.addEventListener('load', init);
	})();

})();
