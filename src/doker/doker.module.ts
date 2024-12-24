import { Module } from '@nestjs/common';
import { DokerService } from './doker.service';
import { DokerController } from './doker.controller';

@Module({
  controllers: [DokerController],
  providers: [DokerService],
  exports: [DokerService]
})
export class DokerModule {}
