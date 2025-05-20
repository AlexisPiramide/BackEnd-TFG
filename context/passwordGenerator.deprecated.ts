export default async function passwordGenerator(): Promise<string> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    
    const contaseñanueva = Array.from({ length: 16 })
    .map(() => caracteres[Math.floor(Math.random() * caracteres.length)])
    .join('');

    return contaseñanueva;
};