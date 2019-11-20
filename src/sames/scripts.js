(function() {
	const hex = ['#FFB900','#E74856','#0078D7','#0099BC','#FF8C00','#E81123','#0063B1','#2D7D9A','#F7630C','#EA005E','#8E8CD8','#00B7C3','#CA5010','#C30052','#6B69D6','#038387','#DA3B01','#E3008C','#8764B8','#00B294','#567C73','#EF6950','#BF0077','#744DA9','#018574','#486860','#D13438','#C239B3','#B146C2','#00CC6A','#498205','#847545','#FF4343','#9A0089','#881798','#10893E','#107C10'];
	const random = items => items[Math.floor(Math.random() * items.length)];

	document.documentElement.style.setProperty('--background-colour', random(hex));

	fetch('/en/list.json').then(res => res.json()).then(random).then(link).catch(console.error);
	function link(key) {
		document.getElementById('draw').setAttribute('href', `/en/${key}/`);
	}
})();
