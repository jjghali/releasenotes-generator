const sprintf = require("sprintf-js").sprintf;
const markdownTemplate = require("./templates/markdown.template");
const confluenceTemplate = require("./templates/confluence.template");
import { markdownToAtlassianWikiMarkup } from "@kenchan0130/markdown-to-atlassian-wiki-markup";
import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactVersion } from "./model/artifactVersion.model";
import { ArtifactFile } from "./model/artifactFile.model";

class Generator {
  private repositoryTag: RepositoryTag;
  private mdReleaseNotes: string = "";
  constructor(repositoryTag: RepositoryTag) {
    this.repositoryTag = repositoryTag;
  }

  public generateMarkdown(): string {
    const tasksList: string = this.generateMdTaskList(
      this.repositoryTag.jiraTasks
    );

    const downloadSection: string = this.generateMdDownloadSection(
      this.repositoryTag.artifactVersion
    );

    let releaseNote: string = sprintf(
      markdownTemplate.template,
      this.repositoryTag.projectName,
      this.repositoryTag.repoSlug,
      this.repositoryTag.name,
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
      downloadSection += `* [` + f.name + `](` + f.downloadURL + `)\n`;
    });
    return downloadSection;
  }

  public generateConfluenceFormat(): string {
    const tasksList: string = this.generateConfluenceTaskList(
      this.repositoryTag.jiraTasks
    );

    const downloadSection: string = this.generateConfluenceDownloadSection(
      this.repositoryTag.artifactVersion
    );

    const testCasesSection: string = this.generateConfluenceTestCases(
      this.repositoryTag.jiraTasks
    );

    let releaseNote: string = sprintf(
      confluenceTemplate.releaseNoteTemplate,
      tasksList,
      testCasesSection,
      downloadSection
    );
    return releaseNote;
  }

  private generateConfluenceTaskList(jiraTasks: JiraTask[]): string {
    let taskList: string = "";

    jiraTasks.forEach((j: JiraTask) => {
      taskList +=
        "**[" +
        j.key +
        "|https://jira.desjardins.com/browse/" +
        j.key +
        "]:* " +
        j.summary +
        " (" +
        j.summary +
        ")\n";
    });
    return taskList;
  }

  private generateConfluenceDownloadSection(
    artifactVersion: ArtifactVersion
  ): string {
    let downloadSection: string = "";

    artifactVersion.files.forEach((f: ArtifactFile) => {
      downloadSection += `* [` + f.name + `\\` + f.downloadURL + `]\n`;
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
