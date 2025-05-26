-- Tabla Direccion
CREATE TABLE Direccion (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255),
    numero VARCHAR(15),
    codigo_postal VARCHAR(10),
    localidad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(50) DEFAULT 'España',
    es_temporal BOOLEAN DEFAULT FALSE
);

-- Tabla Sucursal
CREATE TABLE Sucursal (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    id_direccion INT,
    telefono VARCHAR(15),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);

-- Tabla Usuario (Usuarios registrados)
CREATE TABLE Usuario (
    id VARCHAR(15) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(100),
    telefono VARCHAR(15) UNIQUE,
    puesto VARCHAR(50),
    sucursal INT,
    es_externo BOOLEAN DEFAULT FALSE,
    es_admin BOOLEAN DEFAULT FALSE,
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$'),
    FOREIGN KEY (sucursal) REFERENCES Sucursal(id),
    CHECK (correo IS NOT NULL OR telefono IS NOT NULL)
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
    remitente VARCHAR(15) NOT NULL,
    destinatario VARCHAR(15) NOT NULL,
    direccion_remitente INT,
    direccion_destinatario INT,
    peso FLOAT,
    precio FLOAT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP,
    FOREIGN KEY (remitente) REFERENCES Usuario(id),
    FOREIGN KEY (destinatario) REFERENCES Usuario(id),
    FOREIGN KEY (direccion_remitente) REFERENCES Direccion(id),
    FOREIGN KEY (direccion_destinatario) REFERENCES Direccion(id),
    CONSTRAINT formato_id CHECK (id ~* '^[A-Za-z0-9]{15}$'),
    CONSTRAINT formato_id_dimension CHECK (id_dimension ~* '^[A-Za-z0-9]{24}$')
);

WITH inserted_direccion AS (
    INSERT INTO Direccion (calle, numero, codigo_postal, localidad, provincia, pais, es_temporal)
    VALUES ('Carretera de Cuarte', '0', '22071', 'Huesca', 'Huesca', 'España', FALSE)
    RETURNING id
),

inserted_sucursal AS (
    INSERT INTO Sucursal (nombre, id_direccion, telefono)
    VALUES ( 'CPIFP Piramide', (SELECT id FROM inserted_direccion), '666666666')
    RETURNING id
)

-- Contraseña hasheada = Password*9

INSERT INTO Usuario (id, nombre, apellidos, correo, contraseña, telefono, puesto, sucursal, es_externo, es_admin)
VALUES 
    ('Q7XZ-3B9L-PD4K', 'Alexis', 'Torres Climente', '220240@fppiramide.com', '$2b$12$3InWgxc/ED7SIBxsj8uOje5Ba9omgfk37iwpWdW4PEMe2RQxuDtOa', '639040769', 'Gerente', (SELECT id FROM inserted_sucursal), FALSE, TRUE),
    ('M8CN-R2VF-JT5W', 'Nuria', 'Torrelles Guerris', '230282@fppiramide.com','$2b$12$3InWgxc/ED7SIBxsj8uOje5Ba9omgfk37iwpWdW4PEMe2RQxuDtOa', '000000000', NULL, (SELECT id FROM inserted_sucursal), FALSE, FALSE);

-- 1. Insert Direcciones and capture their IDs
WITH inserted_direcciones AS (
    INSERT INTO Direccion (calle, numero, codigo_postal, localidad, provincia, pais, es_temporal)
    VALUES 
        ('Calle Torla 1', '3B', '22600', 'Sabiñanigo', 'Huesca', 'España', FALSE),
        ('Av. del Tenor Fleta 1', '4C', '50008', 'Zaragoza', 'Zaragoza', 'España', FALSE)
    RETURNING id
),

-- 2. Number the inserted direcciones to match them with users
enumerated_direcciones AS (
    SELECT id, ROW_NUMBER() OVER () AS rn
    FROM inserted_direcciones
)

-- 3. Insert into Usuario_Direccion linking each direccion to the correct user
INSERT INTO Usuario_Direccion (usuario, direccion)
SELECT 
    CASE rn
        WHEN 1 THEN 'Q7XZ-3B9L-PD4K'
        WHEN 2 THEN 'M8CN-R2VF-JT5W'
    END AS usuario,
    id AS direccion
FROM enumerated_direcciones;

