/**
 * Serve the static export the way a static host serves it.
 *
 * The site builds to plain files, so the tests should exercise those files
 * rather than a Next.js server that will not exist in production. Clean URLs
 * are resolved the same way Firebase Hosting resolves them, so a path that
 * works here works there.
 *
 *   node scripts/serve-static.mjs [port] [directory]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] ?? 3217);
const dir = path.resolve(root, process.argv[3] ?? "out");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json"
};

async function readIfFile(candidate) {
  try {
    const info = await stat(candidate);
    if (!info.isFile()) return null;
    return await readFile(candidate);
  } catch {
    return null;
  }
}

/** Resolve a request path the way a static host with clean URLs would. */
async function resolve(pathname) {
  const clean = decodeURIComponent(pathname.split("?")[0]);
  const relative = path.normalize(clean).replace(/^(\.\.[/\\])+/, "");
  const base = path.join(dir, relative);

  // Refuse anything that escapes the export directory.
  if (!base.startsWith(dir)) return null;

  for (const candidate of [
    base,
    `${base}.html`,
    path.join(base, "index.html")
  ]) {
    const body = await readIfFile(candidate);
    if (body) return { body, file: candidate };
  }
  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  const found = await resolve(url.pathname === "/" ? "/index.html" : url.pathname);

  if (!found) {
    const notFound = await readIfFile(path.join(dir, "404.html"));
    response.writeHead(404, { "Content-Type": TYPES[".html"] });
    response.end(notFound ?? "Not found");
    return;
  }

  const extension = path.extname(found.file);
  // The status endpoint exports without an extension but is JSON.
  const type = TYPES[extension] ?? (extension === "" ? TYPES[".json"] : "application/octet-stream");
  response.writeHead(200, { "Content-Type": type });
  response.end(found.body);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${path.relative(root, dir)} on http://127.0.0.1:${port}`);
});
