SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_progress (
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  payload JSON NOT NULL,
  revision BIGINT UNSIGNED NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT user_progress_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reading_recordings (
  id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  exercise_id VARCHAR(80) NOT NULL,
  storage_path VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  score TINYINT UNSIGNED NOT NULL,
  passed TINYINT(1) NOT NULL,
  duration_ms INT UNSIGNED NOT NULL,
  byte_size INT UNSIGNED NOT NULL,
  mime_type VARCHAR(40) NOT NULL DEFAULT 'audio/ogg',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY recordings_path_unique (storage_path),
  KEY recordings_user_created_idx (user_id, created_at),
  CONSTRAINT recordings_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT recordings_score_check CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT recordings_duration_check CHECK (duration_ms <= 300000),
  CONSTRAINT recordings_size_check CHECK (byte_size BETWEEN 1 AND 10485760)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY reset_token_hash_unique (token_hash),
  KEY reset_user_idx (user_id),
  KEY reset_expiry_idx (expires_at),
  CONSTRAINT reset_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS request_limits (
  scope_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  attempts SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  window_started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  blocked_until DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
