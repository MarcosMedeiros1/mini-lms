import { readFile } from "node:fs/promises";
import { AuthApi } from "./api/auth/index.ts";
import { sha256 } from "./api/auth/utils.ts";
import { LmsApi } from "./api/lms/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";

const core = new Core();

core.router.use([logger]);

new AuthApi(core).init();
new LmsApi(core).init();

core.router.get("/", async (req, res) => {
  const index = await readFile("./front/index.html", "utf-8");
  res.setHeader("Content-type", "text/html; charset=utf-8");
  res.status(200).end(index);
});

core.router.get("/safe", async (req, res) => {
  const sid = req.headers.cookie?.replace("sid=", "");
  if (!sid) {
    throw new RouteError(401, "not authenticated");
  }
  const sid_hashh = sha256(sid);
  const session = core.db
    .query(
      /*sql*/ `
      SELECT "user_id" FROM "sessions" WHERE "sid_hash" = ?
    `,
    )
    .get(sid_hashh);
  if (!session) {
    throw new RouteError(404, "user not found");
  }
  res.status(200).json(session);
});

core.init();
