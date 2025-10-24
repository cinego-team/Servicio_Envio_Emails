import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDTO } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }
    @Post('send')
    sendMail(@Body() body: SendMailDTO) {
        this.mailService.sendEmailBoleto(body);
    }
}
