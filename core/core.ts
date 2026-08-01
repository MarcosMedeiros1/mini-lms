import { RouteError } from "@utils/route-error.ts";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { Database } from "./database.ts";
import { customReq } from "./http/custom-req.ts";
import { customRes } from "./http/custom-res.ts";
import { bodyJson } from "./middleware/body-json.ts";
import { Router } from "./router.ts";

export class Core {
  router: Router;
  server: Server;
  db: Database;

  constructor() {
    this.router = new Router();
    this.router.use([bodyJson]);
    this.db = new Database("./lms.sqlite");
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const req = await customReq(request);
      const res = customRes(response);

      for (const middleware of this.router.middlewares) {
        await middleware(req, res);
      }

      const matched = this.router.find(req.method || "", req.pathname);

      if (!matched) {
        throw new RouteError(404, "Not found");
      }

      const { route, params } = matched;
      req.params = params;

      for (const middleware of route.middlewares) {
        await middleware(req, res);
      }
      await route.handler(req, res);
    } catch (error) {
      if (error instanceof RouteError) {
        console.error(
          `${error.status} ${error.message} | ${request.method} ${request.url}`,
        );
        response.statusCode = error.status;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: error.message }),
        );
      } else {
        console.error(error);
        response.statusCode = 500;
        response.setHeader("content-type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: "error" }),
        );
      }
    }
  };

  init() {
    this.server.listen(3000, () => {
      console.log("Server: http://localhost:3000");
    });
  }
}
