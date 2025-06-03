import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import Usuario from "../../src/usuarios/domain/Usuario";
import Sucursal from "../../src/sucursales/domain/Sucursal";
import executeQuery from "../postgres.db";

dotenv.config();

const SECRET_KEY: Secret = process.env.SECRET_KEY!;

// --- Token Helpers ---

const verifyToken = (token: string): any => {
    return jwt.verify(token, SECRET_KEY);
};

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const createToken = (user: Usuario): string => {
    const payload: {
        id?: string;
        nombre?: string;
        apellidos?: string;
        correo?: string;
        telefono?: string;
        sucursal?: Sucursal;
    } = {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono,
    };

    if (user.sucursal) {
        payload.sucursal = {
            id: user.sucursal.id,
            nombre: user.sucursal.nombre,
            telefono: user.sucursal.telefono,
            direccion: user.sucursal.direccion,
        };
    }

    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
};

// --- Middleware ---

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ mensaje: "No autorizado" });
            return;
        }

        const decoded: any = verifyToken(token);

        req.body.id = decoded.id;
        req.body.nombre = decoded.nombre;
        req.body.apellidos = decoded.apellidos;
        req.body.correo = decoded.correo;
        req.body.telefono = decoded.telefono;

        if (decoded.sucursal) {
            req.body.sucursal = decoded.sucursal;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ mensaje: "No autorizado" });
        return;
    }
};

const isWorker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ mensaje: "No autorizado" });
            return;
        }

        const decoded: any = verifyToken(token);

        if (!decoded.sucursal) {
            res.status(401).json({ mensaje: "No autorizado" });
            return;
        }

        req.body.trabajador = {
            id: decoded.id,
            nombre: decoded.nombre,
            apellidos: decoded.apellidos,
            correo: decoded.correo,
            sucursal: decoded.sucursal,
            telefono: decoded.telefono,
        };

        
        const autorizacionValida = await checkSucursal(decoded.correo);

        if (!autorizacionValida) {
            res.status(401).json({ mensaje: "No autorizado" });
            return;
        }
        
        next();
    } catch (error) {
        console.error("Error en isWorker middleware:", error);
        res.status(500).json({ mensaje: "Error interno en la autenticación" });
    }
}


async function checkSucursal(correo: string): Promise<boolean> {
    const query = "SELECT s.* FROM Sucursal s JOIN usuario u ON s.id = u.sucursal WHERE u.correo = $1";
    const values = [correo];

    const result: any = await executeQuery(query, values);

    return result.length > 0;
}


const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ mensaje: "No autorizado" });
        return ;
    }

    const decoded: any = verifyToken(token);

    req.body.id = decoded.id;
    req.body.nombre = decoded.nombre;
    req.body.apellidos = decoded.apellidos;
    req.body.correo = decoded.correo;
    req.body.telefono = decoded.telefono;

    if (decoded.sucursal) {
        req.body.sucursal = decoded.sucursal;
    }

    
    const query = "SELECT es_admin FROM Usuario WHERE correo = $1";
    const values = [decoded.correo];

    const result: any = await executeQuery(query, values);

    if (result.length === 0 || !result[0].es_admin) {
        res.status(401).json({ mensaje: "No autorizado" });
        return;
    }
    
    next();
}



// Export the finalized helpers and middlewares
export { verifyToken, createToken, isAuth, isWorker, isAdmin };


