import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const options = new DocumentBuilder()
      .setTitle('PUSLY API')
      .setVersion('1.0')
      .addServer('http://localhost:3000/', 'Local environment')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'jwt',
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
  } catch (err) {
    console.log('Error in main server file', err);
  }
}

bootstrap();
