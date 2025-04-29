import express, { Request, Response } from "express";
import generateBarcode from "./../../../../barcode";
import PaqueteRepository from "../../domain/paquetes.repository";
import PaquetesUsecases from "../../application/paquetes.usecases";
import PaqueteRepositoryPostgres from "../db/paquetes.repository.postgres";
import Direccion from "../../../direcciones/domain/Direccion";
import Paquete from "../../domain/Paquete";
import Usuario from "../../../usuarios/domain/Usuario";

const router = express.Router();

const paquetesrepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const paquetesusecases = new PaquetesUsecases(paquetesrepository);

router.post('/', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Paquetes']
        #swagger.description = 'Endpoint para generar un nuevo paquete'
        #swagger.responses[201] = { 
            description: 'Paquete creado correctamente'
        }
    */
    try {
        const paquetebody: Paquete = {
            dimensiones: req.body.dimensiones,
            remitente: typeof req.body.remitente === "object" ? nuevoUsuario(req) : req.body.remitente,
            direccion_remitente: typeof req.body.direccion_remitente === "object" ? nuevaDireccion(req): req.body.direccion_remitente,
            destinatario: typeof req.body.destinatario === "object" ? nuevoUsuario(req) : req.body.destinatario,
            direccion_destinatario: typeof req.body.direccion_destinatario === "object" ? nuevaDireccion(req) : req.body.direccion_destinatario,
            peso: req.body.peso
        };

        const paquete = await paquetesusecases.postPaquete(paquetebody);
        res.status(201).json(paquete);
    } catch (error) {
        console.log(error);
        res.status(error.estatus).json(error.message);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Paquetes']
        #swagger.description = 'Endpoint para obtener paquete por id'
        #swagger.responses[200] = { 
            description: 'Paquete obtenido correctamente'
        }
    */
    try {
        const paquete = await paquetesusecases.getPaquete(req.params.id);
        res.status(200).json(paquete);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.post('/paquetes/', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Paquetes']
        #swagger.description = 'Endpoint para obtener paquete por id'
        #swagger.responses[200] = { 
            description: 'Paquete obtenido correctamente'
        }
    */
    try {
        const paquetes = await paquetesusecases.getPaquetesByUsuario(req.body.id);
        res.status(200).json(paquetes);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.get('/gencode/:id', async (req: Request, res: Response) => {
    /* #swagger.tags = ['Paquetes']
        #swagger.description = 'Endpoint para generar el código de barras'
        #swagger.responses[200] = { 
            description: 'Código de barras generado correctamente'
        }
    */
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
    /* #swagger.tags = ['Paquetes']
        #swagger.description = 'Endpoint para calcular el precio de un paquete'
        #swagger.responses[200] = { 
            description: 'Precio calculado correctamente'
        }
    */
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