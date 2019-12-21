(function() {
	const patch = [
		'https://hooks.slack.com',
		'services',
		'T9Y79PHFF',
		'BR8C1U9FH',
		'xcLq7eXtb9ndt6ai34JRQ8K8'
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
			[target, textarea].forEach(e => e.setAttribute('disabled', 'disabled'));
			send(value).then(thanks).catch(
				() => [target, textarea].forEach(e => e.removeAttribute('disabled'))
			);
		}
	);

	const send = text => fetch(patch.join('/'), {
		method: 'POST',
		body: JSON.stringify({ text })
	});

	function thanks() {
		const div = document.querySelector('div');
		div.style.height = div.offsetHeight + 'px';
		setTimeout(() => { div.style.height = '0px'; }, 200);
		const header = document.querySelector('header');
		header.parentNode.replaceChild(document.querySelector('template[name="thanks"]').content, header);
	}
})();
