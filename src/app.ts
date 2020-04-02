import { request, GraphQLClient } from "graphql-request";
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

const query = `
  {
  repository(
    project: "parcours-habitation"
    slug: "calcul-scenario-paiement-web"
  ) {
    tag(tag: "1.2.0") {
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

// S<inspirer de ca: https://github.com/npm/npm/releases

requestPromise(options)
  .then((authData: any) => {
    const parsedAuthData: any = JSON.parse(authData);
    const token = "Bearer " + parsedAuthData.access_token;
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: token
      }
    });

    graphQLClient
      .request(query)
      .then((data: any) => {
        return data.repository.tag;
      })
      .then((tag: any) => {
        let readmeContent: String = "";
        readmeContent +=
          tag.projectName + "/" + tag.repoSlug + " " + tag.name + "\n";
        readmeContent += "\n***Changements:***\n";

        tag.jiraTasks
          .filter((j: any) => j.status == "done" && j.assignee != "Unassigned")
          .forEach((jira: any) => {
            const task: any =
              "- " +
              jira.key +
              ": " +
              jira.summary +
              " (" +
              jira.assignee +
              ")\n";
            readmeContent = readmeContent.concat(task);
          });

        readmeContent += "\n***Téléchargements:***\n";
        tag.artifactVersion.files
          .filter(
            (f: any) =>
              f.name.includes(".jar") ||
              f.name.includes(".zip") ||
              f.name.includes("tar")
          )
          .forEach((f: any) => {
            const download: any = "- " + f.name + ": " + f.downloadURL + "\n";
            readmeContent = readmeContent.concat(download);
          });
        return readmeContent;
      })
      .then((readmeContent: any) => {
        fs.writeFile("RELEASE-NOTES.txt", readmeContent, (err: any) => {
          if (err) {
            console.error(err);
          }
        });
      })
      .catch((error: any) => {
        console.error(error);
      });
  })
  .catch((error: any) => {
    console.error(error);
  });
