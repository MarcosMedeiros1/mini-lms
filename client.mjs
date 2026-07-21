const baseUrl = "http://localhost:3000";

await fetch(baseUrl + "/courses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    slug: "html",
    name: "HTML",
    description: "HTML course",
  }),
});

await fetch(baseUrl + "/lessons", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    slug: "arrays",
    name: "Arrays",
    courseSlug: "javascript",
  }),
});

console.log("--- --- GET Courses --- ---");

const courses = await fetch(baseUrl + "/courses").then((r) => r.json());
console.log(courses);

console.log("--- --- GET Course --- ---");

const course = await fetch(baseUrl + "/course?slug=javascript").then((r) =>
  r.json(),
);
console.log(course);

console.log("--- --- GET Lessons --- ---");

const lessons = await fetch(baseUrl + "/lessons?course=javascript").then((r) =>
  r.json(),
);
console.log(lessons);

console.log("--- --- GET Lesson --- ---");

const lesson = await fetch(
  baseUrl + "/lesson?slug=arrays&course=javascript",
).then((r) => r.json());
console.log(lesson);
