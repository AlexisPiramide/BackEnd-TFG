import Usuario from "./Usuario"

export default interface usuariosRepository{
    login(usuario : Usuario): Promise<Usuario>
    registro(usuario : Usuario): Promise<Usuario>
    comporbarID(idGenerado:string): Promise<boolean>
    getUsuario(id: string): Promise<Usuario>
}