// src/qrs/qrs.service.ts
import * as QRCode from 'qrcode';
/**
 * Genera códigos QR en formato PNG a partir de un arreglo de textos.
 *
 * Recorre cada string recibido, crea un código QR con alto nivel de corrección
 * de errores (H) y un ancho de 300px, y devuelve un arreglo de Buffers
 * que contienen las imágenes generadas.
 *
 * @param textos Arreglo de strings que se convertirán en códigos QR.
 * @returns Promise que resuelve en un arreglo de Buffers con los QR generados.
 * @throws Lanza un error si ocurre un problema durante la generación.
 */
export async function generarQrsComoBuffers(
    textos: string[],
): Promise<Buffer[]> {
    const qrBuffers: Buffer[] = [];
    try {
        for (const texto of textos) {
            const buffer = await QRCode.toBuffer(texto, {
                type: 'png',
                errorCorrectionLevel: 'H',
                width: 300,
            });
            qrBuffers.push(buffer);
        }
        return qrBuffers;
    } catch (error) {
        console.error('Error al generar los códigos QR:', error);
        throw error;
    }
}
