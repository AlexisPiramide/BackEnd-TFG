import request from "supertest";
import app from "./../src/app";
import { limpiarDB, postDireccion } from "./unitarios";

describe("Direcciones Tests", () => {
    
    beforeEach(async () => {
        await limpiarDB();
        }

        it("POST /direcciones debería crear una nueva dirección", async () => {
        const usuario = "XXXX-XXXX-XXXX";
        const response = await request(app)
        .post("/direcciones/" + usuario)
        .send({
            calle: "Calle Falsa",
            numero: "123",
            codigoPostal: "54321",
            localidad: "Shelbyville",
            provincia: "Illinois",
            pais: "USA"
        });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.calle).toBe("Calle Falsa");
        expect(response.body.numero).toBe("123");
        expect(response.body.codigoPostal).toBe("54321");
        expect(response.body.localidad).toBe("Shelbyville");
        expect(response.body.provincia).toBe("Illinois");
        expect(response.body.pais).toBe("USA");
        });

        it("GET /direcciones/:usuario - debería recuperar la dirección creada", async () => {
        const usuario = "XXXX-XXXX-XXXX";
        const direccionId =await postDireccion();

        const response = await request(app).get(`/direcciones/${direccionId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", direccionId);
        expect(response.body.calle).toBe("Calle Falsa");
    });
});
