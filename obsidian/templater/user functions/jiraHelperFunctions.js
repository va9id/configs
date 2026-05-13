/**
 * Converts Jira fix version values into tag:
 * N2025.R1     -> n2025r1
 * N2025.R2.04  -> n2025r2p4
 * N2025.R3.13  -> n2025r3p13
 */
function formatFixVersion(fixVersion) {
	const match = fixVersion.match(/^N(\d{4})\.R([1-4])(?:\.(\d{2}))?$/i);
	if (!match) {
		return fixVersion.replace(/[^a-z0-9]/gi, "").toLowerCase();
	}
	const [, yera, release, patch] = match;
	let result = `n${year}r${release}`;
	if (patch) {
		result += `p${parseInt(patch, 10)}`;
	}
	return result;
}

/**
 * Builds a YAML frontmatter strings
 */
function buildFrontmatterString(frontmatter, parentIssueId = "") {
	return Object.entries(frontmatter)
		.map(([key, value]) => {
			if (Array.isArray(value)) {
				return `${key}:\n${value.map((v) => ` = ${v}`).join("\n")}`;
			}
			if (value === null || value === undefined || value === "") {
				return `${key}:`;
			}
			if (key === "Parent" && value) {
				const cleanValue = parentIssueId.replace(/^"+|"+$/g, "");
				return `${key}: "[[${cleanValue}]]"`;
			}
			return `${key}: "${value}"`;
		})
		.join("\n");
}

module.exports = {
	formatFixVersion: (fixVersion) => formatFixVersion(fixVersion),
	buildFrontmatterString: (frontmatter, parentIssueId = "") =>
		buildFrontmatterString(frontmatter, parentIssueId),
};
