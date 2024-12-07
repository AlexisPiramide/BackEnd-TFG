import tiposRepository from "../domain/tipos.repository";

export default class tipoUseCases {
    
    constructor(private tiposRepository: tiposRepository) {};
    
    async getAll(): Promise<any> {
        try {
            return await this.tiposRepository.getAll();
        } catch (error) {
            throw error;
        }
    }
}