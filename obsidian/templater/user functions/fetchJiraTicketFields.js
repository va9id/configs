async function fetchJiraTicketFields(subdomain, email, token, issueId) {
	const https = require("https");
	const credentials = Buffer.from(`${email}:${token}`).toString("base64");

	return new Promise((resolve, reject) => {
		const options = {
			hostname: `${subdomain}.atlassian.net`,
			path: `/rest/api/3/issue/${issueId}?fields=summary,fixVersions,parent,status`,
			method: "GET",
			headers: {
				Authorization: `Basic ${credentials}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		};

		const request = https.request(options, (res) => {
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => {
				if (res.statusCode < 200 || res.statusCode >= 300) {
					reject(
						new Error(
							`HTTP ${res.statusCode}: ${res.statusMessage}`,
						),
					);
				} else {
					const parsed = JSON.parse(data);
					resolve(sanitizeStringValues(parsed));
				}
			});
		});

		request.on("error", reject);
		request.end();
	});
}

/* Replace double quotes in ticket fields with single quotes */
function sanitizeStringValues(value) {
	if (typeof value === "string") {
		return value.replace(/"/g, "'");
	}
	if (Array.isArray(value)) {
		return value.map(sanitizeStringValues);
	}
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([k, v]) => [k, sanitizeStringValues(v)]),
		);
	}
	return value;
}

module.exports = fetchJiraTicketFields;
