-- Tabla Direccion
CREATE TABLE Direccion (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255),
    numero VARCHAR(15),
    codigo_postal VARCHAR(10),
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100)
);

-- Tabla Sucursal
CREATE TABLE Sucursal (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100),
    id_direccion INT,
    telefono VARCHAR(15),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);

-- Tabla Usuario (Usuarios registrados)
CREATE TABLE Usuario (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    telefono VARCHAR(15),
    puesto VARCHAR(50),
    sucursal VARCHAR(15),
    es_externo BOOLEAN DEFAULT FALSE,  -- Indica si el usuario es externo o no
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$'),
    FOREIGN KEY (sucursal) REFERENCES Sucursal(id)
);

-- Tabla Usuario_Externo (Usuarios no registrados)
CREATE TABLE Usuario_Externo (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(255),
    correo VARCHAR(255) NULL,
    telefono VARCHAR(50) NULL,
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$')
);

-- Tabla Usuario_Direccion (Relación entre Usuario y Direccion)
CREATE TABLE Usuario_Direccion (
    usuario VARCHAR(15),
    direccion INT,
    PRIMARY KEY (usuario, direccion),
    FOREIGN KEY (usuario) REFERENCES Usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (direccion) REFERENCES Direccion(id) ON DELETE CASCADE
);

-- Tabla Paquete (Paquetes enviados)
CREATE TABLE Paquete (
    id VARCHAR(15) PRIMARY KEY,
    id_dimension VARCHAR(24),
    remitente VARCHAR(15) NULL,  -- Remitente puede ser un usuario registrado
    destinatario VARCHAR(15) NULL,  -- Destinatario puede ser un usuario registrado
    id_remitente_externo INT NULL,  -- Remitente externo (si no es usuario registrado)
    id_destinatario_externo INT NULL,  -- Destinatario externo (si no es usuario registrado)
    direccion_remitente INT NULL,  -- Dirección del remitente
    direccion_destinatario INT NULL,  -- Dirección del destinatario
    peso FLOAT,
    precio FLOAT,
    FOREIGN KEY (remitente) REFERENCES Usuario(id),
    FOREIGN KEY (destinatario) REFERENCES Usuario(id),
    FOREIGN KEY (id_remitente_externo) REFERENCES Usuario_Externo(id),
    FOREIGN KEY (id_destinatario_externo) REFERENCES Usuario_Externo(id),
    FOREIGN KEY (direccion_remitente) REFERENCES Direccion(id),
    FOREIGN KEY (direccion_destinatario) REFERENCES Direccion(id),
    CONSTRAINT formato_id_dimension CHECK (id_dimension ~* '^[A-Za-z0-9]{24}$')
);
