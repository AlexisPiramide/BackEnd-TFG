export default interface Usuario {
    nombre: string;
    apellidos: string;
    email: string;
    contraseña?: string;
    rol?: string;
}