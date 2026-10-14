import { describe, it } from "node:test";
import assert from "node:assert/strict";
import phrase from "./index.js";

describe("phrase", () => {
	it("replaces placeholders with and without spaces", () => {
		assert.equal(phrase("{{ a }}-{{b}}", { a: 1, b: "two" }), "1-two");
	});
	it("supports dashed keys", () => {
		assert.equal(phrase("{{ play-button }}", { "play-button": "X" }), "X");
	});
	it("leaves unknown placeholders intact", () => {
		assert.equal(phrase("{{ missing }}", {}), "{{ missing }}");
	});
	it("does not interpret replacement patterns in values", () => {
		assert.equal(phrase("{{ a }}", { a: "$&$1" }), "$&$1");
	});
	it("replaces placeholders inside values", () => {
		assert.equal(
			phrase("<head>{{ meta }}</head>", {
				meta: "<title>{{ name }}</title>",
				name: "do",
			}),
			"<head><title>do</title></head>",
		);
	});
	it("stops on self referencing values", () => {
		assert.doesNotThrow(() => phrase("{{ a }}", { a: "{{ a }}" }));
	});
});
