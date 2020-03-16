(function() {
	try {
		window.localStorage.setItem('activity-list', 'indoors');
	} catch (error) {
		// ignore
	}

	const random = items => items[Math.floor(Math.random() * items.length)];
	const keys = JSON.parse('{{ indoors }}');
	window.location.href=`/${random(keys)}/`;
})();
