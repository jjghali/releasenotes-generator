import { request, GraphQLClient } from "graphql-request";

import { RepositoryTag } from "./model/repositoryTag.model";
import { JiraTask } from "./model/jiraTask.model";
import { ArtifactFile } from "./model/artifactFile.model";
import { APIClient } from "./api.client";
import { Generator } from "./generator";
import { ConfluenceService } from "./service/confluence.service";
import { Options } from "./options";
import { Repository } from "./model/repository.model";
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
    if (this.env.parentPage)
      this.env.parentPage = env.parentPage.trim();
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
          .getReleaseInfo(this.env.project, this.env.repository, this.env.tag)
          .then((repo: Repository) => {
            const generator: Generator = new Generator(repo);
            let resultConfluence: string = generator.generateConfluenceFormat();

            this.confluenceService.getPage(this.env.parentPage,
              this.env.spaceKey).then((res: any) => {
                // check if page exists
                if (!res) {
                  return this.confluenceService.initializeSummaryPage(this.env.parentPage,
                    this.env.spaceKey);
                }
              }).then(() => {

                this.confluenceService.getPage(this.env.parentPage,
                  this.env.spaceKey)

                  .then((res: any) => {
                    console.log("Pushing to Confluence 📄");
                    this.confluenceService.createPage(
                      repo.tag.name + "-" + this.env.repository,
                      this.env.spaceKey,
                      res.id,
                      resultConfluence
                    )
                    let pageLink = this.env.confluenceUrl + '/display/' + this.env.spaceKey + '/' + repo.tag.name + "-" + this.env.repository;
                    let tagLink = 'https://git.cfzcea.dev.desjardins.com/projects/' + this.env.project + '/repos/' + this.env.repository + '/browse?at=refs%2Ftags%2F' + repo.tag.name
                    return {
                      repository: this.env.repository,
                      tag: this.env.tag,
                      releaseNoteLink: pageLink,
                      parentPage: this.env.parentPage,
                      spaceKey: this.env.spaceKey,
                      tagLink,
                      releaseDate: repo.tag.artifactVersion.created,
                      sonarQubeKey: repo.key,
                      projectName: repo.tag.projectName,
                    }
                  })
                  .then((env: any) => {
                    // update table of content which is the parent page
                    this.confluenceService.updateSummary(env.repository,
                      env.tag,
                      env.releaseNoteLink,
                      env.parentPage,
                      env.spaceKey,
                      env.tagLink,
                      env.releaseDate,
                      env.sonarQubeKey,
                      env.projectName)
                  })
                  .catch((error: any) => {
                    console.error(error);
                  });
              })
              .catch((error: any) => {
                console.error(error);
              });
          });
      });
  }
}
