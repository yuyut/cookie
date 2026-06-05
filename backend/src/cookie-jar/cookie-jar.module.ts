import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieJar } from './cookie-jar.entity';
import { CookieJarService } from './cookie-jar.service';
import { CookieJarController } from './cookie-jar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CookieJar])],
  providers: [CookieJarService],
  controllers: [CookieJarController],
})
export class CookieJarModule {}