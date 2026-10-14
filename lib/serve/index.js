import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import logger from "../logger/index.js";

const TYPES = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml",
	".txt": "text/plain; charset=utf-8",
	".webmanifest": "application/manifest+json; charset=utf-8",
	".xml": "application/xml; charset=utf-8",
};

/**
 * Resolve a request path to a file in root, or null when there is no such file
 * @param {string} root
 * @param {string} pathname
 * @returns {Promise<string | null>}
 */
async function locate(root, pathname) {
	const filename = join(root, decodeURIComponent(pathname));
	if (filename !== root && !filename.startsWith(root + sep)) {
		return null;
	}

	try {
		const stats = await stat(filename);
		return stats.isDirectory()
			? locate(root, join(pathname, "index.html"))
			: filename;
	} catch {
		return null;
	}
}

/**
 * Serve a directory over HTTP for local development
 * @param {object} [o]
 * @param {string} [o.root]
 * @param {number} [o.port]
 */
export default function serve({ root = resolve("docs"), port = 1337 } = {}) {
	return createServer(async (request, response) => {
		const { pathname } = new URL(request.url, "http://localhost");
		const filename =
			(await locate(root, pathname)) ?? (await locate(root, "/404.html"));
		const status =
			filename?.endsWith(`${sep}404.html`) && pathname !== "/404.html"
				? 404
				: 200;

		if (!filename) {
			response
				.writeHead(404, { "Content-Type": TYPES[".txt"] })
				.end("Not found");
			logger.error(404, pathname);
			return;
		}

		response.writeHead(status, {
			"Content-Type": TYPES[extname(filename)] ?? "application/octet-stream",
			"Cache-Control": "no-cache",
		});
		createReadStream(filename).pipe(response);
		logger.info(status === 200 ? "🌐" : status, pathname);
	}).listen(port, "127.0.0.1", () =>
		logger.info(`🌐 http://127.0.0.1:${port}`),
	);
}
