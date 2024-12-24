import { PartialType } from '@nestjs/swagger';
import { CreateRareDto } from './create-rare.dto';

export class UpdateRareDto extends PartialType(CreateRareDto) {}
