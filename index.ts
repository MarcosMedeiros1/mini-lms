import { Core } from "./core/core.ts";

const core = new Core();

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
