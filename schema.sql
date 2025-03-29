CREATE TABLE Direccion (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255),
    numero VARCHAR(15),   
    codigo_postal VARCHAR(10),
    localidad VARCHAR(100), 
    provincia VARCHAR(100), 
    pais VARCHAR(100),
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

CREATE TABLE Usuario_Direccion (
    usuario VARCHAR(15) PRIMARY KEY,
    direccion INT PRIMARY KEY,
    PRIMARY KEY (usuario, direccion),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario) REFERENCES Usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_direccion FOREIGN KEY (direcdireccioncion_id) REFERENCES Direccion(id) ON DELETE CASCADE
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


CREATE TABLE Paquete (
    id VARCHAR(15) PRIMARY KEY,
    id_dimension VARCHAR(24),
    remitente VARCHAR(15) PRIMARY KEY,
    direccion_remitente INT,
    destinatario VARCHAR(15) PRIMARY KEY,
    direccion_destinatario INT,
    peso FLOAT,
    precio FLOAT,
    estado VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (remitente) REFERENCES Usuario(id)
    FOREIGN KEY (direccion_remitente) REFERENCES Usuario_Direccion(usuario)
    FOREIGN KEY (direccion_remitente) REFERENCES Usuario_Direccion(direccion)
    FOREIGN KEY (direccion_remitente) REFERENCES Usuario_Direccion(direccion)
    CONSTRAINT formato_id_dimension CHECK (id_dimension ~* '^[A-Za-z0-9]{24}$')
);

CREATE TABLE Envio (
    id SERIAL PRIMARY KEY,
    paquete INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50),
    FOREIGN KEY (paquete) REFERENCES Paquete(id),
);
