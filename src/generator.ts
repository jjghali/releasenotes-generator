const sprintf = require("sprintf-js").sprintf;
const markdownTemplate = require("./templates/markdown.template");
const confluenceTemplate = require("./templates/confluence.template");
import { markdownToAtlassianWikiMarkup } from "@kenchan0130/markdown-to-atlassian-wiki-markup";
import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactVersion } from "./model/artifactVersion.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { Repository } from "./model/repository.model";
import { Measures } from "./model/measures.model";

class Generator {
  // private repositoryTag: RepositoryTag;
  private repository: Repository;
  private mdReleaseNotes: string = "";
  constructor(repository: Repository) {
    // this.repository.tag = repositoryTag;
    this.repository = repository
  }

  public generateMarkdown(): string {
    const tasksList: string = this.generateMdTaskList(
      this.repository.tag.jiraTasks
    );

    const downloadSection: string = this.generateMdDownloadSection(
      this.repository.tag.artifactVersion
    );

    let releaseNote: string = sprintf(
      markdownTemplate.template,
      this.repository.tag.projectName,
      this.repository.tag.repoSlug,
      this.repository.tag.name,
      tasksList,
      downloadSection
    );

    this.mdReleaseNotes = releaseNote;
    return releaseNote;
  }

  private generateMdTaskList(jiraTasks: JiraTask[]): string {
    let taskList: string = "";

    jiraTasks.forEach((j: JiraTask) => {
      taskList +=
        "* **[" +
        j.key +
        "](https://jira.desjardins.com/browse/" +
        j.key +
        "):** " +
        j.summary +
        " (" +
        j.summary +
        ")\n";
    });
    return taskList;
  }

  private generateMdDownloadSection(artifactVersion: ArtifactVersion): string {
    let downloadSection: string = "";

    artifactVersion.files.forEach((f: ArtifactFile) => {
      downloadSection += `* [` + f.name + `](` + f.href + `)\n`;
    });
    return downloadSection;
  }

  public generateConfluenceFormat(): string {
    const tasksList: string = this.generateConfluenceTaskList(
      this.repository.tag.jiraTasks
    );

    const sonarMeasures: string = this.generateSonarQubeResultsSection();

    const downloadSection: string = this.generateConfluenceDownloadSection(
      this.repository.tag.artifactVersion
    );

    const testCasesSection: string = this.generateConfluenceTestCases(
      this.repository.tag.jiraTasks
    );

    let releaseNote: string = sprintf(
      confluenceTemplate.releaseNoteTemplate,
      this.repository.tag.artifactVersion.created,
      sonarMeasures,
      tasksList,
      testCasesSection,
      downloadSection
    );
    return releaseNote;
  }

  private generateConfluenceTaskList(jiraTasks: JiraTask[]): string {
    let taskList: string = "";

    for (let i = 0; i < jiraTasks.length; i++) {
      const j = jiraTasks[i];
      taskList += j.key
      if ((i + 1) != jiraTasks.length)
        taskList += ","
    }

    return taskList;
  }

  private generateSonarQubeResultsSection(): string {
    this.repository.measures = new Measures();
    this.repository.measures.coverage = 95.2
    this.repository.measures.reliability_rating = "Z"
    this.repository.measures.security_rating = "Z"
    this.repository.measures.sqale_rating = "Z"
    this.repository.measures.ncloc = 9000

    let sonarSection: string = ""
    let sonarMeasures: string = sprintf(confluenceTemplate.sonarQubeComponentTemplate,
      "link-here",
      "green",
      "Couverture",
      this.repository.measures.coverage) + '\n';

    sonarMeasures += sprintf(confluenceTemplate.sonarQubeComponentTemplate,
      "link-here",
      "green",
      "Fiabilité",
      this.repository.measures.reliability_rating) + '\n';

    sonarMeasures += sprintf(confluenceTemplate.sonarQubeComponentTemplate,
      "link-here",
      "green",
      "Sécurité",
      this.repository.measures.security_rating) + '\n';

    sonarMeasures += sprintf(confluenceTemplate.sonarQubeComponentTemplate,
      "link-here",
      "green",
      "Maintenabilité",
      this.repository.measures.sqale_rating) + '\n';

    sonarMeasures += sprintf(confluenceTemplate.sonarQubeComponentTemplate,
      "link-here",
      "blue",
      "Lignes de code",
      this.repository.measures.ncloc) + '\n';

    sonarSection = sprintf(confluenceTemplate.sonarQubeSectionTemplate,
      sonarMeasures);

    return sonarSection;
  }

  private generateConfluenceDownloadSection(
    artifactVersion: ArtifactVersion
  ): string {
    let downloadSection: string = "";

    artifactVersion.files.forEach((f: ArtifactFile) => {
      downloadSection += `* [` + f.href + `]\n`;
    });
    return downloadSection;
  }


  private generateConfluenceTestCases(jiraTasks: JiraTask[]): string {
    let taskList: string = "";

    for (let i = 0; i < jiraTasks.length; i++) {
      const j = jiraTasks[i];
      taskList += j.key;
      if (i + 1 != jiraTasks.length) taskList += ",";
    }
    return taskList;
  }
}
export { Generator };
