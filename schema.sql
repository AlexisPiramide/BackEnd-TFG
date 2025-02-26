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
    id_dimension VARCHAR(24),  -- Ahora almacena el ObjectId de MongoDB
    id_remitente INT,
    otros_datos VARCHAR(255),
    FOREIGN KEY (id_remitente) REFERENCES Remitente(id)
);

/*
CREATE TABLE paquetes (
    id VARCHAR(24) PRIMARY KEY,
    id_dimension VARCHAR(24) NOT NULL,  -- Ahora almacena el ObjectId de MongoDB
);
*/

CREATE TABLE Envio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_paquete INT,
    id_direccion INT,
    FOREIGN KEY (id_paquete) REFERENCES Paquete(id),
    FOREIGN KEY (id_direccion) REFERENCES Direccion(id)
);