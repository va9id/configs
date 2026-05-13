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
					resolve(JSON.parse(data));
				}
			});
		});

		request.on("error", reject);
		request.end();
	});
}

module.exports = fetchJiraTicketFields;
