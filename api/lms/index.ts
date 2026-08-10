import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { type CourseCreate, type LessonCreate, LmsQuery } from "./query.ts";
import { lmsTables, lmsViews } from "./tables.ts";

export class LmsApi extends Api {
  query = new LmsQuery(this.db);
  handlers = {
    postCourse: (req, res) => {
      const writeResult = this.query.insertCourse(req.body as CourseCreate);
      console.log(writeResult);
      if (writeResult.changes === 0) {
        throw new RouteError(400, "Error on create course");
      }
      res.status(201).json({
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
        title: "Course created",
      });
    },

    postLesson: (req, res) => {
      const writeResult = this.query.inertLesson(req.body as LessonCreate);
      console.log(writeResult);
      if (writeResult.changes === 0) {
        throw new RouteError(400, "Error on create lesson");
      }
      res.status(201).json({
        id: writeResult.lastInsertRowid,
        changes: writeResult.changes,
        title: "Lesson created",
      });
    },

    getCourses: (req, res) => {
      const courses = this.query.selectCourses();
      if (courses.length === 0) {
        throw new RouteError(404, "No course found");
      }
      res.status(200).json(courses);
    },

    getCourse: (req, res) => {
      const { slug } = req.params;
      const course = this.query.selectCourse(slug);
      const lessons = this.query.selectLessons(slug);
      if (!course) {
        throw new RouteError(404, "No course found");
      }
      res.status(200).json({ course, lessons });
    },

    getLesson: (req, res) => {
      const { courseSlug, lessonSlug } = req.params;
      const lesson = this.query.selectLesson(courseSlug, lessonSlug);
      const nav = this.query.selectLessonNav(courseSlug, lessonSlug);

      if (!lesson) {
        throw new RouteError(404, "No lesson found");
      }

      const i = nav.findIndex((l) => l.slug === lesson.slug);
      const prev = i === 0 ? null : nav.at(i - 1)?.slug;
      const next = nav.at(i + 1)?.slug ?? null;
      res.status(200).json({ ...lesson, prev, next });
    },
  } satisfies Api["handlers"];

  tables(): void {
    this.db.exec(lmsTables);
    this.db.exec(lmsViews);
  }

  routes(): void {
    this.router.post("/lms/course", this.handlers.postCourse);
    this.router.get("/lms/courses", this.handlers.getCourses);
    this.router.get("/lms/course/:slug", this.handlers.getCourse);
    this.router.post("/lms/lesson", this.handlers.postLesson);
    this.router.get(
      "/lms/lesson/:courseSlug/:lessonSlug",
      this.handlers.getLesson,
    );
  }
}
