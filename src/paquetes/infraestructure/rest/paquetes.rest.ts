import express, { Request, Response } from "express";
import generateBarcode from "../../../../context/barcode";
import PaqueteRepository from "../../domain/paquetes.repository";
import PaquetesUsecases from "../../application/paquetes.usecases";
import PaqueteRepositoryPostgres from "../db/paquetes.repository.postgres";
import Direccion from "../../../direcciones/domain/Direccion";
import Paquete from "../../domain/Paquete";
import Usuario from "../../../usuarios/domain/Usuario";
import { isAuth, isWorker } from "../../../../context/security/auth";
import envioRepository from "../../../envios/domain/envios.repository";
import enviosrepositoryMongo from "../../../envios/infraestructure/db/envios.repository.mongo";

const router = express.Router();

const paquetesrepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const enviosrepository: envioRepository = new enviosrepositoryMongo();
const paquetesusecases = new PaquetesUsecases(paquetesrepository,enviosrepository);

router.post('/',isWorker, async (req: Request, res: Response) => {
    // #swagger.tags = ['Paquetes'], #swagger.description = 'Registrar un nuevo paquete', #swagger.parameters[0] = { in: 'body', description: 'Datos del paquete', required: true, schema: { type: 'object', properties: { dimensiones: { type: 'string' }, remitente: { type: 'object' }, direccion_remitente: { type: 'object' }, destinatario: { type: 'object' }, direccion_destinatario: { type: 'object' }, peso: { type: 'number' } } } }, #swagger.responses[201] = { description: 'Paquete registrado correctamente' }, #swagger.responses[400] = { description: 'Datos inválidos' }, #swagger.responses[500] = { description: 'Error en el servidor' }
    try {
        const paquetebody: Paquete = {
            dimensiones: req.body.dimensiones,
            remitente: typeof req.body.remitente === "object" ? nuevoUsuario(req) : req.body.remitente,
            direccion_remitente: typeof req.body.direccion_remitente === "object" ? nuevaDireccion(req): req.body.direccion_remitente,
            destinatario: typeof req.body.destinatario === "object" ? nuevoUsuario(req) : req.body.destinatario,
            direccion_destinatario: typeof req.body.direccion_destinatario === "object" ? nuevaDireccion(req) : req.body.direccion_destinatario,
            peso: req.body.peso
        };

        const trabajador : Usuario = req.body.trabajador;

        const paquete = await paquetesusecases.postPaquete(paquetebody,trabajador);
        res.status(201).json(paquete);
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    // #swagger.tags = ['Paquetes'], #swagger.description = 'Obtener paquete por ID', #swagger.parameters[0] = { in: 'path', name: 'id', required: true, description: 'ID del paquete', schema: { type: 'string' } }, #swagger.responses[200] = { description: 'Paquete encontrado' }, #swagger.responses[404] = { description: 'No encontrado' }, #swagger.responses[500] = { description: 'Error en el servidor' }
    try {
        const paquete = await paquetesusecases.getPaquete(req.params.id);
        res.status(200).json(paquete);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.post('/paquetes/',isWorker, async (req: Request, res: Response) => {
    // #swagger.tags = ['Paquetes'], #swagger.description = 'Obtener paquetes por usuario', #swagger.security = [{ "bearerAuth": [] }], #swagger.parameters[0] = { in: 'body', name: 'id', required: true, description: 'ID del usuario', schema: { type: 'string' } }, #swagger.responses[200] = { description: 'Paquetes obtenidos' }, #swagger.responses[401] = { description: 'No autorizado' }, #swagger.responses[500] = { description: 'Error en el servidor' }
    try {
        const paquetes = await paquetesusecases.getPaquetesByUsuario(req.body.id);
        res.status(200).json(paquetes);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.get('/gencode/:id',isAuth, async (req: Request, res: Response) => {
    // #swagger.tags = ['Paquetes'], #swagger.description = 'Generar código de barras en PNG', #swagger.security = [{ "bearerAuth": [] }], #swagger.parameters[0] = { in: 'path', name: 'id', required: true, description: 'ID del paquete', schema: { type: 'string' } }, #swagger.responses[200] = { description: 'Código de barras generado' }, #swagger.responses[404] = { description: 'No encontrado' }, #swagger.responses[500] = { description: 'Error en el servidor' }
    try {
        const pngBuffer = await generateBarcode(req.params.id);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.png"`);
        res.send(pngBuffer);
    } catch (error) {
        res.status(error.estatus || 500).json({ error: error.message });
    }
});

router.get("/precio/:tamaño/:peso", async (req: Request, res: Response) => {
    // #swagger.tags = ['Paquetes'], #swagger.description = 'Calcular precio de envío', #swagger.parameters[0] = { in: 'path', name: 'tamaño', required: true, description: 'Tamaño del paquete', schema: { type: 'string' } }, #swagger.parameters[1] = { in: 'path', name: 'peso', required: true, description: 'Peso del paquete', schema: { type: 'number' } }, #swagger.responses[200] = { description: 'Precio calculado' }, #swagger.responses[400] = { description: 'Parámetros inválidos' }, #swagger.responses[500] = { description: 'Error en el servidor' }
    try {
        const precio = await paquetesusecases.calcularPrecio(req.params.tamaño, Number(req.params.peso));
        res.status(200).json(precio);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});


const nuevoUsuario = (req: Request): Usuario => {
    return {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        correo: req.body.email,
        contraseña: req.body.password,
        telefono: req.body.telefono
    };
}
const nuevaDireccion = (req: Request): Direccion => {
    return {
        calle: req.body.calle,
        numero: req.body.numero,
        codigoPostal: req.body.codigoPostal,
        localidad: req.body.localidad,
        provincia: req.body.provincia,
        pais: req.body.pais
    };
}
export default router;