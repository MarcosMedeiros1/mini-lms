import type { IncomingMessage } from "node:http";

export interface CustomRequest extends IncomingMessage {
  query: URLSearchParams;
  pathname: string;
  body: Record<string, any>;
}

export async function customReq(request: IncomingMessage) {
  const req = request as CustomRequest;
  const url = new URL(req.url || "", "http://localhost:3000");
  req.query = url.searchParams;
  req.pathname = url.pathname;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  if (req.headers["content-type"] === "application/json") {
    const safeBody = body.trim();
    req.body = safeBody ? JSON.parse(safeBody) : null;
  } else {
    req.body = {};
  }

  return req;
}
