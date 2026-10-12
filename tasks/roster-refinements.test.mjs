import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function source(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf(nextMarker, start);
  assert.ok(start >= 0 && end > start, `${name} source is present`);
  return html.slice(start, end);
}

test('P21 roster rows show a 32px initial avatar and keep status, risk, and newcomer information distinct', () => {
  const context = {
    esc,
    TRACK: { sing: '才艺唱歌' },
    ST: { done: new Set() },
    opsTodoForStreamer: () => null,
    opsHasOpenRisk: () => false,
    opsRiskSummary: () => '',
    fmtW: value => `${value}万`,
    statusBadge: () => '<span>直播中</span>',
  };
  vm.runInNewContext(`${source('qrow', 'function qlist(')}\n${source('p21Row', 'function p21RosterBody(')}\nglobalThis.render=p21Row;`, context);
  const output = context.render({ id: 'xiaoyu', name: '小雨', track: 'sing', st: 'live', stage: 'new', brief: '新人 · 清唱翻唱', today: { g: 3.2 }, trend: '↑13%' });

  assert.match(output, /class="qrow p21-roster-row/);
  assert.match(output, /class="p21-roster-avatar" aria-hidden="true">小<\/span>/);
  assert.match(output, /class="qb p21-roster-copy"/);
  assert.match(output, /class="qr p21-roster-status"/);
  assert.match(output, /新人 · 清唱翻唱/);
  assert.match(output, /class="qact p21-roster-action" onclick="openMsg\('xiaoyu'\)">发消息/);
});

test('P21 filters keep all five labels and counts in a touch-scrollable row with a directional edge cue', () => {
  const context = {
    ST: { p21m: { f: 'new', q: '' } },
    STREAMERS: [
      { grpName: '运营一组 · 小林', st: 'live', stage: 'new', risk: null },
      { grpName: '运营一组 · 小林', st: 'done', stage: 'active', risk: 'risk' },
    ],
    m21List: () => [],
    m21Rows: () => '<div id="m21results">results</div>',
    opsHasOpenRisk: streamer => !!streamer.risk,
    esc,
  };
  vm.runInNewContext(`${source('p21RosterBody', 'function m21List(')}\nglobalThis.render=p21RosterBody;`, context);
  const output = context.render();

  assert.match(output, /class="m21-filter-viewport"/);
  assert.match(output, /class="m21-filters" role="group" aria-label="主播筛选" onscroll="m21FilterScroll\(this\)"/);
  for (const [name, count] of [['全部', 2], ['在播', 1], ['未播', 0], ['风险', 1], ['新人', 1]]) {
    assert.match(output, new RegExp(`<span>${name}<\\/span><span class="cnt">${count}<\\/span>`));
  }
  assert.match(output, /class="m21-filter-edge" aria-hidden="true">›<\/span>/);
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.m21-filter-edge\{[^}]*linear-gradient/.test(html));
  assert.ok(/\.m21-filter-viewport\.has-more \.m21-filter-edge\{[^}]*opacity:1/.test(html));
  assert.ok(/\.m21-filter-viewport\.has-start::before[^{]*\{/.test(html));
});

test('P21 filter changes preserve the horizontal position and update both edge cues', () => {
  const toggled = [];
  const wrap = { classList: { toggle: (name, value) => toggled.push([name, value]) } };
  const oldScroller = { scrollLeft: 64 };
  const newScroller = { scrollLeft: 0, clientWidth: 286, scrollWidth: 366, parentElement: wrap, getBoundingClientRect: () => ({ left: 0, right: 286 }), querySelectorAll: () => [] };
  let queryCount = 0;
  const context = {
    ST: { p21m: { f: 'all' } },
    document: { querySelector: () => queryCount++ === 0 ? oldScroller : newScroller },
    render: () => {},
  };
  vm.runInNewContext(`${source('m21FilterScroll', 'function m21f(')}\n${source('m21f', 'function m21View(')}\nglobalThis.change=m21f;globalThis.update=m21FilterScroll;`, context);
  context.change('new');

  assert.equal(context.ST.p21m.f, 'new');
  assert.equal(newScroller.scrollLeft, 64);
  assert.deepEqual(toggled, [['has-overflow', true], ['has-start', true], ['has-more', true]]);
  toggled.length = 0;
  newScroller.scrollLeft = 0;
  newScroller.clientWidth = newScroller.scrollWidth;
  context.update(newScroller);
  assert.deepEqual(toggled, [['has-overflow', false], ['has-start', false], ['has-more', false]]);
});

test('P21 hides partially visible filter chips behind the horizontal scroll cues', () => {
  const wrapClasses = new Set();
  const hidden = new Map();
  const wrap = { classList: { toggle: (name, value) => value ? wrapClasses.add(name) : wrapClasses.delete(name) } };
  const makeChip = (left, right, name) => ({
    name,
    getBoundingClientRect: () => ({ left, right }),
    classList: { toggle: (className, value) => hidden.set(name, value) },
  });
  const fullyVisible = makeChip(20, 248, 'full');
  const clippedByRightCue = makeChip(230, 294, 'right');
  const clippedByLeftCue = makeChip(5, 40, 'left');
  const scroller = {
    parentElement: wrap,
    clientWidth: 286,
    scrollWidth: 366,
    scrollLeft: 0,
    getBoundingClientRect: () => ({ left: 0, right: 286 }),
    querySelectorAll: () => [fullyVisible, clippedByRightCue, clippedByLeftCue],
  };
  const context = { document: {}, ST: {} };
  vm.runInNewContext(`${source('m21FilterScroll', 'function syncM21FilterCue(')}\nglobalThis.update=m21FilterScroll;`, context);

  context.update(scroller);

  assert.equal(hidden.get('full'), false);
  assert.equal(hidden.get('right'), true);
  assert.equal(hidden.get('left'), false);
  scroller.scrollLeft = 24;
  context.update(scroller);
  assert.equal(hidden.get('left'), true);
});

test('P21 keyboard focus scrolls a hidden filter chip fully into view', () => {
  const classes = new Set(['has-overflow', 'has-more']);
  const hidden = new Map();
  const wrap = { classList: { toggle: (name, value) => value ? classes.add(name) : classes.delete(name), contains: name => classes.has(name) } };
  const scroller = {
    parentElement: wrap,
    clientWidth: 348,
    scrollWidth: 366,
    scrollLeft: 0,
    getBoundingClientRect: () => ({ left: 21, right: 369 }),
    querySelectorAll: () => [button],
  };
  const button = {
    closest: () => scroller,
    getBoundingClientRect: () => ({ left: 314 - scroller.scrollLeft, right: 379 - scroller.scrollLeft }),
    classList: { toggle: (name, value) => hidden.set(name, value) },
  };
  const context = { document: {}, ST: {} };
  vm.runInNewContext(`${source('m21FilterScroll', 'function syncM21FilterCue(')}\nglobalThis.update=m21FilterScroll;globalThis.focus=m21FilterFocus;`, context);

  context.focus(button);

  assert.equal(scroller.scrollLeft, 18);
  assert.equal(hidden.get('edge-hidden'), false);
  assert.equal(classes.has('has-more'), false);
});

test('P21 avatar and filter cue styles match the global 32px token and never reveal native scrollbars', () => {
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.p21-roster-row\{[^}]*grid-template-columns:var\(--avatar-list\)/.test(html));
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.p21-roster-avatar\{[^}]*width:var\(--avatar-list\)[^}]*height:var\(--avatar-list\)[^}]*border:1px solid var\(--color-neutral-300\)/.test(html));
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.p21-roster-action\{[^}]*min-height:44px!important[^}]*border:0!important[^}]*background:transparent!important/.test(html));
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.m21-filters\{[^}]*overflow-x:auto[^}]*scrollbar-width:none/.test(html));
  assert.ok(/#app \.ops-screen\[data-page="P21"\] \.m21-filter\.edge-hidden\{[^}]*opacity:0[^}]*pointer-events:none/.test(html));
  assert.match(html, /class="m21-filter \$\{f\.f===k\?"on":""\}" aria-pressed="\$\{f\.f===k\}" onfocus="m21FilterFocus\(this\)"/);
  assert.ok(/\*::-webkit-scrollbar\{display:none!important/.test(html));
});
