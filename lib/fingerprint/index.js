import { createHash } from "node:crypto";

/**
 * MD5 hex digest of a string. Used as the activity's URL slug, so it must stay stable.
 * @param {string} string
 * @returns {string}
 */
export default (string) =>
	createHash("md5").update(string, "utf8").digest("hex");
