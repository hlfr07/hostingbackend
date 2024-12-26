import { PartialType } from '@nestjs/swagger';
import { CreateProjectHotDto } from './create-project_hot.dto';

export class UpdateProjectHotDto extends PartialType(CreateProjectHotDto) {}
