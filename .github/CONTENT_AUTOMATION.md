# Publicación semanal automática

El workflow `weekly-content-tasks.yml` se ejecuta cada domingo a las 08:00 UTC. También puede iniciarse manualmente con un tema opcional para hacer una prueba.

## Funcionamiento

1. El repositorio crea localmente un cuento educativo desde una biblioteca de aventuras revisadas. No llama a Magic Loops ni a otra IA externa.
2. Escoge el rango de edad que tenga menos cuentos para mantener equilibrada la biblioteca.
3. Valida el catálogo, la biblioteca Mini y la compilación completa.
4. Guarda el cuento directamente en `main` mediante GitHub Actions.
5. Ese cambio activa `pages.yml`, que compila y publica la nueva versión automáticamente en Hostinger.

No hay ramas temporales, pull requests, correos de aprobación ni pasos manuales. No necesita secretos adicionales. Los secretos FTP de Hostinger continúan utilizándose exclusivamente en `pages.yml`.

## Seguridad y recuperación

- Si falla cualquier validación, no se guarda ni se publica nada.
- Git conserva el historial completo, por lo que cada cuento puede revisarse o revertirse.
- La publicación conserva `api/config.php`, los audios y `.well-known` del servidor.
