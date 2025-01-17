import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectHotsService } from './project_hots.service';
import { CreateProjectHotDto } from './dto/create-project_hot.dto';
import { UpdateProjectHotDto } from './dto/update-project_hot.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetProjectHotDto } from './dto/get-project_hot.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('ProjectHots')
@Controller('project-hots')
export class ProjectHotsController {
  constructor(private readonly projectHotsService: ProjectHotsService) {}

  @ApiBody({ type: CreateProjectHotDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProjectHotDto: CreateProjectHotDto) {
    return this.projectHotsService.create(createProjectHotDto);
  }

  @ApiBody({ type: [GetProjectHotDto]})
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.projectHotsService.findAll();
  }
  
  @ApiBody({ type: GetProjectHotDto })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.projectHotsService.findOne(+id);
  }

  @ApiBody({ type: GetProjectHotDto })
  @Get('user/:id/:page/:limit')
  @UseGuards(JwtAuthGuard)
  findOneByUser(@Param('id') id: string, @Param('page') page: string, @Param('limit') limit: string) {
    return this.projectHotsService.findOneByUser(+id, +page, +limit);
  }

  @ApiBody({ type: GetProjectHotDto })
  @Get('zip/:id')
  @UseGuards(JwtAuthGuard)
  findOneByZip(@Param('id') id: string) {
    return this.projectHotsService.findOneByZipProject(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProjectHotDto: UpdateProjectHotDto) {
  //   return this.projectHotsService.update(+id, updateProjectHotDto);
  // }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.projectHotsService.remove(+id);
  }
}
