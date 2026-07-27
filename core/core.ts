import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { customReq } from "./http/custom-req.ts";
import { customRes } from "./http/custom-res.ts";
import { Router } from "./router.ts";

export class Core {
  router: Router;
  server: Server;

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    const req = await customReq(request);
    const res = customRes(response);

    const matched = this.router.find(req.method || "", req.pathname);

    if (!matched) {
      return res.status(404).end("Not found");
    }

    const { route, params } = matched;
    req.params = params;
    await route(req, res);
  };

  constructor() {
    this.router = new Router();
    this.server = createServer(this.handler);
  }

  init() {
    this.server.listen(3000, () => {
      console.log("Server: http://localhost:3000");
    });
  }
}
