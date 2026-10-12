import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';

test('the prototype uses an inline icon and does not request a missing favicon resource', () => {
  assert.match(head, /<link\b[^>]*rel=["']icon["'][^>]*href=["']data:image\/svg\+xml,/i);
  assert.doesNotMatch(head, /href=["'][^"']*favicon\.ico/i);
});
