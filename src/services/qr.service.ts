import * as QRCode from 'qrcode';

export async function QrToBuffer(qrBase64: string[]): Promise<Buffer[]> {
    const qrsBuffer: Buffer[] = await Promise.all(
        qrBase64.map((qr) => QRCode.toBuffer(qr))
    );
    return qrsBuffer;
}