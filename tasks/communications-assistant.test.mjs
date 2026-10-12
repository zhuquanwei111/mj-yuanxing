import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

function sliceBetween(startText, endText) {
  const start = html.indexOf(startText);
  const end = html.indexOf(endText, start + startText.length);
  assert.ok(start >= 0 && end > start, `source section exists: ${startText}`);
  return html.slice(start, end);
}

function communicationFixture(role = 'yunying') {
  const conversations = sliceBetween('function initChat(){', '/* ===== 明镜助理');
  const assistant = sliceBetween('const AICHIPS = {', '/* ===== P93/P94/P95');
  const context = {
    ST: { role, p92view: 'all', p83chat: [], chatFollow: false },
    ROLES: { yunying: { n: '运营' }, zhubo: { n: '主播' } },
    TRACK: { sing: '唱歌' },
    events: [], renders: 0, values: {},
    location: { hash: '#P92' },
    pageHead: title => `<header>${title}</header>`,
    resolveStreamer: id => id === 'xiaoyu' ? { id, name: '小雨', track: 'sing', comms: [] } : null,
    detailOf: () => {}, esc: value => String(value ?? ''),
    render() { context.renders++; },
    toast(message) { context.events.push(message); },
    go(route) { context.route = route; context.location.hash = `#${route}`; },
    openModal(markup) { context.modal = markup; }, closeModal() { context.modal = ''; },
    document: { getElementById(id) { return context.values[id] ? { value: context.values[id] } : null; } },
    pushReceipt() {},
    setTimeout() {}
  };
  vm.runInNewContext(`${conversations}\n${assistant}\nglobalThis.api={initChat,pageP90,pageP91,pageP92,sendGroup,sendDm,p92SetView:typeof p92SetView==='function'?p92SetView:null,openConversation:typeof openConversation==='function'?openConversation:null,openSystemNotification:typeof openSystemNotification==='function'?openSystemNotification:null,openGroupItem:typeof openGroupItem==='function'?openGroupItem:null,chatUnreadCount:typeof chatUnreadCount==='function'?chatUnreadCount:null,aiAsk,aiAccept:typeof aiAccept==='function'?aiAccept:null,aiUndoDecision:typeof aiUndoDecision==='function'?aiUndoDecision:null,aiDismiss:typeof aiDismiss==='function'?aiDismiss:null,aiEdit:typeof aiEdit==='function'?aiEdit:null,aiSaveEdit:typeof aiSaveEdit==='function'?aiSaveEdit:null,pageAI};`, context);
  context.api.initChat();
  return { context, api: context.api };
}

test('P90 groups messages by day and distinguishes conversation, system notice, and business event', () => {
  const { api } = communicationFixture();
  const page = api.pageP90();
  assert.match(page, /星曜传媒/);
  assert.match(page, /昨天/);
  assert.match(page, /今天/);
  assert.match(page, /系统通知/);
  assert.match(page, /业务进展/);
  assert.match(page, /公会群/);
});

test('opening a conversation clears its unread items, while rendering the page alone does not', () => {
  const { context, api } = communicationFixture();
  assert.equal(api.chatUnreadCount('group'), 2);
  api.pageP90();
  assert.equal(api.chatUnreadCount('group'), 2);
  api.openConversation('group');
  assert.equal(api.chatUnreadCount('group'), 0);
  assert.equal(context.route, 'P90');
});

test('P92 categories filter conversations and system notices and open an exact unread notice', () => {
  const { context, api } = communicationFixture();
  context.ST.chat.dm.azhe = [{ id: 'd4', from: '阿哲', text: '晚场目标已确认', time: '今天 11:00', unread: true }];
  assert.equal(typeof api.p92SetView, 'function');
  const all = api.pageP92();
  assert.match(all, /全部/);
  assert.match(all, /未读/);
  assert.match(all, /系统通知/);
  assert.match(all, /星曜传媒 · 公会群/);
  assert.match(all, /azhe/);
  api.p92SetView('unread');
  const unread = api.pageP92();
  assert.match(unread, /未读/);
  assert.match(unread, /待你确认/);
  assert.doesNotMatch(unread, /全部消息已读/);
  api.p92SetView('system');
  const system = api.pageP92();
  assert.match(system, /10月账单已出/);
  assert.doesNotMatch(system, /星曜传媒 · 公会群/);
  api.openSystemNotification('s1');
  assert.equal(context.route, 'P71');
  assert.equal(api.chatUnreadCount('system'), 2);
  api.openConversation('dm', 'azhe');
  assert.equal(context.route, 'P91/azhe');
  assert.equal(api.chatUnreadCount('dm', 'azhe'), 0);
  assert.equal(context.ST.p92view, 'system');
});

test('P91 identifies both parties and guides an empty/new conversation without losing its draft', () => {
  const { context, api } = communicationFixture('zhubo');
  context.ST.chat.dm.xiaoyu = [];
  const page = api.pageP91('xiaoyu');
  assert.match(page, /小林（运营）/);
  assert.match(page, /对话刚刚开始/);
  assert.match(page, /dmin/);
  context.values.dmin = '我今晚会提前半小时准备';
  api.sendDm('xiaoyu');
  assert.equal(context.ST.chat.dm.xiaoyu.at(-1).text, '我今晚会提前半小时准备');
  assert.equal(context.ST.chat.dm.xiaoyu.at(-1).from, '小雨');
  assert.match(api.pageP91('xiaoyu'), /我今晚会提前半小时准备/);
});

test('empty or unavailable sends keep the draft and show an inline recovery message', () => {
  const { context, api } = communicationFixture();
  context.values.gmin = '保留这段内容';
  context.ST.chat.connection = 'offline';
  api.sendGroup();
  assert.equal(context.ST.chat.group.length, 5);
  assert.match(api.pageP90(), /暂时无法发送/);
  assert.match(api.pageP90(), /保留这段内容/);
  context.ST.chat.connection = 'online';
  api.sendGroup();
  assert.equal(context.ST.chat.group.at(-1).text, '保留这段内容');
});

test('assistant action cards identify the affected object and support accept, edit, and dismiss feedback', () => {
  const { context, api } = communicationFixture();
  assert.equal(typeof api.aiAccept, 'function');
  assert.equal(typeof api.aiEdit, 'function');
  assert.equal(typeof api.aiDismiss, 'function');
  api.aiAsk('给小雨生成下周规划');
  let page = api.pageAI();
  assert.match(page, /关联对象/);
  assert.match(page, /查看业务对象/);
  assert.match(page, /采纳建议/);
  assert.match(page, /编辑问题/);
  assert.match(page, /忽略建议/);
  api.aiAccept(1);
  assert.equal(context.route, 'P23/xiaoyu');
  assert.match(api.pageAI(), /已采纳 · 已打开关联页面/);
  assert.equal(context.events.some(event => event === '已采纳建议，正在打开关联页面'), false);
  api.aiUndoDecision(1);
  assert.equal(context.ST.chat.ai.yunying[1].actionState, '');
  api.aiEdit(1);
  assert.match(context.modal, /ai-edit-1/);
  context.values['ai-edit-1'] = '查小雨最近复盘';
  api.aiSaveEdit(1);
  assert.match(context.ST.chat.ai.yunying[0].text, /查小雨最近复盘/);
  api.aiDismiss(1);
  assert.equal(context.ST.chat.ai.yunying[1].actionState, 'dismissed');
  assert.match(api.pageAI(), /已忽略/);
  api.aiUndoDecision(1);
  assert.equal(context.ST.chat.ai.yunying[1].actionState, '');
});
