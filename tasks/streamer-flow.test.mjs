import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
function section(startText, endText){
  const start=html.indexOf(startText), end=html.indexOf(endText,start);
  assert.ok(start>=0&&end>start,`prototype section exists: ${startText}`);
  return html.slice(start,end);
}

function fixture(){
  const context={
    ST:{indep:false,memberActive:false,memberUntil:'2026-11-09',p85view:'account',p84view:'overview',p81planAckKey:null,p81view:'current',p82view:'latest'},
    CONFIG:{memberPrice:100,shenglangToRMB:10000},
    TRACK:{sing:'才艺唱歌'}, messages:[],renders:0,modalOpen:true,
    streamer:{name:'小雨',track:'sing',join:'2026-03-14',exp:'2027-03-13',plans:[
      {d:'10-14',k:'单场',t:'周六大场：翻唱连打＋两场连麦',goal:'音浪冲5.5万',st:'draft',text:'19:30提前开播热场'},
      {d:'10-13',k:'单场',t:'周五晚场冲刺',goal:'音浪4.5万',st:'running'}
    ]},
    byId(id){return id==='xiaoyu'?context.streamer:null;},
    monthOf(){return 4.6;},rateOf(){return .4;},
    esc(value){return String(value).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));},
    segView(label,items,selected){return `<nav data-label="${label}" data-selected="${selected}">${items.map(x=>`<span>${x[1]}</span>`).join('')}</nav>`;},
    toast(message){context.messages.push(message);},render(){context.renders++;},closeModal(){context.modalOpen=false;},
    qrow(options){return `<article>${options.title}${options.sub||''}</article>`;},
    sectHead(){return '<h2>本场流程</h2>';}
  };
  const code=[
    section('function p81CurrentPlan(){','function p81HistoryDetail('),
    section('function pageP81(){','function p82View('),
    section('function p82View(v){','function p82evToggle('),
    section('function p85ConfirmMember(){','function goIndep('),
    section('function pageP85(){','const EXAMS = ['),
    section('function pageP84(){','\nfunction p84View(v)')
  ].join('\n');
  vm.runInNewContext(code+'\nglobalThis.api={p81PlanKey,p81IsConfirmed,p81Confirm,pageP81,p82View,p85ConfirmMember,pageP85,pageP84};',context,{filename:'prototype-streamer-flow.js'});
  return {context,api:context.api};
}

test('plan acknowledgement follows the exact current plan and resets when its content changes',()=>{
  const {context,api}=fixture();
  const plan=context.streamer.plans[1];
  assert.equal(api.p81IsConfirmed(plan),false);
  api.p81Confirm();
  assert.equal(api.p81IsConfirmed(plan),true);
  const confirmedView=api.pageP81();
  assert.match(confirmedView,/当前计划已确认/);
  assert.match(confirmedView,/<button class="btn g" disabled/);
  assert.match(confirmedView,/>已确认<\/button>/);
  plan.goal='音浪目标更新';
  assert.equal(api.p81IsConfirmed(plan),false);
  assert.deepEqual(context.messages,[]);
  assert.equal(context.renders,1);
});

test('legacy MY and streamer views can show a bound account with a direct next step',()=>{
  const {api}=fixture();
  const account=api.pageP85();
  assert.match(account,/星曜传媒/);
  assert.match(account,/已激活/);
  assert.match(account,/看今天安排/);
});

test('membership content offers purchase only to an independent basic account',()=>{
  const {context,api}=fixture();
  context.ST.p85view='membership';
  assert.match(api.pageP85(),/公会账号权益/);
  assert.doesNotMatch(api.pageP85(),/开通会员/);
  context.ST.indep=true;
  const offer=api.pageP85();
  assert.match(offer,/升级为明镜会员/);
  assert.match(offer,/开通会员/);
  context.ST.memberActive=true;
  const active=api.pageP85();
  assert.match(active,/已开通/);
  assert.match(active,/2026-11-09/);
  assert.doesNotMatch(active,/确认开通/);
});

test('member confirmation updates the displayed entitlement and gives a completion result',()=>{
  const {context,api}=fixture();
  context.ST.indep=true;
  api.p85ConfirmMember();
  assert.equal(context.ST.memberActive,true);
  assert.equal(context.ST.memberUntil,'2026-11-09');
  assert.equal(context.ST.p85view,'membership');
  assert.equal(context.modalOpen,false);
  assert.match(api.pageP85(),/已开通/);
  assert.equal(context.messages.at(-1),'会员已开通，有效至 11 月 9 日');
});

test('profile has separate overview, schedule, and account views with period and currency units',()=>{
  const {context,api}=fixture();
  const overview=api.pageP84();
  assert.match(overview,/2026 年 10 月/);
  assert.match(overview,/预计实发/);
  assert.match(overview,/¥/);
  context.ST.p84view='schedule';
  assert.match(api.pageP84(),/周二/);
  assert.match(api.pageP84(),/20:00–23:00/);
  context.ST.p84view='account';
  assert.match(api.pageP84(),/2026-03-14/);
  assert.match(api.pageP84(),/2027-03-13/);
});

test('review view selection is a stable explicit page state',()=>{
  const {context,api}=fixture();
  api.p82View('history');
  assert.equal(context.ST.p82view,'history');
  assert.equal(context.renders,1);
});

test('streamer assistant focus hides bottom navigation and its send label stays on one line',()=>{
  const toggles=[];
  const screen={classList:{toggle:(...args)=>toggles.push(args)}};
  const input={scrollIntoView:options=>{screen.scrollOptions=options;}};
  const context={
    ST:{role:'zhubo'},selector:'',
    document:{querySelector:value=>{context.selector=value;return screen;},getElementById:()=>input},
    requestAnimationFrame:callback=>callback(),
  };
  vm.runInNewContext(section('function assistantKeyboard(open){','function pageAI(){')+'\nglobalThis.sync=assistantKeyboard;',context);
  context.sync(true);
  context.sync(false);
  const page=section('function pageAI(){','/* ===== P93/P94/P95');

  assert.deepEqual(toggles,[['keyboard-open',true],['keyboard-open',false]]);
  assert.match(context.selector,/data-page="P83"/);
  assert.equal(screen.scrollOptions.block,'nearest');
  assert.match(page,/chatField\("aiin",[^;]*,true\)/);
  assert.match(page,/class="btn p" onclick="aiSend\(\)">发送<\/button>/);
  assert.match(html,/#app \.screen\[data-page="P83"\] \.chatbar>button\.btn\.p\{[^}]*width:64px!important[^}]*min-width:64px!important[^}]*white-space:nowrap/);
  assert.match(html,/#app \.screen\[data-page="P83"\]\.keyboard-open \.mtabs\{display:none/);
});
