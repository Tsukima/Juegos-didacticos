<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$action = (string)($_GET['action'] ?? 'session');

try {
    switch ($action) {
        case 'health':
            require_method('GET');
            if (!extension_loaded('pdo_mysql')) {
                json_response(['status' => 'error', 'database' => 'pdo_mysql_unavailable'], 503);
            }
            try {
                db()->query('SELECT 1')->fetchColumn();
            } catch (PDOException $databaseError) {
                $code = (int)($databaseError->errorInfo[1] ?? 0);
                $reason = match ($code) {
                    1045 => 'credentials_rejected',
                    1049 => 'database_not_found',
                    2002, 2003, 2005 => 'host_unreachable',
                    default => 'connection_failed',
                };
                json_response(['status' => 'error', 'database' => $reason, 'code' => $code], 503);
            }
            $audioDirectory = (string)$config['audio_directory'];
            if (!is_dir($audioDirectory) || !is_writable($audioDirectory)) {
                json_response(['status' => 'partial', 'database' => 'ok', 'audioStorage' => 'not_writable'], 503);
            }
            json_response(['status' => 'ok', 'database' => 'ok', 'audioStorage' => 'ok']);

        case 'session':
            require_method('GET');
            $user = null;
            if ($id = current_user_id()) {
                $statement = db()->prepare('SELECT id, email FROM users WHERE id = ?');
                $statement->execute([$id]);
                $row = $statement->fetch();
                if ($row) $user = public_user($row); else unset($_SESSION['user_id']);
            }
            json_response(['user' => $user, 'csrfToken' => $_SESSION['csrf']]);

        case 'register':
            require_method('POST'); require_csrf();
            $input = body(); $email = normalize_email($input['email'] ?? ''); $password = validate_password($input['password'] ?? '');
            enforce_rate_limit('register', 4, 3600, $email);
            $statement = db()->prepare('INSERT INTO users(id, email, password_hash, email_verified_at) VALUES(?, ?, ?, UTC_TIMESTAMP())');
            try { $id = uuid_v4(); $statement->execute([$id, $email, password_hash($password, PASSWORD_DEFAULT)]); }
            catch (PDOException $error) {
                if ((int)($error->errorInfo[1] ?? 0) === 1062) json_response(['error' => 'Este correo ya tiene una cuenta.'], 409);
                throw $error;
            }
            session_regenerate_id(true); $_SESSION['user_id'] = $id; $_SESSION['csrf'] = bin2hex(random_bytes(32));
            json_response(['user' => ['id' => $id, 'email' => $email], 'csrfToken' => $_SESSION['csrf']], 201);

        case 'login':
            require_method('POST'); require_csrf();
            $input = body(); $email = normalize_email($input['email'] ?? '');
            enforce_rate_limit('login', 8, 900, $email);
            $statement = db()->prepare('SELECT id, email, password_hash FROM users WHERE email = ?'); $statement->execute([$email]); $user = $statement->fetch();
            if (!$user || !password_verify((string)($input['password'] ?? ''), $user['password_hash'])) {
                usleep(random_int(100000, 250000)); json_response(['error' => 'El correo o la contraseña no son correctos.'], 401);
            }
            if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
                db()->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash((string)$input['password'], PASSWORD_DEFAULT), $user['id']]);
            }
            session_regenerate_id(true); $_SESSION['user_id'] = $user['id']; $_SESSION['csrf'] = bin2hex(random_bytes(32));
            json_response(['user' => public_user($user), 'csrfToken' => $_SESSION['csrf']]);

        case 'logout':
            require_method('POST'); require_csrf();
            $_SESSION = []; if (ini_get('session.use_cookies')) { $params=session_get_cookie_params(); setcookie(session_name(), '', time()-42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']); }
            session_destroy(); json_response(['ok' => true]);

        case 'password-request':
            require_method('POST'); require_csrf();
            $input=body(); $email=normalize_email($input['email'] ?? ''); enforce_rate_limit('password', 4, 3600, $email);
            $statement=db()->prepare('SELECT id FROM users WHERE email=?'); $statement->execute([$email]); $user=$statement->fetch();
            if ($user) {
                $token=bin2hex(random_bytes(32));
                db()->prepare('UPDATE password_reset_tokens SET used_at=UTC_TIMESTAMP() WHERE user_id=? AND used_at IS NULL')->execute([$user['id']]);
                db()->prepare('INSERT INTO password_reset_tokens(user_id,token_hash,expires_at) VALUES(?,?,DATE_ADD(UTC_TIMESTAMP(),INTERVAL 30 MINUTE))')->execute([$user['id'],hash('sha256',$token)]);
                $link=rtrim((string)$config['app_url'],'/') . '/?reset=' . rawurlencode($token);
                $subject='Cambia tu contraseña de Tinkie';
                $message="Has solicitado cambiar tu contraseña de Tinkie.\n\nAbre este enlace durante los próximos 30 minutos:\n$link\n\nSi no fuiste tú, ignora este mensaje.";
                $headers=['Content-Type: text/plain; charset=UTF-8','From: '.$config['mail_from_name'].' <'.$config['mail_from'].'>'];
                @mail($email, $subject, $message, implode("\r\n",$headers));
            }
            json_response(['ok'=>true,'message'=>'Si existe una cuenta con ese correo, recibirás un enlace.']);

        case 'password-confirm':
            require_method('POST'); require_csrf();
            $input=body(); $token=(string)($input['token'] ?? ''); $password=validate_password($input['password'] ?? '');
            if (!preg_match('/^[a-f0-9]{64}$/',$token)) json_response(['error'=>'El enlace no es válido.'],422);
            $pdo=db(); $pdo->beginTransaction();
            $statement=$pdo->prepare('SELECT id,user_id FROM password_reset_tokens WHERE token_hash=? AND used_at IS NULL AND expires_at>UTC_TIMESTAMP() FOR UPDATE'); $statement->execute([hash('sha256',$token)]); $reset=$statement->fetch();
            if (!$reset) { $pdo->rollBack(); json_response(['error'=>'El enlace ha caducado o ya fue utilizado.'],422); }
            $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash($password,PASSWORD_DEFAULT),$reset['user_id']]);
            $pdo->prepare('UPDATE password_reset_tokens SET used_at=UTC_TIMESTAMP() WHERE id=?')->execute([$reset['id']]); $pdo->commit();
            session_regenerate_id(true); $_SESSION['user_id']=$reset['user_id']; $_SESSION['csrf']=bin2hex(random_bytes(32));
            $statement=db()->prepare('SELECT id,email FROM users WHERE id=?'); $statement->execute([$reset['user_id']]);
            json_response(['user'=>public_user($statement->fetch()),'csrfToken'=>$_SESSION['csrf']]);

        case 'progress':
            $userId=require_user();
            if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
                $statement=db()->prepare('SELECT payload,revision,updated_at FROM user_progress WHERE user_id=?'); $statement->execute([$userId]); $row=$statement->fetch();
                json_response(['progress'=>$row ? json_decode($row['payload'],true) : null,'revision'=>$row ? (int)$row['revision'] : 0,'updatedAt'=>$row['updated_at'] ?? null]);
            }
            require_method('PUT'); require_csrf(); $input=body(); $payload=$input['progress'] ?? null;
            if (!is_array($payload)) json_response(['error'=>'Progreso no válido.'],422);
            $encoded=json_encode($payload,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
            if ($encoded===false || strlen($encoded)>1048576) json_response(['error'=>'El progreso es demasiado grande.'],413);
            db()->prepare('INSERT INTO user_progress(user_id,payload,revision) VALUES(?,?,1) ON DUPLICATE KEY UPDATE payload=VALUES(payload),revision=revision+1')->execute([$userId,$encoded]);
            json_response(['ok'=>true]);

        case 'recordings':
            require_method('GET'); $userId=require_user();
            $statement=db()->prepare('SELECT id,exercise_id,score,passed,duration_ms,created_at FROM reading_recordings WHERE user_id=? ORDER BY created_at DESC LIMIT 50'); $statement->execute([$userId]);
            $rows=array_map(static fn(array $row):array=>[
                'id'=>$row['id'],'exercise_id'=>$row['exercise_id'],'score'=>(int)$row['score'],'passed'=>(bool)$row['passed'],'duration_ms'=>(int)$row['duration_ms'],'created_at'=>$row['created_at'].'Z','audioUrl'=>'./api/index.php?action=audio&id='.rawurlencode($row['id'])
            ],$statement->fetchAll()); json_response(['recordings'=>$rows]);

        case 'recording-upload':
            require_method('POST'); require_csrf(); $userId=require_user(); enforce_rate_limit('audio',30,3600,$userId);
            if (!isset($_FILES['audio']) || !is_uploaded_file($_FILES['audio']['tmp_name'])) json_response(['error'=>'No se recibió el audio.'],422);
            $file=$_FILES['audio']; if ($file['error']!==UPLOAD_ERR_OK) json_response(['error'=>'La subida del audio falló.'],422);
            $size=(int)$file['size']; if ($size<1 || $size>MAX_AUDIO_BYTES) json_response(['error'=>'El audio supera el límite de 10 MB.'],413);
            $prefix=file_get_contents($file['tmp_name'],false,null,0,4); if ($prefix!=='OggS') json_response(['error'=>'El archivo no es un audio Ogg/Opus válido.'],422);
            $exercise=trim((string)($_POST['exerciseId'] ?? '')); if ($exercise==='' || mb_strlen($exercise)>80) json_response(['error'=>'Ejercicio no válido.'],422);
            $score=max(0,min(100,(int)($_POST['score'] ?? 0))); $duration=max(0,min(300000,(int)($_POST['durationMs'] ?? 0))); $passed=filter_var($_POST['passed'] ?? false,FILTER_VALIDATE_BOOLEAN);
            $directory=rtrim((string)$config['audio_directory'],'/\\').DIRECTORY_SEPARATOR.$userId;
            if (!is_dir($directory) && !mkdir($directory,0700,true) && !is_dir($directory)) json_response(['error'=>'No se pudo preparar el almacenamiento privado.'],500);
            $id=uuid_v4(); $filename=$id.'.opus'; $destination=$directory.DIRECTORY_SEPARATOR.$filename;
            if (!move_uploaded_file($file['tmp_name'],$destination)) json_response(['error'=>'No se pudo guardar el audio.'],500);
            try { db()->prepare('INSERT INTO reading_recordings(id,user_id,exercise_id,storage_path,score,passed,duration_ms,byte_size,mime_type) VALUES(?,?,?,?,?,?,?,?,?)')->execute([$id,$userId,$exercise,$userId.'/'.$filename,$score,$passed?1:0,$duration,$size,'audio/ogg']); }
            catch (Throwable $error) { @unlink($destination); throw $error; }
            json_response(['id'=>$id],201);

        case 'audio':
            require_method('GET'); $userId=require_user(); $id=(string)($_GET['id'] ?? '');
            if (!preg_match('/^[a-f0-9-]{36}$/i',$id)) json_response(['error'=>'Audio no válido.'],404);
            $statement=db()->prepare('SELECT storage_path,byte_size FROM reading_recordings WHERE id=? AND user_id=?'); $statement->execute([$id,$userId]); $row=$statement->fetch();
            if (!$row) json_response(['error'=>'Audio no encontrado.'],404);
            $path=rtrim((string)$config['audio_directory'],'/\\').DIRECTORY_SEPARATOR.str_replace('/',DIRECTORY_SEPARATOR,$row['storage_path']);
            if (!is_file($path)) json_response(['error'=>'Audio no disponible.'],404);
            session_write_close(); header('Content-Type: audio/ogg'); header('Content-Length: '.filesize($path)); header('Content-Disposition: inline; filename="lectura.opus"'); readfile($path); exit;

        default: json_response(['error'=>'Ruta no encontrada.'],404);
    }
} catch (Throwable $error) {
    error_log('Tinkie API: '.$error->getMessage());
    json_response(['error'=>'Ha ocurrido un error interno.'],500);
}
