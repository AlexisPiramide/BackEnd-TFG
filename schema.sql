CREATE TABLE Dimensiones (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    largo DECIMAL(10, 2) NOT NULL,
    ancho DECIMAL(10, 2) NOT NULL,
    alto DECIMAL(10, 2) NOT NULL,
    peso DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Direccion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    direccion VARCHAR(255),
    codigo_postal VARCHAR(10)
);

CREATE TABLE Usuario (
    id VARCHAR(15),
    CONSTRAINT formato_id CHECK (id ~ '^\d{4}-\d{4}-\d{4}$')
    nombre VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE Remitente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_direccion INT,
    id_usuario INT,
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);


CREATE TABLE Paquete (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_dimension INT,
    id_remitente INT,
    otros_datos VARCHAR(255),
    FOREIGN KEY (id_dimension) REFERENCES Dimensiones(id),
    FOREIGN KEY (id_remitente) REFERENCES Remitente(id)
);


CREATE TABLE Envio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paquete INT,
    id_direccion INT,
    FOREIGN KEY (id_paquete) REFERENCES Paquete(id),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);