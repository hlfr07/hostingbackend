import { Module } from '@nestjs/common';
import { ComandsService } from './comands.service';
import { ComandsController } from './comands.controller';

@Module({
  controllers: [ComandsController],
  providers: [ComandsService],
})
export class ComandsModule {}
