import express, { Request, Response } from "express";
import generateBarcode from "./../../../../barcode";
import PaqueteRepository from "../../domain/paquetes.repository";
import PaquetesUsecases from "../../application/paquetes.usecases";
import PaqueteRepositoryPostgres from "../db/paquetes.repository.postgres";
import Direccion from "../../../direcciones/domain/Direccion";
import Paquete from "../../domain/Paquete";

const router = express.Router();

const paquetesrepository: PaqueteRepository = new PaqueteRepositoryPostgres();
const paquetesusecases = new PaquetesUsecases(paquetesrepository);

router.post('/', async (req: Request, res: Response) => {
    try {

        const direccion_destinatario: Direccion = {
            id:undefined,
            calle: req.body.direccion.calle,
            numero: req.body.direccion.numero,
            codigoPostal: req.body.direccion.codigoPostal,
            localidad: req.body.direccion.localidad,
            provincia: req.body.direccion.provincia,
            pais: req.body.direccion.pais,
        };
        

        const paquetebody : Paquete = {
            dimensiones:  req.body.dimensiones,
            remitente: req.body.remitente,
            direccion_remitente: req.body.direccion_remitente,
            destinatario: req.body.destinatario,
            direccion_destinatario: direccion_destinatario,
            peso: req.body.peso
        }

        const paquete = await paquetesusecases.postPaquete(paquetebody);
        res.status(201).json(paquete);
    } catch (error) {
        res.status(error.estatus).json(error.message);
    }
});


router.get('/:id', async (req: Request, res: Response) => {
    try {
        const paquete = await paquetesusecases.getPaquete(req.params.id);
        res.status(200).json(paquete);
    }
    catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

router.get('/gencode/:id', async (req: Request, res: Response) => {
    try {
        const pngBuffer = await generateBarcode(req.params.id); // Get the buffer

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.png"`);

        res.send(pngBuffer); // Send the buffer directly
    } catch (error) {
        res.status(error.estatus || 500).json({ error: error.message });
    }
});

router.get("/precio/:tamaño/:peso", async (req: Request, res: Response) => {
    try {
        const precio = await paquetesusecases.calcularPrecio(req.params.tamaño, Number (req.params.peso));
        res.status(200).json(precio);
    }
    catch (error) {
        res.status(error.estatus).json(error.message);
    }
});

export default router;