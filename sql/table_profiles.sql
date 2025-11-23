-- Tabla de perfiles de usuario (uno a uno con users)
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    username VARCHAR(50) UNIQUE,      -- @usuario_demo, por ej.
    bio TEXT,
    avatar_url TEXT,
    header_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
