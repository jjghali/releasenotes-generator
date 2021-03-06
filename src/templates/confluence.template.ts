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
    href="https://portail-infonuagique.example.com
/static/semantic.min.css" />
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

//Example de lien a mettre https://sonar.example.com/dashboard?id=com.example

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
<h3>Informations</h3>
<ac:structured-macro ac:name="html" ac:schema-version="1" ac:macro-id="7a5afa2b-70d7-4e65-81b3-b9b0a0573266">
  <ac:plain-text-body>
    <![CDATA[
        <div>
<div class="summary-content">
%1$s
</div>
</div>

<script>

$(document).ready(function () {
    $('.composants-table tbody tr').each(function () {
        var repoName = $(this).attr('data-composant');
        var hasRepo = $('.composant-filtre option[value="' + repoName + '"]').length > 0;
        if (!hasRepo) {
            $('.composant-filtre').append('<option value="' + repoName + '">' + repoName + '</option>')
        }
    
    })
    $('[data-latest="false"]').hide();
        $(".show-old").change(function () {
            if (this.checked) {
                $('[data-latest="false"]').show();
            } else {
                $('[data-latest="false"]').hide();
            }
        })
                $(".composant-filtre").change(function () {
                    $('.version-row').hide();
                    var showOld = $(".show-old").checked;



                    if ($(this).val()) {
                        $('[data-latest="true"][data-composant="' + $(this).val() + '"]').show();

                        if ($(".show-old").val() == 'on')
                            $('[data-latest="false"][data-composant="' + $(this).val() + '"]').show();
                        else
                            $('[data-latest="false"][data-composant="' + $(this).val() + '"]').hide();
                    } else {
                        $('.version-row').show();
                        if ($(".show-old").val() == 'on')
                            $('[data-latest="false"]').show();
                        else
                            $('[data-latest="false"]').hide();
                    }

                })
            });


        </script>
        <style>
            .hidden {
                display: none;
            }
        </style>        
        <link rel="stylesheet" type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
        <link rel="stylesheet" type="text/css"
            href="https://portail-infonuagique.example.com/static/semantic.min.css">
]]>
  </ac:plain-text-body>
</ac:structured-macro>
`

const summaryContentTemplate = `
    <table class="ui celled table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Liens</th>
                </tr>
            </thead>
            <tbody class="resource-links">              
            </tbody>
        </table>

        <div class="ui divider"></div>
        <h1 class="ui header">Notes de livraison</h1>
        <select class="composant-filtre ui dropdown">
            <option value>Composant</option>
        </select>
        <div class="ui checkbox">
            <input class="show-old" type="checkbox" name="hide-old">
            <label>Show old releases</label>
        </div>
        <br>
        <table class="composants-table ui table">
            <thead>
                <tr>
                    <th class="single line">Version</th>
                    <th>Date de cr&#xE9;ation</th>
                    <th>Composante</th>
                    <th>Liens</th>
                </tr>
            </thead>
            <tbody>
                
            </tbody>
        </table>
`

const bitbucketInfoLink = `
<a class="ui blue image label bitbucket-link" href="https://git.example.com/projects/%1$s/repos/%2$s/browse">
    <i class="fab fa-bitbucket"></i>Bitbucket
    <div class="detail">%2$s</div>
</a>
                        `
const concourseInfoLink = `
<a class="ui yellow image label concourse-link" href="https://ci.example.com/teams/%1$s/pipelines/%2$s">
    <i class="fas fa-cog"></i>Concourse
    <div class="detail">%2$s</div>
</a>
                        `
const sonarQubeInfoLink = `
<a class="ui grey image label sonar-link" href="https://sonar.example.com/dashboard?id=%1$s">
    <i class="fas fa-bug"></i>SonarQube
    <div class="detail">%2$s</div>
</a>
`
const resourcesLinksInfo = `
<tr data-composant="%1$s">
    <td data-label="nom">%1$s</td>
    <td class="resource-link" data-label="liens">
        %2$s
    </td>
</tr>`

module.exports = {
    releaseNoteTemplate,
    componentsNoteTemplate,
    sonarQubeComponentTemplate,
    sonarQubeSectionTemplate,
    releaseRowTemplate,
    summaryPageTemplate,
    summaryContentTemplate,
    bitbucketInfoLink,
    concourseInfoLink,
    sonarQubeInfoLink,
    resourcesLinksInfo
};
