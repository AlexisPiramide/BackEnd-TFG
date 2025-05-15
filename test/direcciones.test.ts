import request from "supertest";
import app from "./../src/app";
import { limpiarDB, postDireccion } from "./unitarios";

describe("Direcciones Tests", () => {

    beforeEach(async () => {
        await limpiarDB();
    }
});
