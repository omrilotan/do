export default function toast() {
	const dialog = document.createElement('dialog');
	dialog.appendChild(document.createTextNode('New update available!'));

	const menu = document.createElement('menu');

	const update = document.createElement('button');
	update.appendChild(document.createTextNode('update'));
	update.onclick = () => dialog.close() || window.location.reload();

	const close = document.createElement('button');
	close.appendChild(document.createTextNode('close'));
	close.onclick = () => dialog.close();

	dialog.appendChild(menu);
	menu.appendChild(update);
	menu.appendChild(close);
	document.body.appendChild(dialog);

	dialog.showModal();
	setTimeout(() => dialog.classList.add('show'));
	setTimeout(() => dialog.classList.remove('show'), 20000);
}
