import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailDTO } from './dto/send-mail.dto';
import { generarQrsComoBuffers } from 'src/services/qr.service';

@Injectable()
/**
 * Servicio encargado del envío de correos electrónicos.
 *
 * Configura un transporter de Nodemailer utilizando variables
 * de entorno para conectarse al servidor SMTP.
 */
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'cinegoventas@gmail.com',
                pass: process.env.EMAIL_PASS || 'vtbc nftc atuq sozm',
            },
        });
    }
    /**
     * Envía un correo electrónico con los datos del boleto comprado.
     *
     * Genera los códigos QR en formato Buffer a partir del arreglo recibido,
     * los adjunta como imágenes PNG al correo y envía un email al destinatario
     * con la información de la función (título, fecha y hora).
     *
     * @param data Objeto DTO que contiene destinatario, datos de la función
     *             y los textos para generar los códigos QR.
     * @returns Promise<void>
     * @throws Error si ocurre un problema al generar los QR o al enviar el correo.
     */

    async sendEmailBoleto(data: SendMailDTO) {
        const qrs: Buffer[] = await generarQrsComoBuffers(data.body.qrs);
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
            to: data.body.destinatario,
            subject: '¡Gracias por tu compra en CineGo!',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Gracias por tu compra! 🍿</h2>
                    <p><strong>Título:</strong> ${data.body.titulo}</p>
                    <p><strong>Fecha:</strong> ${data.body.fecha}</p>
                    <p><strong>Hora:</strong> ${data.body.hora}</p>
                    <p>Adjuntamos tu código QR para ingresar a la función:</p>
                    <p>Mostralo en la entrada del cine para disfrutar de la película.</p>
                    <p style="margin-top:30px;">¡Te esperamos! 🎥</p>
                    <hr />
                    <small style="color:#777;">CineGo - Tu experiencia de cine, más fácil.</small>
                </div>
            `,
            attachments: qrs.map((qrBuffer, index) => ({
                filename: `entrada_${index + 1}.png`,
                content: qrBuffer,
            })),
        };
        await this.transporter.sendMail(mailOptions);
    }
}
