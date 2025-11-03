import { createApp } from "src/main";

let cachedServer: any;

export default async function handler(req, res) {
  if (!cachedServer) {
    const server = await createApp();
    cachedServer = server;
  }
  return cachedServer(req, res);
}
