(function() {
	try {
		window.localStorage.setItem('activity-list', 'outdoors');
	} catch (error) {
		// ignore
	}

	const random = items => items[Math.floor(Math.random() * items.length)];
	const keys = JSON.parse('{{ outdoors }}');
	window.location.href=`/${random(keys)}/`;
})();
