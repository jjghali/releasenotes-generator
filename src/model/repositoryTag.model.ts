import { JiraTask } from "./jiraTask.model";
import { ArtifactVersion } from "./artifactVersion.model";

class RepositoryTag {
  public projectName: String = "";
  public repoSlug: String = "";
  public name: String = "";
  public latestCommit: String = "";
  public jiraTasks: JiraTask[] = [];
  public artifactVersion: ArtifactVersion = new ArtifactVersion();
}
export { RepositoryTag };
