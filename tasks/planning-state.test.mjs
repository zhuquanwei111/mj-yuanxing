import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html',import.meta.url),'utf8');
test('planning inputs, cycle and draft stage belong to each streamer',()=>{
  const fn=source.match(/function planSession\(store, id\)\{[\s\S]*?\n\}/)?.[0];
  assert.ok(fn,'per-streamer planning state exists');
  const context=vm.createContext({}); vm.runInContext(fn,context);
  const store={}, first=context.planSession(store,'xiaoxiao');
  first.form.goal='8万'; first.form.focus='新话术'; first.tier='stage7'; first.stage='draft';
  const second=context.planSession(store,'laok'); second.form.focus='热场';
  assert.equal(second.form.goal,''); assert.equal(second.tier,'dan'); assert.equal(second.stage,'form');
  assert.equal(context.planSession(store,'xiaoxiao'),first);
  assert.equal(first.form.focus,'新话术'); assert.equal(first.form.goal,'8万'); assert.equal(first.tier,'stage7');
});
