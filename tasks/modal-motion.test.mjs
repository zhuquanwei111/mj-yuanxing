import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const prototypePath = new URL("../明镜/1_产品原型/明镜产品原型.html", import.meta.url);
const html = readFileSync(prototypePath, "utf8");
const styleEnd = html.indexOf("</style>");
assert.notEqual(styleEnd, -1, "prototype style block exists");
const css = html.slice(html.indexOf("<style"), styleEnd);
const scriptStart = html.indexOf("function openModal(html, opts){");
const scriptEnd = html.indexOf("function openMsg(id){", scriptStart);
assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, "modal lifecycle functions exist");
const modalLifecycle = html.slice(scriptStart, scriptEnd);

function expectMatch(source, pattern, message) {
  assert.ok(pattern.test(source), message);
}

test("dialogs and bottom sheets have restrained enter and exit motion", () => {
  expectMatch(css, /\/\* Stage 5: modal motion \*\//, "stage 5 modal motion layer exists");
  expectMatch(css, /\.mask\.is-visible\s*\{[^}]*opacity:\s*1/i, "visible overlays reach full opacity");
  expectMatch(css, /\.mask:not\(\.sheetmask\)\s+\.modal\s*\{[^}]*transform:/i, "dialogs use a subtle transform");
  expectMatch(css, /\.mask\.sheetmask\s+\.modal\s*\{[^}]*translateY\(/i, "sheets enter from below");
  expectMatch(css, /\.mask\.sheetmask\.is-visible\s+\.modal\s*\{[^}]*translateY\(0\)/i, "visible sheets settle into place");
  expectMatch(css, /prefers-reduced-motion\s*:\s*reduce[\s\S]*?\.mask\s*,\s*\.mask\s+\.modal[\s\S]*?transition:\s*none/i, "reduced motion disables overlay transitions");
});

test("modal close keeps the overlay lifecycle active until its exit finishes", () => {
  for (const phase of ["opening", "open", "closing", "closed"]) {
    expectMatch(modalLifecycle, new RegExp(`dataset\\.phase\\s*=\\s*"${phase}"`), `modal enters ${phase} state`);
  }
  expectMatch(modalLifecycle, /transitionend/, "CSS transition completion is observed");
  expectMatch(modalLifecycle, /setTimeout\(/, "a timeout fallback covers missing transition events");
  expectMatch(modalLifecycle, /modalBackground\(false\)/, "background unlock is part of final close");
  expectMatch(modalLifecycle, /target\?\.focus\(\)/, "focus returns after close");
});

test("modal motion preserves focus management, escape, inert background, and reduced motion", () => {
  expectMatch(modalLifecycle, /requestAnimationFrame\(/, "opening is separated into a frame for CSS transitions");
  expectMatch(modalLifecycle, /matchMedia\?\.\("\(prefers-reduced-motion: reduce\)"\)/, "JavaScript honors reduced motion");
  expectMatch(modalLifecycle, /aria-modal/, "dialog semantics remain present");
  expectMatch(modalLifecycle, /modalFocusables\(\)/, "focus stays inside the modal");
  expectMatch(modalLifecycle, /e\.key==="Escape"/, "Escape still closes the modal");
});
