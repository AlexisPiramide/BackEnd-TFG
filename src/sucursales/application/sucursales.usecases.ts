import sucuralesRepository from "../domain/sucursales.repository";
import UsuariosUsecases from "../../usuarios/application/usuarios.usecases";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import Usuario from "../../usuarios/domain/Usuario";
import UsuariosRepository from "../../usuarios/domain/usuarios.repository";
import createMail from "./../../../context/createMail";
import Sucursal from "../domain/Sucursal";

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
}