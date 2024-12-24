import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ZipProjectsService } from './zip_projects.service';
import { CreateZipProjectDto } from './dto/create-zip_project.dto';
import { UpdateZipProjectDto } from './dto/update-zip_project.dto';

@Controller('zip-projects')
export class ZipProjectsController {
  constructor(private readonly zipProjectsService: ZipProjectsService) {}

  // @Post()
  // create(@Body() createZipProjectDto: CreateZipProjectDto) {
  //   return this.zipProjectsService.create(createZipProjectDto);
  // }

  // @Get()
  // findAll() {
  //   return this.zipProjectsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.zipProjectsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateZipProjectDto: UpdateZipProjectDto) {
  //   return this.zipProjectsService.update(+id, updateZipProjectDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.zipProjectsService.remove(+id);
  // }

  // @Patch('/zip-project-docker/:filenombre/:containerName')
  // zipProjectDocker(@Param('filenombre') nombre: string, @Param('containerName') containerName: string) {
  //   return this.zipProjectsService.zipProjecTDocker(nombre, containerName);
  // }
}
