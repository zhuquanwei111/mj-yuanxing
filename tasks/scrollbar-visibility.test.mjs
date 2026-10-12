import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

test('all prototype pages hide vertical and horizontal scrollbars without disabling scroll', () => {
  assert.match(html, /html,body,\*\{scrollbar-width:none!important;-ms-overflow-style:none!important\}/,
    'Firefox and legacy Microsoft browsers hide scrollbars on every element');
  assert.match(html, /\*::-webkit-scrollbar\{display:none!important;width:0!important;height:0!important;background:transparent\}/,
    'WebKit browsers hide both scrollbar axes on every element');
  assert.match(html, /\.mbody\{[^}]*overflow-y:auto/,
    'long page content remains vertically scrollable');
  assert.match(html, /\.m21-filters\{[^}]*overflow-x:auto/,
    'the long singer filter remains horizontally scrollable');
  assert.doesNotMatch(html, /html,body,\*\{[^}]*overflow:\s*hidden/i,
    'the global scrollbar rule must not disable scrolling');
});
