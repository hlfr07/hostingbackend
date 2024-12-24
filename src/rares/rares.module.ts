import { Module } from '@nestjs/common';
import { RaresService } from './rares.service';
import { RaresController } from './rares.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZipProject } from 'src/zip_projects/entities/zip_project.entity';
import { ZipProjectsModule } from 'src/zip_projects/zip_projects.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { TunelsService } from 'src/tunels/tunels.service';
import { TunelsModule } from 'src/tunels/tunels.module';

@Module({
  imports: [TypeOrmModule.forFeature([ZipProject, Usuario]), TunelsModule],
  controllers: [RaresController],
  providers: [RaresService],
  exports: [RaresService]
})
export class RaresModule {}
