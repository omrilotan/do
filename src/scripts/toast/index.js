/**
 * Show an "update available" message with a reload button
 */
export default function toast() {
	const dialog = document.createElement("dialog");
	dialog.setAttribute("aria-labelledby", "toast-message");

	const close = document.createElement("button");
	close.className = "close";
	close.setAttribute("aria-label", "Dismiss");
	close.textContent = "×";
	close.addEventListener("click", () => dialog.close());

	const message = document.createElement("h3");
	message.id = "toast-message";
	message.textContent = "New update available!";

	const menu = document.createElement("menu");
	const update = document.createElement("button");
	update.textContent = "update";
	update.addEventListener("click", () => {
		dialog.close();
		window.location.reload();
	});
	menu.append(update);

	dialog.append(close, message, menu);
	dialog.addEventListener("close", () => dialog.remove());
	document.body.append(dialog);

	dialog.show();
	requestAnimationFrame(() => dialog.classList.add("show"));
	setTimeout(() => dialog.classList.remove("show"), 20000);
}
