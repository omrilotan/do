import { join } from "node:path";
import { fileURLToPath } from "node:url";
import logger from "../logger/index.js";
import phrase from "../phrase/index.js";
import readFile from "../readFile/index.js";
import sames from "../sames/index.js";
import sortObjectByValue from "../sortObjectByValue/index.js";
import writeFile from "../writeFile/index.js";
import activityPage from "./activityPage/index.js";
import constructAppData from "./constructAppData/index.js";
import createActivities from "./createActivities/index.js";
import createBundle from "./createBundle/index.js";
import createSitemap from "./createSitemap/index.js";

const base = fileURLToPath(new URL("../../", import.meta.url));
const src = join(base, "src");
const dist = join(base, "docs");

const sources = {
	anywhere: join(src, "activities/anywhere.txt"),
	indoors: join(src, "activities/indoors.txt"),
	outdoors: join(src, "activities/outdoors.txt"),

	cacheKeyVersion: join(src, "cache-key-version.txt"),
	playButton: join(src, "play-button.html"),
	paletteBright: join(src, "palette-bright.css"),
	paletteDark: join(src, "palette-dark.css"),
	suggest: join(src, "scripts/suggest.js"),
	glossary: join(src, "scripts/glossary.js"),
	meta: join(src, "meta.html"),
	nav: join(src, "nav.html"),
	scripts: join(src, "scripts/index.js"),
	sitemap: join(src, "sitemap.xml"),
	template: join(src, "template.html"),
};

const destinations = {
	indoors: join(dist, "indoors.json"),
	outdoors: join(dist, "outdoors.json"),
	all: join(dist, "all.json"),
	scripts: join(dist, "scripts.js"),
	sitemap: join(dist, "sitemap.xml"),
	suggest: join(dist, "scripts/suggest.js"),
	glossary: join(dist, "scripts/glossary.js"),
};

const start = performance.now();

const [anywhere, indoors, outdoors] = await Promise.all([
	createActivities(sources.anywhere),
	createActivities(sources.indoors),
	createActivities(sources.outdoors),
]);

const activities = sortObjectByValue({ ...anywhere, ...indoors, ...outdoors });
const lists = {
	all: Object.keys(activities),
	indoors: Object.keys({ ...indoors, ...anywhere }),
	outdoors: Object.keys({ ...outdoors, ...anywhere }),
};

const appData = await constructAppData({
	activities,
	indoors: lists.indoors,
	outdoors: lists.outdoors,
	sources,
});

const template = await readFile(sources.template);

await Promise.all([
	writeFile(destinations.indoors, JSON.stringify(lists.indoors)),
	writeFile(destinations.outdoors, JSON.stringify(lists.outdoors)),
	writeFile(destinations.all, JSON.stringify(lists.all)),
	createBundle(sources.scripts, appData).then((code) =>
		writeFile(destinations.scripts, code),
	),
	createBundle(sources.glossary, appData).then((code) =>
		writeFile(destinations.glossary, code),
	),
	createBundle(sources.suggest, appData).then((code) =>
		writeFile(destinations.suggest, code),
	),
	sames(join(src, "sames"), dist, (content) => phrase(content, appData)),
	...Object.entries(activities).map(([key, thing]) =>
		activityPage({ dist, key, thing, template, appData }),
	),
]);

// Runs last: the sitemap lists the pages written above
await writeFile(
	destinations.sitemap,
	await createSitemap(sources.sitemap, dist, appData),
);

logger.info(
	`Built site with ${lists.all.length} activities`,
	`(${lists.indoors.length} indoors, ${lists.outdoors.length} outdoors)`,
	`in ${(performance.now() - start).toFixed(2)}ms`,
);
