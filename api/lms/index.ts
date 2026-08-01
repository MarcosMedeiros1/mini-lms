import { Api } from "../../core/utils/abstract.ts";
import { RouteError } from "../../core/utils/route-error.ts";
import { lmsTables, lmsViews } from "./tables.ts";

export class LmsApi extends Api {
  handlers = {
    postCourses: (req, res) => {
      const { slug, title, description, lessons, hours } = req.body;
      const writeResult = this.db
        .query(
          /*sql*/ `
        INSERT OR IGNORE INTO 
        "courses" ("slug", "title", "description", "lessons", "hours")
        VALUES (?,?,?,?,?)
      `,
        )
        .run(slug, title, description, lessons, hours);
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
  } satisfies Api["handlers"];

  tables(): void {
    this.db.exec(lmsTables);
    this.db.exec(lmsViews);
  }

  routes(): void {
    this.router.post("/lms/courses", this.handlers.postCourses);
  }
}
