const cheerio = require('cheerio');
const requestPromise = require("request-promise-native");
const Logger = require("@ptkdev/logger");
const sprintf = require("sprintf-js").sprintf;
const confluenceTemplate = require("../templates/confluence.template");

const loggerOptions = {
  "language": "en",
  "colors": true,
  "debug": true,
  "info": true,
  "warning": true,
  "error": true,
  "sponsor": true,
  "write": false
};

const logger = new Logger(loggerOptions);

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
    this.convertToStorageFormat(content).then((res: any) => {
      let ancestors = parentPage ? [{ parentPage }] : [];
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
          ancestors,
          body: {
            storage: {
              value: res.value,
              representation: res.representation,
            },
          },
        },
        json: true,
      };

      requestPromise(options)
        .then((result: any) => {
          logger.info(
            "New page created at: " + this.confluenceLink + result._links.webui
          );
        })
        .catch((error: any) => {
          logger.error(error.message);
        });
    }).catch((error: any) => {
      logger.error(error.message);
    });;
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
        return JSON.parse(result).results[0];
      })
      .catch((error: any) => {
        logger.error(error.message);
      });
  }

  public updatePage(title: string, spaceKey: string, content: string) {
    this.getPage(title, spaceKey)
      .then((res: any) => {
        let pageId = res.id;
        let version = res.version.number + 1;

        let options = {
          "method": "PUT",
          "url": this.confluenceLink + "/rest/api/content/" + pageId + "?expand=body.storage,version",
          "headers": {
            "authorization": "Basic " + this.authorization,
          },
          "body": {
            "id": pageId,
            "type": "page",
            "title": title,
            "space": { "key": spaceKey },
            "body": {
              "storage": content,
            },
            "version": { "number": version },
          },
          "json": true
        };

        requestPromise(options)
          .then((result: any) => {
            logger.info(
              "Page updated at: " + this.confluenceLink + result._links.webui
            );
          })
          .catch((error: any) => {
            logger.error(error.message);
          });
      })
      .catch((error: any) => {
        logger.error(error.message);
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
    }).catch((error: any) => {
      logger.error(error.message)
    }
    );
  }

  public updateSummary(repositoryName: string, releaseTag: string, releaseNoteLink: string, parentPage: string, spaceKey: string): Promise<any> {

    return this.getPage(parentPage, spaceKey)
      .then((result: any) => {
        let pageId = result.id;
        let versionNumber = result.version.number;
        let html = result.body.storage.value

        let $ = cheerio.load(html,
          {
            normalizeWhitespace: false,
            xmlMode: false
          }
        )

        $ = cheerio.load($('.summary-content').html(),
          {
            normalizeWhitespace: true,
            xmlMode: true
          }
        )



        this.demoteLatest(repositoryName, $)
        let line: string = this.generateLine(repositoryName, releaseTag, 'datehere', releaseNoteLink)

        $('.composants-table tbody').append(line);
        let pageContent: string = sprintf(confluenceTemplate.summaryPageTemplate,
          $.html())
        return {
          pageId,
          title: parentPage,
          versionNumber,
          summaryContent: pageContent
        }

      })
      .then((res: any) => {
        const pageId = res.pageId;
        const title = res.title;
        const versionNumber = res.versionNumber + 1;
        this.convertToStorageFormat(res.summaryContent)
          .then((res: any) => {
            this.updatePage(parentPage, spaceKey, res)
          })
          .catch((error: any) => {
            logger.error(error.message)
          }
          );
      })


      .catch((error: any) => {
        logger.error(error.message)
      }
      );


  }

  private generateLine(repositoryName: string, releaseTag: string, date: string, releaseNoteLink: string): string {
    let componentName: string = releaseTag + "-" + repositoryName;
    let line: string = sprintf(confluenceTemplate.releaseRowTemplate,
      componentName,
      releaseTag,
      repositoryName,
      date,
      releaseNoteLink
    )

    return line;
  }

  private demoteLatest(repositoryName: string, $: any) {
    $('[data-composant="' + repositoryName + '"][data-latest="true"]').attr('data-latest', 'false')
  }
}

export { ConfluenceService };
