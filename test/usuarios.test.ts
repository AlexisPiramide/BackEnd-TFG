import request from "supertest";
import app from "./../src/app";
import { insertarAdminUser, limpiarDB, registrodb } from "./unitarios";

describe("Usuarios Tests", () => {

    beforeEach(async () => {
        limpiarDB
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
