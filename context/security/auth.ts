import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Usuario from "../../src/usuarios/domain/Usuario";
import Sucursal from "../../src/sucursales/domain/Sucursal";
import executeQuery from "../postgres.db";

dotenv.config();

const SECRET_KEY: Secret = process.env.SECRET_KEY;
const DOMINIO: string = process.env.DOMINIO || "";

const decode = (token: string) => {
    return jwt.decode(token);
};

const createToken = (user: Usuario): string => {

    const payload: { nombre: string; apellidos: string; correo: string; sucursal?: Sucursal } = {
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
    };

    if (user.sucursal) {
        payload.sucursal = {
            id: user.sucursal.id,
            nombre: user.sucursal.nombre,
            telefono: user.sucursal.telefono,
            direccion: user.sucursal.direccion,
        };
    }

    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });

};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token: string | undefined = authHeader && authHeader.split(" ")[1];
        if (token) {
            const decoded: any = jwt.verify(token, SECRET_KEY);
            req.body.nombre = decoded.nombre;
            req.body.apellidos = decoded.apellidos;
            req.body.correo = decoded.correo;

            if (decoded.sucursal) {
                req.body.sucursal = decoded.sucursal;
            }

            next();
        } else {
            response.status(401).json({ mensaje: "No autorizado" });
        }
    } catch (err) {
        console.error(err);
        response.status(401).json({ mensaje: "No autorizado" });
    }
};

const isWorker = (req: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token: string | undefined = authHeader && authHeader.split(" ")[1];

        
        if (token) {
            const decoded: any = jwt.verify(token, SECRET_KEY);

            if(!decoded.sucursal) {
                response.status(401).json({ mensaje: "No autorizado" });
            }
            req.body.trabajador.id = decoded.id;
            req.body.trabajador.nombre = decoded.nombre;
            req.body.trabajador.apellidos = decoded.apellidos;
            req.body.trabajador.correo = decoded.correo;
            req.body.trabajador.sucursal = decoded.sucursal;
            req.body.trabajador.telefono = decoded.telefono;

            const sucursal = req.body.sucursal;
            const email = req.body.correo;
            if (sucursal && email.includes(DOMINIO)) {
                next();
            } else {
                response.status(401).json({ mensaje: "No autorizado" });
            }
        } else {
            response.status(401).json({ mensaje: "No autorizado" });
        }

    } catch (err) {
        console.error(err);
        response.status(401).json({ mensaje: "No autorizado" });
    }
};

const isAdmin = async (req: Request, response: Response, next: NextFunction) => {
    try {
        const query = 'SELECT es_admin FROM Usuario WHERE correo = $1';
        const values = [req.body.correo];

        try {
            const result = await executeQuery(query, values);
            if (result.length === 0) {
                response.status(401).json({ mensaje: "No autorizado" });
            }  else {
                const esAdmin = result[0].es_admin;
                if (esAdmin) {
                    next();
                } else {
                    response.status(401).json({ mensaje: "No autorizado" });
                }
            }
            
        } catch (error) {
            console.error(error);
            response.status(500).json({ mensaje: "Error interno del servidor" });
        }
    } catch (err) {
        console.error(err);
        response.status(401).json({ mensaje: "No autorizado" });
    }
};

export { decode, createToken, isAuth, isWorker, isAdmin };