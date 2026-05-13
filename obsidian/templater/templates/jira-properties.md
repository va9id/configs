<%\*
const issueId = tp.file.title;
const JIRA_SUBDOMAIN = "<ENTER>";
const JIRA_EMAIL = "<ENTER>"
const JIRA_API_TOKEN = tp.user.getJiraToken();
if (JIRA_API_TOKEN === "") {
new Notice("Failed to fetch Jira token from env variable");
}

let titleResult = "";
let parentIssueId = "";
let fixVersion = "";
let status = "";
try {
const data = await tp.user.fetchJiraTicketFields(
JIRA_SUBDOMAIN,
JIRA_EMAIL,
JIRA_API_TOKEN,
issueId
);
titleResult = data.fields.summary ?? "";
parentIssueId = data.fields.parent?.key ?? "";
status = data.fields.status?.name ?? "";
const fixVersions = data.fields.fixVersions;
if (Array.isArray(fixVersions) && fixVersions.length >= 1) {
fixVersion = fixVersions[0].name ?? "";
}
} catch (error) {
new Notice(`Failed to fetch Jira issue: ${error.message}`);
}

const existingFrontmatter = tp.frontmatter;
const existingTags = existingFrontmatter.tags;
if (fixVersion) {
const formattedFixVersion = tp.user.jiraHelperFunctions.formatFixVersion(fixVersion, parentIssueId);
existingTags.push(formattedFixVersion);
}

const newFrontmatter = {
...existingFrontmatter,
"Jira ticket": `https://${JIRA_SUBDOMAIN}.atlassian.net/browse/${issueId}`,
"Title": titleResult,
"Status": status,
"Started on": existingFrontmatter["Started on"] ?? null,
"Finished on": existingFrontmatter["Finished on"] ?? null,
tags: existingTags
};

const frontmatterString = tp.user.jiraHelperFunctions.buildFrontmatterString(newFrontmatter, parentIssueId);
-%>

---

## <% frontmatterString %>

---
