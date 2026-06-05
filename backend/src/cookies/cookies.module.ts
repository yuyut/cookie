import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cookie } from './cookie.entity';
import { CookiesService } from './cookies.service';
import { CookiesController } from './cookies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cookie])],
  providers: [CookiesService],
  controllers: [CookiesController],
})
export class CookiesModule {}