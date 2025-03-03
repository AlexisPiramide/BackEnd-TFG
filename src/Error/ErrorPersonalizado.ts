export default class ErrorPersonalizado extends Error {
    estatus: number;

    constructor(message: string,estatus: number) {
        super(message);
        this.estatus = estatus;
    }
}