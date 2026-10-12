import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');

test('closing a modal after rerender restores focus to the matching replacement action', () => {
  const finish = html.match(/function finishModalClose\(\)\{[\s\S]*?\n\}/)?.[0];
  assert.ok(finish, 'modal close completion exists');

  const replacement = { focused: false, focus() { this.focused = true; } };
  const fallback = { focused: false, focus() { this.focused = true; } };
  const context = {
    overlays: {
      trigger: { isConnected: false, focus() {} },
      returnFocus: () => replacement,
      mask: {
        dataset: { phase: 'closing' }, style: {},
        classList: { remove() {}, contains() { return false; } },
      },
      modal: { classList: { remove() {} } },
    },
    modalCloseTimer: 1,
    clearTimeout() {},
    modalBackground() {},
    document: { querySelector() { return fallback; } },
  };
  vm.runInNewContext(`${finish}\nglobalThis.close=finishModalClose;`, context);
  context.close();

  assert.equal(replacement.focused, true);
  assert.equal(fallback.focused, false);
});

test('P23 and P24 editor actions pass their invoker and a stable rerender focus target', () => {
  assert.match(html, /function editP23\(id,\s*trigger\)/);
  assert.match(html, /function editP24\(id,\s*trigger\)/);
  assert.match(html, /editP23\('\$\{id\}',this\)/);
  assert.match(html, /editP24\('\$\{id\}',this\)/);
  assert.match(html, /data-focus-key="p23-edit-\$\{id\}"/);
  assert.match(html, /data-focus-key="p24-edit-\$\{id\}"/);
  assert.match(html, /returnFocus:\(\)=>document\.querySelector\(`\[data-focus-key="p23-edit-\$\{id\}"\]`\)/);
  assert.match(html, /returnFocus:\(\)=>document\.querySelector\(`\[data-focus-key="p24-edit-\$\{id\}"\]`\)/);
});
