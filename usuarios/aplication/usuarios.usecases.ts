import usuariosRepository from "../domain/usuarios.repository";

export default class usuarioUsecases{
    constructor(private usuariosRepository: usuariosRepository){}

    async login(email: string, password: string){
        try{
            return await this.usuariosRepository.login(email, password);
        }catch(error){
            throw error;
        }
    }

    async registro(usuario: any){
        try{
            return await this.usuariosRepository.registro(usuario);
        }catch(error){
            throw error;
        }
    }
}