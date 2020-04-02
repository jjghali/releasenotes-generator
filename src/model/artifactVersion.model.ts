import { ArtifactFile } from "./artifactFile.model";
class ArtifactVersion {
  public name: String = "";
  public created: String = "";
  public createdBy: String = "";
  public lastModified: String = "";
  public lastModifiedBy: String = "";
  public path: String = "";
  public files: ArtifactFile[] = [];
}
export { ArtifactVersion };
