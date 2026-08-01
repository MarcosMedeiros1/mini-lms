import { AuthApi } from "./api/auth/index.ts";
import { LmsApi } from "./api/lms/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";

const core = new Core();

core.router.use([logger]);

new AuthApi(core).init();
new LmsApi(core).init();

core.router.get("/course/:slug", (req, res) => {
  const { slug } = req.params;
  const course = core.db
    .query(`SELECT * FROM "courses" WHERE "slug" = ?`)
    .get(slug);
  if (!course) {
    throw new RouteError(404, "No course found");
  }
  res.status(200).json(course);
});

core.router.get("/", (req, res) => {
  res.status(200).json("hello");
});

core.init();
