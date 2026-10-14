import fingerprint from "../../fingerprint/index.js";
import readLines from "../../readLines/index.js";

/**
 * Turn activities file into object
 * @param {string} activitiesFile Path to file
 * @returns {Promise<Record<string, string>>} {[fingerprint]: activity}
 */
export default async function createActivities(activitiesFile) {
	const lines = await readLines(activitiesFile);

	return Object.fromEntries(
		lines
			.filter((line) => !line.startsWith("#"))
			.map((line) => [fingerprint(line), line]),
	);
}
