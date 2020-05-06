import * as commander from "commander";
import { loadEnv, env } from "./env";
import { Controller } from "./controller";
import { Options } from "./options";

loadEnv();

const chalk = require("chalk");
const confluenceUrl: string = env.CONFLUENCE_URL || "";
const confluenceUser: string = env.CONFLUENCE_USER || "";
const confluencePassword: string = env.CONFLUENCE_PASSWORD || "";

const graphqlEndpointUrl: string = env.GRAPHQL_URL || "";
const productTokenUrl: string = env.PRODUCT_TOKEN_URL || "";
const productCLientId: string = env.PRODUCT_CLIENT_ID || "";
const productClientSecret: string = env.PRODUCT_CLIENT_SECRET || "";

const program = new commander.Command();
const Logger = require("@ptkdev/logger");
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

program
  .storeOptionsAsProperties(false) // <--- change behaviour
  .passCommandToAction(false); // <--- change behaviour

program
  .version("1.0.0")
  .description("Release notes generator")
  .command("gen")
  .requiredOption("-t, --tag <tag>", "")
  .requiredOption("-s, --space-key <space-key>", "")
  .requiredOption("-p, --project <project>", "")
  .requiredOption("-r, --repository <repository>", "")
  .option("-P, --parent-page <parent-Page>", "")
  .option("--graphql-url <graphql-url>", "")
  .option("--confluence-url <confluence-url>", "")
  .option("--confluence-username <confluence-username>", "")
  .option("--confluence-password <confluence-password>", "")
  .option("--product-token-url <product-token-url>", "")
  .option("--product-client-id <product-client-id>", "")
  .option("--product-client-secret <product-client-secret>", "")
  .action((opts: Options) => {
    logger.info("Starting...");
    new Promise((resolve, reject) => {
      let envConfig: any;
      if (
        !opts.graphqlUrl ||
        !opts.confluencePassword ||
        !opts.confluenceUrl ||
        !opts.confluenceUser ||
        !opts.productClientId ||
        !opts.productClientSecret ||
        !opts.productTokenUrl
      ) {
        if (env) {
          logger.warning(
            "One or more required options are missing. We will use the ones existing in the dotenv file."
          );
          envConfig = {
            tag: opts.tag,
            repository: opts.repository,
            project: opts.project,
            spaceKey: opts.spaceKey,
            graphqlUrl: env.GRAPHQL_URL,
            confluenceUrl: env.CONFLUENCE_URL,
            confluenceUser: env.CONFLUENCE_USER,
            confluencePassword: env.CONFLUENCE_PASSWORD,
            productTokenUrl: env.PRODUCT_TOKEN_URL,
            productClientId: env.PRODUCT_CLIENT_ID,
            productClientSecret: env.PRODUCT_CLIENT_SECRET,
          };
        } else reject("no-config");
      } else envConfig = null;

      if (!opts.parentPage) {
        logger.warning(
          "No parent page was specified. Page will be created at the root of the space."
        );
      }

      const controller: Controller = new Controller(envConfig || opts);
      controller.generateReleaseNote();
    }).catch((error: any) => {
      logger.error(error.message)
    }
    );
  });
program.parse(process.argv);
