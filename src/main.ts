import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            `http://localhost:${process.env.PUERTO_APIGATEWAY}`,
            `http://localhost:${process.env.PUERTO_MS_VENTAS}`,
            `http://localhost:${process.env.PUERTO_MS_PROMOCIONES}`,
            `http://localhost:${process.env.PUERTO_MS_PELICULAS}`,
            `http://localhost:${process.env.PUERTO_MS_FUNCIONES_Y_SALAS}`,
            `http://localhost:${process.env.PUERTO_MS_USUARIOS}`,
            `http://localhost:${process.env.PUERTO_MS_MERCADOPAGO}`,
        ],
        credentials: true
    });
    await app.listen(process.env.PUERTO_MS_ENVIO_EMAILS!);
}
bootstrap();

