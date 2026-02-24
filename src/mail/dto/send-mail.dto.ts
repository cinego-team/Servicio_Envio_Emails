export class SendMailDTO {
    body: {
        titulo: string;
        fecha: string;
        hora: string;
        destinatario: string;
        qrs: string[];
    }
}