import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import logger from "../logger/index.js";
import serve from "../serve/index.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const IGNORE = /^(\.git|docs|node_modules)(\/|$)|\.DS_Store$|\.log$/;

const [, , port = "1337"] = process.argv;

let running = null;
let queued = false;
let timer;

/**
 * Run the build in a fresh process so every module is re-evaluated
 */
function build() {
	if (running) {
		queued = true;
		return;
	}
	logger.info("🔨 Build");
	running = spawn(process.execPath, ["lib/build/index.js"], {
		cwd: root,
		stdio: "inherit",
	});
	running.on("exit", (code) => {
		running = null;
		if (code) {
			logger.error(`Build failed with exit code ${code}`);
		}
		if (queued) {
			queued = false;
			build();
		}
	});
}

serve({ port: Number(port) });
build();
watch(root, { recursive: true }, (type, file) => {
	if (!file || IGNORE.test(file)) {
		return;
	}
	clearTimeout(timer);
	timer = setTimeout(build, 100);
});
