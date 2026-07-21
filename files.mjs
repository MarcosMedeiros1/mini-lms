import fs from "node:fs/promises";

try {
  await fs.mkdir("./products");
} catch (err) {
  console.log("Folder already exists.");
}

fs.writeFile(
  "./products/mouse.json",
  JSON.stringify({
    name: "MX Vertical",
    brand: "Logitech",
    price: 500,
  }),
);

const data = await fs.readFile("./products/mouse.json", "utf-8");
console.log(data);

const dir = await fs.readdir("./products", { recursive: true });
console.log(dir.filter((file) => file.endsWith(".json")));
