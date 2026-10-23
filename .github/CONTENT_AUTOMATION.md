# Publicación semanal automática

El workflow `weekly-content-tasks.yml` publica contenido a las 10:00 de Madrid, ajustándose automáticamente al horario de verano e invierno. También puede iniciarse manualmente para hacer una prueba.

## Funcionamiento

1. Todos los días crea un minicuento con reflexión y una actividad de regulación.
2. Los lunes y jueves crea además tres cuentos largos: uno para 6–8, otro para 8–10 y otro para 10–12 años.
3. El contenido parte de bibliotecas educativas revisadas y no llama a Magic Loops ni a otra IA externa.
4. Valida el catálogo, la biblioteca Mini y la compilación completa.
5. Guarda el contenido directamente en `main` mediante GitHub Actions.
6. Ese cambio activa `pages.yml`, que compila y publica la nueva versión automáticamente en Hostinger.

No hay ramas temporales, pull requests, correos de aprobación ni pasos manuales. No necesita secretos adicionales. Los secretos FTP de Hostinger continúan utilizándose exclusivamente en `pages.yml`.

## Seguridad y recuperación

- Si falla cualquier validación, no se guarda ni se publica nada.
- Git conserva el historial completo, por lo que cada cuento puede revisarse o revertirse.
- La publicación conserva `api/config.php`, los audios y `.well-known` del servidor.
