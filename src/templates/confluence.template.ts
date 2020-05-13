const releaseNoteTemplate: string = `
h3. Informations
*Date:* %1$s

h3. SonarQube
%2$s

h3. Tickets
{jiraissues:anonymous=false |columns=key,summary | jqlQuery=key in (%3$s)}

{expand:Cas de Tests}
{jiraissues:anonymous=false |columns=key,status,summary | jqlQuery=issuetype=Test AND issuefunction in linkedIssuesof(\"key in (%4$s)\")}
{expand}
{expand:Téléchargements}
%5$s
{expand}
`;

const componentsNoteTemplate: string = `
`;


const sonarQubeSectionTemplate: string = `{html}
%1$s
<link rel="stylesheet" type="text/css"
    href="https://portail-infonuagique.apps.cfzcec.desjardins.com/static/semantic.min.css" />
<style>
    .measure {
        max-width: 300px;
    }

    .measure .ui.fluid {
        margin-bottom: 10px;
    }
    .measure .ui.fluid.button {
        min-width:265px;
    }
    .measure .ui.basic.label{
        min-width:66px;
    }
    
    .measure .ui.blue.fluid.button{
        color:white!important
    }
    .measure .ui.red.fluid.button{
        color:white!important
    }
</style>
{html}`;

//Example de lien a mettre https://sonar.cfzcea.dev.desjardins.com/dashboard?id=com.desjardins.accesdccomm:communication-hogan-metier

/*
Mesures a mettre
Couverture
Fiabilité
Sécurité
Maintenabilité
Lignes de code
*/

/**
 * %1$s: Lien sonarqube
 * %2$s: Code de couleur (green, red, yellow)
 * %3$s: nom de la mesure (Couverture,Fiabilité,Sécurité,Maintenabilité,Lignes de code)
 * %4$s: valeur de la mesure
 */
const sonarQubeComponentTemplate: string = `<p class="measure"><a
        href="%1$s"
        target="_new"><span class="ui fluid right labeled button" role="button"><button class="ui %2$s fluid button">%3$s</button><span
                class="ui %2$s left pointing basic label">%4$s</span></span></a></p>
<br />`;

/**
 * %1$s: 0.18.0-autre-service
 * %2$s: 0.18.0
 * %3$s: autre-service
 * %4$s: 03 février 2020
 * %5$s: lien  page confluence
 * %6$s: lien vers tag bitbucket
 */

const releaseRowTemplate: string = `<tr class="version-row" id="%1$s" data-latest="true" data-version="%2$s"
            data-composant="%3$s">
    <td class="single line">
        <div class="">
            <a href="%5$s">
                %2$s
            </a>
            <div class="ui green tag label tiny">Latest</div>
        </div>
    </td>
    <td>
        %4$s
    </td>
    <td class="single line">
        %3$s
    </td>
    <td>
        <a class="ui blue image label" href="%6$s">
            <i class="fab fa-bitbucket"></i>
            <div class="detail">%1$s</div>
        </a>        
    </td>
</tr>`

const summaryPageTemplate: string = `
h3. Informations
{html}
%1$s
{html}
`

module.exports = {
    releaseNoteTemplate,
    componentsNoteTemplate,
    sonarQubeComponentTemplate,
    sonarQubeSectionTemplate,
    releaseRowTemplate,
    summaryPageTemplate
};
