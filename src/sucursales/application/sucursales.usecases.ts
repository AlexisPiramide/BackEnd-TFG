import sucuralesRepository from "../domain/sucursales.repository";
import UsuariosUsecases from "../../usuarios/application/usuarios.usecases";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import Usuario from "../../usuarios/domain/Usuario";
import UsuariosRepository from "../../usuarios/domain/usuarios.repository";
import createMail from "./../../../context/createMail";
import Sucursal from "../domain/Sucursal";
import ErrorPersonalizado from "../../Error/ErrorPersonalizado";
import { generarIDUsuario } from "../../../context/idGenerator";
import { hash } from "../../../context/security/encrypter";

const usuariosRepository: UsuariosRepository = new usuariosRepositoryPostgres();
const usuariosUsecases = new UsuariosUsecases(usuariosRepository);

export default class SucursalesUseCases {
   
    constructor(private sucursalesrepository: sucuralesRepository) {}
       
    async getSucursal(sucursal: string) {
        return await this.sucursalesrepository.getSucursal(sucursal);
    }

    async getSucursales() {
        return await this.sucursalesrepository.getSucursales();
    }
    
    async crearSucursal(sucursal: Sucursal) {
        return await this.sucursalesrepository.crearSucursal(sucursal);
    }
    

    async crearTrabajador(trabajador: Usuario, sucursal: string) {

         if (!trabajador.correo || !trabajador.contraseña) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }

        let result = true;

        while (result) {
            const idGenerado = await generarIDUsuario();
            trabajador.id = idGenerado;
            result = await usuariosRepository.comporbarID(idGenerado);
        }

        const passwordHash = hash(trabajador.contraseña);
        trabajador.contraseña = passwordHash;

        const trabajadorCreado = await this.crearTrabajador(trabajador,sucursal);

        return trabajadorCreado;
    }
    

    async vincularTrabajador(sucursal: string, trabajador: Usuario) {
        const trabajadorCreado = await this.sucursalesrepository.vincularTrabajador(sucursal, trabajador);
        return trabajadorCreado;
    }
}