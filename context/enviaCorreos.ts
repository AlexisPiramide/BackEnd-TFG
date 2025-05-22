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
  'https://developers.google.com/oauthplayground' // o tu redirect_uri
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
    throw error; // propagate error to handle in sendTrackingEmail
  }
}

const sendTrackingEmail = async (to: string, trackingCode: string) => {
  const subject = 'Notificación de seguimiento';
  const text = `Tu código de seguimiento es: ${trackingCode}. Puedes usarlo para verificar el estado de tu envío.
  Si te esta llegando esto te jodes porque estoy de pruebas 33`;

  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      text,
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
