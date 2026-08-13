# Juegos didácticos · Tinkie

Aplicación educativa de lectoescritura, bienestar emocional y seguridad digital para misiones breves y positivas.

## Aplicación

El código fuente está en `src/` y se compila con Vite. GitHub Actions instala las versiones fijadas en `package-lock.json`, genera `dist/` y lo publica automáticamente en GitHub Pages al actualizar `main`. La raíz contiene también la salida compilada para el despliegue estático de Hostinger.

```sh
npm ci
npm run dev
npm run build
```

En Hostinger, el comando de compilación es `npm run build` y el directorio de publicación es `dist`.

Consulta [`APP.md`](APP.md) para conocer la arquitectura, privacidad y cómo sustituir el banco provisional por el contenido literal del PDF.
