# Taxonomía de Comandos Git por Nivel de Uso

Documento de decisión para la reorganización de comandos en `recursos.html` (`src/components/CommandLevel.js` y `src/data/commands-all.json`).

## Criterios de clasificación

| Nivel | Icono | Criterio de inclusión | Ejemplos representativos |
| :--- | :--- | :--- | :--- |
| **Esencial** | 🔥 | Comandos de uso diario en cualquier tarea del flujo (`feature/*` → `develop`). Sin ellos no es posible clonar, editar, confirmar ni sincronizar cambios básicos. | `git clone <url>`, `git status -s`, `git add .`, `git commit -m "feat: mensaje"`, `git switch -c <rama>`, `git push -u origin <rama>`, `git pull --rebase origin develop`, `git fetch --all`, `git diff`, `git log --oneline --graph -n 10`, `git remote -v` |
| **Frecuente** | ⚡ | Operaciones habituales durante integración, resolución de conflictos, limpieza de ramas, deshacer cambios seguros o publicación de versiones. | `git diff --staged`, `git stash`, `git stash pop`, `git branch -a`, `git branch -d <rama>`, `git merge <rama>`, `git merge --no-ff <rama>`, `git merge --abort`, `git rebase develop`, `git rebase --continue`, `git rebase --abort`, `git restore <archivo>`, `git restore --staged <archivo>`, `git revert <hash>`, `git tag -a v1.0.0 -m "Release"`, `git push origin v1.0.0` |
| **Ocasional** | 🧊 | Comandos avanzados o de mantenimiento puntual: rescate de commits, reescritura controlada, múltiples remotos o configuración local específica. | `git init`, `git stash list`, `git branch -m <nuevo-nombre>`, `git reset --soft HEAD~1`, `git reset --hard <hash>`, `git cherry-pick <hash>`, `git tag -l`, `git remote add gitlab <url>`, `git push gitlab main`, `git push --force-with-lease`, `git show <hash>`, `git config credential.https://github.com.username <usuario>` |

## Verificación de migración

1. **Cero pérdidas:** Los 15 comandos originales de `COMANDOS_GIT` en `src/recursos.js` están incluidos íntegramente en `src/data/commands-all.json` (40 comandos totales).
2. **Cero duplicados:** `agruparPorNivel(comandos)` valida unicidad por `comando` antes de asignar cada elemento a su bloque.
3. **Compatibilidad hacia atrás:** `src/recursos.js` mantiene exportados `COMANDOS_GIT` y `filtrarComandos` para las pruebas y módulos existentes.
