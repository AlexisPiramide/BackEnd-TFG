import Dimension from "./Dimension";

export default interface DimensionesRepository {
    getDimensiones(): Promise<Dimension[]>;
}