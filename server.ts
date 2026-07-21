import { createServer } from "node:http";
import { customReq } from "./custom-req.ts";
import { customRes } from "./custom-res.ts";
import {
  createCourse,
  createLesson,
  getCourseBySlug,
  getCourses,
  getLesson,
  getLessonsByCourse,
} from "./database.ts";
import { Router } from "./router.ts";

const router = new Router();

router.post("/courses", (req, res) => {
  const { slug, name, description } = req.body ?? {};
  const created = createCourse({ slug, name, description });

  if (created) {
    res.status(201).json("Created course");
  } else {
    res.status(400).json("Failed to create course");
  }
});

router.post("/lessons", (req, res) => {
  const { slug, name, courseSlug } = req.body ?? {};
  const created = createLesson({ slug, name, courseSlug });

  if (created) {
    res.status(201).json("Created lesson");
  } else {
    res.status(400).json("Failed to create lesson");
  }
});

router.get("/courses", (req, res) => {
  const courses = getCourses();
  if (courses && courses.length) {
    res.status(200).json(courses);
  } else {
    res.status(400).json("Failed to find courses");
  }
});

router.get("/course", (req, res) => {
  const slug = req.query.get("slug");
  const course = getCourseBySlug(slug);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(400).json("No course found");
  }
});

router.get("/lessons", (req, res) => {
  const courseSlug = req.query.get("course");
  const lessons = getLessonsByCourse(courseSlug);
  if (lessons) {
    res.status(200).json(lessons);
  } else {
    res.status(400).json("Failed to find lessons");
  }
});

router.get("/lesson", (req, res) => {
  const slug = req.query.get("slug");
  const courseSlug = req.query.get("course");
  const lesson = getLesson(slug, courseSlug);
  if (lesson) {
    res.status(200).json(lesson);
  } else {
    res.status(400).json("Failed to find lesson");
  }
});

const server = createServer(async (request, response) => {
  const req = await customReq(request);
  const res = customRes(response);

  const handler = router.find(req.method, req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
