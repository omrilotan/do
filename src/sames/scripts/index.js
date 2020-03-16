(function() {
	if (window.location.pathname === '/' && !window.matchMedia('(display-mode:standalone)').matches) {
		return;
	}

	const random = items => items[Math.floor(Math.random() * items.length)];
	const keys = JSON.parse('{{ all }}');
	window.location.href=`/${random(keys)}/`;
})();
