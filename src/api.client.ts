import { request, GraphQLClient } from "graphql-request";
import { RepositoryTag } from "./model/repositoryTag.model";
import { Repository } from "./model/repository.model";

const sprintf = require("sprintf-js").sprintf;

const getReleaseInfoQuery: String = `
  {
  repository(
      project: "%1$s"
    slug: "%2$s"
  ) {
    tag(tag: "%3$s") {
      projectName
      repoSlug
      name
      latestCommit
      jiraTasks {
        key
        summary
        reporter
        assignee
        status
      }
      artifactVersion {
        name
        path
        created
        files {
          name
          href
        }
      }
    }
  }
}  
`;
// ,
// measures{
// coverage
// sqale_rating
// security_rating
// reliability_rating
// ncloc
// }
class APIClient {
  private graphQLClient: GraphQLClient;

  constructor(bearerToken: string, apiURL: string) {
    this.graphQLClient = new GraphQLClient(apiURL, {
      headers: {
        authorization: bearerToken,
      },
    });
  }

  async getReleaseInfo(
    project: String,
    slug: String,
    version: String
  ): Promise<any> {
    const query: string = sprintf(getReleaseInfoQuery, project, slug, version);
    return this.graphQLClient
      .request(query)
      .then((data: any) => {
        let repo: Repository = data.repository;
        // let tag: RepositoryTag = data.repository.tag;
        return repo;
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}

export { APIClient };
