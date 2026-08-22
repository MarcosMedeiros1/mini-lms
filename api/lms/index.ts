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

      const userId = 1;
      let completed: {
        lesson_id: number;
        completed: string;
      }[] = [];
      if (userId) {
        completed = this.query.selectLessonsCompleted(userId, course.id);
      }
      res.status(200).json({ course, lessons, completed });
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

      const userId = 1;
      let completed = "";
      if (userId) {
        const lessonCompleted = this.query.selectLessonCompleted(
          userId,
          lesson.id,
        );
        if (lessonCompleted) {
          completed = lessonCompleted.completed;
        }
      }

      res.status(200).json({ ...lesson, prev, next, completed });
    },

    completeLesson: (req, res) => {
      const userId = 1;
      const { courseId, lessonId } = req.body;
      const writeResult = this.query.insertLessonCompleted(
        userId,
        courseId,
        lessonId,
      );

      if (writeResult.changes === 0) {
        throw new RouteError(400, "Error on complete lesson");
      }

      const progress = this.query.selectProgress(userId, courseId);
      const incompleteLessons = progress.filter((p) => !p.completed);
      if (progress.length > 0 && incompleteLessons.length === 0) {
        const certificate = this.query.insertCertificate(userId, courseId);
        if (!certificate) {
          throw new RouteError(400, "Error generating certificate");
        }
        res.status(201).json({
          certificate: certificate.id,
          title: "Lesson completed",
        });
        return;
      }

      res.status(201).json({
        certificate: null,
        title: "Lesson completed",
      });
    },

    resetCourse: (req, res) => {
      const userId = 1;
      const { courseId } = req.body;
      const writeResult = this.query.deleteLessonsCompleted(userId, courseId);

      if (writeResult.changes === 0) {
        throw new RouteError(400, "Error on reset course");
      }
      res.status(200).json({
        title: "Course reset",
      });
    },

    getCertificates: (req, res) => {
      const userId = 1;
      const certificates = this.query.selectCertificates(userId);
      if (certificates.length === 0) {
        throw new RouteError(400, "No certificate found");
      }
      res.status(200).json(certificates);
    },

    getCertificate: (req, res) => {
      const { id } = req.params;
      const certificate = this.query.selectCertificate(id);
      if (!certificate) {
        throw new RouteError(400, "Certificate not found");
      }
      res.status(200).json(certificate);
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
    this.router.delete("/lms/course/reset", this.handlers.resetCourse);
    this.router.post("/lms/lesson", this.handlers.postLesson);
    this.router.get(
      "/lms/lesson/:courseSlug/:lessonSlug",
      this.handlers.getLesson,
    );
    this.router.post("/lms/lesson/complete", this.handlers.completeLesson);
    this.router.get("/lms/certificates", this.handlers.getCertificates);
    this.router.get("/lms/certificate/:id", this.handlers.getCertificate);
  }
}
