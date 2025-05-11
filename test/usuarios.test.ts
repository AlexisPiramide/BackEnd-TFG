import request from "supertest";
import app from "./../src/app";
import executeQuery from "../context/postgres.db";

describe("Usuarios Tests", () => {

    beforeEach(async () => {
        const query = `DELETE FROM Usuario`;
        await executeQuery(query);
    });
    

    it("Post /registro", async () => {
        const response = await request(app)
            .post("/usuarios/registro")
            .send({
                "nombre": "Usuario",
                "apellidos": "de Prueba",
                "correo": "220240@fppiramide.com",
                "contraseña": "Contraseña123*",
                "telefono": "609690709"
            });

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("id");
        expect(response.body.token).toBeDefined();
    });

    it("Post /login", async () => {
        await registrodb();
        const response = await request(app)
            .post("/usuarios/login")
            .send({
                "correo": "220240@fppiramide.com",
                "contraseña": "Contraseña123*",
            });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("correo", "220240@fppiramide.com");
        expect(response.body.token).toBeDefined();
    });

    it("Post /admin/registro", async () => {
       
        const { adminEmail, adminPassword } = await insertarAdminUser();

        const responseAdmin = await request(app)
            .post("/usuarios/login")
            .send({
                correo: adminEmail,
                contraseña: adminPassword
            });
    
        const adminToken = responseAdmin.body.token;
    
        const response = await request(app)
            .post("/usuarios/admin/registro")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                nombre: "Empleado",
                apellidos: "De Prueba",
                correo: "admin.user@example.com",
                contraseña: "AdminPassword123",
                telefono: "609690809"
            });
    
        expect(response.status).toBe(201);
        expect(response.body.usuario).toHaveProperty("nombre", "Empleado");
        expect(response.body.usuario).toHaveProperty("correo", "admin.user@example.com");
    });
    

    it("Post /existe - Por Correo", async () => {
        await registrodb();
        const response = await request(app)
            .post("/usuarios/existe")
            .send({
                "nombre": "Usuario",
                "apellidos": "de Prueba",
                "correo": "220240@fppiramide.com",
            });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("nombre", "Usuario");
        expect(response.body.usuario).toHaveProperty("correo", "220240@fppiramide.com");
    });

    it("Post /existe - Por Telefono", async () => {
        await registrodb();
        const response = await request(app)
            .post("/usuarios/existe")
            .send({
                "nombre": "Usuario",
                "apellidos": "de Prueba",
                "telefono": "609690709",
            });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("nombre", "Usuario");
        expect(response.body.usuario).toHaveProperty("telefono", "609690709");
    });

    it("Get /:id", async () => {
        const { usuario, token } = await registrodb();
        const response = await request(app)
            .get(`/usuarios/${usuario.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty("id", usuario.id);
        expect(response.body).toHaveProperty("nombre", "Usuario");
        expect(response.body).toHaveProperty("apellidos", "de Prueba");
        expect(response.body).toHaveProperty("correo", "220240@fppiramide.com");
        expect(response.body).toHaveProperty("telefono", "609690709");
    });

});

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
        VALUES ('AD-1234-5678', 'Admin', 'User', '${validAdminEmail}', 'AdminPassword123', '600000000', 'Administrador', '${sucursalId}', FALSE) 
        RETURNING id, correo;
    `);
    const adminId = usuarioResponse.rows[0].id;
    const adminEmail = usuarioResponse.rows[0].correo;

    return { adminId, adminEmail, adminPassword: "AdminPassword123" };
};
