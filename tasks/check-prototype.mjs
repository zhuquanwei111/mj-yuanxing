import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, '明镜', '1_产品原型', '明镜产品原型.html');
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) throw new Error('Prototype has no inline JavaScript');
for (const [, script] of scripts) new Function(script);
if (!html.includes('<meta name="viewport"')) throw new Error('Viewport metadata missing');
console.log(`PASS: ${scripts.length} inline script(s) compile; viewport metadata present.`);
console.log('Layout and interaction acceptance require the recorded browser checks.');
