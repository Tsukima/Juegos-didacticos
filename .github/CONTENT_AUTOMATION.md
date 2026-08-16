# Contenido semanal con GitHub Copilot

El workflow `weekly-content-tasks.yml` se ejecuta los domingos a las 08:00 UTC y también puede iniciarse manualmente.

## Funcionamiento

1. GitHub crea dos incidencias semanales sin duplicarlas: Historias y Lenguaje.
2. Las incidencias quedan asignadas a `Tsukima` y generan una notificación móvil.
3. El adulto abre cada incidencia, selecciona **Assign to Copilot** y elige el agente indicado.
4. Copilot prepara los JSON y abre una pull request.
5. El adulto revisa y acepta o rechaza la propuesta.
6. Solo el contenido fusionado en `main` queda publicado.

## Credenciales

Este flujo no utiliza claves de Anthropic, OpenAI ni Supabase. Usa únicamente el `GITHUB_TOKEN` temporal proporcionado por GitHub Actions para crear las incidencias.

GitHub Models no se utiliza porque GitHub retiró completamente ese servicio el 30 de julio de 2026.
