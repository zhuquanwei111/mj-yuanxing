import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

function sourceBetween(startText, endText) {
  const start = html.indexOf(startText);
  const end = html.indexOf(endText, start);
  assert.ok(start >= 0 && end > start, `source exists between ${startText} and ${endText}`);
  return html.slice(start, end);
}

function fixture() {
  const todoData = sourceBetween('const TODOS_AM = [', 'const OKTOAST =');
  const todoLeft = sourceBetween('function todoLeft(){', 'function navHtml(');
  const todoSorted = sourceBetween('function todoSorted(){', 'function todoMore(');
  const context = {
    ST: { done: new Set(), todoExtra: [{ id: 'receipt-1' }] }
  };
  vm.runInNewContext(`${todoData}\n${todoLeft}\n${todoSorted}\nglobalThis.api={todoLeft,todoSorted};`, context);
  return { context, api: context.api };
}

test('today queue includes pending tasks from both shifts and counts each once', () => {
  const { context, api } = fixture();

  assert.equal(api.todoSorted().length, 11);
  assert.ok(api.todoSorted().some(todo => todo.id === 'a2'));
  assert.ok(api.todoSorted().some(todo => todo.id === 'p1'));
  assert.equal(api.todoLeft(), 12);

  context.ST.done.add('a2');
  context.ST.done.add('p1');
  assert.equal(api.todoSorted().length, 9);
  assert.equal(api.todoLeft(), 10);
});
