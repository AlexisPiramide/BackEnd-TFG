import dotenv from "dotenv";
import Usuario from "../src/usuarios/domain/Usuario";
import ErrorPersonalizado from "../src/Error/ErrorPersonalizado";
dotenv.config();
const DOMINIO: string = process.env.DOMINIO || "";

async function createMail(usuario: Usuario): Promise<string> {
    try {
        if(!usuario.nombre || !usuario.apellidos){
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
        const correo = usuario.nombre+usuario.apellidos+ "@" +DOMINIO;
        return correo;
    } catch (error) {
       throw new ErrorPersonalizado("Error al crear el correo", 500);
    }
}

export default createMail;