import { RouteError } from "@utils/route-error.ts";
import { ProductsApi } from "./api/products/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";

const core = new Core();

core.router.use([logger]);

new ProductsApi(core).init();

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
