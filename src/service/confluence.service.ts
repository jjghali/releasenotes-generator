const requestPromise = require("request-promise");
class ConfluenceService {
  private confluenceLink: string = "";
  private authorization: string = "";
  //   endpoint must be https://confluence.desjardins.com/

  constructor(confluenceLink: string, username: string, password: string) {
    this.authorization = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );
    this.confluenceLink = confluenceLink;
  }

  public createPage(title: string, spaceKey: string, content: string) {
    let options: any = {
      method: "POST",
      url: this.confluenceLink + "/rest/api/content",
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + this.authorization,
      },
      body: {
        storage: { value: content, representation: "wiki" },
      },
    };

    requestPromise(options)
      .then((result: any) => {
        console.log(
          "New page created at: " + this.confluenceLink + result._links.webui
        );
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
  public getPageBaseInfo(title: string, spaceKey: string, content: string) {
    let options = {
      method: "GET",
      url: this.confluenceLink + "/rest/api/content",
      qs: {
        spaceKey: spaceKey,
        title: title,
        expand: "body.storage.value,version",
      },
      headers: { authorization: "Basic " + this.authorization },
      jar: "JAR",
    };

    requestPromise(options)
      .then((result: any) => {
        let pageId = result.results[0].id;
        let version = result.results[0].version.number;
        this.updatePage(pageId, version);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public updatePage(pageid: string, content: string) {
    let options = {
      method: "PUT",
      url: this.confluenceLink + "/rest/api/content/" + pageid,
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + this.authorization,
      },
      body: content,
      jar: "JAR",
    };
    requestPromise(options)
      .then((result: any) => {
        console.log(
          "Page updated at: " + this.confluenceLink + result._links.webui
        );
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
