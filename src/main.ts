import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const Moralis = require("moralis/node");

const serverUrl = "https://fbjp6fpn9cfk.usemoralis.com:2053/server";
const appId = "2eSJJLFJUsHxYjS0FyMA8YOYyqX44DOKinZkvf8E";

Moralis.start({ serverUrl, appId });

/**
 * Setup the app and start the server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Exchange market information')
    .setDescription('Get information from 3rd party cryptocurrency exchanges')
    .setVersion('1.0')
    .addTag('markets')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  console.log(`App is running on: ${await app.getUrl()}`);
}
bootstrap();
