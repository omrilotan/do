import random from '../random/index.js';

export default function randomDo(list) {
	const key = random(list);

	return document.location.href.includes(key)
		? randomDo(list)
		: `/${key}/`
	;
}
