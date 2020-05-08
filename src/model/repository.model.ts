import { RepositoryTag } from "./repositoryTag.model";
import { Measures } from "./measures.model"

class Repository {
  public tag: RepositoryTag = new RepositoryTag();
  public measures: Measures = new Measures();
}
export { Repository };
