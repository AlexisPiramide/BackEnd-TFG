import Dimension from "./Dimension";

export default interface dimensionesRepository {
    getAll(): Promise<Dimension[]>;
}