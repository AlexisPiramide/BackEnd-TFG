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
            "nombre": "John",
            "apellidos": "Doe",
            "correo": "john.doe@example.com",
            "contraseña": "password123",
            "telefono": "123456789"
          });

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
    });

    it("Post /login", async () => {
        const usuario = await registrodb();
        const response = await request(app)
        .post("/usuarios/login")
        .send({
            "correo": "test@example.com",
            "contraseña": "password123",
        });
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it("Post /admin/registro", async () => {
        const adminToken = "Bearer your-admin-token";
        const response = await request(app)
            .post("/usuarios/admin/registro")
            .set("Authorization", adminToken)
            .send({
                "nombre": "Admin",
                "apellidos": "User",
                "correo": "admin.user@example.com",
                "contraseña": "AdminPassword123",
                "telefono": "987654321"
            });

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("id");
        expect(response.body.usuario).toHaveProperty("nombre", "Admin");
        expect(response.body.usuario).toHaveProperty("correo", "admin@example.com");
    });

    it("Post /existe", async () => {
        await registrodb();
        const response = await request(app)
            .post("/usuarios/existe")
            .send({
                "nombre": "John",
                "apellidos": "Doe",
                "correo": "test@example.com"
            });

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.usuario).toHaveProperty("nombre", "John");
        expect(response.body.usuario).toHaveProperty("correo", "test@example.com");
    });

    it("Get /:id", async () => {
        const registroResponse = await registrodb();
        const userId = registroResponse.body.usuario.id;

        const response = await request(app).get(`/usuarios/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty("id", userId);
        expect(response.body).toHaveProperty("nombre", "John");
    });

});

const registrodb = async () => {
    const response = await request(app)
        .post("/usuarios/registro")
        .send({
            "nombre": "John",
            "apellidos": "Doe",
            "correo": "test@example.com",
            "contraseña": "Password123*",
            "telefono": "123456789"
          });
    return response;
}
