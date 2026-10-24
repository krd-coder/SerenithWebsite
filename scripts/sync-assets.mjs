import { readFile, writeFile, mkdir } from "node:fs/promises";

const source = new URL("../logo.svg", import.meta.url);
const destination = new URL("../public/logo.svg", import.meta.url);
const logo = await readFile(source);
await mkdir(new URL("../public/", import.meta.url), { recursive: true });
let current;
try {
  current = await readFile(destination);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (!current || !logo.equals(current)) {
  await writeFile(destination, logo);
  console.log("Updated public/logo.svg from the source logo.svg");
}
