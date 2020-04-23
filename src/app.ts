import { request, GraphQLClient } from "graphql-request";
import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { APIClient } from "./api.client";
import { Generator } from "./generator";
import { ConfluenceService } from "./service/confluence.service";

const confluenceService = new ConfluenceService(
  "https://confluence.desjardins.com/",
  "username",
  "password"
);

const requestPromise = require("request-promise");
const fs = require("fs");

const endpoint = "http://localhost:4000/graphql";

const options = {
  method: "POST",
  url: "https://mvtdev.login.system.cfzcea.dev.desjardins.com/oauth/token",
  headers: {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded",
  },
  form: {
    grant_type: "client_credentials",
    client_id: "clientid",
    client_secret: "secret",
  },
};

// S<inspirer de ca: https://github.com/npm/npm/releases

requestPromise(options)
  .then((authData: any) => {
    const parsedAuthData: any = JSON.parse(authData);
    const token = "Bearer " + parsedAuthData.access_token;
    const apiClient: APIClient = new APIClient(token, endpoint);

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
        confluenceService.createPage(
          "ReleaseNotes-" + tag.name,
          "spacekey",
          resultConfluence
        );
      });
  })
  .catch((error: any) => {
    console.error(error);
  });
