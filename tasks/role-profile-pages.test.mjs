import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html',import.meta.url),'utf8');
function between(startText,endText){
  const start=html.indexOf(startText),end=html.indexOf(endText,start);
  assert.ok(start>=0&&end>start,`source section exists: ${startText}`);
  return html.slice(start,end);
}
function fixture(){
  const roles=between('const ROLES = {','function mshell(pid, inner, activeTab, back){');
  const profiles=between('function pickRole(k){','function mPlaceholder(pid){');
  const owner=between('function fmtN(n){','function monthOf(s){');
  const context={ST:{role:'boss'},CONFIG:{aiUsage:{assistant:61000,plan:39000},aiPrice:{assistant:.01,plan:.02},planQuota:150000},
    go(route){context.route=route;},render(){context.renders=(context.renders||0)+1;},toast(message){context.message=message;},
    esc(value){return String(value??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));},
    pageHead(){return '';},ailine(){return '';}};
  const picker=between('function pageP00(){','const ROSTER40 = [');
  vm.runInNewContext(`${roles}\n${profiles}\n${owner}\n${picker}\nglobalThis.api={ROLES,permOf,myPage,myIdentityCard:typeof myIdentityCard==='function'?myIdentityCard:null,pickRole,exitRole,mP16,pageP00};`,context);
  return {context,api:context.api};
}

const secondaryRoles=['yunying','jingji','peixun','zhuangzao','biandao','jianji','caiwu','zongjian','zuzhang','plat'];

test('all non-streamer roles use a shared identity frame and show their organization and data scope',()=>{
  const {api}=fixture();
  for(const role of secondaryRoles){
    const page=api.myPage(role),definition=api.ROLES[role];
    assert.match(page,/my-identity/ ,`${role} has the shared identity frame`);
    assert.match(page,/my-scope/ ,`${role} states its visible data scope`);
    assert.match(page,new RegExp(definition.n),`${role} label matches its role`);
    assert.match(page,new RegExp(role==='plat'?'明镜平台':'星曜传媒'),`${role} organization is appropriate`);
    assert.match(page,/切换工作身份/ ,`${role} has an explicit switch action`);
  }
});

test('work links reflect each role and do not render empty profile or permission sections',()=>{
  const {api}=fixture();
  const expected={yunying:['P20','P21'],jingji:['P30','P31'],peixun:['P40','P41'],zhuangzao:['P50','P51'],biandao:['P60','P61'],jianji:['P62'],caiwu:['P70','P71'],zongjian:['P93','P95'],zuzhang:['P94'],plat:['P01','P02']};
  for(const [role,routes] of Object.entries(expected)){
    const page=api.myPage(role);
    if(role==='yunying'){
      assert.doesNotMatch(page,/my-work-entries/,`${role} avoids duplicating bottom navigation shortcuts`);
      assert.match(page,/ops-identity-switch/,`${role} has a single identity-switch row`);
    }else{
      assert.match(page,/my-work-entries/,`${role} has named work shortcuts`);
      for(const route of routes)assert.match(page,new RegExp(`go\\('${route}'\\)`),`${role} links to ${route}`);
    }
    assert.doesNotMatch(page,/暂无权限|待开放|即将开放/);
  }
  for(const route of ['P20','P21','P25'])assert.doesNotMatch(api.myPage('yunying'),new RegExp(`go\\('${route}'\\)`),`operator work shortcuts are present in the bottom navigation instead`);
  assert.equal(api.myPage('yunying').includes("go('P12')"),false,'ordinary operator is not offered the admin permission console');
  assert.equal(api.myPage('zuzhang').includes("go('P95')"),false,'group lead is not offered the cross-company organization view');
  assert.doesNotMatch(api.myPage('zongjian'),/go\('P12'\)/,'permission administration stays on the owner account');
});

test('boss profile shares the account frame while keeping period and units on AI usage',()=>{
  const {api}=fixture();
  const page=api.mP16();
  assert.match(page,/my-identity/);
  assert.match(page,/公会老板/);
  assert.match(page,/全公司/);
  assert.match(page,/AI 用量/);
  assert.match(page,/当月/);
  assert.match(page,/累计调用/);
  assert.match(page,/套餐额度/);
  assert.match(page,/go\('P12'\)/);
  assert.match(page,/切换工作身份/);
  assert.doesNotMatch(page,/运营 · 只看自己名下主播/,'boss page does not repeat employee scopes');
});

test('role switching returns to the picker and a selected identity opens its own home',()=>{
  const {context,api}=fixture();
  api.exitRole();
  assert.equal(context.ST.role,null);
  assert.equal(context.route,'P00');
  api.pickRole('peixun');
  assert.equal(context.ST.role,'peixun');
  assert.equal(context.route,'P41');
});

test('P00 renders the twelve roles as one ungrouped list of horizontal identity rows',()=>{
  const {api}=fixture();
  const page=api.pageP00();
  const rows=[...page.matchAll(/<button type="button" class="rcard"[^>]*onclick="pickRole\('([^']+)'\)"/g)].map(match=>match[1]);
  assert.deepEqual(rows,Object.keys(api.ROLES),'identity order follows the existing role registry');
  assert.equal(rows.length,12);
  assert.doesNotMatch(page,/p00-group|p00grid|<h2/,'the picker does not divide roles into categories');
  for(const [key,role] of Object.entries(api.ROLES)){
    const row=page.match(new RegExp(`<button type="button" class="rcard"[^>]*onclick="pickRole\\('${key}'\\)"[\\s\\S]*?<\\/button>`))?.[0]||'';
    assert.match(row,new RegExp(role.n),`${key} displays its role name`);
    assert.match(row,new RegExp(role.one),`${key} displays its existing work description`);
    assert.match(row,new RegExp(`进入.*${role.n}.*工作台`),`${key} explains that the row opens its workspace`);
  }
});

test('P00 identity rows use an unboxed divider layout with narrow-screen wrapping',()=>{
  assert.match(html,/#app \.p00v2 button\.rcard[\s\S]*?border:0!important[\s\S]*?border-bottom:1px solid var\(--line-divider\)!important/);
  assert.match(html,/#app \.p00v2 button\.rcard \.ro[\s\S]*?overflow-wrap:anywhere/);
  assert.match(html,/#app \.p00v2 button\.rcard:focus-visible[\s\S]*?outline/);
});

test('legacy MY routes resolve to the correct boss, streamer, or shared role workspace',()=>{
  assert.equal((html.match(/\n\s{2}[a-z]+:\{n:/g)||[]).length,12,'prototype exposes all twelve identities');
  const myRoute=between('} else if (pid==="MY"){','const R = ROLES[ST.role];');
  assert.match(myRoute,/ST\.role==="boss"[\s\S]*?mP16\(\)/);
  assert.match(myRoute,/ST\.role==="zhubo"[\s\S]*?pageP84\(\)/);
  assert.match(myRoute,/myPage\(ST\.role\)/);
});
