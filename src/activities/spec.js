const { readFileSync } = require('fs');
const { join } = require('path');
const SpellChecker = require('simple-spellchecker');

const MAX_LENGTH = 150;

let dictionary;

const activities = [
	'anywhere.txt',
	'indoors.txt',
	'outdoors.txt'
].map(
	filename => readFileSync(
		join(__dirname, filename)
	).toString().split('\n').map(i => i.trim()).filter(Boolean)
).flat();


const setupDictionary = () => new Promise(
	(resolve, reject) => {
		if (dictionary) {
			resolve();
			return;
		}

		SpellChecker.getDictionary('en-GB', function(error, received) {
			if (error) {
				reject(error);
				return;
			}
			dictionary = received;
			resolve();
		});
	}
);

const skipWords = [
	'GIF',
	'hand-clap',
	'in-person',
	'minifigures',
	'Pat-a-Cake',
	'selfies',
	'stop-motion',
	'Wikipedia',
	'yes/no'
];

describe(`${activities.length} activities`, () => {
	before(setupDictionary);
	it('should be shorter than 80 characters', () => {
		activities.forEach(activity => {
			expect(activity, activity).to.have.lengthOf.at.most(MAX_LENGTH);
		});
	});
	it('should end with a punctuation mark', () => {
		activities.forEach(activity => {
			expect(activity, activity).to.match(/[.?!]$/);
		});
	});
	it('should be spelled correctly', () => {
		activities.forEach(activity => {
			words(activity).forEach(word => {
				if (word == Number(word)) { return; }
				if (skipWords.includes(word)) { return; }

				if (!dictionary.spellCheck(word)) {
					const suggestions = dictionary.getSuggestions(word);

					assert.fail([
						`${activity} contains the misspelled word: "${word}".`,
						suggestions.length ? `Consider the following suggestions ${suggestions.join(', ')}.` : ''
					].filter(Boolean).join(' '));
				}
			});
		});
	});
});

const words = activity => activity.split(' ').map(i => i.replace(/^\W*|\W*$/g, '')).filter(Boolean);
