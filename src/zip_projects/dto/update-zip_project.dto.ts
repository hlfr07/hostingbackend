import { PartialType } from '@nestjs/swagger';
import { CreateZipProjectDto } from './create-zip_project.dto';

export class UpdateZipProjectDto extends PartialType(CreateZipProjectDto) {}
