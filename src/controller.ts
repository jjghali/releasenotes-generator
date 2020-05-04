import { request, GraphQLClient } from "graphql-request";

import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { APIClient } from "./api.client";
import { Generator } from "./generator";
import { ConfluenceService } from "./service/confluence.service";
import { Options } from "./options";
const requestPromise = require("request-promise");
const fs = require("fs");

export class Controller {
  private env: Options;
  private confluenceService: ConfluenceService;

  constructor(env: Options) {
    this.env = env;
    this.confluenceService = new ConfluenceService(
      this.env.confluenceUrl,
      this.env.confluenceUser,
      this.env.confluencePassword
    );
  }

  public generateReleaseNote(tag: string) {
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
          .getRepositoryTag(
            "parcours-habitation",
            "renouvellement-service",
            "1.6.0"
          )
          .then((tag: RepositoryTag) => {
            const generator: Generator = new Generator(tag);
            let resultMd: string = generator.generateMarkdown();
            let resultConfluence: string = generator.generateConfluenceFormat();
            fs.writeFile(
              "ReleaseNotes-" + tag.name + ".md",
              resultMd,
              (err: any) => {
                if (err) console.log(err);
              }
            );
            // fs.writeFile(
            //   "ReleaseNotes-" + tag.name + "-adf.txt",
            //   resultConfluence,
            //   (err: any) => {
            //     if (err) console.log(err);
            //   }
            // );

            console.log("Pushing to Confluence 📄");
            this.confluenceService.createPage(
              "ReleaseNotes-" + tag.name + "-test2",
              "~DWP1473",
              resultConfluence
            );
          });
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
