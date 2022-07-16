import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  const configDocSwagger = new DocumentBuilder()
    .setTitle('Тестовое задание')
    .setDescription(
      `Cервис с REST API, который регистрирует, удаляет, редактирует и авторизует пользователя с помощью токена(продолжительность 15 минут)`
    )
    .setVersion('1.0.0')
    .build();

  const documentSwagger = SwaggerModule.createDocument(app, configDocSwagger);
  SwaggerModule.setup('api-docs', app, documentSwagger);

  await app.listen(port, () => {
    console.log(`Server work on port ${port}`);
    console.log(`See documentation: http://localhost:${port}/api-docs`)
  });

}
bootstrap();
