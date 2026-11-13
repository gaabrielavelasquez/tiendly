# Protecciones de GitHub · main y dev

Pendiente al 9-nov-2026. La cuenta usada por el agente tiene `push`, pero no `admin` ni `maintain`; no se intentó cambiar ajustes con una cuenta distinta. Las reglas del proyecto están en [CLAUDE.md §7](../../CLAUDE.md).

Una cuenta administradora configura ambas ramas en [Settings → Branches](https://github.com/gaabrielavelasquez/tiendly/settings/branches). Crear una regla para `main` y otra para `dev`, con la misma configuración:

| Ajuste | Valor |
|---|---|
| Require a pull request before merging. | Activado. |
| Require approvals. | Al menos una; según el workflow, la aprobación debe ser de Gabi. |
| Dismiss stale pull request approvals when new commits are pushed. | Activado. |
| Require status checks to pass before merging. | Activado. |
| Check requerido. | `Tokens, build y pruebas`, de GitHub Actions, workflow `CI`. |
| Require branches to be up to date before merging. | Activado. |
| Require conversation resolution before merging. | Activado. |
| Do not allow bypassing the above settings. | Activado. |
| Require linear history. | Desactivado, para permitir merge commits. |
| Allow force pushes. | Desactivado. |
| Allow deletions. | Desactivado. |

La API de GitHub devuelve el check con el nombre exacto `Tokens, build y pruebas`; la interfaz puede agruparlo bajo `CI`. No usar el nombre completo del workflow como si fuera otro check. Vercel sigue siendo una validación adicional de transición y no sustituye la CI.

En [Settings → General → Pull Requests](https://github.com/gaabrielavelasquez/tiendly/settings), mantener **Allow merge commits** y desactivar **Allow squash merging** y **Allow rebase merging** para hacer cumplir el método del proyecto. No activar borrado automático de ramas durante esta limpieza: se conservan referencias y worktrees históricos.

Después de guardar, comprobar que `main` y `dev` aparecen protegidas, que un PR exige aprobación y CI, y que solo permite merge commit. La regla de una aprobación no identifica por sí sola a Gabi; esa condición del workflow se comprueba antes de cada merge. Ningún cambio descrito aquí está aplicado por este documento.
