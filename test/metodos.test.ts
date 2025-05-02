import generateBarcode from '../context/barcode';
import { generarIDUsuario, generarID16AN } from '../context/idGenerator';
import createMail from '../context/createMail';
import passwordGenerator from '../context/passwordGenerator';
import enviaCorreos from '../context/enviaCorreos';
import ErrorPersonalizado from '../src/Error/ErrorPersonalizado';
import Usuario from '../src/usuarios/domain/Usuario';

import bwipjs from 'bwip-js';
import nodemailer from 'nodemailer';

jest.mock('bwip-js');
jest.mock('nodemailer');

describe('Test de todos los métodos', () => {
    // Mocks para bwip-js
    describe('generateBarcode', () => {
        it('debe llamar a bwipjs.toBuffer con los parámetros correctos', async () => {
            const mockBuffer = Buffer.from('fake-barcode');
            (bwipjs.toBuffer as jest.Mock).mockResolvedValue(mockBuffer);

            const result = await generateBarcode('12345');
            expect(bwipjs.toBuffer).toHaveBeenCalledWith({
                bcid: 'code128',
                text: '12345',
                scale: 3,
                height: 10,
                includetext: false,
            });
            expect(result).toBe(mockBuffer);
        });

        it('debe lanzar error si no se pasa ID', async () => {
            await expect(generateBarcode('')).rejects.toThrow('ID is required');
        });
    });

    // Tests para ID generators
    describe('generarIDUsuario', () => {
        it('debe retornar un ID con el formato XXXX-XXXX-XXXX', async () => {
            const result = await generarIDUsuario();
            expect(result).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
        });
    });

    describe('generarID16AN', () => {
        it('debe retornar un string de 15 caracteres alfanuméricos', async () => {
            const result = await generarID16AN();
            expect(result).toMatch(/^[A-Za-z0-9]{15}$/);
        });
    });

    // createMail
    describe('createMail', () => {
        const OLD_ENV = process.env;

        beforeEach(() => {
            process.env = { ...OLD_ENV, DOMINIO: 'ejemplo.com' };
        });

        afterEach(() => {
            process.env = OLD_ENV;
        });

        it('debe generar el correo correctamente', async () => {
            const usuario: Usuario = { nombre: 'Juan', apellidos: 'Perez' } as Usuario;
            const result = await createMail(usuario);
            expect(result).toBe('JuanPerez@ejemplo.com');
        });

        it('debe lanzar error personalizado si faltan datos', async () => {
            const usuario: Usuario = { nombre: '', apellidos: '' } as Usuario;
            await expect(createMail(usuario)).rejects.toThrow(ErrorPersonalizado);
            await expect(createMail(usuario)).rejects.toThrow('Error al crear el correo');
        });
    });

    // passwordGenerator
    describe('passwordGenerator', () => {
        it('debe generar una contraseña de 16 caracteres', async () => {
            const result = await passwordGenerator();
            expect(result).toMatch(/^[A-Z0-9!@#$%^&*]{16}$/);
            expect(result.length).toBe(16);
        });

        it('debe generar contraseñas diferentes en múltiples llamadas', async () => {
            const pass1 = await passwordGenerator();
            const pass2 = await passwordGenerator();
            expect(pass1).not.toBe(pass2);
        });
    });

    // enviaCorreos
    describe('enviaCorreos', () => {
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'fake-message-id' });

        beforeEach(() => {
            (nodemailer.createTransport as jest.Mock).mockReturnValue({
                sendMail: sendMailMock,
            });

            process.env.GMAIL_USER = 'test@gmail.com';
            process.env.GMAIL_PASS = 'testpass';
        });

        it('debe enviar un correo con el código de seguimiento', async () => {
            const to = 'destinatario@correo.com';
            const trackingCode = 'ABC123';

            await enviaCorreos(to, trackingCode);

            expect(sendMailMock).toHaveBeenCalledWith({
                from: 'test@gmail.com',
                to,
                subject: 'Notificación de seguimiento',
                text: expect.stringContaining(trackingCode),
            });
        });

        it('debe manejar errores sin lanzar excepción', async () => {
            sendMailMock.mockRejectedValueOnce(new Error('Falló'));
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await enviaCorreos('dest@correo.com', 'XYZ');

            expect(consoleSpy).toHaveBeenCalledWith('Error enviando el correo: ', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });
});
