import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const prototypePath = new URL("../明镜/1_产品原型/明镜产品原型.html", import.meta.url);
const html = readFileSync(prototypePath, "utf8");
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
  .map((match) => match[1])
  .join("\n");

test("button and action control rules do not reduce the 44px touch target", () => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const offenders = rules.flatMap(([, selector, declarations]) => {
    const isAction = /(?:button|\.btn\b|\.fchip\b|\.ptab\b|\.mtabs\b|\.mback\b|\.micbtn2\b|\.plusbtn\b|\.sendround\b)/i.test(selector);
    if (!isAction) return [];
    return [...declarations.matchAll(/min-height\s*:\s*(\d+(?:\.\d+)?)px/gi)]
      .filter(([, value]) => Number(value) < 44)
      .map(([, value]) => `${selector.trim()} (${value}px)`);
  });

  assert.deepEqual(offenders, [], "action control rules below 44px: " + offenders.join(", "));
  assert.doesNotMatch(html, /<button\b[^>]*class="btn p"[^>]*style="[^"]*height\s*:\s*(?:2[0-9]|3[0-9])px/i,
    "toast actions must not reintroduce undersized inline button heights");
});

test("checkbox labels keep a 44px minimum touch target in modals and page content", () => {
  const rule = [...css.matchAll(/\.ckc\s*\{([^}]*)\}/gi)]
    .map(([, declarations]) => declarations)
    .find((declarations) => /display\s*:\s*flex/i.test(declarations));
  assert.ok(rule, "shared checkbox label rule exists");
  assert.match(rule, /min-height\s*:\s*44px/i);
});

test("filter selects keep readable text and a phone-sized touch target", () => {
  const rule = css.match(/\.bar select\s*\{([^}]*)\}/i)?.[1];
  assert.ok(rule, "shared filter select rule exists");
  assert.match(rule, /font-size\s*:\s*16px/i);
  assert.match(rule, /min-height\s*:\s*44px/i);
});

test("shared form and message fields keep readable text and phone-sized targets", () => {
  const rule = css.match(/\.fld select,\.fld input,\.fld textarea,\.bar input,\.chatbar input\s*\{([^}]*)\}/i)?.[1];
  assert.ok(rule, "shared form and message field rule exists");
  assert.match(rule, /font-size\s*:\s*16px/i);
  assert.match(rule, /min-height\s*:\s*44px/i);
});

test("platform, learning, permission, and onboarding tabs wrap without horizontal scrolling", () => {
  const group = css.match(/\.platform-tabs\s*,\s*\.learning-tabs\s*,\s*\.permission-tabs\s*,\s*\.p01-tabs\s*\{([^}]*)\}/i)?.[1];
  const items = css.match(/\.platform-tabs \.ptab\s*,\s*\.learning-tabs \.ptab\s*,\s*\.permission-tabs \.ptab\s*,\s*\.p01-tabs \.ptab\s*\{([^}]*)\}/i)?.[1];
  assert.ok(group, "shared mobile tab group rule exists");
  assert.ok(items, "shared mobile tab item rule exists");
  assert.match(group, /flex-wrap\s*:\s*wrap/i);
  assert.doesNotMatch(group, /overflow-x\s*:\s*(?:auto|scroll)/i);
  assert.doesNotMatch(css, /\.platform-tabs::-webkit-scrollbar|\.learning-tabs::-webkit-scrollbar|\.permission-tabs::-webkit-scrollbar|\.p01-tabs::-webkit-scrollbar/i);
  assert.match(items, /white-space\s*:\s*normal/i);
  assert.match(items, /flex\s*:\s*1\s+1\s+70px/i);
});

test("the product canvas has no horizontal scrolling rules for tabs or table wrappers", () => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  const offenders = rules
    .filter(([, selector, declarations]) =>
      /\.mbody\s+\.ptabs|\.tbwrap|\.platform-tabs|\.learning-tabs|\.permission-tabs|\.p01-tabs/i.test(selector)
      && /overflow-x\s*:\s*(?:auto|scroll)/i.test(declarations))
    .map(([, selector]) => selector.trim());
  assert.deepEqual(offenders, [], "product horizontal scroll rules remain: " + offenders.join(", "));
});

test("collapsible details are confined to the prototype review sidebar", () => {
  const disclosureTags = [...html.matchAll(/<details\b/gi)];
  assert.equal(disclosureTags.length, 1, "business pages should not hide content under title disclosures");
  const surroundingCode = html.slice(Math.max(0, disclosureTags[0].index - 80), disclosureTags[0].index + 80);
  assert.match(surroundingCode, /reviewNotes\.ai/i, "the remaining disclosure is reviewer-only AI notes");
});
