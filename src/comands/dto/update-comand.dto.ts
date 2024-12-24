import { PartialType } from '@nestjs/swagger';
import { CreateComandDto } from './create-comand.dto';

export class UpdateComandDto extends PartialType(CreateComandDto) {}
