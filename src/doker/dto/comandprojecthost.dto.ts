import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ComandProjecthostDto {
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'La carpeta no puede estar vacío' })
    @IsString({ message: 'La carpeta debe ser un texto' })
    @MinLength(3, { message: 'La carpeta debe tener más de 3 caracteres' })
    carpeta: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El comando no puede estar vacío' })
    @IsString({ message: 'El comando debe ser un texto' })
    @MaxLength(50, { message: 'El comando debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El comando debe tener más de 3 caracteres' })
    comando: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El nombre del contenedor no puede estar vacío' })
    @IsString({ message: 'El nombre del contenedor debe ser un texto' })
    @MaxLength(50, { message: 'El nombre del contenedor debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El nombre del contenedor debe tener más de 3 caracteres' })
    containerName: string;
}