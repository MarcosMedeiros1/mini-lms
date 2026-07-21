export async function customReq(req) {
  const url = new URL(req.url, "http://localhost:3000");
  req.query = url.searchParams;
  req.pathname = url.pathname;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");

  if (req.headers["content-type"] === "application/json") {
    const safeBody = body.trim();
    req.body = safeBody ? JSON.parse(safeBody) : null;
  } else {
    req.body = body;
  }

  return req;
}
