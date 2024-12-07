import dimensionesRepository from "../domain/dimensiones.repository";
import Dimension from "../domain/Dimension";

export default class DimensionesUseCases {
    constructor(private dimensionesRepository: dimensionesRepository) {}

    async getAll(): Promise<Dimension[]> {
        try {
            return await this.dimensionesRepository.getAll();
        } catch (error) {
            throw error;
        }
    }
}