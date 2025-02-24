import DimensionesRepository from "../domain/dimensiones.repository";

export default class DimensionesUsecases {
    
    constructor(private dimensionesRepository: DimensionesRepository) {}

    async getDimensiones() {
        return await this.dimensionesRepository.getDimensiones();
    }
    
}