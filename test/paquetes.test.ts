import request from "supertest";
import app from "./../src/app";


describe(" Paquetes Tests", () => {

    it("Post /paquetes", async () => {
        const response = await request(app)
        .post("/paquetes")
        .send({
            "_id": {
              "$oid": "67bef9905a2641523414df2f"
            },
            "nombre": "Extra Pequeño"
          })

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.dimensiones).toBe("Extra Pequeño");
    });
});