import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function source(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf(nextMarker, start);
  assert.ok(start >= 0 && end > start, `${name} source is present`);
  return html.slice(start, end);
}

test('priority todo preserves its task context and every configured action target', () => {
  const context = {
    todoSrcLabel: () => '预警',
    esc,
  };
  vm.runInNewContext(`${source('todoFocus', 'function todoRow(')}\nglobalThis.render=todoFocus;`, context);
  const output = context.render({ id: 'review-1', lv: 'danger', title: '阿哲：连续3天流水下滑', cat: '主播复盘', src: 'ai', sub: '连续3天流水下滑，需要及时复盘。', actions: [['去复盘', "go('P24')", 'p'], ['看详情', "openTodo('review-1')", 'g'], ['看主播', "goP22('azhe')", 'g']] });

  assert.match(output, /<article class="ops-focus">[\s\S]*?<h3>阿哲：连续3天流水下滑<\/h3>/);
  assert.match(output, /连续3天流水下滑，需要及时复盘。/);
  assert.match(output, /主播复盘 · 预警<br>负责人：小林 · 运营/);
  assert.match(output, /<button type="button" class="ops-primary-action" onclick="go\('P24'\)">去复盘<span[^>]*>→/);
  assert.match(output, /<button type="button" class="ops-secondary-action" onclick="goP22\('azhe'\)">看主播<\/button>/);
  assert.match(output, /<button type="button" class="ops-secondary-action" onclick="openTodo\('review-1'\)">看详情<\/button>/);
});

test('P20 overview keeps each risk summary compact and exposes one explicit route to its actionable todo', () => {
  const slots = [
    { s: { id: 'azhe', name: '阿哲', risk: true, st: 'done' }, slot: '18:00-21:00' },
    { s: { id: 'laok', name: '老K', risk: true, st: 'live' }, slot: '22:00-01:00' },
  ];
  const todos = {
    azhe: { id: 'risk-azhe', lv: 'danger', riskLabel: '连续3天流水下滑' },
    laok: { id: 'risk-laok', lv: 'warn', riskLabel: '昨晚音浪低于同期' },
  };
  const context = {
    P20_SLOTS: [['azhe'], ['laok']],
    ST: { done: new Set() },
    p20Slots: () => slots,
    opsTodoForStreamer: id => todos[id],
    todoLeft: () => 11,
    esc,
  };
  vm.runInNewContext(`${source('p20Overview', 'function p20ShowLive(')}\nglobalThis.render=p20Overview;`, context);
  const output = context.render();
  const rows = [...output.matchAll(/<button type="button" class="p20-risk-row[\s\S]*?<\/button>/g)].map(match => match[0]);

  assert.equal(rows.length, 2);
  assert.match(rows[0], /onclick="openOpsTodo\('risk-azhe'\)"/);
  assert.match(rows[0], /连续3天流水下滑/);
  assert.match(rows[0], /去待办 ›/);
  assert.doesNotMatch(rows[0], /查看对应待办/);
  assert.match(rows[1], /onclick="openOpsTodo\('risk-laok'\)"/);
  assert.match(rows[1], /昨晚音浪低于同期/);
  assert.match(output, /11 件需要跟进/);
});

test('roster search comes before a single-row horizontally scrollable filter with inline counts', () => {
  const context = {
    ST: { p21m: { f: 'new', q: '' }, done: new Set() },
    STREAMERS: [{ grpName: '运营一组 · 小林', st: 'live', risk: null, stage: 'new' }],
    m21List: () => [],
    m21Rows: () => '<div>ROWS</div>',
    opsHasOpenRisk: streamer => !!streamer.risk,
    esc,
  };
  vm.runInNewContext(`${source('p21RosterBody', 'function m21List(')}\nglobalThis.render=p21RosterBody;`, context);
  const output = context.render();

  assert.ok(output.indexOf('class="m21-search"') < output.indexOf('class="m21-filters"'));
  assert.match(output, /class="m21-filters" role="group" aria-label="主播筛选"/);
  assert.match(output, /class="m21-filter on"[^>]*aria-pressed="true"[\s\S]*?<span>新人<\/span><span class="cnt">1<\/span>/);
  assert.match(html, /#app \.ops-screen\[data-page="P21"\] \.m21-filters\{[^}]*flex-wrap:nowrap[^}]*overflow-x:auto/);
});

test('handoff summary is flat, explains total versus selected-range counts, and each handoff names people once', () => {
  const context = {
    ST: { p25tab: 'inbox' },
    STREAMERS: [{ id: 'xiaoyu', handoffs: [{ id: 'sent-1', d: '10-13', k: '视觉', to: '运营 · 小林', from: '运营 · 小林', note: '背景已换好', st: 'doing' }] }],
    HANDOFF_INBOX: [{ id: 'in-1', sid: 'azhe', d: '今天', k: '视觉', to: '运营 · 小林', from: '主播 · 阿哲', note: '直播背景需要检查', st: 'doing' }],
    HST: { done: ['ok', '已完成'], doing: ['b', '进行中'], wait: ['warn', '待接单'] },
    byId: id => id === 'azhe' ? { name: '阿哲' } : { name: '小雨' },
    pageHead: () => '<header>交接中心</header>',
    segView: () => '<nav>范围切换</nav>',
    sectHead: (title, count) => `<h2>${title} ${count}</h2>`,
    emptyBox: () => '',
    esc,
  };
  vm.runInNewContext(`${source('pageP25', 'function exportRpt(')}\nglobalThis.render=pageP25;`, context);
  const output = context.render();

  assert.match(output, /class="handoff-overview-title"><strong>全部交接<\/strong><span[^>]*>2 张单/);
  assert.match(output, /上方统计全部交接单；下方数量按所选范围统计/);
  assert.doesNotMatch(output, /class="handoff-stat"[^>]*style=/);
  assert.match(output, /class="handoff-card-title">阿哲 · 视觉/);
  assert.match(output, /class="handoff-card-people"><span>发起人：主播 · 阿哲<\/span><span[^>]*>·<\/span><span>当前负责人：运营 · 小林<\/span>/);
  assert.doesNotMatch(output, /当前负责人：<strong>/);
  assert.match(output, /class="handoff-card-actions"><button type="button" class="handoff-primary"[^>]*>办完并回执/);
  assert.match(output, /class="handoff-secondary"[^>]*>看主播/);
  assert.match(html, /#app \.ops-screen\[data-page="P25"\] \.handoff-stat\{[^}]*border:0[^}]*background:transparent/);
  assert.match(html, /#app \.ops-screen\[data-page="P25"\] \.handoff-card-actions \.handoff-primary\{[^}]*background:#111!important[^}]*color:#fff!important/);
});

test('operations My page removes duplicate work shortcuts and uses one identity-switch row', () => {
  const context = {
    ROLES: { yunying: { n: '运营' }, jingji: { n: '经纪人' } },
    myIdentityCard: role => `<section>身份 ${role}</section>`,
    myScopeCard: role => `<section>范围 ${role}</section>`,
    myWorkEntries: role => `<nav>工作入口 ${role}</nav>`,
  };
  vm.runInNewContext(`${source('myPage', 'function mPlaceholder(')}\nglobalThis.render=myPage;`, context);
  const operations = context.render('yunying');
  const otherRole = context.render('jingji');

  assert.doesNotMatch(operations, /工作入口/);
  assert.match(operations, /class="ops-identity-switch"[^>]*onclick="exitRole\(\)"[\s\S]*?切换工作身份[\s\S]*?aria-hidden="true">›/);
  assert.match(otherRole, /工作入口 jingji/);
  assert.match(html, /#app \.ops-screen\[data-page="MY"\] \.ops-identity-switch\{[^}]*min-height:56px/);
});

test('operations assistant groups its first-use explanation and quick questions, then moves conversation into the message list', () => {
  const base = () => ({
    ST: { role: 'yunying', chat: { ai: { yunying: [{ from: 'ai', text: '我是明镜助理。可以查询本角色业务，并带你查看对应的业务页面。', onboarding: true }] } } },
    ROLES: { yunying: { n: '运营' } },
    AICHIPS: { yunying: ['给小雨生成下周规划', '谁今天没开播', '阿哲的复盘'] },
    pageHead: title => `<header>${title}</header>`,
    chatFeedback: () => '',
    chatField: (id, placeholder, action, scope, sid, keyboardAware) => `<input id="${id}" data-keyboard-aware="${keyboardAware}" onfocus="assistantKeyboard(true)" onblur="assistantKeyboard(false)">`,
    chatObjectLabel: () => '',
    esc,
  });
  const code = `${source('pageAI', '/* ===== P93/P94/P95')}\nglobalThis.render=pageAI;`;
  const initialContext = base();
  vm.runInNewContext(code, initialContext);
  const initial = initialContext.render();
  assert.match(initial, /class="assistant-welcome"/);
  assert.match(initial, /class="assistant-prompt-list"/);
  assert.match(initial, /给小雨生成下周规划/);
  assert.doesNotMatch(initial, /class="assistant-context"/);
  assert.doesNotMatch(initial, /class="assistant-prompts"/);
  assert.doesNotMatch(initial, /我是明镜助理。可以查询本角色业务/);
  assert.match(initial, /data-keyboard-aware="true"/);
  assert.match(initial, /class="assistant-send"[^>]*aria-label="发送问题"/);

  initialContext.ST.chat.ai.yunying.push({ from: 'me', text: '谁今天没开播' }, { from: 'ai', text: '有 2 位主播尚未开播。' });
  const ongoing = initialContext.render();
  assert.doesNotMatch(ongoing, /class="assistant-welcome"|class="assistant-prompt-list"/);
  assert.match(ongoing, /谁今天没开播/);
  assert.match(ongoing, /有 2 位主播尚未开播/);
});

test('assistant keyboard focus hides operations bottom navigation and blur restores it', () => {
  const toggles = [];
  const screen = { classList: { toggle: (...args) => toggles.push(args) } };
  const input = { scrollIntoView: options => { screen.scrollOptions = options; } };
  const context = {
    ST: { role: 'yunying' },
    document: { querySelector: () => screen, getElementById: () => input },
    requestAnimationFrame: callback => callback(),
  };
  vm.runInNewContext(`${source('assistantKeyboard', 'function pageAI(')}\nglobalThis.sync=assistantKeyboard;`, context);
  context.sync(true);
  context.sync(false);

  assert.deepEqual(toggles, [['keyboard-open', true], ['keyboard-open', false]]);
  assert.equal(screen.scrollOptions.block, 'nearest');
  assert.equal(screen.scrollOptions.behavior, 'smooth');
  assert.match(html, /\.ops-screen\[data-page="AI"\]\.keyboard-open \.mtabs\{display:none/);
});
