import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const {
  GMAIL_USER,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
} = process.env;

// Configura OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // o tu redirect_uri
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter() {
  const { token } = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: token as string,
    },
  });
}

const sendTrackingEmail = async (to: string, trackingCode: string) => {
  const subject = 'Notificación de seguimiento';
  const text = `Tu código de seguimiento es: ${trackingCode}. Puedes usarlo para verificar el estado de tu envío.`;

  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: GMAIL_USER,
      to,
      subject,
      text,
    });

    console.log('Correo enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error enviando el correo: ', error);
  }
};

export default sendTrackingEmail;
