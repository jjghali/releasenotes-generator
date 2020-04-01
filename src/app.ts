import { request, GraphQLClient } from "graphql-request";
const requestPromise = require("request-promise");

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
      name
      projectName
      description
      key

      tag(tag: "1.1.0") {
        jiraTasksBetweenTags(endTag: "1.2.0") {
          displayId
          author
          message
        }
        projectName
        repoSlug
        name
        latestCommit
        jiraTasks {
          key
          summary
          reporter
          assignee
        }
      }
    }
  }
`;

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
      .then(data => {
        console.log(data);
      })
      .catch((error: any) => {
        console.error(error);
      });
  })
  .catch((error: any) => {
    console.error(error);
  });
