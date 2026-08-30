# Instalación de Tinkie en Hostinger

El ZIP de entrega separa expresamente los archivos públicos, el SQL y la configuración privada. No contiene credenciales reales.

## 1. Base de datos

1. Abre la base `aprendeconmigo` en phpMyAdmin.
2. Pulsa **Importar**.
3. Selecciona `database/database.sql`.
4. Comprueba que aparecen `users`, `user_progress`, `reading_recordings`, `password_reset_tokens` y `request_limits`.

## 2. Configuración privada

1. En el Administrador de archivos, sitúate en la carpeta que contiene `public_html`.
2. Crea `tinkie-private` al mismo nivel que `public_html`, nunca dentro.
3. Copia `private-template/config.php` a `tinkie-private/config.php`.
4. Edita esa copia y completa host, base, usuario y contraseña MySQL de hPanel.
5. Cambia `mail_from` por una cuenta real de tu dominio preparada en Hostinger.
6. Crea `tinkie-private/audio`. PHP debe poder escribir en ella.

La estructura debe quedar así:

```text
carpeta-del-dominio/
├── public_html/
└── tinkie-private/
    ├── config.php
    └── audio/
```

## 3. Aplicación

Sube únicamente el contenido de `public_html/` del paquete a la carpeta `public_html` del dominio. No subas allí `database`, `docs` ni `private-template`.

## 4. Comprobación

1. Abre la aplicación y crea la cuenta familiar con el mismo correo usado en Supabase.
2. Usa una contraseña nueva de al menos 10 caracteres; la contraseña anterior no se copia.
3. Completa una misión en un dispositivo y entra con la misma cuenta en otro.
4. Activa el guardado de audio, realiza una lectura y comprueba que se reproduce en el panel familiar.
5. Prueba **He olvidado mi contraseña**.

No borres el proyecto de Supabase hasta verificar registro, inicio de sesión, sincronización, grabación, reproducción y recuperación de contraseña.
