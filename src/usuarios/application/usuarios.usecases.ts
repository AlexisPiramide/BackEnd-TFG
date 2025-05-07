import { generarIDUsuario } from "../../../context/idGenerator";
import ErrorPersonalizado from "../../Error/ErrorPersonalizado";
import Usuario from "../domain/Usuario";
import usuariosRepository from "../domain/usuarios.repository";
import {hash,compare} from "./../../../context/security/encrypter";
export default class usuariosUsecases{
    constructor(private usuariosRepository: usuariosRepository){}

    async login(usuario: Usuario): Promise<Usuario> {
        if (!usuario.correo || !usuario.contraseña) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
        
        const passwordHash = hash(usuario.contraseña);
        usuario.contraseña = passwordHash;

        const usuarioDB = await this.usuariosRepository.login(usuario);

        return usuarioDB;
    }
    
    async registro(usuario: Usuario): Promise<Usuario> {
        if (!usuario.correo || !usuario.contraseña) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
    
        let result = true;
        
        while (result) {
            const idGenerado = await generarIDUsuario(); 
            usuario.id = idGenerado;
            result = await this.usuariosRepository.comporbarID(idGenerado);
        }
        
        const passwordHash = hash(usuario.contraseña);
        usuario.contraseña = passwordHash;
        
        const usuarioDB = await this.usuariosRepository.registro(usuario);
   
        return usuarioDB;
     
    }

    async registrarUsuarioExterno(usuario: Usuario): Promise<Usuario> {

        try {

            let result = true;
        
            while (result) {
                const idGenerado = await generarIDUsuario(); 
                usuario.id = idGenerado;
                result = await this.usuariosRepository.comporbarID(idGenerado);
            }
          
            const usuarioregistrado = await this.usuariosRepository.registrarUsuarioExterno(usuario)
        
            return usuarioregistrado;
        } catch (error) {
            throw new ErrorPersonalizado("Error al registrar el usuario", 500);
            
        }
    }

    async convertirdeUsuarioExterno(usuario: Usuario): Promise<Usuario> {
        if (!usuario.nombre || !usuario.apellidos || !usuario.correo || !usuario.telefono) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }

        const passwordHash = hash(usuario.contraseña);
        usuario.contraseña = passwordHash;

        const usuarioDB = await this.usuariosRepository.convertirdeUsuarioExterno(usuario);

        return usuarioDB;
    }

    
    async getUsuario(id: string): Promise<Usuario> {
        if (!id) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
    
        return await this.usuariosRepository.getUsuario(id);
    }

    async comporbarID(id: string): Promise<boolean> {
        if (!id) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
    
        return await this.usuariosRepository.comporbarID(id);
    }


    async encontrarcondatos(usuario: Usuario): Promise<Usuario> {
        if (!usuario.nombre || !usuario.apellidos || !usuario.correo) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
    
        return await this.usuariosRepository.encontrarcondatos(usuario);
    }

}