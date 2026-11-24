import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const RAIZ = resolve(import.meta.dirname, '..');
test('recursos.js y recursos.css existen y estan enlazados', () => {
  assert.equal(existsSync(resolve(RAIZ, 'src/recursos.js')), true);
  assert.equal(existsSync(resolve(RAIZ, 'src/styles/recursos.css')), true);
  const codigo = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');
  assert.match(codigo, /recursos\.css/);
  assert.match(codigo, /renderizarNavbar\(\)/);
  assert.match(codigo, /renderizarFooter\(\)/);
});
