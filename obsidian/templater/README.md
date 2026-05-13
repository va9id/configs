# Templater

User functions and templates using the [Templater](https://github.com/silentvoid13/Templater) plugin.

## About

Create files for Jira tickets by naming the file after the issue id.

Template used to pre-populate ticket properties by pulling them from Jira. Requires an API token from JIRA stored as an environment variable. Configure the variables (`JIRA_SUBDOMAIN`,`JIRA_EMAIL`) in the [template](/obsidian/templater/templates/jira-properties.md). This setup is for Windows, not sure if the function to fetch the [jira token](/obsidian/templater/user%20functions/getJiraToken.js) will work on Linux/macOS.
