import { EnvType, load } from "ts-dotenv";

export type Env = EnvType<typeof schema>;

export const schema = {
  GRAPHQL_URL: String,
  CONFLUENCE_URL: String,
  CONFLUENCE_USER: String,
  CONFLUENCE_PASSWORD: String,
  PRODUCT_TOKEN_URL: String,
  PRODUCT_CLIENT_ID: String,
  PRODUCT_CLIENT_SECRET: String,
};

export let env: Env;
export function loadEnv(): void {
  env = load(schema);
}
