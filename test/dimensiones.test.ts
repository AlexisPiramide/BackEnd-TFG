import request from "supertest";
import app from "./../src/app";
import createMongoConnection from "../context/mongo.db";

describe("API Dimensiones Tests", () => {
    beforeAll(async () => {
        await createMongoConnection()
    });

    it("GET /api/dimensiones", async () => {
        const response = await request(app).get("/api/dimensiones");
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);

        response.body.forEach(dimension => {
            expect(dimension).toHaveProperty("id");
            expect(dimension.id).toMatch(/^[a-fA-F0-9]{24}$/);

            expect(dimension).toHaveProperty("nombre");
            expect(dimension.nombre).toBeTruthy();

            expect(dimension).toHaveProperty("ancho");
            expect(dimension.ancho).toEqual(expect.any(Number));

            expect(dimension).toHaveProperty("alto");
            expect(dimension.alto).toEqual(expect.any(Number));

            expect(dimension).toHaveProperty("largo");
            expect(dimension.largo).toEqual(expect.any(Number));

            expect(dimension).toHaveProperty("peso");
            expect(dimension.peso).toEqual(expect.any(Number));  
        });
    });
});