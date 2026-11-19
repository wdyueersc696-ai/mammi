import { build } from "esbuild";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./", import.meta.url));
const require = createRequire(import.meta.url);
const common = {
  absWorkingDir: root, bundle: true, jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
};
await mkdir(new URL("./assets/", import.meta.url), { recursive: true });
await build({
  ...common, entryPoints: ["src/entry.tsx"], outfile: "assets/storefront.js",
  minify: true, target: ["es2020"], legalComments: "linked",
});

const serverBundle = await build({
  ...common, entryPoints: ["src/Storefront.tsx"], write: false,
  platform: "node", format: "cjs", packages: "external",
});
const compiled = { exports: {} };
new Function("require", "module", "exports", serverBundle.outputFiles[0].text)(require, compiled, compiled.exports);
const content = renderToString(createElement(compiled.exports.default));
await writeFile(new URL("./index.html", import.meta.url), `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ad3728">
<meta name="description" content="Коллекция mammi. Женские варежки и зимние чехлы на коляску в четырёх принтах.">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>mammi — варежки и чехлы на коляску</title>
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="./fonts/inter.css">
<link rel="stylesheet" href="./src/globals.css">
<link rel="stylesheet" href="./src/dialogs.css">
<script defer src="./assets/storefront.js"></script>
</head><body><div id="storefront">${content}</div><noscript>Для переключения принтов и просмотра формы включите JavaScript.</noscript></body></html>\n`);
