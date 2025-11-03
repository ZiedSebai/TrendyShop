import { createApp } from './backend/src/main';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    const server = await createApp();
    cachedServer = server;
  }

  return cachedServer(req, res);
}
