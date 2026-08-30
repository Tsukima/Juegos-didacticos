# Cuento semanal con GitHub Copilot

El workflow `weekly-content-tasks.yml` se ejecuta cada domingo a las 08:00 UTC (10:00 en España peninsular durante el horario de verano) y también puede iniciarse manualmente con un tema opcional.

## Funcionamiento

1. GitHub encarga al agente `Tinkie Historias` un episodio avanzado para 10-12 años.
2. El agente revisa el catálogo para continuar la serie y evitar repeticiones.
3. Genera el cuento, la palabra clave, el quiz y actualiza el índice.
4. Ejecuta `npm run validate:content` y `npm run build`.
5. Abre una pull request con un resumen familiar y queda pendiente de revisión.
6. Solo al fusionar la pull request en `main` el contenido puede llegar al despliegue.

El workflow nunca publica directamente en MySQL ni en Hostinger.

## Credencial

El repositorio necesita el secreto `COPILOT_TASK_TOKEN` con acceso a la API de tareas de Copilot. No usa claves de OpenAI, Anthropic, Supabase ni de Hostinger.

## Ejecución manual

En GitHub: **Actions → Crear contenido semanal con Copilot → Run workflow**. El campo `tema` es opcional; si se deja vacío, el agente escoge el siguiente tema según la variedad del catálogo.
