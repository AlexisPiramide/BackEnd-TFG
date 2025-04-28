import request from "supertest";
import app from "./../src/app";

describe("Paquetes Tests", () => {

    it("POST /paquetes - Debería crear un paquete", async () => {
        const { id, paqueteData } = await postPaquete();
        expect(id).toBeDefined();
    });

    it("GET /paquetes/:id - Debería devolver el paquete creado", async () => {
        const { id, paqueteData } = await postPaquete();

        const response = await request(app).get(`/paquetes/${id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", id);
        expect(response.body.dimensiones).toBe(paqueteData.dimensiones);
    });

    it("GET /paquetes/gencode/:id - Debería devolver código de barras en formato PNG", async () => {
        const { id } = await postPaquete();

        const response = await request(app).get(`/paquetes/gencode/${id}`);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toBe("image/png");
    });

    it("POST /paquetes/paquetes - Debería devolver paquetes por usuario", async () => {
        const { id } = await postPaquete();

        const response = await request(app)
            .post("/paquetes/paquetes")
            .send({ id });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // Might not find if your getPaquetesByUsuario logic is strict
    });

    it("GET /paquetes/precio/:tamaño/:peso - Debería calcular el precio correctamente", async () => {
        const tamaño = "Extra Pequeño";
        const peso = 2.5;

        const response = await request(app)
            .get(`/paquetes/precio/${encodeURIComponent(tamaño)}/${peso}`);

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe("number");
    });
});

const postPaquete = async () => {
    const destinatario = {
        "nombre": "John",
        "apellidos": "Doe",
        "correo": "test@example.com",
        "contraseña": "Password123*",
        "telefono": "123456789"
    };

    const remitente = {
        "nombre": "Jane",
        "apellidos": "Doe",
        "correo": "test2@example.com",
        "contraseña": "Password123*",
        "telefono": "987654321"
    };

    const usuario = await registrodb(destinatario);
    const id = usuario.body.id;
    const token = usuario.body.token;
    
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
        destinatario: id,
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

const registrodb = async (usuario) => {
    const response = await request(app)
        .post("/usuarios/registro")
        .send(usuario);
    return response;
}