import { Module } from '@nestjs/common';
import { ProjectHotsService } from './project_hots.service';
import { ProjectHotsController } from './project_hots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectHot } from './entities/project_hot.entity';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { DokerModule } from 'src/doker/doker.module';
import { TunelsModule } from 'src/tunels/tunels.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectHot, ZipProject]), DokerModule, TunelsModule],  
  controllers: [ProjectHotsController],
  providers: [ProjectHotsService],
  exports: [ProjectHotsService]
})
export class ProjectHotsModule {}
