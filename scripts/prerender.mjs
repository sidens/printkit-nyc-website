// Pre-renders each route to static HTML after `vite build`, so crawlers that don't run
// JavaScript (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Bingbot) get real page text
// and every page returns HTTP 200 on GitHub Pages instead of falling through to 404.html.
//
// Output: dist/index.html for "/", dist/<route>.html for the rest. GitHub Pages serves
// /pricing from pricing.html with a 200 and no redirect. dist/404.html stays the plain
// SPA shell for unknown URLs.
//
// To add a page: add its path to ROUTES and to public/sitemap.xml.

import { createServer } from "node:http";
import { readFile, writeFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { chromium } from "playwright";

const ROUTES = ["/", "/pricing", "/faq", "/request"];
const DIST = resolve("dist");
const SHELL = join(DIST, "404.html"); // copy of the unrendered index.html, made by `npm run build`

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// Static server over dist/. Real files are served as-is; every other path gets the SPA shell.
function serve() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = join(DIST, path);
    try {
      if (!(await stat(file)).isFile()) throw new Error("dir");
    } catch {
      file = SHELL;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// index.html carries default title/description/OG tags; react-helmet-async adds per-page
// versions marked data-rh. Drop the defaults wherever a page-specific one exists.
function dedupeHead(html) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  const rhKeys = new Set(
    [...head.matchAll(/<meta[^>]*data-rh="true"[^>]*>/g)].map((m) => {
      const k = m[0].match(/(?:name|property)="([^"]+)"/);
      return k ? k[1] : null;
    }),
  );
  const hasRhCanonical = /<link[^>]*rel="canonical"[^>]*data-rh="true"|<link[^>]*data-rh="true"[^>]*rel="canonical"/.test(head);
  const hasRhTitle = /<title[^>]*data-rh="true"/.test(head);

  let out = head.replace(/<meta(?![^>]*data-rh)[^>]*>/g, (tag) => {
    const k = tag.match(/(?:name|property)="([^"]+)"/);
    return k && rhKeys.has(k[1]) ? "" : tag;
  });
  if (hasRhCanonical) out = out.replace(/<link(?![^>]*data-rh)[^>]*rel="canonical"[^>]*>/g, "");
  if (hasRhTitle) out = out.replace(/<title(?![^>]*data-rh)[^>]*>[\s\S]*?<\/title>/g, "");
  return html.replace(head, out);
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const page = await browser.newPage();

// Keep build-time renders out of Google Analytics and off the network.
await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.abort());

const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

const rendered = new Map();
for (const route of ROUTES) {
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("#root h1"), null, { timeout: 15000 });
  const html = "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML));
  if (!html.includes("</h1>")) throw new Error(`${route}: no <h1> rendered`);
  rendered.set(route, dedupeHead(html));
}

await browser.close();
server.close();

if (errors.length) {
  console.error("Page errors during pre-render:\n" + errors.join("\n"));
  process.exit(1);
}

// Write only after every route rendered, so a failure leaves dist/ untouched.
for (const [route, html] of rendered) {
  const out = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await writeFile(join(DIST, out), html);
  console.log(`prerendered ${route} -> dist/${out} (${(html.length / 1024).toFixed(0)} KB)`);
}
