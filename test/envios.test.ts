import request from "supertest";
import app from "./../src/app";
import { limpiarDB,postPaquete,insertarTrabajador,insertarEnvio } from "./unitarios";

describe("Envios Tests", () => {
    
    beforeEach(async () => {
        await limpiarDB();
    });

    it("POST /tracking/:usuario ", async () => {
        const paquete = await postPaquete();

        const trabajador = await insertarTrabajador();

        const response = await request(app)
            .post("/tracking/" + trabajador.id)
            .send({
                id: paquete.id,
                tipo: 1
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("estado");
    });

    it("GET /tracking/:id deberia devolver el tracking correspondiente", async () => {
        const envio = await insertarEnvio();
        
        const response = await request(app)
            .get("/tracking/" + envio.id)
            .send();
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", envio.id);
        expect(response.body).toHaveProperty("estado");

    });

});