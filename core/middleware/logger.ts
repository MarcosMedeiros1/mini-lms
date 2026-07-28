import type { Middleware } from "../router.ts";

export const logger: Middleware = (req, res) => {
  console.log(`${Date.now()} ${req.method} ${req.pathname}`);
};
