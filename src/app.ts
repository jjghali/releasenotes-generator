import { request, GraphQLClient } from "graphql-request";
import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { APIClient } from "./api.client";
import { Generator } from "./generator";
const requestPromise = require("request-promise");
const fs = require("fs");

const endpoint = "http://localhost:4000/graphql";

const options = {
  method: "POST",
  url: "https://mvtdev.login.system.cfzcea.dev.desjardins.com/oauth/token",
  headers: {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded"
  },
  form: {
    grant_type: "client_credentials",
    client_id: "b7158766-f12b-4451-a437-3cd69f35d82e",
    client_secret: "5343ed71-1141-4b98-a1c2-ffd13e3a1967"
  }
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
        "calcul-scenario-paiement-web",
        "1.2.0"
      )
      .then((tag: RepositoryTag) => {
        const generator: Generator = new Generator(tag);
        let resultMd: String = generator.generateMarkdown();
        let resultConfluence: String = generator.generateConfluenceFormat();
        fs.writeFile(
          "ReleaseNotes-" + tag.name + ".md",
          resultMd,
          (err: any) => {
            if (err) console.log(err);
          }
        );
        fs.writeFile(
          "ReleaseNotes-" + tag.name + "-adf.txt",
          resultConfluence,
          (err: any) => {
            if (err) console.log(err);
          }
        );
      });
  })
  .catch((error: any) => {
    console.error(error);
  });
