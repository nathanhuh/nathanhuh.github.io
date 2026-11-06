import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const routes = JSON.parse(await readFile("src/_data/legacyRoutes.json", "utf8"));
const origin = process.argv[2];

async function readRoute(route, status = 200) {
    if (origin) {
        const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
        assert.equal(response.status, status, route);
        return Buffer.from(await response.arrayBuffer());
    }

    const filename = join("_site", route, route.endsWith("/") ? "index.html" : "");
    if (status === 404) {
        await assert.rejects(readFile(filename), { code: "ENOENT" }, route);
        return readFile("_site/404.html");
    }
    return readFile(filename);
}

for (const { from, to } of routes.redirects) {
    const page = (await readRoute(from)).toString();
    for (const marker of [
        `http-equiv="refresh" content="0; url=${to}"`,
        `rel="canonical" href="https://nathanhuh.com${to}"`,
        `<a href="${to}">`,
    ]) {
        assert.ok(page.includes(marker), `${from} is missing ${marker}`);
    }
    assert.ok((await readRoute(to)).includes("<h1"), `Missing page at ${to}`);
}

for (const { from, to } of routes.assets) {
    const file = await readRoute(to);
    assert.ok(file.length > 0 && (await readRoute(from)).equals(file), `Invalid asset at ${from}`);
}

assert.ok((await readRoute("/index.html")).equals(await readRoute("/")), "Legacy home page");
for (const route of [...routes.retired, "/missing/nat-19-check/"]) {
    const page = await readRoute(route, 404);
    assert.ok(page.includes(">Page not found</h1>") && page.includes('href="/"'),
        `Missing custom 404 at ${route}`);
}
console.log(`Legacy pages, assets, and 404s passed on ${origin || "_site"}.`);
