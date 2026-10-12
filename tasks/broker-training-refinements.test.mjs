import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const start = html.indexOf('function pageP30(){');
const end = html.indexOf('function pageP30D(', start);
assert.ok(start >= 0 && end > start, 'P30 renderer remains extractable');

function renderP30Today(){
  const context = {
    ST: { p30view: 'today' },
    VISITS: [{sid:'miaomiao',sname:'喵喵',kind:'情绪回访',why:'情绪预警第2次，今天必须当面聊一次',nextStep:'当面聊一次',due:'今天',st:'wait',last:'昨天 微信'}],
    VISITHIST: [], LEADS: [],
    pageHead: () => '', segView: () => '', sectHead: () => '',
    esc: value => String(value), emptyRow: () => '',
  };
  vm.runInNewContext(`${html.slice(start, end)}\nglobalThis.render=pageP30;`, context);
  return context.render();
}

test('P30 exposes both approved business instructions in the product page today view', () => {
  const output = renderP30Today();
  assert.match(output, /回访第一：情绪、结业、激活三类今天必须碰/);
  assert.match(output, /主播留存的第一道防线/);
  assert.doesNotMatch(output, /今日回访名单＝已签约未开播＋新签7天内|今天该联系谁，一眼能找到/,
    'reviewer-only page goal and value notes stay outside the product canvas');
  assert.match(output, /class="p30-intro"/);
});

test('P30 visit rows keep the person, task, due status and next action together', () => {
  const output = renderP30Today();
  assert.match(output, /喵喵/);
  assert.match(output, /情绪回访/);
  assert.match(output, /今天必碰/);
  assert.match(output, /记沟通/);
  assert.match(output, /跟进详情/);
});

test('broker and trainee lists use divider rows instead of an individual bordered card for every person', () => {
  assert.ok(/#app \.p31-lead,#app \.p33-person\s*\{[^}]*border:0;[^}]*border-bottom:1px solid var\(--line-divider\)/s.test(html),
    'lead and care records use neutral divider rows');
  assert.ok(/#app \.p31-leads,#app \.p33-list\s*\{[^}]*gap:0/.test(html),
    'rows do not form a stack of separated mini-cards');
});

test('P30 priority and P30D emotion states do not use colored left rails', () => {
  assert.ok(/#app \.p30-item\.priority\s*\{[^}]*border-left:0/s.test(html), 'priority rows rely on their state label');
  assert.ok(/#app \.p30d-emotion\s*\{[^}]*border-left:0/s.test(html), 'emotion state uses text and a status dot');
});
