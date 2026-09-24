# Mini LMS

A small learning project built with Node.js and TypeScript to explore how to create a lightweight LMS backend from scratch.

This project is a custom HTTP server with SQLite storage, session-based authentication, course/lesson APIs, and certificate tracking. It is intentionally simple and educational rather than production-ready.

## What this project does

- Creates a minimal Node.js server without a framework
- Uses SQLite for persistence
- Implements basic user registration and login
- Stores authenticated sessions in the database
- Handles course and lesson data
- Tracks lesson completion and generated certificates
- Serves a tiny front-end page for login checks

## Tech stack

- Node.js
- TypeScript
- SQLite via Node's built-in sqlite API
- Custom router and middleware layers

## Project structure

```text
mini-lms/
├── api/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── query.ts
│   │   ├── tables.ts
│   │   ├── utils.ts
│   │   └── services/
│   │       └── session.ts
│   └── lms/
│       ├── index.ts
│       ├── query.ts
│       └── tables.ts
├── core/
│   ├── core.ts
│   ├── database.ts
│   ├── router.ts
│   ├── http/
│   ├── middleware/
│   └── utils/
├── front/
│   └── index.html
├── index.ts
├── package.json
├── tsconfig.json
├── lms.sqlite
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20+ recommended
- A terminal

### Install dependencies

```bash
npm install
```

### Run the app

```bash
node --watch index.ts
```

The server starts on:

```text
http://localhost:3000
```

## Main routes

### Auth

- `POST /auth/user` — create a user
- `POST /auth/login` — log in a user and create a secure session cookie
- `GET /safe` — check whether the user is authenticated

### LMS

- `POST /lms/course` — create a course
- `GET /lms/courses` — list all courses
- `GET /lms/course/:slug` — get a course with its lessons
- `POST /lms/lesson` — create a lesson
- `GET /lms/lesson/:courseSlug/:lessonSlug` — get one lesson and navigation info
- `POST /lms/lesson/complete` — mark a lesson as complete
- `DELETE /lms/course/reset` — reset lesson completion for a course
- `GET /lms/certificates` — list user certificates
- `GET /lms/certificate/:id` — get one certificate

## Example requests

### Create a user

```bash
curl -X POST http://localhost:3000/auth/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "username": "jane",
    "email": "jane@example.com",
    "password": "secret123"
  }'
```

### Log in

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secret123"
  }'
```

### List courses

```bash
curl http://localhost:3000/lms/courses
```

## Notes

- This is a learning-focused project meant to practice server-side JavaScript and backend concepts.
- The authentication flow is intentionally simple and inspired by custom API design rather than a framework-based app.
- The codebase is a good reference for understanding custom routing, middleware, SQLite data modeling, and session handling in Node.js.

## Future ideas

- Add better validation and input sanitization
- Use hashed passwords instead of plain-text password storage
- Add middleware for authentication checks on LMS routes
- Add admin-only actions
- Build a richer front-end client
- Add tests for API flows

## License

This project is for learning and experimentation, so no formal production license is included.
