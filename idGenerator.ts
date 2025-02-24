async function generarIDUsuario(): Promise<string> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    const idNuevo = Array.from({ length: 3 })
        .map(() => Array.from({ length: 4 }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join(''))
        .join('-');

    return idNuevo;
};

async function generarID16AN(): Promise<string> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    const idNuevo = Array.from({ length: 16 })
        .map(() => caracteres[Math.floor(Math.random() * caracteres.length)])
        .join('');

    return idNuevo;
};

export { generarIDUsuario, generarID16AN}