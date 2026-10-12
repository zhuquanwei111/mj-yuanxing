import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../明镜/1_产品原型/明镜产品原型.html', import.meta.url), 'utf8');
const marker = '/* ===== T17.3 shared design tokens ===== */';
const start = html.indexOf(marker);
assert.notEqual(start, -1, 'shared design token block exists');
const end = html.indexOf('/* ===== End T17.3 shared design tokens ===== */', start);
assert.ok(end > start, 'shared design token block has a clear end');
const tokens = html.slice(start, end);

test('shared design tokens define the neutral, semantic, type, spacing, radius, and elevation scales', () => {
  const expected = [
    '--color-neutral-0:#FFFFFF', '--color-neutral-50:#FAFAFA', '--color-neutral-100:#F2F2F2',
    '--color-neutral-300:#DEDEDE', '--color-neutral-600:#666666', '--color-neutral-900:#171717',
    '--color-primary:#111111', '--color-primary-soft:#F2F2F2',
    '--color-success:#2F765F', '--color-success-soft:#EEF6F1',
    '--color-warning:#806216', '--color-warning-soft:#FAF6EA',
    '--color-risk:#A33D3D', '--color-risk-soft:#FAF0F0',
    '--font-title:16px', '--font-section:14px', '--font-body:14px', '--font-meta:12px',
    '--space-1:4px', '--space-2:8px', '--space-3:12px', '--space-4:16px', '--space-6:24px', '--space-8:32px',
    '--radius-tag:4px', '--radius-control:6px', '--radius-card:8px',
    '--avatar-list:32px', '--avatar-profile:64px',
    '--shadow-card:none',
  ];
  for (const token of expected) assert.ok(tokens.includes(token), `missing design token ${token}`);
  assert.match(tokens, /--shadow-overlay:0 8px 24px rgba\(0,0,0,\.12\)/);
});

test('the main prototype uses a neutral primary, scoped semantic states, and reduced-motion-safe feedback', () => {
  assert.doesNotMatch(html, /#70517C|#60446B|#F3EFF6|#806A89/i, 'the withdrawn purple direction is absent');
  assert.match(html, /html\[data-color-preview-green="true"\]\{[^}]*--color-success:#2F765F/i,
    'green is reserved for success and positive data');
  assert.match(html, /html\[data-color-preview="A"\]:not\(\[data-color-preview-green="true"\]\)\{--color-success:#555555/,
    'the legacy neutral comparison remains available');
  assert.match(tokens, /--brand:var\(--color-primary\)/);
  assert.match(tokens, /--warn:var\(--color-warning\)/);
  assert.match(tokens, /--danger:var\(--color-risk\)/);
  assert.match(tokens, /--ok:var\(--color-success\)/);
  assert.match(html, /#app button:focus-visible[^{]*\{[^}]*outline:/);
  assert.match(html, /#app button:disabled[^{]*\{[^}]*opacity:/);
  assert.match(html, /#app button:active:not\(:disabled\)[^{]*\{/);
  assert.match(html, /#app button\.btn\.p,#mask button\.btn\.p\{[^}]*border-radius:var\(--radius-control\)[^}]*background:var\(--color-primary\)/);
  assert.match(html, /#app button\.btn\.g,#mask button\.btn\.g\{[^}]*border-radius:var\(--radius-control\)[^}]*background:#fff/);
  assert.match(html, /#app button\.text-action:hover[^\{]*\{[^}]*text-decoration:underline/);
  assert.match(html, /#app \.ops-screen \.ops-focus[^\{]*\{border-radius:var\(--radius-card\)\}/);
  assert.match(html, /\.assistant-prompt\{border-radius:var\(--radius-control\)!important\}/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});
