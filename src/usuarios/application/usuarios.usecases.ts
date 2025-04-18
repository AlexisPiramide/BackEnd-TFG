import { generarIDUsuario } from "../../../idGenerator";
import passwordGenerator from "../../../passwordGenerator";
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
    
        const usuarioDB = await this.usuariosRepository.login(usuario);
        const isMatch = await compare(usuario.contraseña, usuarioDB.contraseña);
    
        if (!isMatch) {
            throw new ErrorPersonalizado("Correo o Contraseña Erroneos", 401);
        }
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
        
        usuario.contraseña = await hash(usuario.contraseña);
    
        return await this.usuariosRepository.registro(usuario);
    }

    async registrosinContraseña(usuario: Usuario): Promise<Usuario> {
        if (!usuario.correo) {
            throw new ErrorPersonalizado("Faltan datos", 400);
        }
    
        let result = true;
        
        while (result) {
            const idGenerado = await generarIDUsuario(); 
            usuario.id = idGenerado;
            result = await this.usuariosRepository.comporbarID(idGenerado);
        }
        let nuevacontraseña = "";
        while (true){
            nuevacontraseña = await passwordGenerator();  
            break
        }
        usuario.contraseña = await hash(usuario.contraseña);

        try {
            const usuarioregistrado = await this.usuariosRepository.registro(usuario)

            //AQUI ENVIAR CONTRASEÑA POR CORREO SI FUNCIONA
        
            return usuarioregistrado;
        } catch (error) {
            throw new ErrorPersonalizado("Error al registrar el usuario", 500);
            
        }
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

}