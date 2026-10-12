import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const prototypePath = new URL("../明镜/1_产品原型/明镜产品原型.html", import.meta.url);
const html = readFileSync(prototypePath, "utf8");
const greenStart = html.indexOf("/* 所有方向共用语义绿");
const greenEnd = html.indexOf("/* ===== 运营工作区", greenStart);
const styleEnd = html.indexOf("</style>");
assert.notEqual(greenStart, -1, "semantic green style block exists");
assert.notEqual(greenEnd, -1, "semantic green style block has a clear end");
assert.notEqual(styleEnd, -1, "prototype stylesheet exists");
const tokenStart = html.indexOf("/* ===== T17.3 shared design tokens ===== */");
const tokenEnd = html.indexOf("/* ===== End T17.3 shared design tokens ===== */", tokenStart);
assert.ok(tokenStart >= 0 && tokenEnd > tokenStart, "shared color tokens exist");
const tokenCss = html.slice(tokenStart, tokenEnd);
const greenCss = html.slice(greenStart, greenEnd);
const bootScript = html.match(/<script>\s*\(\(\) => \{\s*const mode = new URLSearchParams\(location\.search\)\.get\("color-preview"\);[\s\S]*?\}\)\(\);\s*<\/script>/)?.[0]
  .replace(/^<script>/, "")
  .replace(/<\/script>$/, "");
assert.ok(bootScript, "color boot script exists in the document head");

function rootColorMode(search = "") {
  const document = { documentElement: { dataset: {} } };
  runInNewContext(bootScript, { URLSearchParams, location: { search }, document });
  return document.documentElement.dataset;
}

test("the default prototype keeps the neutral primary and applies semantic green", () => {
  assert.deepEqual({ ...rootColorMode() }, {
    colorPreview: "A",
    colorPreviewGreen: "true",
  });
  assert.deepEqual({ ...rootColorMode("?color-preview=A") }, {
    colorPreview: "A",
  }, "A-only comparison remains available without green success semantics");
  assert.deepEqual({ ...rootColorMode("?color-preview=A-green") }, {
    colorPreview: "A",
    colorPreviewGreen: "true",
  }, "the existing green preview link remains compatible");
});

test("the primary remains neutral and risk and warning use their semantic tokens", () => {
  assert.match(tokenCss, /--color-primary:#111111/);
  assert.match(tokenCss, /--color-success:#2F765F/);
  assert.match(tokenCss, /--color-success-soft:#EEF6F1/);
  assert.match(tokenCss, /--color-risk:#A33D3D/);
  assert.match(tokenCss, /--color-risk-soft:#FAF0F0/);
  assert.match(tokenCss, /--color-warning:#806216/);
  assert.match(tokenCss, /--color-warning-soft:#FAF6EA/);
  assert.doesNotMatch(html, /#70517C|#60446B|#F3EFF6|#806A89/i,
    "the withdrawn purple direction is removed from the prototype");
  assert.match(html, /#app \.badge\.dg,[^{]+\{color:var\(--color-risk\)!important\}/);
  assert.match(html, /#app \.badge\.warn,[^{]+\{color:var\(--color-warning\)!important\}/);
  assert.ok(html.includes('class="ops-status ${t.lv==="danger"?"danger":t.lv==="warn"?"warn":""}"'),
    "todo rows expose their existing risk level to semantic color styles");
  assert.ok(html.includes('class="ops-kicker ${t.lv==="danger"?"danger":""}"'),
    "priority headlines expose their existing risk level to semantic color styles");
});

test("semantic green is limited to success, live, progress, and positive trends", () => {
  assert.ok(greenCss.includes("#2F765F"), "deep green success token exists");
  const uncommentedGreenCss = greenCss.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selector] of uncommentedGreenCss.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    assert.match(selector.trim(), /^html\[data-color-preview-green="true"\]/,
      "every green rule requires the semantic-green root attribute");
  }
  for (const hook of [".badge.ok", ".livedot", ".p20-progress-fill", ".p42-result.passed",
    ".kpi .d.up", ".snums .n .v.up", ".p93-team-trend"]) {
    assert.ok(greenCss.includes(hook), `green semantic mapping is missing ${hook}`);
  }
  assert.doesNotMatch(greenCss, /\.badge\.ok\s*\{[^}]*background\s*:/,
    "success labels stay text-only without green button or nested-box fills");
});
