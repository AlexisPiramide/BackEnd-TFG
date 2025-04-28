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