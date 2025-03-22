import request from "supertest";
import app from "./../src/app";

describe("Paquetes Tests", () => {

    it("should create a new paquete", async () => {
        const remitente = "XXXX-XXXX-XXXX";
        const direccion_remitente = "asfasfawfafafa123";
        const destinatario = "Maria Gómez";

        const response = await request(app)
        .post("/paquetes")
        .send({
            dimensiones: "Extra Pequeño",
            remitente: remitente,
            direccion_remitente: direccion_remitente,
            destinatario: destinatario,
            direccion_destinatario: {
            calle: "Calle Falsa",
            numero: "123",
            codigoPostal: "54321",
            localidad: "Shelbyville",
            provincia: "Illinois",
            pais: "USA"
            },
            peso: 1.5
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.dimensiones).toBe("Extra Pequeño");
        expect(response.body.remitente).toBe(remitente);
        expect(response.body.direccion_remitente).toBe(direccion_remitente);
        expect(response.body.destinatario).toBe(destinatario);
    });


    it("GET /paquetes/:id - Should retrieve the created paquete", async () => {

        const paqueteId = postPaquete({

        })

        const response = await request(app).get(`/paquetes/${paqueteId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("_id", paqueteId);
        expect(response.body.dimensiones).toBe("Extra Pequeño");
    });

    it("GET /paquetes/gencode/:id - Should generate a barcode image", async () => {

        const paqueteId = postPaquete({

        })

        const response = await request(app).get(`/paquetes/gencode/${paqueteId}`);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe("image/png");
    });

});

const postPaquete = async (pedido) => {
    const response = await request(app)
        .post("/paquetes")
        .send(pedido);

    
    return response.id;
}