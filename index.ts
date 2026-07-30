import { Core } from "./core/core.ts";
import { logger } from "./core/middleware/logger.ts";

const core = new Core();

core.router.use([logger]);

core.router.get("/course/:slug", (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  // const course = getCourseBySlug(slug);
  // if (course) {
  //   res.status(200).json(course);
  // } else {
  //   res.status(400).json("No course found");
  // }
});

core.router.get("/", (req, res) => {
  res.status(200).json("hello");
});

core.init();
