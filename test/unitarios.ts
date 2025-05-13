import request from "supertest";
import app from "./../src/app";
import executeQuery from "../context/postgres.db";

const logindb = async (correo, contraseña) => {
    const response = await request(app)
        .post("/usuarios/login")
        .send({
            "correo": correo,
            "contraseña": contraseña
        });
    return {
        token: response.body.token
    };
}

const registrodb = async () => {
    const response = await request(app)
        .post("/usuarios/registro")
        .send({
            "nombre": "Usuario",
            "apellidos": "de Prueba",
            "correo": "220240@fppiramide.com",
            "contraseña": "Contraseña123*",
            "telefono": "609690709"
        });
    return {
        usuario: response.body.usuario,
        token: response.body.token
    };
}

const registrodbSecundario = async () => {
    const response = await request(app)
        .post("/usuarios/registro")
        .send({
            "nombre": "Usuario",
            "apellidos": "de Prueba",
            "correo": "230282@fppiramide.com",
            "contraseña": "Contraseña123*",
            "telefono": "639040769",
        });

    return {
        usuario: response.body.usuario,
        token: response.body.token
    };
}

const insertarAdminUser = async () => {
    const direccionResponse = await executeQuery(`
        INSERT INTO Direccion (calle, numero, codigo_postal, localidad, provincia, pais) 
        VALUES ('Calle Falsa', '123', '28080', 'Madrid', 'Madrid', 'España') 
        RETURNING id;
    `);
    const direccionId = direccionResponse.rows[0].id;

    const sucursalResponse = await executeQuery(`
        INSERT INTO Sucursal (id, nombre, id_direccion, telefono) 
        VALUES ('SUC001', 'Sucursal Central', ${direccionId}, '910000000') 
        RETURNING id;
    `);
    const sucursalId = sucursalResponse.rows[0].id;

    const validAdminEmail = "1234@mycompany.com";
    const usuarioResponse = await executeQuery(`
        INSERT INTO Usuario (id, nombre, apellidos, correo, contraseña, telefono, puesto, sucursal, es_externo) 
        VALUES ('AD-1234-5678', 'Admin', 'User', '${validAdminEmail}', 'AdminPassword123*', '600000000', 'Administrador', '${sucursalId}', FALSE) 
        RETURNING id, correo;
    `);
    const adminId = usuarioResponse.rows[0].id;
    const adminEmail = usuarioResponse.rows[0].correo;

    const token = await logindb(adminEmail, "AdminPassword123")

    return { adminId, adminEmail, adminPassword: "AdminPassword123*", token };
};


const postDireccion = async () => {

    const usuario = await registrodb();

    const response = await request(app)
        .post("/direcciones/" + usuario.usuario.id)
        .send({
            calle: "Calle Falsa",
            numero: "123",
            codigoPostal: "54321",
            localidad: "Shelbyville",
            provincia: "Illinois",
            pais: "USA"
        });

    return response.body.id;
}

//AÑADIR TODAS LAS OTRAS TABLAS
const limpiarDB = async () => {

    const query = `
        DELETE FROM Usuario;
        DELETE FROM Direccion;
        DELETE FROM Paquete;
        DELETE FROM Sucursal;
    `;
    executeQuery(query);
}


const postPaquete = async () => {

    const usuario = await registrodb();
    const usuario2 = await registrodbSecundario();

    const remitente = usuario.usuario.id;
    const token = usuario.usuario.token;

    const destinatario = usuario2.usuario.id;

    const paqueteData = {
        dimensiones: "Extra Pequeño",
        remitente: remitente,
        direccion_remitente: {
            calle: "Calle Verdadera",
            numero: "1",
            codigoPostal: "22600",
            localidad: "Sabiñanigo",
            provincia: "Huesca",
            pais: "España"
        },
        destinatario: destinatario,
        direccion_destinatario: {
            calle: "Calle Verdadera",
            numero: "1",
            codigoPostal: "22600",
            localidad: "Sabiñanigo",
            provincia: "Huesca",
            pais: "España"
        },
        peso: 2.0
    };

    const response = await request(app)
        .post("/paquetes")
        .set("Authorization", `Bearer ${token}`)
        .send(paqueteData);

    if (response.status !== 201) {
        throw new Error(`Error creating paquete: ${response.text}`);
    }

    return {
        id: response.body.id,
        paqueteData
    };
};

const insertarSucursal = async () => {
    const { token } = await insertarAdminUser();
    const direccion = await postDireccion();

    const sucursal = {
        nombre: "Sucursal Test",
        direccion: direccion,
        telefono: "123456789"
    };
    const res = await request(app)
        .post("/sucursales")
        .send(sucursal)
        .set("Authorization ", `Bearer ${token}`);
    if (res.status !== 201) {
        throw new Error(`Error creating sucursal: ${res.text}`);
    }
    return {
        id: res.body.id,
        sucursalData: sucursal
    };

};

const insertarSucursal2 = async () => {
    const { token } = await insertarAdminUser();
    const direccion = await postDireccion();

    const sucursal = {
        nombre: "Sucursal Test 2",
        direccion: direccion,
        telefono: "123456788"
    };
    const res = await request(app)
        .post("/sucursales")
        .send(sucursal)
        .set("Authorization ", `Bearer ${token}`);
    if (res.status !== 201) {
        throw new Error(`Error creating sucursal: ${res.text}`);
    }
    return {
        id: res.body.id,
        sucursalData: sucursal
    };
};

const insertarTrabajador = async () => {
    const { token } = await insertarAdminUser();
    const sucursal = await insertarSucursal2();

    const trabajador = {
        nombre: "Trabajador Test",
        apellidos: "Apellido Test",
        correo: "",
        contraseña: "Contraseña123*",
        telefono: "123456789",
        puesto: "Atencion al cliente"
    };
    const res = await request(app)
        .post("/sucursales/trabajador")
        .send(trabajador, sucursal, token)
        .set("Authorization ", `Bearer ${token}`);
    if (res.status !== 201) {
        throw new Error(`Error creating trabajador: ${res.text}`);
    }
    return {
        id: res.body.id,
        trabajadorData: trabajador
    };
}

const insertarEnvio = async () => {
    const paquete = await postPaquete();

    const trabajador = await insertarTrabajador();

    const response = await request(app)
        .post("/tracking/" + trabajador.id)
        .send({
            id: paquete.id,
            tipo: 1
        });

    if (response.status !== 201) {
        throw new Error(`Error creating envio: ${response.text}`);
    }
    return {
        id: response.body.id,
        envioData: response.body
    };
}


export { registrodb, insertarAdminUser, postDireccion, limpiarDB, postPaquete, insertarSucursal, insertarTrabajador,insertarEnvio };