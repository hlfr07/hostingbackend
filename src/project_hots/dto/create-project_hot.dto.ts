import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateProjectHotDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El zip_id no puede estar vacío' })
    @IsString({ message: 'El zip_id debe ser un texto' })
    @MaxLength(100, { message: 'El zip_id debe tener menos de 100 caracteres' })
    @MinLength(1, { message: 'El zip_id debe tener más de 1 caracteres' })
    zip_id: string;

    // @ApiProperty()
    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsNotEmpty({ message: 'El namecarpeta no puede estar vacío' })
    // @IsString({ message: 'El namecarpeta debe ser un texto' })
    // @MaxLength(100, { message: 'El namecarpeta debe tener menos de 100 caracteres' })
    // @MinLength(1, { message: 'El namecarpeta debe tener más de 1 caracteres' })
    // namecarpeta: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El url no puede estar vacío' })
    @IsString({ message: 'El url debe ser un texto' })
    @MaxLength(100, { message: 'El url debe tener menos de 100 caracteres' })
    @MinLength(1, { message: 'El url debe tener más de 1 caracteres' })
    url: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El port no puede estar vacío' })
    @IsString({ message: 'El port debe ser un texto' })
    @MaxLength(100, { message: 'El port debe tener menos de 100 caracteres' })
    @MinLength(1, { message: 'El port debe tener más de 1 caracteres' })
    port: string;
}
