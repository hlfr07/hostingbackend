import { Module } from '@nestjs/common';
import { ZipProjectsService } from './zip_projects.service';
import { ZipProjectsController } from './zip_projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { zip } from 'rxjs';
import { ZipProject } from './entities/zip_project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZipProject])],
  controllers: [ZipProjectsController],
  providers: [ZipProjectsService],
  exports: [ZipProjectsService]
})
export class ZipProjectsModule {}
