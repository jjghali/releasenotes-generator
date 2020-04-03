import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactVersion } from "./model/artifactVersion.model";
import { ArtifactFile } from "./model/artifactFile.model";
const sprintf = require("sprintf-js").sprintf;
const markdownTemplate = require("./templates/markdown.template");

class Generator {
  private repositoryTag: RepositoryTag;
  constructor(repositoryTag: RepositoryTag) {
    this.repositoryTag = repositoryTag;
  }

  public generateMarkdown(): String {
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

  public generateConfluenceFormat(): String {
    return "";
  }
}
export { Generator };
