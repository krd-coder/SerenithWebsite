import { readFile, writeFile, mkdir } from "node:fs/promises";

await mkdir(new URL("../public/", import.meta.url), { recursive: true });

async function syncAsset(filename, content) {
  const destination = new URL(`../public/${filename}`, import.meta.url);
  let current;
  try {
    current = await readFile(destination);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!current || !content.equals(current)) {
    await writeFile(destination, content);
    console.log(`Updated public/${filename}`);
  }
}

for (const filename of ["logo.svg", "logo_square.svg"]) {
  const logo = await readFile(new URL(`../${filename}`, import.meta.url));
  await syncAsset(filename, logo);

  if (filename === "logo_square.svg") {
    // Keep the white mark readable on both light and dark browser tabs.
    const favicon = logo.toString("utf8").replace(
      /^[\s\S]*?<svg\b[^>]*>/,
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-125 -125 1250 1250"><rect x="-125" y="-125" width="1250" height="1250" rx="240" fill="#070709"/>',
    );
    await syncAsset("favicon.svg", Buffer.from(favicon));
  }
}
