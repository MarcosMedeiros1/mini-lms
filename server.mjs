import fs from "node:fs/promises";
import { createServer } from "node:http";
import { customReq } from "./custom-req.mjs";
import { customRes } from "./custom-res.mjs";
import { Router } from "./router.mjs";

const router = new Router();

router.post("/products", postProduct);
router.get("/products", getProducts);
router.get("/product", getProduct);

async function postProduct(req, res) {
  const { category, slug } = req.body;
  try {
    await fs.mkdir(`./products/${category}`, { recursive: true });
  } catch (error) {
    console.error("Error: ", error);
  }
  try {
    await fs.writeFile(
      `./products/${category}/${slug}.json`,
      JSON.stringify(req.body),
      { recursive: true },
    );
    res.status(201).end("Product created: " + JSON.stringify(req.body));
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).end("Error");
  }
}

async function getProducts(_, res) {
  try {
    const files = await fs.readdir("./products", { recursive: true });
    const productsFiles = files.filter((file) => file.endsWith(".json"));
    const promises = productsFiles.map((product) =>
      fs.readFile(`./products/${product}`, "utf-8"),
    );
    const productsData = await Promise.all(promises);
    const products = productsData.map(JSON.parse);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).end("Error");
  }
}

async function getProduct(req, res) {
  let category = req.query.get("category");
  let slug = req.query.get("slug");
  let product = null;

  if (!category || !slug) {
    return res.status(400).end("Missing category or slug query parameters");
  }

  try {
    product = await fs.readFile(`./products/${category}/${slug}.json`, "utf-8");
    product = JSON.parse(product);
    res.status(200).end("Product: " + JSON.stringify(product));
  } catch (error) {
    console.error("Error: ", error);
    res.status(404).end("Product not found");
  }
}

const server = createServer(async (request, response) => {
  const req = await customReq(request);
  const res = customRes(response);

  const handler = router.find(req.method, req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end("Not found");
  }
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
