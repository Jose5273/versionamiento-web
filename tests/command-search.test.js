import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buscarComandos,
  resaltarCoincidencia,
  crearDebounce,
} from '../src/components/CommandSearch.js';

const RAIZ = resolve(import.meta.dirname, '..');
const todosComandos = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-all.json'), 'utf8')
);

test('commands-all.json contiene 40 comandos únicos y cubre etiquetas principales', () => {
  assert.equal(Array.isArray(todosComandos), true);
  assert.equal(todosComandos.length, 40);

  const ids = new Set();
  const cmds = new Set();
  const todasEtiquetas = new Set();

  for (const item of todosComandos) {
    assert.equal(ids.has(item.id), false, `ID duplicado: ${item.id}`);
    ids.add(item.id);
    assert.equal(cmds.has(item.comando), false, `Comando duplicado: ${item.comando}`);
    cmds.add(item.comando);
    assert.equal(Array.isArray(item.etiquetas) && item.etiquetas.length > 0, true);
    item.etiquetas.forEach((e) => todasEtiquetas.add(e));
  }

  for (const req of ['#rama', '#conflicto', '#deshacer', '#tag']) {
    assert.equal(todasEtiquetas.has(req), true, `Falta etiqueta requerida ${req}`);
  }
});

test('buscarComandos soporta búsqueda por texto, multiselección de etiquetas y estado vacío', () => {
  const porTexto = buscarComandos(todosComandos, { termino: 'rebase' });
  assert.equal(porTexto.length >= 4, true);

  const multiTag = buscarComandos(todosComandos, {
    etiquetasActivas: ['#conflicto', '#deshacer'],
  });
  assert.equal(multiTag.length >= 2, true);
  assert.equal(
    multiTag.every((c) => c.etiquetas.includes('#conflicto') && c.etiquetas.includes('#deshacer')),
    true
  );

  const vacio = buscarComandos(todosComandos, { termino: 'comando_inexistente_xyz' });
  assert.equal(vacio.length, 0);
});

test('resaltarCoincidencia escapa HTML y envuelve coincidencias con <mark>', () => {
  const res = resaltarCoincidencia('git switch -c <rama>', 'switch');
  assert.match(res, /<mark class="resaltado">switch<\/mark>/);
  assert.match(res, /&lt;rama&gt;/);
});

test('crearDebounce agrupa llamadas consecutivas dentro de la ventana de 200ms', async () => {
  let conteo = 0;
  const debounced = crearDebounce(() => {
    conteo += 1;
  }, 50);

  debounced();
  debounced();
  debounced();
  assert.equal(conteo, 0);

  await new Promise((r) => setTimeout(r, 90));
  assert.equal(conteo, 1);
});
