import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER || '';
const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '';


// Configura OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();

    if (!accessTokenResponse || !accessTokenResponse.token) {
      throw new Error('Failed to obtain access token.');
    }

    const accessToken = accessTokenResponse.token;

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error; 
  }
}

const sendTrackingEmail = async (to: string, trackingCode: string) => {
  const subject = 'Notificación de seguimiento';
  const html = 
  ` <p>Un envío ha sido registrado con éxito a este correo.</p>
    <p>Su código de seguimiento es: <strong>${trackingCode}</strong>.</p>
    <p>Puedes usarlo para verificar el estado de tu envío desde 
      <a href="https://front.alexis.daw.cpifppiramide.com/${trackingCode}">este enlace</a>.
    </p>
    <p>O desde nuestra página web oficial 
      <a href="https://front.alexis.daw.cpifppiramide.com/">https://front.alexis.daw.cpifppiramide.com/</a>.
    </p>
    
    <p>Gracias por confiar en nosotros.</p>
   
    <p>Este correo ha sido enviado automáticamente, por favor no respondas a este mensaje.</p>
    <p>Si tienes alguna duda, puedes contactar con nosotros a través de nuestro correo de soporte.</p>
    `;
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Correo enviado: %s', info.messageId);
  } catch (error: any) {
    if (error?.response?.includes('Invalid Credentials')) {
      console.error('Your refresh token may be invalid or expired. You need to regenerate it.');
    }
    console.error('Error enviando el correo: ', error);
  }
};

export default sendTrackingEmail;
