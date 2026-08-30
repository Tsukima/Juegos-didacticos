# Cuento semanal con Magic Loops y GitHub

El workflow `weekly-content-tasks.yml` se ejecuta cada domingo a las 08:00 UTC y también puede iniciarse manualmente con un tema opcional.

## Funcionamiento

1. GitHub calcula el siguiente episodio y envía a Magic Loops el tema y un resumen del catálogo.
2. Magic Loops genera un cuento de la serie «Expediciones de Tinkie» sin repetir el contenido anterior.
3. El repositorio comprueba estructura, extensión, edades, páginas, palabra clave y preguntas.
4. Ejecuta `npm run validate:content` y `npm run build`.
5. Abre una pull request con un resumen familiar pendiente de aprobación adulta.
6. Envía el cuento completo a `angelesperniajobs@gmail.com` con el enlace de revisión.

El workflow nunca publica directamente en MySQL ni en Hostinger.

## Secretos necesarios

En **Settings → Secrets and variables → Actions** deben existir:

- `MAGIC_LOOP_URL`: endpoint `/run` del Loop activo.
- `STORY_EMAIL_USER`: cuenta de Gmail que enviará el mensaje.
- `STORY_EMAIL_APP_PASSWORD`: contraseña de aplicación de Google.

No se necesitan claves de Gemini ni una suscripción a GitHub Copilot.

## Ejecución manual

En GitHub: **Actions → Crear contenido semanal con Magic Loops → Run workflow**. El campo `tema` es opcional.
