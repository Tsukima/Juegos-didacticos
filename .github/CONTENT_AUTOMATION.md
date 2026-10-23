# Publicación semanal automática

El workflow `weekly-content-tasks.yml` publica contenido a las 10:00 de Madrid, ajustándose automáticamente al horario de verano e invierno. También puede iniciarse manualmente para hacer una prueba.

## Funcionamiento

1. Todos los días crea un minicuento para Mini y una versión más extensa para Explorador (8–12 años), ambas con reflexión y actividad de regulación.
2. Los lunes y jueves crea además un cuento largo; el rango de edad rota para mantener equilibrada la biblioteca.
3. Los miércoles publica una edición de cómic formada por tres capítulos.
4. El contenido parte de bibliotecas educativas revisadas y no llama a Magic Loops ni a otra IA externa.
5. Valida los catálogos, la biblioteca Mini y la compilación completa.
6. Guarda el contenido directamente en `main` mediante GitHub Actions y activa la publicación en Hostinger.

No hay ramas temporales, pull requests, correos de aprobación ni pasos manuales. No necesita secretos adicionales. Los secretos FTP de Hostinger continúan utilizándose exclusivamente en `pages.yml`.

## Seguridad y recuperación

- Si falla cualquier validación, no se guarda ni se publica nada.
- Git conserva el historial completo, por lo que cada cuento puede revisarse o revertirse.
- La publicación conserva `api/config.php`, los audios y `.well-known` del servidor.
