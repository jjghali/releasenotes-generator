import { request, GraphQLClient } from "graphql-request";
import { RepositoryTag } from "./model/repositoryTag.model";

const sprintf = require("sprintf-js").sprintf;

const queryTemplate: String = `
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
        files {
          name
          downloadURL
        }
      }
    }
  }
}
  
`;

class APIClient {
  private graphQLClient: GraphQLClient;

  constructor(bearerToken: string, apiURL: string) {
    this.graphQLClient = new GraphQLClient(apiURL, {
      headers: {
        authorization: bearerToken,
      },
    });
  }

  async getRepositoryTag(
    project: String,
    slug: String,
    version: String
  ): Promise<any> {
    const query: string = sprintf(queryTemplate, project, slug, version);
    return this.graphQLClient
      .request(query)
      .then((data: any) => {
        let tag: RepositoryTag = data.repository.tag;
        return tag;
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}

export { APIClient };
