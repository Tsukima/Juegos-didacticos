<?php
declare(strict_types=1);

const MAX_AUDIO_BYTES = 10485760;

$configPath = dirname((string)($_SERVER['DOCUMENT_ROOT'] ?? __DIR__)) . '/tinkie-private/config.php';
if (!is_file($configPath)) {
    $configPath = dirname(__DIR__, 2) . '/tinkie-private/config.php';
}
if (!is_file($configPath)) {
    json_response(['error' => 'El servidor todavía no está configurado.'], 503);
}
$config = require $configPath;

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store, private');

$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '' && !in_array($origin, $config['allowed_origins'] ?? [], true)) {
    json_response(['error' => 'Origen no permitido.'], 403);
}
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    http_response_code(204);
    exit;
}

session_name((string)($config['session_name'] ?? 'tinkie_family'));
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();
if (!isset($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function json_response(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function db(): PDO
{
    global $config;
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $database = $config['database'];
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $database['host'], $database['port'], $database['name'], $database['charset']);
    $pdo = new PDO($dsn, $database['user'], $database['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $value = json_decode($raw, true);
    if (!is_array($value)) json_response(['error' => 'Solicitud JSON no válida.'], 400);
    return $value;
}

function require_method(string ...$methods): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        json_response(['error' => 'Método no permitido.'], 405);
    }
}

function require_csrf(): void
{
    $token = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($token === '' || !hash_equals((string)($_SESSION['csrf'] ?? ''), $token)) {
        json_response(['error' => 'La sesión ha caducado. Actualiza la página.'], 419);
    }
}

function current_user_id(): ?string
{
    return isset($_SESSION['user_id']) ? (string)$_SESSION['user_id'] : null;
}

function require_user(): string
{
    $id = current_user_id();
    if ($id === null) json_response(['error' => 'Inicia sesión para continuar.'], 401);
    return $id;
}

function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function normalize_email(mixed $value): string
{
    $email = mb_strtolower(trim((string)$value));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
        json_response(['error' => 'Escribe un correo válido.'], 422);
    }
    return $email;
}

function validate_password(mixed $value): string
{
    $password = (string)$value;
    if (strlen($password) < 10 || strlen($password) > 128) {
        json_response(['error' => 'La contraseña debe tener entre 10 y 128 caracteres.'], 422);
    }
    return $password;
}

function client_fingerprint(string $scope, string $identity = ''): string
{
    $ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return hash('sha256', $scope . '|' . $ip . '|' . mb_strtolower($identity));
}

function enforce_rate_limit(string $scope, int $maximum, int $windowSeconds, string $identity = ''): void
{
    $key = client_fingerprint($scope, $identity);
    $pdo = db();
    $pdo->beginTransaction();
    $statement = $pdo->prepare('SELECT attempts, window_started_at, blocked_until FROM request_limits WHERE scope_key = ? FOR UPDATE');
    $statement->execute([$key]);
    $row = $statement->fetch();
    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    if ($row && $row['blocked_until'] && new DateTimeImmutable($row['blocked_until'], new DateTimeZone('UTC')) > $now) {
        $pdo->rollBack();
        json_response(['error' => 'Demasiados intentos. Espera unos minutos.'], 429);
    }
    $windowExpired = !$row || (new DateTimeImmutable($row['window_started_at'], new DateTimeZone('UTC')))->modify('+' . $windowSeconds . ' seconds') <= $now;
    $attempts = $windowExpired ? 1 : ((int)$row['attempts'] + 1);
    $blockedUntil = $attempts > $maximum ? $now->modify('+' . $windowSeconds . ' seconds')->format('Y-m-d H:i:s') : null;
    $upsert = $pdo->prepare('INSERT INTO request_limits(scope_key, attempts, window_started_at, blocked_until) VALUES(?, ?, UTC_TIMESTAMP(), ?) ON DUPLICATE KEY UPDATE attempts=VALUES(attempts), window_started_at=IF(?=1, UTC_TIMESTAMP(), window_started_at), blocked_until=VALUES(blocked_until)');
    $upsert->execute([$key, $attempts, $blockedUntil, $windowExpired ? 1 : 0]);
    $pdo->commit();
    if ($blockedUntil !== null) json_response(['error' => 'Demasiados intentos. Espera unos minutos.'], 429);
}

function public_user(array $user): array
{
    return ['id' => $user['id'], 'email' => $user['email']];
}
