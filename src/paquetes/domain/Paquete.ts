import Dimension from "../../dimensiones/domain/Dimension";

export default interface Paquete {
    id?: string;
    dimensiones: Dimension;
}