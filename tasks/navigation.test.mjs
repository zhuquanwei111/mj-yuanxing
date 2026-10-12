import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html',import.meta.url),'utf8');
const fn=html.match(/function navigationTrail\(trail, current, next\)\{[\s\S]*?\n\}/);
assert.ok(fn,'Navigation must retain complete source routes');
const trailFor=vm.runInNewContext(`(${fn[0]})`);
const p=(hash,role='boss')=>({hash,role});
test('nested object routes return to the original list',()=>{
  let trail=[];
  trail=trailFor(trail,p('#P14'),p('#P22/azhe'));
  trail=trailFor(trail,p('#P22/azhe'),p('#P24/azhe'));
  assert.equal(trail.at(-1).hash,'#P22/azhe');
  trail=trailFor(trail,p('#P24/azhe'),p('#P22/azhe'));
  assert.equal(trail.at(-1).hash,'#P14');
  assert.equal(trailFor(trail,p('#P22/azhe'),p('#P14')).length,0);
});
test('role changes and identity picker clear previous role history',()=>{
  assert.equal(trailFor([p('#P13')],p('#P14'),p('#P30','jingji')).length,0);
  assert.equal(trailFor([p('#P13')],p('#P14'),p('#P00')).length,0);
});
