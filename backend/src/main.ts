import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';
import { Role } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Cookie API')
    .setDescription('CRUD API for cookies and cookie jars with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  const usersService = app.get(UsersService);
  const admin = await usersService.findByEmail('admin@admin.com');
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await usersService.create('admin@admin.com', hashed, Role.ADMIN);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();