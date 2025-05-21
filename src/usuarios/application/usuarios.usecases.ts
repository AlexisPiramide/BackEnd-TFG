import { generarIDUsuario } from "../../../context/idGenerator";
import ErrorPersonalizado from "../../Error/ErrorPersonalizado";
import Usuario from "../domain/Usuario";
import usuariosRepository from "../domain/usuarios.repository";
import { hash, compare } from "./../../../context/security/encrypter";
export default class usuariosUsecases {
    constructor(private usuariosRepository: usuariosRepository) { }

    async login(usuario: Usuario): Promise<Usuario> {
    if (!usuario.correo || !usuario.contraseña) {
        throw new ErrorPersonalizado("Faltan datos", 400);
    }

    const usuarioDB = await this.usuariosRepository.login(usuario);

    const result = compare(usuario.contraseña, usuarioDB.contraseña); // <-- corrected here

    if (!result) { 
        throw new ErrorPersonalizado("Contraseña incorrecta", 401); 
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

        const passwordHash = hash(usuario.contraseña);
        usuario.contraseña = passwordHash;

        const usuarioDB = await this.usuariosRepository.registro(usuario);
        return usuarioDB;

    }

    async registrarUsuarioExterno(usuario: Usuario): Promise<string> {

        try {

            let result = true;

            while (result) {
                const idGenerado = await generarIDUsuario();
                usuario.id = idGenerado;
                result = await this.usuariosRepository.comporbarID(idGenerado);
            }

            const usuarioregistrado = await this.usuariosRepository.registrarUsuarioExterno(usuario)

            return usuarioregistrado.id;
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

    async isExterno(id: string): Promise<Boolean> {
        return await this.usuariosRepository.isExterno(id);
    }

}