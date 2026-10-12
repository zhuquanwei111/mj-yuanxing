import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

function source(name, nextMarker) {
  const start = html.indexOf(`function ${name}(`);
  const end = html.indexOf(nextMarker, start);
  assert.ok(start >= 0 && end > start, `${name} source is present`);
  return html.slice(start, end);
}

const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

test('each operations-owned risk points to exactly one canonical todo', () => {
  const start = html.indexOf('const TODOS_AM = [');
  const end = html.indexOf('const OKTOAST', start);
  assert.ok(start >= 0 && end > start, 'operations todo data is present');
  const context = {};
  vm.runInNewContext(`${html.slice(start, end)}\nglobalThis.todos=TODOS_ALL;`, context);
  const linked = context.todos
    .filter(todo => todo.riskFor)
    .map(todo => [todo.riskFor, todo.id, todo.riskLabel]);
  assert.equal(JSON.stringify(linked), JSON.stringify([
    ['laok', 'a2', '流水下滑'],
    ['azhe', 'a3', '流水连续下滑'],
    ['xiaoxiao', 'a4', '峰值连续下滑'],
    ['lizi', 'p3', '新人排期波动'],
  ]));
});

test('management risk states use visible dots and labels without left-edge emphasis bars', () => {
  const styleEnd=html.indexOf('</style>');
  const css=html.slice(html.indexOf('<style'),styleEnd);
  const riskStyles=css.slice(css.indexOf('/* T17.11 risk markers:'));
  const rules=[
    ['#app [data-page="P13"] .alertrow','border-left:0!important'],
    ['#app [data-page="P15"] [data-warning-id]','border-left:1px solid var(--line-divider)!important'],
    ['#app [data-page="P93"] .p93-risk','border-left:1px solid var(--line-divider)!important'],
    ['#app [data-page="P93"] .p93-team.warn','border-left:1px solid var(--line-divider)!important'],
    ['#app [data-page="P94"] .focusrec','border-left:1px solid var(--line-divider)!important'],
    ['#app [data-page="P94"] .qrow','border-left:0!important'],
  ];
  for(const [selector,declaration] of rules){
    const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    assert.match(riskStyles,new RegExp(`${escaped}[^\\{]*\\{[^}]*${declaration.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`),`${selector} removes its emphasis bar`);
  }
  assert.match(source('mP13','function ck(item)'),/class="adot p13-risk-marker"/,'P13 keeps its risk dot');
  assert.match(source('mP15','const WARNINGS ='),/class="p15-risk-dot"/,'P15 marks each warning record');
  assert.match(source('pageP93','function adoptSug('),/class="p93-risk-dot [^"]+"/,'P93 marks each active risk');
  assert.match(source('pageP93','function adoptSug('),/class="p93-team-trend-mark"/,'cross-group declines keep a visible marker');
  assert.match(source('pageP94','function assign41Modal('),/class="p94-risk-dot [^"]+/,'P94 marks its focused risk task');
  assert.match(source('pageP95','function p95OpenGroup('),/class="p95-risk-dot/,'P95 marks risk counts in organization rows');
});

test('an overview or list risk entry opens its existing task in the operations queue', () => {
  const events = [];
  const context = {
    ST: { p20view: 'overview', todoTab: 'done', todoFocusId: null, done: new Set() },
    todoById: id => id === 'a3' ? { id } : null,
    go: route => events.push(['go', route]),
    render: () => events.push(['render']),
  };
  vm.runInNewContext(`${source('openOpsTodo', 'function todoMore(')}\nglobalThis.open=openOpsTodo;`, context);
  context.open('a3');

  assert.equal(context.ST.p20view, 'work');
  assert.equal(context.ST.todoTab, 'todo');
  assert.equal(context.ST.todoFocusId, 'a3');
  assert.deepEqual(events, [['go', 'P20']]);
});

test('the queue focuses the linked risk task selected from another operations view', () => {
  const context = {
    ST: { todoTab: 'todo', todoFocusId: 'a3', doneList: [] },
    todoSorted: () => [{ id: 'a2' }, { id: 'a3' }, { id: 'p1' }],
    todoFocus: task => `<focus>${task.id}</focus>`,
    todoRow: task => `<row>${task.id}</row>`,
    sectHead: () => '<heading>other tasks</heading>',
  };
  vm.runInNewContext(`${source('todoCardHtml', 'function refreshTodo(')}\nglobalThis.render=todoCardHtml;`, context);
  const output = context.render();

  assert.match(output, /<focus>a3<\/focus>/);
  assert.match(output, /<row>a2<\/row>/);
  assert.match(output, /<row>p1<\/row>/);
  assert.doesNotMatch(output, /<row>a3<\/row>/);
});

test('P20 business overview links its concise active risk summary to one task and omits handled tasks', () => {
  const tasks = {
    laok: { id: 'a2', riskLabel: '流水下滑' },
    azhe: { id: 'a3', riskLabel: '流水连续下滑' },
  };
  const context = {
    ST: { done: new Set(['a3']) },
    p20Slots: () => [
      { s: { id: 'laok', name: '老K', risk: { lv: 'danger', word: '有风险', text: '长篇风险描述不应在概况重复' } } },
      { s: { id: 'azhe', name: '阿哲', risk: { lv: 'danger', word: '有风险', text: '已处理的风险详情' } } },
    ],
    opsTodoForStreamer: id => tasks[id] || null,
    todoLeft: () => 4,
    esc,
  };
  vm.runInNewContext(`${source('p20Overview', 'function p20ShowLive(')}\nglobalThis.render=p20Overview;`, context);
  const output = context.render();

  assert.match(output, /老K/);
  assert.match(output, /流水下滑/);
  assert.match(output, /onclick="openOpsTodo\('a2'\)"/);
  assert.doesNotMatch(output, /阿哲|已处理的风险详情/);
  assert.doesNotMatch(output, /长篇风险描述不应在概况重复/);
});

test('today schedule shows a short risk label and routes to its linked task', () => {
  const context = {
    p20SchRows: () => [{ s: { id: 'laok', name: '老K', st: 'pending', risk: { lv: 'danger', word: '有风险', text: '完整的流水风险描述' } }, slot: '22:00-01:00' }],
    opsTodoForStreamer: () => ({ id: 'a2', riskLabel: '流水下滑' }),
    ST: { done: new Set() },
    esc,
  };
  vm.runInNewContext(`${source('p20SchBody', 'function p20Overview(')}\nglobalThis.render=p20SchBody;`, context);
  const output = context.render();

  assert.match(output, /onclick="openOpsTodo\('a2'\)"/);
  assert.match(output, /流水下滑/);
  assert.doesNotMatch(output, /完整的流水风险描述/);
});

test('handled risk tasks leave the active risk filter and its count together', () => {
  const context = {
    ST: { done: new Set(['a2']) },
    opsTodoForStreamer: id => id === 'laok' ? { id: 'a2' } : null,
  };
  vm.runInNewContext(`${source('opsHasOpenRisk', 'function opsRiskSummary(')}\nglobalThis.isOpen=opsHasOpenRisk;`, context);
  assert.equal(context.isOpen({ id: 'laok', risk: { text: 'old risk' } }), false);
  assert.equal(context.isOpen({ id: 'azhe', risk: { text: 'active risk' } }), true);
  assert.match(source('mP20', 'function broadcastModal'), /const cnt=.*opsHasOpenRisk\(r\.s\)/);
});

test('roster risk summary links to the task while retaining the profile path for unlinked risks', () => {
  const rows = [];
  const context = {
    ST: { done: new Set() },
    opsTodoForStreamer: id => id === 'azhe' ? { id: 'a3', riskLabel: '流水连续下滑' } : null,
    opsRiskSummary: s => s.id === 'azhe' ? '待办 · 流水连续下滑' : '由经纪人跟进',
    TRACK: { talk: '聊天' },
    fmtW: value => value,
    statusBadge: () => '已下播',
    esc,
    qrow: row => { rows.push(row); return JSON.stringify(row); },
  };
  vm.runInNewContext(`${source('p21Row', 'function p21RosterBody(')}\nglobalThis.render=p21Row;`, context);
  context.render({ id: 'azhe', name: '阿哲', track: 'talk', today: null, yest: { g: 2.8 }, risk: { text: '重复的完整风险叙述' }, st: 'done', trend: '↓16%' });
  context.render({ id: 'miaomiao', name: '喵喵', track: 'talk', today: null, yest: null, risk: { text: '经纪人负责的风险' }, st: 'absent' });

  assert.equal(rows[0].onclick, "openOpsTodo('a3')");
  assert.match(rows[0].sub, /流水连续下滑/);
  assert.doesNotMatch(rows[0].sub, /重复的完整风险叙述/);
  assert.equal(rows[1].onclick, "goP22('miaomiao')");
  assert.match(rows[1].sub, /由经纪人跟进/);
  assert.doesNotMatch(rows[1].sub, /经纪人负责的风险/);
});

test('the streamer activity inbox reuses the canonical task for an operations risk', () => {
  const context = {
    ST: { done: new Set(['a2']), maiziGrad: true },
    STREAMERS: [
      { id: 'azhe', name: '阿哲', grpName: '运营一组 · 小林', risk: { text: '长篇重复风险描述' }, st: 'done' },
      { id: 'laok', name: '老K', grpName: '运营一组 · 小林', risk: { text: '已经处理的风险描述' }, st: 'done' },
      { id: 'miaomiao', name: '喵喵', grpName: '运营一组 · 小林', risk: { text: '经纪人负责的风险' }, st: 'absent' },
    ],
    opsTodoForStreamer: id => ({
      azhe: { id: 'a3', riskLabel: '流水连续下滑', lv: 'danger' },
      laok: { id: 'a2', riskLabel: '流水下滑', lv: 'danger' },
    })[id] || null,
    HANDOFF_INBOX: [],
    SIGNUP32: [],
    byId: () => null,
    HST: {},
  };
  vm.runInNewContext(`${source('p21Events', 'function p21EvRow(')}\nglobalThis.events=p21Events;`, context);
  const events = context.events();
  assert.equal(events.length, 1);
  const [event] = events;
  assert.equal(event.todoId, 'a3');
  assert.equal(event.text, '流水连续下滑');
  assert.equal(event.act[0], '去待办');
  assert.equal(event.act[1], "openOpsTodo('a3')");

  const rowContext = { esc };
  vm.runInNewContext(`${source('p21EvRow', 'function p21FeedBody(')}\nglobalThis.row=p21EvRow;`, rowContext);
  const output = rowContext.row(event, '今天');
  assert.match(output, /onclick="openOpsTodo\('a3'\)"/);
  assert.doesNotMatch(output, /长篇重复风险描述|goP22\('azhe'\)|class="qact/);
});
