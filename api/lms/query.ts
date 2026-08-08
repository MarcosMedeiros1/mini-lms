import { Query } from "../../core/utils/abstract.ts";

type CourseData = {
  id: number;
  slug: string;
  title: string;
  description: string;
  lessons: number;
  hours: number;
  created: string;
};

export type CourseCreate = Omit<CourseData, "id" | "created">;

type LessonData = {
  id: number;
  course_id: number;
  slug: string;
  title: string;
  seconds: number;
  video: string;
  description: string;
  order: number;
  free: number;
  created: string;
};

export type LessonCreate = Omit<LessonData, "id" | "course_id" | "created"> & {
  courseSlug: string;
};

export class LmsQuery extends Query {
  insertCourse(data: CourseCreate) {
    const { slug, title, description, lessons, hours } = data;

    return this.db
      .query(
        /*sql*/ `
        INSERT OR IGNORE INTO 
        "courses" ("slug", "title", "description", "lessons", "hours")
        VALUES (?,?,?,?,?)
        `,
      )
      .run(slug, title, description, lessons, hours);
  }

  inertLesson(data: LessonCreate) {
    const {
      courseSlug,
      slug,
      title,
      seconds,
      video,
      description,
      order,
      free,
    } = data;

    return this.db
      .query(
        /*sql*/ `
          INSERT OR IGNORE INTO "lessons" 
          ("course_id", "slug", "title", "seconds",
          "video", "description", "order", "free")
          VALUES ((SELECT "id" FROM "courses" WHERE "slug" = ?),?,?,?,?,?,?,?)`,
      )
      .run(courseSlug, slug, title, seconds, video, description, order, free);
  }

  selectCourses() {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "courses" ORDER BY "created" ASC LIMIT 100`,
      )
      .all() as CourseData[];
  }

  selectCourse(slug: string) {
    return this.db
      .prepare(
        /*sql*/ `
        SELECT * FROM "courses"
        WHERE "slug" = ?`,
      )
      .get(slug) as CourseData | undefined;
  }
}
