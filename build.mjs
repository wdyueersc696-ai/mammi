import { build } from "esbuild";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
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
const styles = ["src/globals.css", "src/dialogs.css", "src/lookbook.css", "src/product-facts.css", "src/reference-theme.css", "src/commerce.css", "src/cart-drawer.css", "src/checkout.css", "src/delivery.css", "src/payment-print.css"];
const versionHash = createHash("sha256");
for (const file of ["assets/storefront.js", ...styles, "src/drawer.css", "src/scene.css", "src/prichudy.css", "src/snowfall.css", "fonts/yeseva-one.css", "fonts/lt-remark-regular.otf"]) {
  versionHash.update(await readFile(new URL(file, import.meta.url)));
}
const version = versionHash.digest("hex").slice(0, 12);
const pages = [
  { page: "home", file: "index.html", title: "Причуды — варежки и чехлы на коляску", description: "Коллекция «Причуды»: семь расцветок женских варежек и пять расцветок зимних чехлов на коляску. Размеры, материалы и образы для прогулок." },
  { page: "cart", file: "cart.html", title: "Корзина — Причуды", description: "Ваши Причуды: корзина, способы доставки и оформление покупки." },
  { page: "delivery", file: "delivery.html", title: "Доставка и оплата — Причуды", description: "Доставка Причуд по России, Санкт-Петербургу и Беларуси. Способы получения, оплата и связь с нами." },
  { page: "returns", file: "returns.html", title: "Возврат и обмен — Причуды", description: "Как вернуть варежки или чехол, обменять принт и сообщить о недостатке. Сроки, обратная доставка и почта магазина." },
  { page: "privacy", file: "privacy.html", title: "Обработка данных — Причуды", description: "Как сайт Причуды хранит корзину, использует cookie и работает с данными." },
];
for (const page of pages) {
const content = renderToString(createElement(compiled.exports.default, {page: page.page}));
await writeFile(new URL(page.file, import.meta.url), `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#612731">
<meta name="description" content="${page.description}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${page.title}</title>
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="./fonts/inter.css">
<link rel="preload" href="./fonts/yeseva-one-cyrillic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="./fonts/yeseva-one.css">
${styles.map(file => `<link rel="stylesheet" href="./${file}?v=${version}">`).join("\n")}
<script defer src="./assets/storefront.js?v=${version}"></script>
</head><body data-page="${page.page}"><div id="storefront">${content}</div><noscript>Для выбора товаров и работы корзины включите JavaScript. По вопросам покупки: +7 967 625-32-41.</noscript></body></html>\n`);
}
