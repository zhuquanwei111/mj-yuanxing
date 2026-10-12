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

test('the main content region supports keyboard scrolling and exposes focus clearly', () => {
  assert.ok(/<div class="mbody" tabindex="0" role="region" aria-label="页面内容" onkeydown="pageBodyScrollKeydown\(event\)">/.test(html));
  assert.ok(/#app \.screen>\.mbody:focus-visible\{[^}]*outline:2px solid/.test(html));

  const body = { scrollTop: 100, clientHeight: 400, scrollHeight: 1000, closest: () => null };
  const context = {};
  vm.runInNewContext(`${source('pageBodyScrollKeydown', 'function render(')}\nglobalThis.onKey=pageBodyScrollKeydown;`, context);
  const send = (key, options = {}) => {
    const event = { key, shiftKey: !!options.shiftKey, currentTarget: body, target: body, prevented: false, preventDefault() { this.prevented = true; } };
    context.onKey(event);
    return event.prevented;
  };

  assert.equal(send('PageDown'), true);
  assert.equal(body.scrollTop, 440);
  assert.equal(send('ArrowUp'), true);
  assert.equal(body.scrollTop, 392);
  assert.equal(send(' '), true);
  assert.equal(body.scrollTop, 600);
  assert.equal(send(' ', { shiftKey: true }), true);
  assert.equal(body.scrollTop, 260);
  assert.equal(send('Home'), true);
  assert.equal(body.scrollTop, 0);
  assert.equal(send('End'), true);
  assert.equal(body.scrollTop, 600);
});

test('keyboard scrolling does not steal keys from focused controls or open dialogs', () => {
  const body = { scrollTop: 10, clientHeight: 400, scrollHeight: 1000, closest: selector => selector === '.screen.modal-open' ? { className: 'screen modal-open' } : null };
  const context = {};
  vm.runInNewContext(`${source('pageBodyScrollKeydown', 'function render(')}\nglobalThis.onKey=pageBodyScrollKeydown;`, context);
  const child = { key: 'PageDown', currentTarget: body, target: {}, prevented: false, preventDefault() { this.prevented = true; } };
  context.onKey(child);
  assert.equal(child.prevented, false);
  assert.equal(body.scrollTop, 10);

  const focusedRegion = { key: 'PageDown', currentTarget: body, target: body, prevented: false, preventDefault() { this.prevented = true; } };
  context.onKey(focusedRegion);
  assert.equal(focusedRegion.prevented, false);
  assert.equal(body.scrollTop, 10);
});
