(function() {
	const random = items => items[Math.floor(Math.random() * items.length)];
	const keys = JSON.parse('{{ keys }}');
	window.location.href=`/en/${random(keys)}/`;
})();
