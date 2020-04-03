const releaseNoteTemplate: string = `
h4. Tickets
%1%s
{expand:Cas de Tests}\n
{jiraissues:anonymous=false |columns=key,status | jqlQuery=issuetype=Test AND issuefunction in linkedIssuesof("key in (%2$s)")}
{expand}
{expand:Téléchargements}\n
%3%s
{expand}
`;
const componentsNoteTemplate: string = `
`;
module.exports = { releaseNoteTemplate, componentsNoteTemplate };
