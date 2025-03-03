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
    });


});