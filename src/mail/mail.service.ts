import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailDTO } from './dto/send-mail.dto';
import { generarQrsComoBuffers } from 'src/services/qr.service';

@Injectable()
export class MailService {
    private transporter;

    constructor(
        private configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASS'),
            },
        });
    }

    async sendEmailBoleto(data: SendMailDTO) {
        const qrs: Buffer[] = await generarQrsComoBuffers(data.qrs);
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
            to: data.destinatario,
            subject: '¡Gracias por tu compra en CineGo!',
            html:
                `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>¡Gracias por tu compra! 🍿</h2>
                    <p><strong>Título:</strong> ${data.titulo}</p>
                    <p><strong>Fecha:</strong> ${data.fecha}</p>
                    <p><strong>Hora:</strong> ${data.hora}</p>
                    <p>Adjuntamos tu código QR para ingresar a la función:</p>
                    <p>Mostralo en la entrada del cine para disfrutar de la película.</p>
                    <p style="margin-top:30px;">¡Te esperamos! 🎥</p>
                    <hr />
                    <small style="color:#777;">CineGo - Tu experiencia de cine, más fácil.</small>
                </div>
            `,
            attachments:
                qrs.map((qrBuffer, index) => ({
                    filename: `entrada_${index + 1}.png`,
                    content: qrBuffer,
                })),
        }
        await this.transporter.sendMail(mailOptions);
    }
}