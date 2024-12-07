import Tipo from "./Tipo";

export default interface tiposRepository {
    getAll(): Promise<Tipo[]>;
}
