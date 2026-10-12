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

function calendarFixture() {
  const data = sliceBetween('const WORKJOBS = [', 'function p31Drop(){');
  const pages = sliceBetween('function p50View(v){', 'const MATERIALS = {');
  const visualPage = sliceBetween('const MATERIALS = {', 'function openResched(id){');
  const rescheduleModal = sliceBetween('function openResched(id){', 'function saveResched(id){');
  const reschedule = sliceBetween('function saveResched(id){', 'function pageP52(jid){');
  const debugPage = sliceBetween('function pageP52(jid){', 'function finish52(id){');
  const context = {
    ST: {p50view:'list',p50day:0,p52checks:{}}, STREAMERS: [], events: [], renders: 0,
    pageHead: title => `<h1>${title}</h1>`, resolveStreamer: () => ({track:'sing'}),
    esc: value => String(value ?? ''), ailine: () => '',
    render(){ context.renders++; }, toast(message){ context.events.push(message); },
    go(route){ context.events.push(route); }, pushReceipt(message){ context.events.push(message); },
    openModal(markup){ context.modal=markup; },
    document: {getElementById(id){ return id==='rsd'?{value:'d2'}:id==='rst'?{value:'17:30'}:null; }},
    closeModal(){ context.events.push('closed'); }
  };
  vm.runInNewContext(`${data}\n${pages}\n${visualPage}\n${rescheduleModal}\n${reschedule}\n${debugPage}\nglobalThis.api={WORKJOBS,pageP50,pageP51,pageP52,openResched,saveResched,p50SelectDay:typeof p50SelectDay==='function'?p50SelectDay:null};`, context);
  return {context,api:context.api};
}

function contentFixture() {
  const source = sliceBetween('const TASKS60 = [', 'function pageP10(){');
  const context = {
    ST: {todoExtra:[],p62f:'all'}, STREAMERS: [{id:'azhe',name:'阿哲'}], events: [], renders:0,
    pageHead: title => `<h1>${title}</h1>`, byId: id => ({id,name:'阿哲',track:'sing',trend:'稳定',yest:null,stay:'—',risk:null}),
    TRACK:{sing:'唱歌'}, fmtW: value => String(value), resolveStreamer: () => ({d14:[1,2]}),
    rateOf: () => 0.4, pageTitle:'', sectHead: title => `<h2>${title}</h2>`,
    ailine: () => '', esc: value => String(value ?? ''),
    emptyBox: title => `<div>${title}</div>`, render(){context.renders++;},
    toast(message){context.events.push(message);}, pushReceipt(message){context.events.push(message);},
    openModal(html){context.modal=html;}, closeModal(){context.modal='';},
    document:{getElementById(id){return id==='dtx'?{value:'改后脚本'}:id==='n62c'?{value:'新剪辑需求'}:id==='n62s'?{value:'azhe'}:id==='n62d'?{value:'2026-10-16'}:id==='r62note'?{value:'结尾节奏偏慢，调整最后15秒'}:null;}}
  };
  vm.runInNewContext(`${source}\nglobalThis.api={TASKS60,TASKS62,D61,pageP60,pageP61,pageP62,claimTask,deliverTask,approveScript,rejectScript,p61Draft,p61Adopt,p61Drop,p61Restore:typeof p61Restore==='function'?p61Restore:null,claim62,deliver62,openRevision62,saveRevision62};`, context);
  return {context,api:context.api};
}

function financeFixture() {
  const source = sliceBetween('function monthOf(s){', 'function pageP52(jid){');
  const people = Object.fromEntries(['xiaoyu','daqiao','moli','tiantian','azhe','jiujiu','xiaoxiao','lizi','maizi','g71'].map((id,i)=>[
    id,{id,name:`主播${i+1}`,d14:[10,11,12],track:'sing'}
  ]));
  const context = {
    ST:{p70view:'platform',p70q:'',p71confirmed:{}}, CONFIG:{shenglangToRMB:0.1,baoXin:1,settle:{voice:1560,flow:156,rate:'12%',pay:18.7}},
    pageHead: title => `<h1>${title}</h1>`, resolveStreamer:id=>people[id], rateOf:person=>person.id==='maizi'?null:0.4,
    ailine:()=>'', sectHead:title=>`<h2>${title}</h2>`, esc:value=>String(value??''),
    render(){context.renders=(context.renders||0)+1;}, toast(message){context.lastToast=message;},
    openModal(markup){context.modal=markup;}, closeModal(){context.modal='';}, go(route){context.route=route;}
  };
  vm.runInNewContext(`${source}\nglobalThis.api={pageP70,pageP71,p70rows,p70SetView:typeof p70SetView==='function'?p70SetView:null,recordP70Difference:typeof recordP70Difference==='function'?recordP70Difference:null,confirmP70:typeof confirmP70==='function'?confirmP70:null,confirmP71:typeof confirmP71==='function'?confirmP71:null};`,context);
  return {context,api:context.api};
}

test('calendar day selection filters the vertical schedule and keeps full job context', () => {
  const {context,api}=calendarFixture();
  assert.equal(typeof api.p50SelectDay,'function');
  api.p50SelectDay(1);
  assert.equal(context.ST.p50day,1);
  const page=api.pageP50();
  assert.match(page,/明天的预约/);
  assert.match(page,/甜甜/);
  assert.match(page,/15:00/);
  assert.match(page,/直播间B/);
  assert.doesNotMatch(page,/class="cal7"/);
});

test('visual workbench shows same-day appointments as a compact scannable agenda, not a dense AI paragraph', () => {
  const {api,context}=calendarFixture();
  const page=api.pageP50();
  assert.match(page,/class="p50-route-note"/);
  assert.match(page,/小雨当天有两项服务安排，地点不同，出发前确认路线/);
  assert.match(page,/09:40/);
  assert.match(page,/14:00/);
  assert.match(page,/直播间A/);
  assert.match(page,/化妆间/);
  assert.doesNotMatch(page,/撞档提醒|先妆造再调试|按时间和地点自动比对排期/);
  context.ST.p50view='cal';
  const week=api.pageP50();
  assert.doesNotMatch(week,/按日期和时间顺序查看所有预约/);
  assert.equal((week.match(/class="p50-route-note"/g)||[]).length,1);
});

test('rescheduling supports any day in the visible week and the schedule reflects the saved time', () => {
  const {api,context}=calendarFixture();
  api.saveResched('j1');
  const job=api.WORKJOBS.find(item=>item.id==='j1');
  assert.equal(job.day,'d2');
  assert.equal(job.time,'17:30');
  assert.equal(context.ST.p50day,2);
  assert.match(api.pageP50(),/17:30/);
});

test('visual service and room debugging details expose appointment, owner, status, and a full-week reschedule', () => {
  const {api,context}=calendarFixture();
  const service=api.pageP51('j2');
  assert.match(service,/视觉服务单/);
  assert.match(service,/14:00/);
  assert.match(service,/化妆间/);
  assert.match(service,/服务负责人/);
  assert.match(service,/处理进度/);
  const debug=api.pageP52('j1');
  assert.match(debug,/预约时间/);
  assert.match(debug,/现场检查/);
  assert.match(debug,/发起人/);
  api.openResched('j1');
  assert.match(context.modal,/周二 · 10-20/);
  assert.match(context.modal,/value="d6"/);
});

test('content tasks show their owner and deadline and script delivery enters review before editing', () => {
  const {api,context}=contentFixture();
  assert.match(api.pageP60(),/负责人/);
  assert.match(api.pageP60(),/期限/);
  context.ST.p60view='topics';
  const topics=api.pageP60();
  assert.match(topics,/class="p60-section-head p60-topic-head"/);
  assert.match(topics,/class="btn p p60-topic-add"[^>]*>新建选题/);
  const script=api.pageP61('k1');
  assert.match(script,/<h3>开场<\/h3>/);
  assert.match(script,/<h3>互动<\/h3>/);
  assert.match(script,/人设适配/);
  assert.match(api.pageP62(),/交付期限/);
  assert.match(api.pageP62(),/负责人/);
  assert.match(api.pageP62(),/class="p62-filterbar" aria-label="按任务状态筛选"/);
  assert.match(html,/\.p62-filterbar\{display:grid;grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  api.claimTask('k1');
  api.p61Draft('k1');
  api.p61Adopt('k1');
  api.deliverTask('k1');
  assert.equal(api.TASKS60.find(item=>item.id==='k1').st,'待运营审');
  assert.equal(api.TASKS62.length,2);
  api.rejectScript('k1');
  assert.equal(api.TASKS60.find(item=>item.id==='k1').st,'进行中');
  assert.equal(api.D61.k1.st,'draft');
  assert.equal(context.ST.todoExtra.length,0);
});

test('review approval creates the linked clip task only after acceptance', () => {
  const {api}=contentFixture();
  api.claimTask('k1'); api.p61Draft('k1'); api.p61Adopt('k1'); api.deliverTask('k1');
  api.approveScript('k1');
  assert.equal(api.TASKS60.find(item=>item.id==='k1').st,'已交付');
  assert.equal(api.D61.k1.st,'sent');
  assert.equal(api.TASKS62.length,3);
  assert.equal(api.TASKS62[0].sid,'azhe');
  assert.ok(api.TASKS62[0].owner);
});

test('discarding a script keeps it discarded across rerenders and supports an explicit restore', () => {
  const {api}=contentFixture();
  api.p61Draft('k1'); api.p61Drop('k1');
  assert.equal(api.p61Draft('k1').st,'discarded');
  assert.equal(api.TASKS60.find(item=>item.id==='k1').st,'已取消');
  assert.equal(typeof api.p61Restore,'function');
  api.p61Restore('k1');
  assert.equal(api.p61Draft('k1').st,'draft');
  assert.equal(api.TASKS60.find(item=>item.id==='k1').st,'进行中');
});

test('clip delivery can be returned for a tracked revision and re-enters the active queue', () => {
  const {api,context}=contentFixture();
  const waiting=api.TASKS62.find(item=>item.id==='c1');
  api.claim62('c1');
  assert.equal(waiting.st,'进行中');
  api.deliver62('c1');
  assert.equal(waiting.st,'已交付');
  const clip=api.TASKS62.find(item=>item.id==='c2');
  api.deliver62('c2');
  api.openRevision62('c2');
  assert.match(context.modal,/r62note/);
  api.saveRevision62('c2');
  assert.equal(clip.st,'进行中');
  assert.equal(clip.ver,3);
  assert.equal(clip.rev.at(-1).note,'结尾节奏偏慢，调整最后15秒');
  assert.match(api.pageP62(),/返修中/);
});

test('finance uses stacked bill records with complete units and period, and confirmation is explicit', () => {
  const {api,context}=financeFixture();
  const workbench=api.pageP70();
  assert.match(workbench,/平台结算/);
  assert.match(workbench,/主播账单/);
  assert.doesNotMatch(workbench,/<table/i);
  assert.equal(typeof api.p70SetView,'function');
  api.confirmP70();
  assert.equal(context.ST.p70checked,undefined);
  api.recordP70Difference();
  api.confirmP70();
  assert.equal(context.ST.p70checked,true);
  api.p70SetView('creators');
  const list=api.pageP70();
  assert.match(list,/万声浪/);
  assert.match(list,/¥/);
  const bill=api.pageP71('xiaoyu');
  assert.match(bill,/10月/);
  assert.match(bill,/预计实发/);
  assert.match(bill,/折合流水/);
  assert.match(bill,/合同分成/);
  assert.match(bill,/结算工作台/);
  assert.match(bill,/待确认/);
  assert.equal(typeof api.confirmP71,'function');
  api.confirmP71('xiaoyu');
  assert.equal(context.ST.p71confirmed.xiaoyu,true);
  assert.match(api.pageP71('xiaoyu'),/已确认/);
});

test('P70/P71 long money and calculation text can wrap without widening the page', () => {
  const amountRule = html.match(/\.p70-difference>b\s*\{([^}]*)\}/)?.[1] || '';
  assert.match(amountRule, /flex:\s*0\s+1\s+auto/);
  assert.match(amountRule, /min-width:\s*0/);
  assert.match(amountRule, /overflow-wrap:\s*anywhere/);
  const billAmountRule = html.match(/\.p71-amount-main strong\s*\{([^}]*)\}/)?.[1] || '';
  const calculationRule = html.match(/\.p71-calc-step\s*\{([^}]*)\}/)?.[1] || '';
  assert.match(billAmountRule, /overflow-wrap:\s*anywhere/);
  assert.match(calculationRule, /overflow-wrap:\s*anywhere/);
});
