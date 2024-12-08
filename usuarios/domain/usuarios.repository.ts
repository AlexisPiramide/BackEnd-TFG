import Usuario from "./Usuario";

export default interface usuariosRepository {
    login(email: string, password: string): Promise<Usuario>;
    registro(usuario: Usuario): Promise<Usuario>;
}