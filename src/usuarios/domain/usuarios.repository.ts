import Usuario from "./Usuario"

export default interface usuariosRepository{

    login(usuario : Usuario): Promise<Usuario>
    registro(usuario : Usuario): Promise<Usuario>
}