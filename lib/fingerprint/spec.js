const fingerprint = require('.');

describe('lib/fingerprint', () => {
	it('Should create consistent hashes for same string', () => {
		['a', 'r4g', 'hello'].forEach(
			string => expect(fingerprint(string)).to.equal(fingerprint(string)),
		);
	});
	it('Should create unique hashes for different values', () => {
		const values = ['a', 'A', '1', 'wij', 'wiJ', 'WIJ', '*', '^', '😀', '😃'];
		const keys = new Set(values.map(fingerprint));
		expect(values.length).to.equal(keys.size);
	});
});
