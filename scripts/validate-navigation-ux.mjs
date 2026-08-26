import assert from "node:assert/strict";
import fs from "node:fs";

const pages = [
  "index.html",
  "presentes-canaa.html",
  "presentes-canaa-dos-carajas/index.html",
  "buques-canaa-dos-carajas/index.html",
  "cestas-de-presente-canaa/index.html",
  "cesta-de-aniversario-canaa/index.html",
  "floricultura-canaa-dos-carajas/index.html",
  "cesta-cafe-da-manha-canaa/index.html",
  "presentes-romanticos-canaa/index.html",
  "rosas-perfumadas-canaa/index.html"
];

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const nav = html.match(/<ul class="nav-menu" id="nav-menu">([\s\S]*?)<\/ul>/)?.[1] || "";
  const links = nav.match(/<li><a\b/g) || [];
  const current = nav.match(/aria-current="page"/g) || [];

  assert.ok(nav, `${page}: menu principal ausente`);
  assert.equal(links.length, 6, `${page}: o menu principal deve ter seis opções`);
  assert.ok(html.includes('aria-controls="nav-menu"'), `${page}: botão sem aria-controls`);
  assert.ok(current.length <= 1, `${page}: mais de uma opção marcada como atual`);
}

const home = fs.readFileSync("index.html", "utf8");
const whatsappLinks = [...home.matchAll(/<a\b[^>]*href="https:\/\/wa\.me\/[^\"]+"[^>]*>/g)].map((match) => match[0]);
assert.ok(whatsappLinks.length > 0, "Home sem links de WhatsApp");
assert.ok(whatsappLinks.every((link) => link.includes('data-track="whatsapp"')), "Todo link de WhatsApp da Home deve ser mensurável");

const css = fs.readFileSync("assets/css/style.css", "utf8");
const desktopNav = css.match(/@media \(min-width: 1100px\) \{[\s\S]*?\.nav-menu \{[\s\S]*?display: flex !important;/);
assert.ok(desktopNav, "O menu desktop deve iniciar somente em telas largas");

console.log(`Navigation UX validation ok: ${pages.length} pages, six-item menu, accessible control and tracked Home WhatsApp links.`);
