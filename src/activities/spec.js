import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import dictionary from "dictionary-en-gb";
import nspell from "nspell";

const MAX_LENGTH = 150;

const SKIP_WORDS = new Set(["minifigures"]);

const activities = (
	await Promise.all(
		["anywhere.txt", "indoors.txt", "outdoors.txt"].map((filename) =>
			readFile(new URL(filename, import.meta.url), "utf8"),
		),
	)
)
	.flatMap((content) => content.split("\n"))
	.map((line) => line.trim())
	.filter(Boolean);

// Compound words ("hand-clap", "yes/no") are checked part by part
const words = (activity) =>
	activity
		.split(/[\s/-]+/)
		.map((word) => word.replace(/^\W*|\W*$/g, ""))
		.filter(Boolean);

describe(`${activities.length} activities`, () => {
	const spell = nspell(dictionary);

	it(`should be at most ${MAX_LENGTH} characters`, () => {
		for (const activity of activities) {
			assert.ok(activity.length <= MAX_LENGTH, activity);
		}
	});

	it("should end with a punctuation mark", () => {
		for (const activity of activities) {
			assert.match(activity, /[.?!]$/);
		}
	});

	it("should be unique", () => {
		assert.equal(new Set(activities).size, activities.length);
	});

	it("should be spelled correctly", () => {
		for (const activity of activities) {
			for (const word of words(activity)) {
				if (!Number.isNaN(Number(word)) || SKIP_WORDS.has(word)) {
					continue;
				}
				if (!spell.correct(word)) {
					const suggestions = spell.suggest(word);
					assert.fail(
						[
							`${activity} contains the misspelled word: "${word}".`,
							suggestions.length &&
								`Consider the following suggestions ${suggestions.join(", ")}.`,
						]
							.filter(Boolean)
							.join(" "),
					);
				}
			}
		}
	});
});
