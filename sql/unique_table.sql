ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE users
ADD CONSTRAINT unique_dni UNIQUE (dni);
