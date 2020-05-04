import { request, GraphQLClient } from "graphql-request";

import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { APIClient } from "./api.client";
import { Generator } from "./generator";
import { ConfluenceService } from "./service/confluence.service";
import { Options } from "./options";
const requestPromise = require("request-promise");

export class Controller {
  private env: Options;
  private confluenceService: ConfluenceService;

  constructor(env: Options) {
    this.env = env;
    this.env.tag = env.tag.trim();
    this.env.repository = env.repository.trim();
    this.env.project = env.project.trim();
    this.env.spaceKey = env.spaceKey.trim();
    this.confluenceService = new ConfluenceService(
      this.env.confluenceUrl,
      this.env.confluenceUser,
      this.env.confluencePassword
    );
  }

  public generateReleaseNote() {
    const options = {
      method: "POST",
      url: this.env.productTokenUrl,
      headers: {
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        grant_type: "client_credentials",
        client_id: this.env.productClientId,
        client_secret: this.env.productClientSecret,
      },
    };
    // S<inspirer de ca: https://github.com/npm/npm/releases

    requestPromise(options)
      .then((authData: any) => {
        const parsedAuthData: any = JSON.parse(authData);
        const token = "Bearer " + parsedAuthData.access_token;
        const apiClient: APIClient = new APIClient(token, this.env.graphqlUrl);

        apiClient
          .getRepositoryTag(this.env.project, this.env.repository, this.env.tag)
          .then((tag: RepositoryTag) => {
            const generator: Generator = new Generator(tag);
            let resultConfluence: string = generator.generateConfluenceFormat();

            console.log("Pushing to Confluence 📄");
            this.confluenceService.createPage(
              "Release note-" + tag.name,
              this.env.spaceKey,
              resultConfluence
            );
          });
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
