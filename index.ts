import { Core } from "./core/core.ts";
import { getCourseBySlug } from "./core/database.ts";
import { logger } from "./core/middleware/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";

const core = new Core();

core.router.use([logger]);

core.router.get("/course/:slug", (req, res) => {
  const { slug } = req.params;
  const course = getCourseBySlug(slug);
  if (!course) {
    throw new RouteError(404, "No course found");
  }
  res.status(200).json(course);
});

core.router.get("/", (req, res) => {
  res.status(200).json("hello");
});

core.init();
