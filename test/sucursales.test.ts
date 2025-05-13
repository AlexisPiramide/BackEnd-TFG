import request from "supertest";
import app from "./../src/app";
import { limpiarDB, postDireccion,insertarAdminUser, insertarSucursal, insertarTrabajador } from "./unitarios";

describe("Pruebas de Sucursales", () => {
    beforeEach(async () => {
        await limpiarDB();
    });

    it("GET /sucursales debe devolver 200 y un array", async () => {
        const result = await insertarSucursal();

        const res = await request(app).get("/sucursales");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("POST /sucursales debe crear una nueva sucursal", async () => {
        const {token} = await insertarAdminUser();
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
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.nombre).toBe(sucursal.nombre);
    });

    it("GET /sucursales/:id debe devolver la sucursal por id", async () => {
        const id = insertarSucursal();

        const res = await request(app).get(`/sucursales/${id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", id);
    });

    it("POST /sucursales/trabajador debe crear un nuevo trabajador", async () => {
        const {token} = await insertarAdminUser();

        const sucursal = await insertarSucursal();

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
            .send(trabajador,sucursal,token)
            .set("Authorization ", `Bearer ${token}`);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.nombre).toBe(trabajador.nombre);
    });

    it("PATCH /sucursales/:id debe vincular trabajador", async () => {
        const {token} = await insertarAdminUser();
        const trabajador = await insertarTrabajador();
        const sucursal = await insertarSucursal();
       

        const res = await request(app)
            .patch(`/sucursales/${sucursal.id}`)
            .send(trabajador)
            .set("Authorization ", `Bearer ${token}`);
    });
});
