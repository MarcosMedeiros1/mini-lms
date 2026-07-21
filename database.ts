import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./lms.sqlite");

db.exec(/*sql*/ `
    PRAGMA foreign_keys = 1;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    PRAGMA cache_size = 2000;
    PRAGMA busy_timeout = 5000;
    PRAGMA temp_store = MEMORY;

    CREATE TABLE IF NOT EXISTS "courses" (
      "id" INTEGER PRIMARY KEY,
      "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS "lessons" (
      "id" INTEGER PRIMARY KEY,
      "course_id" INTEGER NOT NULL,
      "slug" TEXT NOT NULL COLLATE NOCASE,
      "name" TEXT NOT NULL,
      FOREIGN KEY("course_id") REFERENCES "courses" ("id"),
      UNIQUE("course_id", "slug")
    ) STRICT;
  `);

export function createCourse({ slug, name, description }) {
  try {
    return db
      .prepare(
        /*sql*/
        `INSERT OR IGNORE INTO 
        "courses" ("slug", "name", "description") 
      VALUES (?,?,?)`,
      )
      .run(slug, name, description);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function createLesson({ slug, name, courseSlug }) {
  try {
    return db
      .prepare(
        /*sql*/
        `INSERT OR IGNORE INTO 
        "lessons" ("slug", "name", "course_id") 
      VALUES (
        ?,?,
       (SELECT "id" FROM "courses" WHERE "slug" = ?)
      )`,
      )
      .run(slug, name, courseSlug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getCourses() {
  try {
    return db
      .prepare(
        /*sql*/
        `SELECT * FROM "courses"`,
      )
      .all();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getCourseBySlug(slug) {
  try {
    return db
      .prepare(
        /*sql*/
        `SELECT * FROM "courses" WHERE "slug" = ?`,
      )
      .get(slug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getLessonsByCourse(courseSlug) {
  try {
    return db
      .prepare(
        /*sql*/
        `SELECT * FROM "lessons" 
          WHERE "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = ?)`,
      )
      .all(courseSlug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getLesson(slug, courseSlug) {
  try {
    return db
      .prepare(
        /*sql*/
        `SELECT * FROM "lessons" 
          WHERE "slug" = ?
          AND "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = ?)`,
      )
      .get(slug, courseSlug);
  } catch (error) {
    console.log(error);
    return null;
  }
}
