import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { filtrarTopComandos } from '../src/components/TopCommands.js';

const RAIZ = resolve(import.meta.dirname, '..');
const comandosTop10 = JSON.parse(
  readFileSync(resolve(RAIZ, 'src/data/commands-top10.json'), 'utf8')
);

test('commands-top10.json contiene 10 comandos únicos con esquema válido', () => {
  assert.equal(Array.isArray(comandosTop10), true);
  assert.equal(comandosTop10.length, 10);

  const rankings = new Set();
  const comandos = new Set();
  const rolesValidos = new Set(['junior', 'senior', 'lead']);

  for (const item of comandosTop10) {
    assert.equal(Number.isInteger(item.ranking), true);
    assert.equal(item.ranking >= 1 && item.ranking <= 10, true);
    assert.equal(rankings.has(item.ranking), false, `Ranking duplicado: ${item.ranking}`);
    rankings.add(item.ranking);

    assert.equal(typeof item.comando, 'string');
    assert.equal(item.comando.length > 0, true);
    assert.equal(comandos.has(item.comando), false, `Comando duplicado: ${item.comando}`);
    comandos.add(item.comando);

    assert.match(item.frecuencia, /usos\/(día|semana)$/);
    assert.equal(rolesValidos.has(item.rol), true, `Rol inválido: ${item.rol}`);
    assert.equal(Array.isArray(item.etiquetas) && item.etiquetas.length > 0, true);
  }
});

test('filtrarTopComandos filtra correctamente por rol y devuelve todos por defecto', () => {
  assert.equal(filtrarTopComandos(comandosTop10, 'todos').length, 10);

  const junior = filtrarTopComandos(comandosTop10, 'junior');
  const senior = filtrarTopComandos(comandosTop10, 'senior');
  const lead = filtrarTopComandos(comandosTop10, 'lead');

  assert.equal(junior.length > 0, true);
  assert.equal(senior.length > 0, true);
  assert.equal(lead.length > 0, true);
  assert.equal(junior.every((c) => c.rol === 'junior'), true);
  assert.equal(senior.every((c) => c.rol === 'senior'), true);
  assert.equal(lead.every((c) => c.rol === 'lead'), true);
  assert.equal(junior.length + senior.length + lead.length, 10);
});
