CREATE TABLE Direccion (
    id SERIAL PRIMARY KEY,
    direccion VARCHAR(255),
    codigo_postal VARCHAR(10)
);

CREATE TABLE Sucursal (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100),
    id_direccion INT,
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);

CREATE TABLE Usuario (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100),
    password VARCHAR(100),
    telefono VARCHAR(15),
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$')
);

CREATE TABLE Trabajador (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100),
    password VARCHAR(100),
    telefono VARCHAR(15),
    puesto VARCHAR(50),
    sucursal VARCHAR(15),
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$'),
    FOREIGN KEY (sucursal) REFERENCES Sucursal(id)
);

CREATE TABLE Remitente (
    id SERIAL PRIMARY KEY,
    id_direccion INT,
    id_usuario VARCHAR(15),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

CREATE TABLE Paquete (
    id SERIAL PRIMARY KEY,
    id_dimension VARCHAR(24),  -- Now stores MongoDB ObjectId
    id_remitente INT,
    otros_datos VARCHAR(255),
    FOREIGN KEY (id_remitente) REFERENCES Remitente(id)
);

CREATE TABLE Envio (
    id SERIAL PRIMARY KEY,
    id_paquete INT,
    id_direccion INT,
    FOREIGN KEY (id_paquete) REFERENCES Paquete(id),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);
