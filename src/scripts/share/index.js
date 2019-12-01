export default function() {
	if (navigator.share && navigator.onLine) {
		const article = document.querySelector('article');
		if (!article) { return; }

		const share = document.createElement('a');
		const img = document.createElement('img');
		share.className = 'share';
		share.addEventListener(
			'click',
			() => navigator.share({
				title: document.title,
				text: document.querySelector('meta[name="description"]').content,
				url: document.location.href
			}).catch(console.error)
		);
		img.setAttribute('src', '/share.svg');
		img.setAttribute('alt', 'share');
		share.appendChild(img);
		article.appendChild(share);
	}
}
