import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordmysqlDto {
    
    //debemos perdir el usuario
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El usuario no puede estar vacío' })
    @IsString({ message: 'El usuario debe ser un texto' })
    @MaxLength(50, { message: 'El usuario debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El usuario debe tener más de 3 caracteres' })
    username: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @IsString({ message: 'La contraseña debe ser un texto' })
    @MaxLength(50, { message: 'La contraseña debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'La contraseña debe tener más de 3 caracteres' })
    newPassword: string;

    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsNotEmpty({ message: 'El contenedor no puede estar vacío' })
    @IsString({ message: 'El contenedor debe ser un texto' })
    @MaxLength(50, { message: 'El contenedor debe tener menos de 50 caracteres' })
    @MinLength(3, { message: 'El contenedor debe tener más de 3 caracteres' })
    containerName: string;
}