import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const prototypePath = new URL("../明镜/1_产品原型/明镜产品原型.html", import.meta.url);
const html = readFileSync(prototypePath, "utf8");
const styleEnd = html.indexOf("</style>");
assert.notEqual(styleEnd, -1, "prototype style block exists");
const css = html.slice(html.indexOf("<style"), styleEnd);
const tokenStart = css.indexOf("/* ===== T17.3 shared design tokens ===== */");
assert.notEqual(tokenStart, -1, "shared design tokens are in the stylesheet");
const tokenEnd = css.indexOf("/* ===== End T17.3 shared design tokens ===== */", tokenStart);
assert.ok(tokenEnd > tokenStart, "shared design token block is complete");
const designTokens = css.slice(tokenStart, tokenEnd);
const semanticGreenStart = css.indexOf("/* 所有方向共用语义绿");
assert.notEqual(semanticGreenStart, -1, "the success color exception is scoped explicitly");
const baseCss = css.slice(0, semanticGreenStart);
const pageSource = html.slice(styleEnd + "</style>".length);

test("phase 3 keeps neutral foundations and P51's approved progress colors", () => {
  const phase3 = css.slice(css.lastIndexOf("/* ===== 阶段三"));
  assert.ok(designTokens.includes("--color-neutral-0:#FFFFFF"), "white is the page surface");
  assert.ok(designTokens.includes("--color-primary:#111111"), "black is the neutral primary");
  assert.ok(designTokens.includes("--color-success:#2F765F"), "success uses the approved semantic green");
  assert.ok(designTokens.includes("--color-warning:#806216"), "warning keeps its semantic gold");
  assert.ok(designTokens.includes("--color-risk:#A33D3D"), "risk keeps its semantic red");
  assert.ok(/#app button[^{]*\{[^}]*min-height:\s*48px/i.test(css), "buttons have a 48px touch target");
  assert.ok(/#app button\.btn\.p[^{]*\{[^}]*background:\s*var\(--accent-600\)/i.test(css), "primary buttons use the black token");
  assert.ok(/#app button:focus-visible[^{]*\{[^}]*outline:/i.test(css), "keyboard focus is visible");
  assert.ok(/prefers-reduced-motion/i.test(css), "reduced motion is respected");
  assert.ok(/#app svg\s*\{filter:\s*grayscale\(1\)\}/i.test(phase3), "SVG accents are rendered in grayscale");
  assert.ok(/\[style\*="D9A441"\]/i.test(phase3), "legacy inline status accents are neutralized");
  assert.match(baseCss, /\.p51-order\{--p51-current:#426579;--p51-complete:#2F765F;/i,
    "P51 is the sole explicit current/completed workflow color exception");
  const neutralFoundation = baseCss.replace(
    ".p51-order{--p51-current:#426579;--p51-complete:#2F765F;",
    ".p51-order{--p51-current:#666666;--p51-complete:#666666;",
  );
  for (const [, value] of neutralFoundation.matchAll(/#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi)) {
    const rgb = value.length <= 4
      ? [value[0], value[1], value[2]].map((channel) => channel.toLowerCase())
      : [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => channel.toLowerCase());
    assert.equal(rgb[0], rgb[1], "the pre-token foundation uses neutral hex colors");
    assert.equal(rgb[1], rgb[2], "the pre-token foundation uses neutral hex colors");
  }
  for (const [, r, g, b] of neutralFoundation.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
    assert.equal(r, g, "the pre-token foundation uses neutral RGB colors");
    assert.equal(g, b, "the pre-token foundation uses neutral RGB colors");
  }
});

test("the button specimen reflects the monochrome palette", () => {
  const specimen = readFileSync(new URL("./design-system-stage2-2026-10-10/button-specimen.html", import.meta.url), "utf8");
  assert.match(specimen, /--accent-600:\s*#171717/i);
  assert.match(specimen, /--neutral-100:\s*#F2F2F2/i);
  assert.match(specimen, /--neutral-700:\s*#444444/i);
  assert.doesNotMatch(specimen, /mint-|warm|#2f765f|#235f4b|薄荷绿|陶土橙|桃杏/i);
  const specimenCss = specimen.slice(specimen.indexOf("<style"), specimen.indexOf("</style>"));
  for (const [, r, g, b] of specimenCss.matchAll(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/gi)) {
    assert.equal(r.toLowerCase(), g.toLowerCase(), "specimen hex colors are monochrome");
    assert.equal(g.toLowerCase(), b.toLowerCase(), "specimen hex colors are monochrome");
  }
  for (const [, r, g, b] of specimenCss.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)) {
    assert.equal(r, g, "specimen RGB colors are monochrome");
    assert.equal(g, b, "specimen RGB colors are monochrome");
  }
});

test("the ten marker pages receive reusable structure and visual treatment", () => {
  const markers = [
    ".p00v2", ".p20-overview-hero", ".p20-toolbar", ".segview", ".fchip",
    ".ptabs", ".setup-stepper", ".onboarding-card", ".material-choice",
    ".myspace", ".my-identity", ".p42-result", ".p15-cause", ".p50-date-picker",
    ".p50-job", ".p61-task-summary", ".p61-script-card",
  ];
  for (const marker of markers) assert.ok(css.includes(marker), `missing marker page rule ${marker}`);
});

test("the final phase 3 stylesheet contains each marker-page treatment", () => {
  const phase3 = css.slice(css.lastIndexOf("/* ===== 阶段三"));
  const selectors = [
    "#app .p00v2 button.rcard", "#app .p20-overview-hero", "#app .ptabs",
    "#app .onboarding-card", "#app .my-identity", "#app .p42-result",
    "#app [data-warning-id]", "#app .p50-date-picker", "#app .p61-task-summary",
  ];
  for (const selector of selectors) {
    assert.ok(phase3.includes(selector), "missing phase 3 treatment " + selector);
  }
  assert.doesNotMatch(phase3, /#app\s+\.p21-search\b/, "phase 3 does not keep an unused P21 search selector");
});

test("all ten marker-page templates contain their matching visual hooks", () => {
  const pages = [
    ["P00", ["function pageP00(", "p00v2", "pickRole("], ["#app .p00v2 button.rcard", "#app .p00-links"]],
    ["P20", ["function mP20(", "p20-overview", "p20-overview-hero"], ["#app .p20-toolbar", "#app .p20-overview-hero"]],
    ["P21", ["function mP21(", "function p21RosterBody(", "function p21FeedBody("], ["#app .segview", "#app .fchip"]],
    ["P22", ["function p22Head(", "id=\"p22body\""], ["#app .ptabs", "#app .focusrec"]],
    ["P10", ["setup-stepper", "onboarding-card", "material-choice"], ["#app .setup-stepper", "#app .material-choice"]],
    ["MY", ["myIdentityCard(", "my-work-entries"], ["#app .my-identity", "#app .my-work-entries"]],
    ["P42", ["p42-result", "安排补考"], ["#app .p42-result"]],
    ["P15", ["data-warning-id", "p15-cause"], ["#app [data-warning-id]", "#app .p15-cause"]],
    ["P50", ["p50-date-picker", "p50-day", "p50-job"], ["#app .p50-date-picker", "#app .p50-job"]],
    ["P61", ["p61-task-summary", "p61-script-card", "p61-script-section"], ["#app .p61-task-summary", "#app .p61-script-card"]],
  ];
  assert.equal(pages.length, 10);
  for (const [page, templateHooks, styleHooks] of pages) {
    for (const hook of templateHooks) assert.ok(pageSource.includes(hook), `${page} template is missing ${hook}`);
    for (const hook of styleHooks) assert.ok(css.includes(hook), `${page} stylesheet is missing ${hook}`);
  }
});

test("P00 renders the current ungrouped identity rows without introducing role categories", () => {
  const start = pageSource.indexOf("function pageP00(");
  const end = pageSource.indexOf("\n}", start);
  assert.ok(start >= 0 && end > start, "P00 renderer exists");
  const roles = {
    yunying: { n: "运营", one: "运营工作", cls: "ops", av: "运" },
    streamer: { n: "主播", one: "直播工作", cls: "stream", av: "主" },
  };
  const sandbox = { ROLES: roles, esc: value => String(value) };
  vm.runInNewContext(`${pageSource.slice(start, end + 2)}\nglobalThis.render=pageP00;`, sandbox);
  const output = sandbox.render();

  assert.match(output, /class="p00v2"/);
  assert.equal((output.match(/class="rcard"/g) || []).length, Object.keys(roles).length);
  assert.match(output, /onclick="pickRole\('yunying'\)"/);
  assert.match(output, /onclick="pickRole\('streamer'\)"/);
  assert.doesNotMatch(output, /p00-group|公会经营|运营与成长/);
});
