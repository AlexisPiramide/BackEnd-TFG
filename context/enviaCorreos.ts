import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
// Crea el transportador con las credenciales de tu cuenta de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,// Tu correo de Gmail
        pass: GMAIL_PASS,// La contraseña de aplicación (si tienes 2FA)
    },
});

// Función para enviar el correo con un código de seguimiento
const sendTrackingEmail = async (to: string, trackingCode: string) => {
    const subject = 'Notificación de seguimiento';
    const text = `Tu código de seguimiento es: ${trackingCode}. Puedes usarlo para verificar el estado de tu envio.`;

    try {
        const info = await transporter.sendMail({
            from: GMAIL_USER, // Remitente
            to, // Destinatario
            subject, // Asunto del correo
            text, // Texto del correo con el código de seguimiento
        });
        console.log('Correo enviado: %s', info.messageId);
    } catch (error) {
        console.error('Error enviando el correo: ', error);
    }
};

export default sendTrackingEmail;