import { Module } from '@nestjs/common';
import { TunelsService } from './tunels.service';
import { TunelsController } from './tunels.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TunelsController],
  providers: [TunelsService],
  exports: [TunelsService],
})
export class TunelsModule {}
