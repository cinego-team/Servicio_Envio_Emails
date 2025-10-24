import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailDTO } from './dto/send-mail.dto';

@Injectable()
export class MailService {
    private transporter;

    constructor(private configService: ConfigService) {
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
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM'),
            // to: data.destinatario,
            to: data.destinatario,
            subject: '¡Gracias por tu compra en CineGo!',
            html: `
        <h2>¡Gracias por tu compra!</h2>
        <p>Adjuntamos tu código QR para el ingreso.</p>
        <p>¡Disfrutá la función! 🍿</p>
      `,
            attachments: [
                {
                    filename: 'entrada_qr.png',
                    content: data.qrBuffer,
                    encoding: 'base64',
                },
            ],
        };

        await this.transporter.sendMail(mailOptions);
    }
}
