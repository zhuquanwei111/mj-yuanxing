import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const prototypePath = new URL("../明镜/1_产品原型/明镜产品原型.html", import.meta.url);
const html = readFileSync(prototypePath, "utf8");
const styleEnd = html.indexOf("</style>");
assert.notEqual(styleEnd, -1, "prototype style block exists");
const css = html.slice(html.indexOf("<style"), styleEnd);
const phase4Start = css.lastIndexOf("/* ===== 阶段四：全页面家族覆盖 ===== */");
const semanticGreenStart = css.indexOf("/* 所有方向共用语义绿");
assert.notEqual(semanticGreenStart, -1, "semantic success colors have a dedicated scope");
const phase4 = css.slice(phase4Start, semanticGreenStart);
const pageSource = html.slice(styleEnd + "</style>".length);

test("phase 4 maps every registered and supplemental route exactly once", () => {
  const registry = html.match(/const PAGES = \{([\s\S]*?)\n\};/);
  assert.ok(registry, "prototype route registry exists");
  const registered = [...registry[1].matchAll(/^\s{2}([A-Z0-9]+):\{/gm)].map((match) => match[1]);
  const expectedRoutes = [...registered, "AI", "P41D", "MY"].sort();
  const matrix = readFileSync(new URL("./page-coverage-stage4-2026-10-10/route-family-matrix.md", import.meta.url), "utf8");
  const mappedRoutes = [...matrix.matchAll(/^\| ([A-Z0-9]+) \|/gm)].map((match) => match[1]).sort();
  assert.equal(expectedRoutes.length, 49, "registered routes plus supplemental views total 49");
  assert.equal(new Set(mappedRoutes).size, mappedRoutes.length, "each route is mapped once");
  assert.deepEqual(mappedRoutes, expectedRoutes, "matrix matches the actual route registry");
});

test("phase 4 adds a mobile visual layer for every non-marker page family", () => {
  assert.ok(phase4.length > 0, "phase 4 family coverage layer exists");
  const familySelectors = [
    ".application-detail", ".guild-overview", ".permission-card", ".platform-priority",
    ".p93-team", ".p23steps", ".handoff-card", ".p30-queue", ".p31-lead",
    ".p32-person", ".p33-person", ".p41-task-record", ".p51-summary", ".p52-summary",
    ".p60-task", ".p62-task", ".p70-platform", ".p71-bill", ".p80-route-card",
    ".p81-timeline", ".p82-review-summary", ".p84-panel", ".p85-status",
    ".chat-event", ".inbox-list", ".aicard",
  ];
  for (const selector of familySelectors) {
    assert.ok(phase4.includes(selector), `phase 4 is missing family treatment ${selector}`);
    assert.ok(css.includes(selector), `page template or stylesheet is missing hook ${selector}`);
  }
  assert.match(phase4, /@media\s*\(max-width:\s*360px\)/i, "narrow phone adjustments exist");
  assert.match(phase4, /:focus-visible/, "keyboard focus remains visible in the family layer");
  assert.match(phase4, /#app\s+input::placeholder[\s\S]*?color:\s*var\(--ink-600\)[\s\S]*?opacity:\s*1/i,
    "input placeholders have readable monochrome contrast on mobile");
  assert.match(phase4, /#mask\s+input::placeholder[\s\S]*?color:\s*var\(--ink-600\)[\s\S]*?opacity:\s*1/i,
    "modal input placeholders keep readable contrast");
});

test("phase 4 family rules stay neutral and their route coverage remains structural", () => {
  for (const [, value] of phase4.matchAll(/#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi)) {
    const rgb = value.length <= 4
      ? [value[0], value[1], value[2]].map((channel) => channel.toLowerCase())
      : [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => channel.toLowerCase());
    assert.equal(rgb[0], rgb[1], "family layer hex colors stay monochrome");
    assert.equal(rgb[1], rgb[2], "family layer hex colors stay monochrome");
  }
  assert.ok(pageSource.includes("function mP20("), "registered routes still have a renderer");
  assert.ok(pageSource.includes("function pageAI("), "supplemental assistant route still has a renderer");
  assert.ok(phase4.includes(".p80-route-card") && phase4.includes(".chat-event"),
    "family-specific selectors cover role routes and message routes");
});
