import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_URL || "";
const dbName = process.env.MONGO_DB_NAME || "myDatabase";
const collections: { [key: string]: Collection } = {};

async function createMongoConnection() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    addCollections(db);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

const addCollections = (db: Db) => {
  collections.usuarios = db.collection("usuarios");
  collections.cafes = db.collection("cafes");
  collections.notas = db.collection("notas");
  collections.pedidos = db.collection("pedidos");
  collections.usuarios.createIndex({ correo: 1 }, { unique: true });
};

export default createMongoConnection;

export { collections };