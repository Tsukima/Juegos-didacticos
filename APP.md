# Tinkie

Aplicación web estática de lectoescritura, bienestar emocional y seguridad digital. No necesita compilación, cuenta ni servidor.

## Publicación

Sube el contenido del repositorio al directorio público de tu dominio. Para probarla localmente usa un servidor HTTP (los módulos ES no funcionan bien abriendo `index.html` como archivo):

```sh
python -m http.server 8080
```

## Contenido del PDF

El PDF solicitado no estaba presente durante la creación. `js/pdf-data/cards.js` contiene un banco provisional de 30 palabras, 30 frases, 10 comprensiones y 6 acciones. Cuando esté disponible `programa-lectoescritura-tarjetas.pdf`, sustituye únicamente esos arrays para conservar toda la interfaz, progreso y juegos.

## Privacidad

El progreso básico se guarda en `localStorage`. Cuando un adulto activa el consentimiento, las lecturas se codifican como Ogg/Opus y se guardan en un bucket privado de Supabase. RLS limita cada sesión a sus propios archivos y metadatos; nunca se incluye una clave secreta en el navegador.

## Supabase

- Proyecto: `Aprende Conmigo` (`yicqgbycigyhniaozrez`)
- Bucket privado: `reading-audios`
- Tabla: `public.reading_recordings`
- Migración: `supabase/migrations/20260813222157_create_reading_recordings.sql`

Las sesiones anónimas deben estar habilitadas en **Authentication → Providers → Anonymous Sign-Ins**. La clave incluida en el cliente es publicable; la protección efectiva se aplica mediante RLS.
