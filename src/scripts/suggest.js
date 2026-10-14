/**
 * Where suggestions go: a new GitHub issue
 * @type {string}
 */
const NEW_ISSUE = "https://github.com/omrilotan/do/issues/new";

/**
 * Longest suggestion that comfortably fits in a URL
 * @type {number}
 */
const MAX_LENGTH = 2000;

const [form] = document.forms;
const textarea = form.querySelector("textarea");
textarea.maxLength = MAX_LENGTH;

form.addEventListener("submit", (event) => {
	event.preventDefault();

	const value = textarea.value.trim();
	if (!value) {
		textarea.focus();
		return;
	}

	const url = new URL(NEW_ISSUE);
	url.searchParams.set("labels", "activity");
	url.searchParams.set(
		"title",
		`Activity suggestion: ${value.split("\n")[0].slice(0, 80)}`,
	);
	url.searchParams.set("body", value);

	window.open(url, "_blank", "noopener");
	thanks();
});

function thanks() {
	const container = form.parentElement;
	container.style.height = `${container.offsetHeight}px`;
	requestAnimationFrame(() => {
		container.style.height = "0px";
	});
	const heading = document.querySelector("h1");
	heading.replaceWith(
		document.getElementById("thanks").content.cloneNode(true),
	);
}

// Grow the text area with its content, where CSS field-sizing is not supported
if (!CSS.supports("field-sizing", "content")) {
	const resize = () => {
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	};
	textarea.addEventListener("input", resize);
}
