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

  public createPage(title: string, spaceKey: string, parentPage: string, content: string) {
    this.convertToStorageFormat(content).then(async (res: any) => {
      let options: any = {
        url: this.confluenceLink + "/rest/api/content",
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Basic " + this.authorization,
        },
        body: {
          type: "page",
          title: title,
          space: {
            key: spaceKey,
          },
          ancestors: [{ parentPage }],
          body: {
            storage: {
              value: res.value,
              representation: res.representation,
            },
          },
        },
        json: true,
      };

      await requestPromise(options)
        .then((result: any) => {
          console.log(
            "New page created at: " + this.confluenceLink + result._links.webui
          );
        })
        .catch((error: any) => {
          console.error(error);
        });
    });
  }

  public getPage(title: string, spaceKey: string): Promise<any> {
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

    return requestPromise(options)
      .then((result: any) => {
        return result.results[0];
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  public updatePage(title: string, spaceKey: string, content: string) {
    this.getPage(title, spaceKey)
      .then((res: any) => {
        let pageId = res.id;
        let version = res.version.number + 1;

        let options = {
          method: "PUT",
          url: this.confluenceLink + "/rest/api/content/" + pageId,
          headers: {
            "content-type": "application/json",
            authorization: "Basic " + this.authorization,
          },
          body: {
            id: pageId,
            type: "page",
            title,
            space: { key: spaceKey },
            body: {
              storage: {
                value: content,
                representation: "wiki",
              },
            },
            version: {
              number: version,
            },
          },
          json: true,
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
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  private convertToStorageFormat(content: any): Promise<any> {
    let options = {
      method: "POST",
      url: this.confluenceLink + "/rest/api/contentbody/convert/storage",
      headers: {
        "content-type": "application/json",
        authorization: "Basic " + this.authorization,
      },
      body: {
        value: content,
        representation: "wiki",
      },
      json: true,
      jar: "JAR",
    };
    return requestPromise(options).then((res: any) => {
      return res;
    });
  }
}

export { ConfluenceService };
