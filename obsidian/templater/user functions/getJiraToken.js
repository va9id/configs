function getJiraToken() {
	return process.env.JIRA_API_TOKEN ?? "";
}

module.exports = getJiraToken;
