import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    cors:true,
  });
  app.use(requestIp.mw());
  app.enableCors();
   // Para conseguir pegar o protocolo https
   app.set('trust proxy', 1);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Clube dos sinais')
    .setDescription('Geral api')
    .setVersion('1.0.0')
    .addTag('status')
    .addTag('auth')
    .addTag('webhook')
    .addTag('user')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Initialized at port ${process.env.PORT || 3000}`)
}
bootstrap();
