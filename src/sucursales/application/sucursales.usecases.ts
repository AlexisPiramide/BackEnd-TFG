import sucuralesRepository from "../domain/sucursales.repository";
import UsuariosUsecases from "../../usuarios/application/usuarios.usecases";
import usuariosRepositoryPostgres from "../../usuarios/infraestructure/db/usuarios.repository.postgres";
import Usuario from "../../usuarios/domain/Usuario";
import UsuariosRepository from "../../usuarios/domain/usuarios.repository";
import createMail from "./../../../context/createMail";
const usuariosRepository: UsuariosRepository = new usuariosRepositoryPostgres();
const usuariosUsecases = new UsuariosUsecases(usuariosRepository);

export default class SucursalesUseCases {
   
    constructor(private sucursalesrepository: sucuralesRepository) {}
       
    async crearTrabajador(trabajador: Usuario): Promise<Usuario> {
        const email = await createMail(trabajador);
        trabajador.correo = email;
        return await usuariosUsecases.registro(trabajador);
    }

    async vincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean> {
        return await this.sucursalesrepository.vincularTrabajador(sucursal, trabajador);
    }

    async desvincularTrabajador(sucursal: string, trabajador: Usuario): Promise<Boolean> {
        return await this.sucursalesrepository.desvincularTrabajador(sucursal, trabajador);
    }
}