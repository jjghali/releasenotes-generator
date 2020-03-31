import { request, GraphQLClient } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization:
      "Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vbXZ0ZGV2LnVhYS5zeXN0ZW0uY2Z6Y2VhLmRldi5kZXNqYXJkaW5zLmNvbS90b2tlbl9rZXlzIiwia2lkIjoia2V5LTEiLCJ0eXAiOiJKV1QifQ.eyJqdGkiOiJiODJkNWFjYzZhZjY0MDMzYmFkZThjMGQyY2QyNDk3YSIsInN1YiI6ImI3MTU4NzY2LWYxMmItNDQ1MS1hNDM3LTNjZDY5ZjM1ZDgyZSIsImF1dGhvcml0aWVzIjpbInVhYS5yZXNvdXJjZSJdLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiXSwiY2xpZW50X2lkIjoiYjcxNTg3NjYtZjEyYi00NDUxLWE0MzctM2NkNjlmMzVkODJlIiwiY2lkIjoiYjcxNTg3NjYtZjEyYi00NDUxLWE0MzctM2NkNjlmMzVkODJlIiwiYXpwIjoiYjcxNTg3NjYtZjEyYi00NDUxLWE0MzctM2NkNjlmMzVkODJlIiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsInJldl9zaWciOiI2YmRhZGE4YiIsImlhdCI6MTU4NTY3NzQwNywiZXhwIjoxNTg1NzIwNjA3LCJpc3MiOiJodHRwczovL212dGRldi51YWEuc3lzdGVtLmNmemNlYS5kZXYuZGVzamFyZGlucy5jb20vb2F1dGgvdG9rZW4iLCJ6aWQiOiI0NmIyYzMzYS04OTE0LTRiZGEtYTk4OS1kMmY5MmJmNGIxYmYiLCJhdWQiOlsidWFhIiwiYjcxNTg3NjYtZjEyYi00NDUxLWE0MzctM2NkNjlmMzVkODJlIl19.YoLKWOC2Ymc6WAa8Te9JMtzIYYa3IO99Z9oFHOwzSG3lmZso8lzdE33zlsXknA6fDhcwXt4mEY5MCCmbgp8p5pCX-jFUZGT_6yeBfFBtArEApPtZ6j-fRjAegx0C06Qk-1F8JQNJpfmCH7g4rnnUBNQZQVmIugHzdv629to4AyO-6Xsj0pqjWkGHfbRmO67BWr4mb1dRJB4L2brhMbTkGnCEunlCmfC2CZi32xU2EStkKR-4JAVzPuS64zReNFGntl7Yg664_1awvW47XNhe7Fi92isM04aqUSMYBoS6uzTawYW7MQzzhv5ccuBakk-Ugla4xSrGEsncKoA63AwD2Q"
  }
});

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
// const data =

graphQLClient
  .request(query)
  .then(data => {
    console.log(JSON.stringify(data));
  })
  .catch(error => console.error(error));
