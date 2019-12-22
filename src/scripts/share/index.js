export default function share(container) {
	if (navigator.share && navigator.onLine) {
		const link = document.createElement('a');
		link.setAttribute('href', '#!');
		link.addEventListener(
			'click',
			function sharePage(event) {
				event.preventDefault();
				navigator.share({
					title: document.title,
					text: document.querySelector('meta[name="description"]').content,
					url: document.location.href
				}).catch(console.error);
			}
		);
		link.appendChild(document.createTextNode('Share'));
		container.insertBefore(link, container.firstElementChild);
	}
}
