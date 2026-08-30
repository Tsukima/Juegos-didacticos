<?php
declare(strict_types=1);

// Copia este archivo como ../tinkie-private/config.php, fuera de public_html.
return [
    'database' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'u000000000_aprendeconmigo',
        'user' => 'u000000000_tinkie',
        'password' => 'CAMBIAR_ESTA_CONTRASENA',
        'charset' => 'utf8mb4',
    ],
    'app_url' => 'https://aprendeconmigo.angsys.com',
    'allowed_origins' => ['https://aprendeconmigo.angsys.com'],
    'audio_directory' => __DIR__ . '/audio',
    'mail_from' => 'no-reply@angsys.com',
    'mail_from_name' => 'Tinkie',
    'session_name' => 'tinkie_family',
];
