import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

function functionSource(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf(nextMarker, start);
  assert.ok(start >= 0 && end > start, `${name} source is present`);
  return html.slice(start, end);
}

function fixture() {
  const state = { filters: { q: '旧搜索', f: 'all' }, renderCount: 0 };
  const context = {
    ST: { p20view: 'overview', done: new Set() },
    state,
    p20Slots: () => [
      { s: { id: 'azhe', name: '阿哲', st: 'done', risk: { lv: 'danger', word: '有风险', text: '连续3天流水下滑' } } },
      { s: { id: 'xiaoyu', name: '小雨', st: 'live', risk: null } },
      { s: { id: 'lizi', name: '栗子', st: 'pending', risk: { lv: 'warn', word: '待跟进', text: '新人期时段多次调整' } } },
      { s: { id: 'daqiao', name: '大乔', st: 'done', risk: null } }
    ],
    p20Sch: () => state.filters,
    opsTodoForStreamer: id => ({
      azhe: { id: 'a3', lv: 'danger', riskLabel: '流水连续下滑' },
      lizi: { id: 'p3', lv: 'warn', riskLabel: '新人排期波动' }
    })[id] || null,
    todoLeft: () => 5,
    render: () => { state.renderCount += 1; },
    esc: value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
  };
  const code = [
    functionSource('p20Overview', 'function p20ShowLive('),
    functionSource('p20ShowLive', 'function p20View(')
  ].join('\n');
  vm.runInNewContext(`${code}\nglobalThis.api={p20Overview,p20ShowLive};`, context);
  return { context, state, api: context.api };
}

test('operations overview leads with derived shift progress, real risk items, and direct next actions', () => {
  const { api } = fixture();
  const output = api.p20Overview();

  assert.match(output, /3\s*<\/strong>\s*<span>\/ 4 场已开播/);
  assert.match(output, /aria-valuenow="3"/);
  assert.match(output, /class="p20-overview-topline"/);
  assert.match(output, /class="p20-live-now"[^>]*aria-label="查看今晚排班中正在直播的 1 位主播"/);
  assert.match(output, /onclick="p20ShowLive\('live'\)"/);
  assert.match(output, /看名单 ›/);
  assert.match(output, /class="p20-analysis-link"/);
  assert.match(output, /阿哲/);
  assert.match(output, /流水连续下滑/);
  assert.match(output, /栗子/);
  assert.match(output, /<span>2 位<\/span><button type="button" onclick="p20ShowLive\('risk'\)">查看全部/);
  assert.match(output, /class="p20-risk-status danger">待跟进/);
  assert.match(output, /class="p20-risk-action">去待办 ›/);
  assert.match(output, /openOpsTodo\('a3'\)/);
  assert.match(output, /p20ShowLive\('risk'\)/);
  assert.match(output, /待处理<\/strong><small>5 件需要跟进/);
});

test('viewing all at-risk streamers opens the live list with its risk filter and clears stale search', () => {
  const { context, state, api } = fixture();
  api.p20ShowLive('risk');

  assert.equal(state.filters.f, 'risk');
  assert.equal(state.filters.q, '');
  assert.equal(context.ST.p20view, 'live');
  assert.equal(state.renderCount, 1);
});

test('the scheduled-live count opens the matching filtered list and clears stale search', () => {
  const { context, state, api } = fixture();
  api.p20ShowLive('live');

  assert.equal(state.filters.f, 'live');
  assert.equal(state.filters.q, '');
  assert.equal(context.ST.p20view, 'live');
  assert.equal(state.renderCount, 1);
});

test('P22 history tabs keep the count inline and review entries present data as a scanable hierarchy', () => {
  const start = html.indexOf('function p22HistoryTabs(');
  const end = html.indexOf('function p22Collab(', start);
  assert.ok(start >= 0 && end > start, 'P22 history rendering source is present');
  const context = {
    ST: { p22: { tab: 'review' } },
    esc: value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
  };
  vm.runInNewContext(`${html.slice(start, end)}\nglobalThis.render=p22History;`, context);
  const output = context.render({ id: 'xiaoyu', reviews: [{
    d: '10-13', t: '比前晚多涨2万，赢在收尾连唱', st: 'pushed',
    snap: '音浪4.6万 · 时长3.1h · 峰值412', owner: '运营 · 小林',
    lines: ['整体4.6万，是近14天最高的一场', '开场前5分钟慢热', '今晚21:20黄金段提前5分钟热场']
  }], plans: [] });

  assert.match(output, /class="p22-history-tabs"/);
  assert.match(output, /复盘史<\/span><span class="p22-history-count">1/);
  assert.match(output, /规划史<\/span><span class="p22-history-count">0/);
  assert.match(output, /class="history-title-row"[\s\S]*?比前晚多涨2万，赢在收尾连唱[\s\S]*?已推送/);
  assert.match(output, /class="history-metric-value">4\.6万/);
  assert.match(output, /class="history-metric-value">3\.1h/);
  assert.match(output, /class="history-metric-value">412/);
  assert.match(output, /class="history-review-label">做得好/);
  assert.match(output, /class="history-review-label">需要处理/);
  assert.match(output, /class="history-review-label">下一步/);
  assert.match(html, /#app \.ops-screen\[data-page="P22"\] \.focusrec\{border-left:1px solid var\(--line-divider\)/);
  assert.match(html, /#app \.ops-screen\[data-page="P22"\] \.focusrec\.danger,[\s\S]*?\.focusrec\.ok\{border-left-color:var\(--line-divider\)\}/);
  assert.match(html, /#app \.ops-screen\[data-page="P22"\] \.mbody\{padding-top:8px\}/);
});
