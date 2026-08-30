# Cuento semanal con Gemini y GitHub

El workflow `weekly-content-tasks.yml` se ejecuta cada domingo a las 08:00 UTC (10:00 en España peninsular durante el horario de verano) y también puede iniciarse manualmente con un tema opcional.

## Funcionamiento

1. GitHub Actions encarga a Gemini un episodio avanzado para 10-12 años.
2. El agente revisa el catálogo para continuar la serie y evitar repeticiones.
3. Genera el cuento, la palabra clave, el quiz y actualiza el índice.
4. Ejecuta `npm run validate:content` y `npm run build`.
5. Abre una pull request con un resumen familiar y queda pendiente de revisión.
6. GitHub envía el cuento completo a `angelesperniajobs@gmail.com`, con un enlace para revisar la pull request.
7. Solo al fusionar la pull request en `main` el contenido puede llegar al despliegue.

El workflow nunca publica directamente en MySQL ni en Hostinger.

## Correo de revisión

El repositorio necesita dos secretos adicionales en **Settings → Secrets and variables → Actions**:

- `STORY_EMAIL_USER`: la cuenta de Gmail que enviará el mensaje.
- `STORY_EMAIL_APP_PASSWORD`: una contraseña de aplicación de Google de 16 caracteres, sin espacios.

El correo solo se envía cuando una pull request no borrador añade o modifica un cuento. La contraseña normal de Gmail no debe utilizarse ni escribirse en ningún archivo del repositorio.

## Credencial de generación

El repositorio necesita el secreto `GEMINI_API_KEY`, creado en Google AI Studio. La variable opcional `GEMINI_MODEL` permite cambiar el modelo sin editar el workflow; si se omite usa `gemini-3.7-flash`.

Ya no se necesita `COPILOT_TASK_TOKEN` ni una suscripción a GitHub Copilot.

## Ejecución manual

En GitHub: **Actions → Crear contenido semanal con Gemini → Run workflow**. El campo `tema` es opcional; si se deja vacío, el generador escoge el siguiente tema según la variedad del catálogo.
