import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const css = html.slice(html.indexOf('<style'), html.indexOf('</style>'));

function functionSource(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf(nextMarker, start);
  assert.ok(start >= 0 && end > start, `${name} source is present`);
  return html.slice(start, end);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

test('prototype uses native controls and does not load or render Ionic components', () => {
  assert.doesNotMatch(html, /<script\s+src=["'][^"']*ionic/i);
  assert.doesNotMatch(html, /<ion-(?:segment|segment-button|label)\b/i);
  assert.doesNotMatch(html, /ion-segment|ionChange|setFocus\(/i);
  assert.match(html, /<button type="button" role="radio"/);
});

test('short peer-view selectors use native radios and preserve labels, counts, and selected value', () => {
  const sandbox = { esc: escapeHtml };
  vm.runInNewContext(`${functionSource('segView', '/* 区块标题')}\nglobalThis.renderSegment = segView;`, sandbox);
  const output = sandbox.renderSegment('主播动态', [['pending', '待处理', 3], ['all', '全部', 8]], 'all', 'm21FeedFilter');

  assert.match(output, /<div class="segview" role="radiogroup" aria-label="主播动态" data-change="m21FeedFilter" style="--seg-count:2">/);
  assert.match(output, /<button type="button" role="radio" data-value="pending" aria-checked="false" tabindex="-1" onclick="runSegmentHandler\('m21FeedFilter','pending'\)">待处理<span class="n">3<\/span><\/button>/);
  assert.match(output, /<button type="button" role="radio" data-value="all" aria-checked="true" tabindex="0" onclick="runSegmentHandler\('m21FeedFilter','all'\)">全部<span class="n">8<\/span><\/button>/);
});

test('long selectors keep every option in a wrapped native radio group', () => {
  const sandbox = { esc: escapeHtml };
  vm.runInNewContext(`${functionSource('segView', '/* 区块标题')}\nglobalThis.renderSegment = segView;`, sandbox);
  const items = [['a', '学员一', null], ['b', '学员二', null], ['c', '学员三', null], ['d', '学员四', null], ['e', '学员五', null]];
  const output = sandbox.renderSegment('在训学员', items, 'c', 'p41Who');

  assert.match(output, /class="segview segview--wrapped" role="radiogroup" aria-label="在训学员"/);
  assert.match(output, /data-value="c" aria-checked="true" tabindex="0"/);
  assert.equal((output.match(/aria-checked="true"/g) || []).length, 1);
  for (const [, label] of items) assert.match(output, new RegExp(label));
  assert.doesNotMatch(output, /role="tablist"|role="tab"|aria-pressed=/);
});

test('native segment controls keep phone-sized targets, selected styling, and keyboard focus', () => {
  assert.match(css, /#app \.segview button\[role="radio"\]\{[^}]*min-height:48px/);
  assert.match(css, /#app \.segview button\[role="radio"\]\[aria-checked="true"\]/);
  assert.match(css, /\.segview button\[role="radio"\]:focus-visible\{[^}]*outline:2px solid/);
  assert.match(css, /#app \.segview--wrapped\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test('segment changes call only the named handler and restore focus after rerender', () => {
  const state = { calls: [], focused: [], frames: [] };
  const radios = ['pending', 'all'].map(value => ({
    dataset: { value },
    focus() { state.focused.push(value); }
  }));
  const group = { dataset: { change: 'm21FeedFilter' }, querySelectorAll() { return radios; } };
  const sandbox = {
    requestAnimationFrame(callback) { state.frames.push(callback); },
    document: { getElementById(id) {
      assert.equal(id, 'app');
      return { querySelectorAll() { return [group]; } };
    } },
    m21FeedFilter(value) { state.calls.push(['m21FeedFilter', value]); }
  };
  const source = functionSource('focusSegmentOption', 'function runSegmentHandler')
    + functionSource('runSegmentHandler', 'function handlePrototypeSegmentKeydown');
  vm.runInNewContext(`${source}\nglobalThis.applySegmentHandler = runSegmentHandler;`, sandbox);

  sandbox.applySegmentHandler('m21FeedFilter', 'all');
  sandbox.applySegmentHandler('missingHandler', 'pending');
  assert.deepEqual(state.calls, [['m21FeedFilter', 'all']]);
  assert.deepEqual(state.focused, [], 'focus waits until the handler rerender completes');
  assert.equal(state.frames.length, 1);
  state.frames[0]();
  assert.deepEqual(state.focused, ['all']);
});

test('arrow, Home, and End keys move and select native segmented radio options', () => {
  const cases = [['ArrowRight', 'all'], ['ArrowLeft', 'overview'], ['Home', 'work'], ['End', 'overview']];
  for (const [key, expected] of cases) {
    const state = { selected: null, prevented: 0 };
    const group = { dataset: { change: 'p20View' }, querySelectorAll() { return radios; } };
    const radios = ['work', 'all', 'overview'].map(value => ({
      dataset: { value },
      closest(selector) { return selector.includes('button') ? this : group; }
    }));
    const sandbox = { runSegmentHandler(name, value) { state.selected = [name, value]; } };
    vm.runInNewContext(`${functionSource('handlePrototypeSegmentKeydown', '/* 区块标题')}\nglobalThis.handleKey = handlePrototypeSegmentKeydown;`, sandbox);
    sandbox.handleKey({
      key,
      target: radios[0],
      preventDefault() { state.prevented += 1; }
    });
    assert.deepEqual(state.selected, ['p20View', expected], `key ${key} selects the expected option`);
    assert.equal(state.prevented, 1, `key ${key} is handled by the group`);
  }
});
