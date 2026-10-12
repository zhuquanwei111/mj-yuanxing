import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

function sliceBetween(startText, endText) {
  const start=html.indexOf(startText),end=html.indexOf(endText,start+startText.length);
  assert.ok(start>=0&&end>start,`source section exists: ${startText}`);
  return html.slice(start,end);
}

function platformFixture(){
  const p00=sliceBetween('function pageP00(){','const ROSTER40 = [');
  const p10=sliceBetween('function keep10(k,v){','function auditTimeline(name){');
  const p01=sliceBetween('function auditTimeline(name){','function passApp(name){');
  const p11=sliceBetween('function p11Step(n){','const LIVE12 = {');
  const p12=sliceBetween('const LIVE12 = {','function p12Toggle(key){');
  const p95=sliceBetween('function pageP95(){','function addGroupModal(){');
  const guilds=sliceBetween('const GUILDS02 = [','function noticeModal(){');
  const p96=sliceBetween('const AICAPS = [','function pageP00(){');
  const roleNames=['boss','yunying','jingji','peixun','zhuangzao','biandao','jianji','caiwu','zongjian','zuzhang','zhubo','plat'];
  const roles=Object.fromEntries(roleNames.map((id,i)=>[id,{n:`角色${i+1}`,one:`职责${i+1}`,av:`${i+1}`,cls:'',home:'P00',tabs:[]} ]));
  const context={
    ST:{p10app:null,p10docs:{license:false,permit:false},p10err:{},p10keep:{nm:'',ct:'',tr:'才艺唱歌',sc:'主播 20-100 人'},p11:{step:1,lock:false,depts:['运营','经纪'],invites:[],tpl:false,names:null},p12open:{},p12ask:null,p12role:'运营',p02sel:'星曜传媒',p02view:'overview',p02guilds:{},p03view:'overview',p95group:null,p96view:'overview',p01view:'list',p01sel:'云杉文化',p01passed:{},extraGroups:[]},
    ROLES:roles,GUILDS02:undefined,events:[],values:{},
    ALL_ASSETS:[{id:'a',name:'阿岚',grpName:'运营一组 · 林悦',risk:{text:'流水下滑'}},{id:'b',name:'小鹿',grpName:'运营一组 · 林悦',risk:null}],
    grpAgg:()=>[{name:'运营一组 · 林悦',n:2}],grpLead:name=>name.split('·')[1]?.trim()||name,
    pageHead:title=>`<header>${title}</header>`,esc:value=>String(value??''),ailine:()=>'<aside>提示</aside>',sectHead:title=>`<h2>${title}</h2>`,
    emptyBox:title=>`<div class="empty">${title}</div>`,toast(message){context.events.push(message);},render(){context.renders=(context.renders||0)+1;},go(route){context.route=route;},
    openModal(markup){context.modal=markup;},closeModal(){context.modal='';},document:{getElementById(id){if(context.values[id]!==undefined)return {value:context.values[id]};if(id==='f-nm'||id==='f-ct')return {value:'',focus(){context.focusedElement=id;context.events.push(`focus:${id}`);}};return null;}}
  };
  vm.runInNewContext(`${p00}\n${p10}\n${p01}\n${p11}\n${p12}\n${p95}\n${guilds}\n${p96}\nglobalThis.api={pageP00,pageP10,submitP10,p10NextStep:typeof p10NextStep==='function'?p10NextStep:null,p10PrevStep:typeof p10PrevStep==='function'?p10PrevStep:null,pageP01,reviewApplication:typeof reviewApplication==='function'?reviewApplication:null,openGuildApplication:typeof openGuildApplication==='function'?openGuildApplication:null,pageP11,p11Step,pageP12,p12SetView:typeof p12SetView==='function'?p12SetView:null,pageP02,p02SetView:typeof p02SetView==='function'?p02SetView:null,planModal,savePlan,stopModal,doStop,resumeG,pageP03,p03SetView:typeof p03SetView==='function'?p03SetView:null,pageP95,p95OpenGroup,p95Back,pageP96,p96SetView:typeof p96SetView==='function'?p96SetView:null};`,context);
  return {context,api:context.api};
}

test('P00 shows ungrouped horizontal identity rows and keeps the application path secondary',()=>{
  const {context,api}=platformFixture();
  const page=api.pageP00();
  assert.doesNotMatch(page,/p00-group|公会经营|运营与成长|内容与服务|主播工作|平台服务/);
  assert.equal((page.match(/class="rcard/g)||[]).length,12);
  assert.equal((page.match(/onclick="pickRole\('/g)||[]).length,12);
  assert.match(html,/#app \.p00v2 button\.rcard\{[\s\S]*?display:flex;[\s\S]*?width:100%/);
  assert.match(page,/P10/);
  assert.doesNotMatch(page,/了解这套系统怎么运转/);
  assert.ok(context.ROLES);
});

test('P10 is a two-step application, validates in place, and preserves all entered values',()=>{
  const {context,api}=platformFixture();
  assert.equal(typeof api.p10NextStep,'function');
  api.p10NextStep();
  assert.equal(context.ST.p10step,1);
  assert.ok(context.ST.p10err.nm);
  context.ST.p10keep.nm='北岸传媒';
  api.p10NextStep();
  assert.equal(context.ST.p10step,2);
  let page=api.pageP10();
  assert.match(page,/第 2 步，共 2 步/);
  assert.match(page,/北岸传媒/);
  assert.match(page,/联系人/);
  api.submitP10();
  assert.ok(context.ST.p10err.ct);
  context.ST.p10keep.ct='李经理 13800000000';
  context.ST.p10keep.tr='舞蹈';
  context.ST.p10keep.sc='主播 20 人以下';
  api.submitP10();
  assert.equal(context.ST.p10app.name,'北岸传媒');
  assert.equal(context.ST.p10app.contact,'李经理 13800000000');
  assert.equal(context.ST.p10app.track,'舞蹈');
});

test('P10 returns keyboard focus to the guild name field after required-name validation rerenders',()=>{
  const {context,api}=platformFixture();
  api.p10NextStep();
  assert.ok(context.ST.p10err.nm);
  assert.equal(context.focusedElement,'f-nm');
  assert.equal(context.events.at(-1),'focus:f-nm');
});

test('P10 moves keyboard focus to the first field after advancing to step two',()=>{
  const {context,api}=platformFixture();
  context.ST.p10keep.nm='北岸传媒';
  api.p10NextStep();
  assert.equal(context.ST.p10step,2);
  assert.equal(context.focusedElement,'f-ct');
});

test('P10 returns keyboard focus to the contact field after submission validation rerenders',()=>{
  const {context,api}=platformFixture();
  context.ST.p10keep.nm='北岸传媒';
  api.p10NextStep();
  context.focusedElement=null;
  api.submitP10();
  assert.ok(context.ST.p10err.ct);
  assert.equal(context.focusedElement,'f-ct');
  assert.equal(context.events.at(-1),'focus:f-ct');
});

test('P01 separates the application queue from a selected review and keeps decision controls with that record',()=>{
  const {context,api}=platformFixture();
  assert.equal(typeof api.reviewApplication,'function');
  const list=api.pageP01();
  assert.match(list,/申请列表/);
  assert.doesNotMatch(list,/资质材料/);
  api.reviewApplication('北岸传媒');
  const review=api.pageP01();
  assert.match(review,/北岸传媒/);
  assert.match(review,/资质材料/);
  assert.match(review,/审核时间线/);
  assert.match(review,/通过并开通/);
  assert.match(review,/返回申请列表/);
  assert.equal(context.ST.p01sel,'北岸传媒');
});

test('P02 pending guild opens its matching application directly in the review view',()=>{
  const {context,api}=platformFixture();
  assert.equal(typeof api.openGuildApplication,'function');
  api.openGuildApplication('北岸传媒');
  assert.equal(context.route,'P01');
  assert.equal(context.ST.p01sel,'北岸传媒');
  assert.equal(context.ST.p01view,'review');
  assert.match(api.pageP01(),/北岸传媒/);
});

test('P11 shows current and remaining setup steps and offers a direct next action',()=>{
  const {context,api}=platformFixture();
  context.ST.p11.step=2;
  const page=api.pageP11();
  assert.match(page,/第 2 步，共 3 步/);
  assert.match(page,/邀请员工/);
  assert.match(page,/上一步/);
  assert.match(page,/下一步/);
  api.p11Step(3);
  assert.match(api.pageP11(),/导入主播/);
});

test('P12 organizes permissions into role and department views with explicit readable access labels',()=>{
  const {api}=platformFixture();
  assert.equal(typeof api.p12SetView,'function');
  const roles=api.pageP12();
  assert.match(roles,/角色权限/);
  assert.match(roles,/资源权限决定可见范围/);
  assert.match(roles,/只读/);
  assert.doesNotMatch(roles,/完整权限矩阵/);
  api.p12SetView('departments');
  const departments=api.pageP12();
  assert.match(departments,/部门与人数/);
  assert.doesNotMatch(departments,/权限矩阵/);
});

test('P02 and P03 use task views instead of stacking guild administration, alerts, announcements, and ranking',()=>{
  const {api}=platformFixture();
  assert.equal(typeof api.p02SetView,'function');
  assert.equal(typeof api.p03SetView,'function');
  const overview=api.pageP02();
  assert.match(overview,/公会概况/);
  assert.doesNotMatch(overview,/全部公会与等级规则/);
  api.p02SetView('list');
  assert.match(api.pageP02(),/公会列表/);
  const dashboard=api.pageP03();
  assert.match(dashboard,/经营概况/);
  assert.match(dashboard,/优先处理/);
  assert.doesNotMatch(dashboard,/公会排行 · 按本月AI用量/);
  api.p03SetView('ranking');
  assert.match(api.pageP03(),/公会排行/);
  assert.doesNotMatch(api.pageP03(),/10月平台活动/);
});

test('P02 keeps a pending guild in review state and does not present provisioned modules or plan controls',()=>{
  const {context,api}=platformFixture();
  context.ST.p02sel='北岸传媒';
  const page=api.pageP02();
  assert.match(page,/杭州 · 审核中/);
  assert.match(page,/审核通过后配置套餐与功能/);
  assert.match(page,/查看入驻审核/);
  assert.doesNotMatch(page,/已开通功能/);
  assert.doesNotMatch(page,/调整套餐/);
  assert.match(page,/合规状态：审核中/);
});

test('P02 keeps an approved applicant manageable after plan changes, stop, and resume',()=>{
  const {context,api}=platformFixture();
  context.ST.p01passed['北岸传媒']=true;
  context.ST.p02sel='北岸传媒';
  let page=api.pageP02();
  assert.match(page,/杭州 · 已开通/);
  assert.match(page,/已开通功能/);
  assert.match(page,/调整套餐/);

  context.values.plm='旗舰版';
  api.savePlan('北岸传媒');
  page=api.pageP02();
  assert.match(page,/旗舰版/);
  assert.ok(context.events.includes('北岸传媒套餐已调整为旗舰版'));

  api.doStop('北岸传媒');
  page=api.pageP02();
  assert.match(page,/杭州 · 已停用/);
  assert.match(page,/恢复开通/);
  api.resumeG('北岸传媒');
  page=api.pageP02();
  assert.match(page,/杭州 · 已开通/);
  assert.match(page,/旗舰版/);
});

test('P96 is a secondary learning page split into named capability, tools, and workflow views',()=>{
  const {api}=platformFixture();
  assert.equal(typeof api.p96SetView,'function');
  const overview=api.pageP96();
  assert.match(overview,/概览/);
  assert.match(overview,/感知/);
  assert.doesNotMatch(overview,/工具箱 · 十件/);
  api.p96SetView('tools');
  assert.match(api.pageP96(),/业务工具/);
  api.p96SetView('workflow');
  const workflow=api.pageP96();
  assert.match(workflow,/使用流程/);
  assert.doesNotMatch(workflow,/对标 Claude Code/);
});

test('P95 shows scannable group summaries and opens member names only in the selected group',()=>{
  const {api}=platformFixture();
  const page=api.pageP95();
  assert.match(page,/运营一组 · 林悦/);
  assert.match(page,/林悦/);
  assert.match(page,/2 人/);
  assert.match(page,/1 人需跟进/);
  assert.doesNotMatch(page,/阿岚|小鹿/);
  assert.equal(typeof api.p95OpenGroup,'function');
  assert.equal(typeof api.p95Back,'function');
  api.p95OpenGroup('运营一组 · 林悦');
  const detail=api.pageP95();
  assert.match(detail,/返回组织列表/);
  assert.match(detail,/组成员/);
  assert.match(detail,/阿岚/);
  assert.match(detail,/小鹿/);
  api.p95Back();
  assert.doesNotMatch(api.pageP95(),/阿岚|小鹿/);
});

test('P94 task assignment uses intact user-facing labels',()=>{
  const source=sliceBetween('function assign41Modal(sid){','function saveAssign41(){');
  let modal='';
  const context={
    openModal(markup){modal=markup;},
    p94Members:()=>[{id:'a',name:'小雨'}]
  };
  vm.runInNewContext(`${source}\nglobalThis.api={assign41Modal};`,context);
  context.api.assign41Modal();
  assert.match(modal,/给哪位主播/);
  assert.doesNotMatch(modal,/\uFFFD/);
  assert.doesNotMatch(html,/\uFFFD/,'the prototype must not render replacement characters in user-facing copy');
});
