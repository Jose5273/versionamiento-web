import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { agruparPorNivel, NIVELES_CONFIG } from '../src/components/CommandLevel.js';

const RAIZ = resolve(import.meta.dirname, '..');
const todosComandos = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-all.json'), 'utf8')
);

test('docs/taxonomia-comandos.md existe y documenta los 3 niveles', () => {
  const ruta = resolve(RAIZ, 'docs/taxonomia-comandos.md');
  assert.equal(existsSync(ruta), true);
  const doc = readFileSync(ruta, 'utf8');
  assert.match(doc, /Esencial/);
  assert.match(doc, /Frecuente/);
  assert.match(doc, /Ocasional/);
});

test('Todos los comandos originales de COMANDOS_GIT están migrados en commands-all.json sin pérdidas', () => {
  const recursosSrc = readFileSync(resolve(RAIZ, 'src/recursos.js'), 'utf8');
  const setMigrados = new Set(todosComandos.map((c) => c.comando));

  const originales = [
    'git clone <url>',
    'git switch -c <rama>',
    'git status -s',
    'git add .',
    'git commit -m "feat: mensaje"',
    'git push -u origin <rama>',
    'git fetch --all',
    'git pull --rebase origin develop',
    'git diff',
    'git log --oneline --graph -n 10',
    'git stash',
    'git revert <hash>',
    'git tag -a v1.0.0 -m "Release"',
    'git push origin v1.0.0',
    'git branch -d <rama>',
  ];

  for (const cmd of originales) {
    assert.equal(setMigrados.has(cmd), true, `Falta comando migrado: ${cmd}`);
  }
  assert.match(recursosSrc, /export const COMANDOS_GIT/);
});

test('agruparPorNivel particiona los 40 comandos en Esencial, Frecuente y Ocasional sin duplicados', () => {
  const grupos = agruparPorNivel(todosComandos);
  assert.equal(grupos.esencial.length > 0, true);
  assert.equal(grupos.frecuente.length > 0, true);
  assert.equal(grupos.ocasional.length > 0, true);
  assert.equal(grupos.esencial.length + grupos.frecuente.length + grupos.ocasional.length, 40);

  // Verifica deduplicación explícita
  const conDuplicado = agruparPorNivel([...todosComandos, todosComandos[0]]);
  assert.equal(
    conDuplicado.esencial.length + conDuplicado.frecuente.length + conDuplicado.ocasional.length,
    40
  );

  assert.deepEqual(
    NIVELES_CONFIG.map((n) => n.icono),
    ['🔥', '⚡', '🧊']
  );
});
