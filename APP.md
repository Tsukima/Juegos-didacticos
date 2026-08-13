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

El progreso se guarda en `localStorage` en el propio dispositivo. No hay analítica, anuncios, chat, compras ni llamadas de red.
