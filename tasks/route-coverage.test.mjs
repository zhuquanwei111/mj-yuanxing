import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html',import.meta.url),'utf8');
function between(startText,endText){
  const start=html.indexOf(startText),end=html.indexOf(endText,start);
  assert.ok(start>=0&&end>start,`source section exists: ${startText}`);
  return html.slice(start,end);
}
const pageSource=between('const PAGES = {','\n};');
const pageIds=[...pageSource.matchAll(/^\s*(P\d+):\{/gm)].map(match=>match[1]);
const renderSource=between('function render(){','const pidChanged = pid !== ST.lastRenderPid;');
const caseIds=[...renderSource.matchAll(/case "(P\d+)"/g)].map(match=>match[1]);
const routeIds=new Set([...pageIds,'AI','MY','P30D','P41D']);

test('all 45 fixed page entries have a unique explicit render path',()=>{
  assert.equal(pageIds.length,45);
  assert.equal(new Set(pageIds).size,pageIds.length,'page directory has no duplicate identifiers');
  assert.equal(new Set(caseIds).size,caseIds.length,'render switch has no duplicate cases');
  assert.deepEqual([...pageIds].filter(id=>!caseIds.includes(id)&&id!=='P00'),[],'every fixed page has a render case or explicit entry branch');
  assert.match(renderSource,/pid==="P00"/);
  assert.match(renderSource,/pid==="P96"/);
});

test('the 49 prototype routes include four explicit auxiliary routes',()=>{
  assert.equal(routeIds.size,49);
  for(const route of ['AI','MY','P30D','P41D'])assert.equal(routeIds.has(route),true,`${route} is in the route set`);
  assert.match(renderSource,/case "AI"/);
  assert.match(renderSource,/pid==="MY"/);
  assert.match(renderSource,/case "P30D"/);
  assert.match(renderSource,/case "P41D"/);
});

test('every role bottom-navigation destination points to a known route',()=>{
  const roles=between('const ROLES = {','function mshell(pid, inner, activeTab, back){');
  const destinations=[...roles.matchAll(/\["(P\d+|AI|MY)"/g)].map(match=>match[1]);
  const missing=[...new Set(destinations.filter(route=>!routeIds.has(route)))];
  assert.deepEqual(missing,[]);
  assert.ok(destinations.length>=40,'role navigation destinations are covered');
});
