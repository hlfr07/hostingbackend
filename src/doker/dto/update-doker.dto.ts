import { PartialType } from '@nestjs/swagger';
import { CreateDokerDto } from './create-doker.dto';

export class UpdateDokerDto extends PartialType(CreateDokerDto) {}
