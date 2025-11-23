CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    dni             VARCHAR(20) NOT NULL,
    fecha_registro  TIMESTAMP DEFAULT NOW(),
    is_verified     BOOLEAN DEFAULT FALSE
);
