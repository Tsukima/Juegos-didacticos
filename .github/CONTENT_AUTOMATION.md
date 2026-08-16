# Automatización semanal de contenido

El workflow `generate-content.yml` se ejecuta los domingos a las 08:00 UTC y también admite ejecución manual.

## Configuración necesaria

En `Settings → Secrets and variables → Actions`:

1. Crea el secreto `ANTHROPIC_API_KEY`.
2. Opcionalmente crea la variable `ANTHROPIC_MODEL`; si se omite se utiliza `claude-sonnet-5`.

La clave nunca debe guardarse en archivos del repositorio.

## Flujo editorial

1. Los scripts generan tres historias y tres sets de lenguaje.
2. Cada resultado se valida antes de escribirlo.
3. GitHub abre una pull request asignada a `Tsukima`.
4. Un adulto acepta o rechaza los archivos.
5. Solo el contenido fusionado en `main` queda publicado.

No se usa `SUPABASE_SERVICE_ROLE_KEY`: la biblioteca consume los cuentos aprobados directamente desde `content/historias/`.
