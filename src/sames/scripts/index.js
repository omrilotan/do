(function() {
	if (window.location.pathname === '/' && !window.matchMedia('(display-mode:standalone)').matches) {
		return;
	}

	const random = items => items[Math.floor(Math.random() * items.length)];
	const keys = JSON.parse('{{ keys }}');
	window.location.href=`/en/${random(keys)}/`;
})();
