export default function toast() {
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
