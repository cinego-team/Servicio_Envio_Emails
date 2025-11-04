// src/qrs/qrs.service.ts
import * as QRCode from 'qrcode';

export async function generarQrsComoBuffers(textos: string[]): Promise<Buffer[]> {
    const qrBuffers: Buffer[] = [];

    for (const texto of textos) {
        const buffer = await QRCode.toBuffer(texto, {
            type: 'png',
            errorCorrectionLevel: 'H',
            width: 300,
        });
        qrBuffers.push(buffer);
    }
    return qrBuffers;
}