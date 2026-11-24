import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderCallout } from '../src/components/Callout.js';

const RAIZ = resolve(import.meta.dirname, '..');

test('renderCallout genera las 3 variantes (warning, danger, info) y escapa HTML', () => {
  const warn = renderCallout({ tipo: 'warning', titulo: 'Aviso <test>', texto: 'Contenido seguro' });
  assert.match(warn, /class="callout callout-warning"/);
  assert.match(warn, /role="note"/);
  assert.match(warn, /Aviso &lt;test&gt;/);

  const danger = renderCallout({ tipo: 'danger', titulo: 'Crítico', texto: 'Riesgo' });
  assert.match(danger, /class="callout callout-danger"/);
  assert.match(danger, /role="alert"/);

  const info = renderCallout({ tipo: 'info', titulo: 'Dato', texto: 'Nota' });
  assert.match(info, /class="callout callout-info"/);
  assert.match(info, /role="note"/);
});

test('Las 5 advertencias críticas están integradas en informe.js, investigacion.js y recursos.js', () => {
  const informe = readFileSync(resolve(RAIZ, 'src/informe.js'), 'utf8');
  const investigacion = readFileSync(resolve(RAIZ, 'src/investigacion.js'), 'utf8');
  const recursos = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');

  assert.match(investigacion, /GitHub Free \+ repositorio privado/);
  assert.match(investigacion, /git reset --hard/);
  assert.match(informe, /Público → privado/);
  assert.match(informe, /pull_request_target/);
  assert.match(recursos, /Runners grandes/);
});
