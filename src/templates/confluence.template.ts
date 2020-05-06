const releaseNoteTemplate: string = `
h3. Informations
*Date:* %1$s

h3. Tickets
{jiraissues:anonymous=false |columns=key,summary | jqlQuery=key in (%2$s)}

{expand:Cas de Tests}
{jiraissues:anonymous=false |columns=key,status,summary | jqlQuery=issuetype=Test AND issuefunction in linkedIssuesof(\"key in (%3$s)\")}
{expand}

{expand:Téléchargements}
%4$s
{expand}
`;

const componentsNoteTemplate: string = `
`;

module.exports = { releaseNoteTemplate, componentsNoteTemplate };
